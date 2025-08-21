from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BrokerConnectionCreate(BaseModel):
    broker_name: str = Field(..., description="Name of the broker (e.g., zerodha, angel_one, upstox)")
    api_key: str = Field(..., description="API key from the broker")
    api_secret: str = Field(..., description="API secret from the broker")

class BrokerConnectionResponse(BaseModel):
    id: int
    broker_name: str
    is_active: bool
    created_at: datetime

class OrderRequest(BaseModel):
    symbol: str = Field(..., description="Stock symbol (e.g., RELIANCE, TCS)")
    side: str = Field(..., description="Order side: 'buy' or 'sell'")
    quantity: int = Field(..., description="Number of shares to trade")
    price: Optional[float] = Field(None, description="Price for limit orders (optional for market orders)")
    order_type: str = Field("market", description="Order type: 'market' or 'limit'")
    validity: Optional[str] = Field("day", description="Order validity: 'day', 'gtd', 'ioc'")

class OrderResponse(BaseModel):
    order_id: str
    status: str
    symbol: str
    side: str
    quantity: int
    price: Optional[float]
    order_type: str
    broker: str
    timestamp: str

class BrokerStatus(BaseModel):
    broker_name: str
    is_connected: bool
    is_authenticated: bool
    last_updated: datetime

class BrokerInfo(BaseModel):
    name: str
    display_name: str
    description: str
    website: str
    api_docs: str
    supported_features: list[str]
