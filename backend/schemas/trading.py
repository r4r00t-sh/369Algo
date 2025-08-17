from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BrokerConnectionCreate(BaseModel):
    broker_name: str
    api_key: str
    api_secret: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None

class BrokerConnectionResponse(BaseModel):
    id: int
    broker_name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TradeCreate(BaseModel):
    symbol: str
    side: str  # buy, sell
    quantity: float
    price: float
    order_type: str  # market, limit, stop_loss
    broker_connection_id: int

class TradeResponse(BaseModel):
    id: int
    symbol: str
    side: str
    quantity: float
    price: float
    order_type: str
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True
