from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base

class Portfolio(Base):
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String, index=True)
    description = Column(Text)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="portfolios")
    holdings = relationship("Holding", back_populates="portfolio", cascade="all, delete-orphan")

class Holding(Base):
    __tablename__ = "holdings"
    
    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id", ondelete="CASCADE"))
    symbol = Column(String, index=True)
    quantity = Column(Float)
    avg_price = Column(Float)
    current_price = Column(Float)
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    portfolio = relationship("Portfolio", back_populates="holdings")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_holdings_portfolio_symbol', 'portfolio_id', 'symbol'),
    )
