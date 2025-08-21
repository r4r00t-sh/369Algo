from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Index, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class MarketData(Base):
    """Market data storage using PostgreSQL's time-series capabilities"""
    __tablename__ = "market_data"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), index=True, nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False)
    price = Column(Float)
    volume = Column(Integer)
    open_price = Column(Float)
    high_price = Column(Float)
    low_price = Column(Float)
    close_price = Column(Float)
    change = Column(Float)
    change_percent = Column(Float)
    
    # JSON column for additional data (market cap, P/E ratio, etc.)
    additional_data = Column(JSON)
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_market_data_symbol_timestamp', 'symbol', 'timestamp'),
        Index('idx_market_data_timestamp', 'timestamp'),
    )

class StockQuote(Base):
    """Current stock quotes with JSON data"""
    __tablename__ = "stock_quotes"
    
    symbol = Column(String(20), primary_key=True, index=True)
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    # Core quote data
    price = Column(Float)
    change = Column(Float)
    change_percent = Column(Float)
    volume = Column(Integer)
    
    # JSON column for all quote data
    quote_data = Column(JSON, nullable=False)
    
    # Indexes
    __table_args__ = (
        Index('idx_stock_quotes_last_updated', 'last_updated'),
    )

class MarketIndex(Base):
    """Market indices data"""
    __tablename__ = "market_indices"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    # Current values
    price = Column(Float)
    change = Column(Float)
    change_percent = Column(Float)
    volume = Column(Integer)
    
    # JSON column for additional data
    index_data = Column(JSON)

class NewsArticle(Base):
    """News articles with JSON metadata"""
    __tablename__ = "news_articles"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(Text, nullable=False)
    summary = Column(Text)
    link = Column(Text)
    published_at = Column(DateTime, index=True)
    symbol = Column(String(20), index=True)  # Related stock symbol
    
    # JSON column for article metadata
    article_metadata = Column(JSON)
    
    # Indexes
    __table_args__ = (
        Index('idx_news_symbol_published', 'symbol', 'published_at'),
        Index('idx_news_published', 'published_at'),
    )
