from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PortfolioCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_default: bool = False

class PortfolioResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True

class HoldingCreate(BaseModel):
    symbol: str
    quantity: float
    price: float
    last_updated: datetime

class HoldingResponse(BaseModel):
    id: int
    symbol: str
    quantity: float
    avg_price: float
    current_price: float
    last_updated: datetime

    class Config:
        from_attributes = True
