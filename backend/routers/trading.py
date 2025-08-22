from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
from jose import jwt

from database import get_postgres_db
from models.user import User
from models.broker import BrokerConnection
from models.trade import Trade
from schemas.trading import BrokerConnectionCreate, BrokerConnectionResponse, TradeCreate, TradeResponse
from config import settings
from services.broker_service import BrokerService

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

@router.post("/broker/connect", response_model=BrokerConnectionResponse)
async def connect_broker(
    broker_data: BrokerConnectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Connect to a broker (Zerodha, Angel One, Upstox)"""
    
    # Check if broker connection already exists
    existing_connection = db.query(BrokerConnection).filter(
        BrokerConnection.user_id == current_user.id,
        BrokerConnection.broker_name == broker_data.broker_name
    ).first()
    
    if existing_connection:
        raise HTTPException(status_code=400, detail="Broker connection already exists")
    
    # Create broker connection
    broker_connection = BrokerConnection(
        user_id=current_user.id,
        broker_name=broker_data.broker_name,
        api_key=broker_data.api_key,
        api_secret=broker_data.api_secret,
        access_token=broker_data.access_token,
        refresh_token=broker_data.refresh_token
    )
    
    db.add(broker_connection)
    db.commit()
    db.refresh(broker_connection)
    
    return BrokerConnectionResponse(
        id=broker_connection.id,
        broker_name=broker_connection.broker_name,
        is_active=broker_connection.is_active,
        created_at=broker_connection.created_at
    )

@router.get("/broker/connections", response_model=List[BrokerConnectionResponse])
async def get_broker_connections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Get all broker connections for the current user"""
    
    connections = db.query(BrokerConnection).filter(
        BrokerConnection.user_id == current_user.id
    ).all()
    
    return [
        BrokerConnectionResponse(
            id=conn.id,
            broker_name=conn.broker_name,
            is_active=conn.is_active,
            created_at=conn.created_at
        )
        for conn in connections
    ]

@router.post("/broker/{broker_id}/disconnect")
async def disconnect_broker(
    broker_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Disconnect from a broker"""
    
    connection = db.query(BrokerConnection).filter(
        BrokerConnection.id == broker_id,
        BrokerConnection.user_id == current_user.id
    ).first()
    
    if not connection:
        raise HTTPException(status_code=404, detail="Broker connection not found")
    
    connection.is_active = False
    db.commit()
    
    return {"message": "Broker disconnected successfully"}

@router.post("/order", response_model=TradeResponse)
async def place_order(
    trade_data: TradeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Place a trade order"""
    
    # Validate broker connection
    broker_connection = db.query(BrokerConnection).filter(
        BrokerConnection.id == trade_data.broker_connection_id,
        BrokerConnection.user_id == current_user.id,
        BrokerConnection.is_active == True
    ).first()
    
    if not broker_connection:
        raise HTTPException(status_code=400, detail="Invalid or inactive broker connection")
    
    # Create trade record
    trade = Trade(
        user_id=current_user.id,
        broker_connection_id=trade_data.broker_connection_id,
        symbol=trade_data.symbol,
        side=trade_data.side,
        quantity=trade_data.quantity,
        price=trade_data.price,
        order_type=trade_data.order_type,
        status="pending"
    )
    
    db.add(trade)
    db.commit()
    db.refresh(trade)
    
    # TODO: Integrate with actual broker API for order execution
    # For now, just return the created trade record
    
    return TradeResponse(
        id=trade.id,
        symbol=trade.symbol,
        side=trade.side,
        quantity=trade.quantity,
        price=trade.price,
        order_type=trade.order_type,
        status=trade.status,
        timestamp=trade.timestamp
    )

@router.get("/orders", response_model=List[TradeResponse])
async def get_trade_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db),
    limit: int = 100,
    offset: int = 0
):
    """Get trade history for the current user"""
    
    trades = db.query(Trade).filter(
        Trade.user_id == current_user.id
    ).order_by(Trade.timestamp.desc()).offset(offset).limit(limit).all()
    
    return [
        TradeResponse(
            id=trade.id,
            symbol=trade.symbol,
            side=trade.side,
            quantity=trade.quantity,
            price=trade.price,
            order_type=trade.order_type,
            status=trade.status,
            timestamp=trade.timestamp
        )
        for trade in trades
    ]

@router.get("/orders/{trade_id}", response_model=TradeResponse)
async def get_trade_details(
    trade_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Get details of a specific trade"""
    
    trade = db.query(Trade).filter(
        Trade.id == trade_id,
        Trade.user_id == current_user.id
    ).first()
    
    if not trade:
        raise HTTPException(status_code=404, detail="Trade not found")
    
    return TradeResponse(
        id=trade.id,
        symbol=trade.symbol,
        side=trade.side,
        quantity=trade.quantity,
        price=trade.price,
        order_type=trade.order_type,
        status=trade.status,
        timestamp=trade.timestamp
    )
