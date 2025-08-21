from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from database import get_postgres_db as get_db
from models.user import User
from models.broker import BrokerConnection
from schemas.broker import (
    BrokerConnectionCreate, 
    BrokerConnectionResponse,
    OrderRequest,
    OrderResponse,
    BrokerStatus
)
from services.broker_service import BrokerService
from routers.auth import get_current_user

router = APIRouter(prefix="/api/broker", tags=["broker"])

@router.post("/connect", response_model=BrokerConnectionResponse)
async def connect_broker(
    broker_data: BrokerConnectionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Connect to a broker account"""
    try:
        # Check if user already has a connection to this broker
        existing_connection = db.query(BrokerConnection).filter(
            BrokerConnection.user_id == current_user.id,
            BrokerConnection.broker_name == broker_data.broker_name
        ).first()
        
        if existing_connection:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Already connected to {broker_data.broker_name}"
            )
        
        # Create new broker connection
        broker_connection = BrokerConnection(
            user_id=current_user.id,
            broker_name=broker_data.broker_name,
            api_key=broker_data.api_key,
            api_secret=broker_data.api_secret,
            is_active=True
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
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to connect broker: {str(e)}"
        )

@router.get("/connections", response_model=List[BrokerConnectionResponse])
async def get_broker_connections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's broker connections"""
    connections = db.query(BrokerConnection).filter(
        BrokerConnection.user_id == current_user.id
    ).all()
    
    return [
        BrokerConnectionResponse(
            id=conn.id,
            broker_name=conn.broker_name,
            is_active=conn.is_active,
            created_at=conn.created_at
        ) for conn in connections
    ]

@router.post("/{broker_id}/authenticate")
async def authenticate_broker(
    broker_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Authenticate with a broker"""
    try:
        broker_connection = db.query(BrokerConnection).filter(
            BrokerConnection.id == broker_id,
            BrokerConnection.user_id == current_user.id
        ).first()
        
        if not broker_connection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Broker connection not found"
            )
        
        broker_service = BrokerService(broker_connection)
        success = await broker_service.authenticate()
        
        if success:
            return {"message": f"Successfully authenticated with {broker_connection.broker_name}"}
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Failed to authenticate with {broker_connection.broker_name}"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )

@router.post("/{broker_id}/order", response_model=OrderResponse)
async def place_order(
    broker_id: int,
    order_data: OrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Place an order through the broker"""
    try:
        broker_connection = db.query(BrokerConnection).filter(
            BrokerConnection.id == broker_id,
            BrokerConnection.user_id == current_user.id,
            BrokerConnection.is_active == True
        ).first()
        
        if not broker_connection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Active broker connection not found"
            )
        
        broker_service = BrokerService(broker_connection)
        
        # Place the order
        result = await broker_service.place_order(
            symbol=order_data.symbol,
            side=order_data.side,
            quantity=order_data.quantity,
            price=order_data.price,
            order_type=order_data.order_type
        )
        
        if "error" in result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
        
        return OrderResponse(
            order_id=result["order_id"],
            status=result["status"],
            symbol=result["symbol"],
            side=result["side"],
            quantity=result["quantity"],
            price=result["price"],
            order_type=result["order_type"],
            broker=result["broker"],
            timestamp=result["timestamp"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Order placement failed: {str(e)}"
        )

@router.delete("/{broker_id}/order/{order_id}")
async def cancel_order(
    broker_id: int,
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel an order"""
    try:
        broker_connection = db.query(BrokerConnection).filter(
            BrokerConnection.id == broker_id,
            BrokerConnection.user_id == current_user.id,
            BrokerConnection.is_active == True
        ).first()
        
        if not broker_connection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Active broker connection not found"
            )
        
        broker_service = BrokerService(broker_connection)
        result = await broker_service.cancel_order(order_id)
        
        if "error" in result:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["error"]
            )
        
        return {"message": f"Order {order_id} cancelled successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Order cancellation failed: {str(e)}"
        )

@router.get("/{broker_id}/status", response_model=BrokerStatus)
async def get_broker_status(
    broker_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get broker connection status and health"""
    try:
        broker_connection = db.query(BrokerConnection).filter(
            BrokerConnection.id == broker_id,
            BrokerConnection.user_id == current_user.id
        ).first()
        
        if not broker_connection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Broker connection not found"
            )
        
        broker_service = BrokerService(broker_connection)
        
        # Check if we can authenticate
        is_authenticated = await broker_service.authenticate()
        
        return BrokerStatus(
            broker_name=broker_connection.broker_name,
            is_connected=broker_connection.is_active,
            is_authenticated=is_authenticated,
            last_updated=broker_connection.updated_at
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get broker status: {str(e)}"
        )

@router.delete("/{broker_id}/disconnect")
async def disconnect_broker(
    broker_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Disconnect from a broker"""
    try:
        broker_connection = db.query(BrokerConnection).filter(
            BrokerConnection.id == broker_id,
            BrokerConnection.user_id == current_user.id
        ).first()
        
        if not broker_connection:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Broker connection not found"
            )
        
        broker_connection.is_active = False
        broker_connection.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {"message": f"Disconnected from {broker_connection.broker_name}"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to disconnect broker: {str(e)}"
        )
