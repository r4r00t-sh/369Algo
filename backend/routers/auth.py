from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
import json

from database import get_postgres_db
from models.user import User
from schemas.auth import UserCreate, UserLogin, UserResponse, Token
from config import settings
from services.cache_service import cache_service

router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_postgres_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check username
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        username=db_user.username,
        full_name=db_user.full_name,
        is_active=db_user.is_active,
        created_at=db_user.created_at
    )

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_postgres_db)):
    # Find user by email
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is deactivated")
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Cache user session data in Redis
    user_session_data = {
        "user_id": user.id,
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "is_active": user.is_active,
        "login_time": datetime.now().isoformat(),
        "last_activity": datetime.now().isoformat(),
        "permissions": ["read", "write", "trade"]
    }
    
    # Cache user session
    cache_service.cache_user_session(user.id, user_session_data)
    
    # Cache user profile (convert boolean to string for Redis)
    user_profile = {
        "id": str(user.id),
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "is_active": str(user.is_active),  # Convert boolean to string
        "created_at": user.created_at.isoformat() if user.created_at else ""
    }
    
    # Store user profile in Redis hash
    cache_service.redis_client.hset(f"user:profile:{user.id}", mapping=user_profile)
    cache_service.redis_client.expire(f"user:profile:{user.id}", 3600)
    
    # Add to active users set
    cache_service.redis_client.sadd("active_users", f"user:{user.id}")
    cache_service.redis_client.expire("active_users", 3600)
    
    # Log user login activity
    login_activity = {
        "user_id": user.id,
        "username": user.username,
        "action": "login",
        "timestamp": datetime.now().isoformat(),
        "ip_address": "127.0.0.1"  # In real app, get from request
    }
    
    cache_service.redis_client.lpush(f"user:actions:{user.id}", json.dumps(login_activity))
    cache_service.redis_client.ltrim(f"user:actions:{user.id}", 0, 49)
    cache_service.redis_client.expire(f"user:actions:{user.id}", 3600)
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_postgres_db)
):
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Update last activity in Redis cache
    if cache_service.exists(f"user:profile:{user.id}"):
        cache_service.redis_client.hset(f"user:profile:{user.id}", "last_activity", datetime.now().isoformat())
        cache_service.redis_client.expire(f"user:profile:{user.id}", 3600)
    
    # Update session last activity
    if cache_service.exists(f"session:{user.id}"):
        session_data = cache_service.get_user_session(user.id)
        if session_data:
            session_data["last_activity"] = datetime.now().isoformat()
            cache_service.cache_user_session(user.id, session_data)
    
    # Log user activity
    user_action = {
        "user_id": user.id,
        "username": user.username,
        "action": "profile_viewed",
        "timestamp": datetime.now().isoformat(),
        "details": "User viewed their profile"
    }
    
    cache_service.redis_client.lpush(f"user:actions:{user.id}", json.dumps(user_action))
    cache_service.redis_client.ltrim(f"user:actions:{user.id}", 0, 49)
    cache_service.redis_client.expire(f"user:actions:{user.id}", 3600)
    
    return UserResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        is_active=user.is_active,
        created_at=user.created_at
    )

@router.post("/logout")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_postgres_db)
):
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email:
            user = db.query(User).filter(User.email == email).first()
            if user:
                # Remove user from active users
                cache_service.redis_client.srem("active_users", f"user:{user.id}")
                
                # Log logout activity
                logout_activity = {
                    "user_id": user.id,
                    "username": user.username,
                    "action": "logout",
                    "timestamp": datetime.now().isoformat(),
                    "details": "User logged out"
                }
                
                cache_service.redis_client.lpush(f"user:actions:{user.id}", json.dumps(logout_activity))
                cache_service.redis_client.ltrim(f"user:actions:{user.id}", 0, 49)
                cache_service.redis_client.expire(f"user:actions:{user.id}", 3600)
                
                # Note: We don't delete the session immediately to allow for reconnection
                # The session will expire naturally after TTL
    except:
        pass  # Continue even if token is invalid
    
    return {"message": "Successfully logged out"}
