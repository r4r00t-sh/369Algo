from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Strategy(Base):
    """Model for storing custom trading strategies"""
    __tablename__ = "strategies"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100), default="custom")  # custom, momentum, mean-reversion, etc.
    
    # Strategy parameters
    parameters = Column(JSON)  # Store strategy-specific parameters
    conditions = Column(JSON)  # Entry/exit conditions
    risk_management = Column(JSON)  # Stop loss, take profit, position sizing
    
    # Execution settings
    is_active = Column(Boolean, default=True)
    auto_execute = Column(Boolean, default=False)  # Whether to auto-execute trades
    broker_integration = Column(String(100))  # Which broker to use (fyers, zerodha, etc.)
    
    # Performance tracking
    total_trades = Column(Integer, default=0)
    successful_trades = Column(Integer, default=0)
    total_pnl = Column(Float, default=0.0)
    win_rate = Column(Float, default=0.0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_executed = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="strategies")
    trades = relationship("StrategyTrade", back_populates="strategy")
    
    def __repr__(self):
        return f"<Strategy(id={self.id}, name='{self.name}', user_id={self.user_id})>"

class StrategyTrade(Base):
    """Model for tracking trades executed by strategies"""
    __tablename__ = "strategy_trades"
    
    id = Column(Integer, primary_key=True, index=True)
    strategy_id = Column(Integer, ForeignKey("strategies.id"), nullable=False)
    trade_id = Column(Integer, ForeignKey("trades.id"), nullable=False)
    execution_reason = Column(Text)  # Why the strategy executed this trade
    strategy_parameters = Column(JSON)  # Parameters at time of execution
    performance_metrics = Column(JSON)  # Strategy-specific metrics
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    strategy = relationship("Strategy", back_populates="trades")
    trade = relationship("Trade")
    
    def __repr__(self):
        return f"<StrategyTrade(id={self.id}, strategy_id={self.strategy_id}, trade_id={self.trade_id})>"

class StrategyBacktest(Base):
    """Model for storing strategy backtest results"""
    __tablename__ = "strategy_backtests"
    
    id = Column(Integer, primary_key=True, index=True)
    strategy_id = Column(Integer, ForeignKey("strategies.id"), nullable=False)
    
    # Backtest parameters
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    initial_capital = Column(Float, nullable=False)
    
    # Results
    total_return = Column(Float)
    annualized_return = Column(Float)
    sharpe_ratio = Column(Float)
    max_drawdown = Column(Float)
    win_rate = Column(Float)
    total_trades = Column(Integer)
    
    # Detailed results
    equity_curve = Column(JSON)  # Daily equity values
    trade_history = Column(JSON)  # Detailed trade results
    monthly_returns = Column(JSON)  # Monthly performance
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    strategy = relationship("Strategy")
    
    def __repr__(self):
        return f"<StrategyBacktest(id={self.id}, strategy_id={self.strategy_id})>"
