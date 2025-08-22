from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Dict, Any
from jose import jwt

from database import get_postgres_db
from models.user import User
from config import settings

router = APIRouter()
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_postgres_db)
) -> User:
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

@router.get("/profile")
async def get_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Get current user's profile information"""

    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at
    }

@router.put("/profile")
async def update_user_profile(
    profile_data: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Update user's profile information"""

    # Validate allowed fields
    allowed_fields = ["username", "full_name"]
    update_data = {k: v for k, v in profile_data.items() if k in allowed_fields}

    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    # Check username uniqueness if being updated
    if "username" in update_data:
        existing_user = db.query(User).filter(
            User.username == update_data["username"],
            User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")

    # Update user profile
    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "username": current_user.username,
            "full_name": current_user.full_name,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at,
            "updated_at": current_user.updated_at
        }
    }

@router.get("/preferences")
async def get_user_preferences(
    current_user: User = Depends(get_current_user)
):
    """Get user's application preferences"""

    # For now, return default preferences
    # In a real app, you'd store these in a separate preferences table
    return {
        "theme": "auto",  # auto, light, dark
        "notifications": {
            "email": True,
            "push": False,
            "sms": False
        },
        "trading": {
            "default_order_type": "market",
            "confirm_orders": True,
            "show_pnl": True
        },
        "display": {
            "currency": "USD",
            "timezone": "UTC",
            "date_format": "MM/DD/YYYY"
        }
    }

@router.put("/preferences")
async def update_user_preferences(
    preferences: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Update user's application preferences"""

    # In a real app, you'd validate and store these preferences
    # For now, just return success
    return {
        "message": "Preferences updated successfully",
        "preferences": preferences
    }

@router.get("/system")
async def get_system_info():
    """Get system information and configuration"""

    return {
        "api_version": "1.0.0",
        "features": {
            "multi_database": settings.USE_MULTI_DB,
            "caching": settings.CACHE_ENABLED,
            "time_series": settings.TIME_SERIES_ENABLED
        },
        "brokers": {
            "zerodha": bool(settings.ZERODHA_API_KEY),
            "angel_one": bool(settings.ANGEL_ONE_API_KEY),
            "upstox": bool(settings.UPSTOX_API_KEY)
        },
        "databases": {
            "postgresql": f"{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}",
            "redis": f"{settings.REDIS_HOST}:{settings.REDIS_PORT}",
            "influxdb": settings.INFLUXDB_URL,
            "clickhouse": f"{settings.CLICKHOUSE_HOST}:{settings.CLICKHOUSE_PORT}",
            "mongodb": f"{settings.MONGODB_HOST}:{settings.MONGODB_PORT}"
        }
    }
