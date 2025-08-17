from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base

class Watchlist(Base):
    __tablename__ = "watchlists"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    symbol = Column(String, index=True)
    name = Column(String)  # Optional custom name for the stock
    added_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="watchlists")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_watchlist_user_symbol', 'user_id', 'symbol'),
        Index('idx_watchlist_symbol', 'symbol'),
    )
