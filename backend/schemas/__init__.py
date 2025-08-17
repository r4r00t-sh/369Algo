# schemas/__init__.py
# This file makes the schemas directory a Python package

from .auth import UserCreate, UserLogin, UserResponse, Token, TokenData
from .trading import BrokerConnectionCreate, BrokerConnectionResponse, TradeCreate, TradeResponse
from .portfolio import PortfolioCreate, PortfolioResponse, HoldingCreate, HoldingResponse
from .watchlist import WatchlistCreate, WatchlistResponse, WatchlistUpdate

__all__ = [
    "UserCreate", "UserLogin", "UserResponse", "Token", "TokenData",
    "BrokerConnectionCreate", "BrokerConnectionResponse", "TradeCreate", "TradeResponse",
    "PortfolioCreate", "PortfolioResponse", "HoldingCreate", "HoldingResponse",
    "WatchlistCreate", "WatchlistResponse", "WatchlistUpdate"
]
