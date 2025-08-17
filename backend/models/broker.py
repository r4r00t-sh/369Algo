from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base

class BrokerConnection(Base):
    __tablename__ = "broker_connections"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    broker_name = Column(String, index=True)  # zerodha, angel_one, upstox, etc.
    api_key = Column(String)
    api_secret = Column(String)
    access_token = Column(Text)
    refresh_token = Column(Text)
    token_expires_at = Column(DateTime)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="broker_connections")
    trades = relationship("Trade", back_populates="broker_connection", cascade="all, delete-orphan")
