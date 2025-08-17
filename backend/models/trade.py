from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base

class Trade(Base):
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    broker_connection_id = Column(Integer, ForeignKey("broker_connections.id", ondelete="CASCADE"))
    symbol = Column(String, index=True)
    side = Column(String, index=True)  # buy, sell
    quantity = Column(Float)
    price = Column(Float)
    order_type = Column(String, index=True)  # market, limit, stop_loss
    status = Column(String, index=True)  # pending, filled, cancelled, rejected
    order_id = Column(String, index=True)
    trade_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="trades")
    broker_connection = relationship("BrokerConnection", back_populates="trades")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_trades_user_timestamp', 'user_id', 'timestamp'),
        Index('idx_trades_symbol_timestamp', 'symbol', 'timestamp'),
        Index('idx_trades_status', 'status'),
    )
