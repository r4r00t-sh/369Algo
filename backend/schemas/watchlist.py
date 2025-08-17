from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WatchlistCreate(BaseModel):
    symbol: str
    name: Optional[str] = None

class WatchlistResponse(BaseModel):
    id: int
    symbol: str
    name: Optional[str] = None
    added_at: datetime

    class Config:
        from_attributes = True

class WatchlistUpdate(BaseModel):
    name: Optional[str] = None
