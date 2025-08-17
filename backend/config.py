from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Trading Web App"
    DEBUG: bool = True
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database Configuration
    USE_MULTI_DB: bool = False  # Simplified to single DB approach
    
    # PostgreSQL
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "trading_app"
    POSTGRES_USER: str = "trading_user"
    POSTGRES_PASSWORD: str = "trading_password"
    POSTGRES_URL: Optional[str] = None
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    REDIS_URL: Optional[str] = None
    
    # Cache Configuration
    CACHE_ENABLED: bool = True
    CACHE_TTL: int = 300  # 5 minutes
    
    # Time Series Configuration (using PostgreSQL)
    TIME_SERIES_ENABLED: bool = True
    
    # Broker API Keys
    ZERODHA_API_KEY: Optional[str] = None
    ZERODHA_API_SECRET: Optional[str] = None
    
    ANGEL_ONE_API_KEY: Optional[str] = None
    ANGEL_ONE_API_SECRET: Optional[str] = None
    
    UPSTOX_API_KEY: Optional[str] = None
    UPSTOX_API_SECRET: Optional[str] = None
    
    # Market Data
    ALPHA_VANTAGE_API_KEY: Optional[str] = None
    YAHOO_FINANCE_ENABLED: bool = True
    
    # Security
    CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Build database URLs
        if not self.POSTGRES_URL:
            self.POSTGRES_URL = f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        
        if not self.REDIS_URL:
            if self.REDIS_PASSWORD:
                self.REDIS_URL = f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
            else:
                self.REDIS_URL = f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

# Create settings instance
settings = Settings()

# Environment-specific overrides
if os.getenv("ENVIRONMENT") == "production":
    settings.DEBUG = False
    settings.CACHE_TTL = 600  # 10 minutes in production
