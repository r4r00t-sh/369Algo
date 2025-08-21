from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional, Dict, Any
from jose import jwt
import yfinance as yf
import requests
import json
from datetime import datetime, timedelta

from database import get_postgres_db
from models.user import User
from config import settings
from services.market_data_service import MarketDataService
from services.cache_service import cache_service

router = APIRouter()
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db = Depends(get_postgres_db)
) -> User:
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

@router.get("/quote/{symbol}")
async def get_stock_quote(
    symbol: str,
    current_user: User = Depends(get_current_user)
):
    """Get real-time stock quote for a symbol"""
    
    try:
        # Check cache first
        cached_quote = cache_service.get_stock_quote(symbol)
        if cached_quote:
            # Log user activity
            user_action = {
                "user_id": current_user.id,
                "username": current_user.username,
                "action": "viewed_stock_quote",
                "symbol": symbol,
                "timestamp": datetime.now().isoformat(),
                "source": "cache"
            }
            
            cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
            cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
            cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
            
            return {"source": "cache", "data": cached_quote}
        
        # Get fresh data from Yahoo Finance
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        quote_data = {
            "symbol": symbol,
            "price": info.get("regularMarketPrice", 0),
            "change": info.get("regularMarketChange", 0),
            "change_percent": info.get("regularMarketChangePercent", 0),
            "volume": info.get("volume", 0),
            "market_cap": info.get("marketCap", 0),
            "pe_ratio": info.get("trailingPE", 0),
            "high": info.get("dayHigh", 0),
            "low": info.get("dayLow", 0),
            "open": info.get("open", 0),
            "previous_close": info.get("previousClose", 0),
            "timestamp": datetime.now().isoformat()
        }
        
        # Cache the quote for 1 minute
        cache_service.cache_stock_quote(symbol, quote_data, 60)
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_stock_quote",
            "symbol": symbol,
            "timestamp": datetime.now().isoformat(),
            "source": "live"
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {"source": "live", "data": quote_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch quote: {str(e)}")

@router.get("/quotes/batch")
async def get_batch_quotes(
    symbols: str = Query(..., description="Comma-separated list of symbols"),
    current_user: User = Depends(get_current_user)
):
    """Get quotes for multiple symbols in batch"""
    
    symbol_list = [s.strip().upper() for s in symbols.split(",")]
    if len(symbol_list) > 20:  # Limit batch size
        raise HTTPException(status_code=400, detail="Maximum 20 symbols allowed per request")
    
    results = {}
    
    for symbol in symbol_list:
        try:
            # Check cache first
            cached_quote = cache_service.get_stock_quote(symbol)
            if cached_quote:
                results[symbol] = {"source": "cache", "data": cached_quote}
                continue
            
            # Get fresh data
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            quote_data = {
                "symbol": symbol,
                "price": info.get("regularMarketPrice", 0),
                "change": info.get("regularMarketChange", 0),
                "change_percent": info.get("regularMarketChangePercent", 0),
                "volume": info.get("volume", 0),
                "timestamp": datetime.now().isoformat()
            }
            
            # Cache the quote
            cache_service.cache_stock_quote(symbol, quote_data, 60)
            results[symbol] = {"source": "live", "data": quote_data}
            
        except Exception as e:
            results[symbol] = {"error": str(e)}
    
    return results

@router.get("/indices")
async def get_market_indices(
    current_user: User = Depends(get_current_user)
):
    """Get major market indices"""
    
    try:
        # Check cache first
        cached_indices = cache_service.get_market_indices()
        if cached_indices:
            return {"source": "cache", "data": cached_indices}
        
        # Major indices
        indices = ["^GSPC", "^DJI", "^IXIC", "^NSEI", "^BSESN"]
        indices_data = []
        
        for index in indices:
            try:
                ticker = yf.Ticker(index)
                info = ticker.info
                
                index_data = {
                    "symbol": index,
                    "name": info.get("longName", index),
                    "price": info.get("regularMarketPrice", 0),
                    "change": info.get("regularMarketChange", 0),
                    "change_percent": info.get("regularMarketChangePercent", 0),
                    "volume": info.get("volume", 0)
                }
                indices_data.append(index_data)
                
            except Exception as e:
                indices_data.append({"symbol": index, "error": str(e)})
        
        # Cache for 5 minutes
        cache_service.cache_market_indices(indices_data, 300)
        
        return {"source": "live", "data": indices_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch indices: {str(e)}")

@router.get("/search")
async def search_stocks(
    query: str = Query(..., min_length=2, description="Stock symbol or company name to search"),
    current_user: User = Depends(get_current_user)
):
    """Search for stocks by symbol or company name"""
    
    try:
        # Use Yahoo Finance search
        search_results = yf.Tickers(query)
        
        results = []
        for ticker in search_results.tickers[:10]:  # Limit to 10 results
            try:
                info = ticker.info
                if info.get("regularMarketPrice"):
                    results.append({
                        "symbol": info.get("symbol", ""),
                        "name": info.get("longName", ""),
                        "exchange": info.get("exchange", ""),
                        "type": info.get("quoteType", ""),
                        "price": info.get("regularMarketPrice", 0)
                    })
            except:
                continue
        
        return {"results": results}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/news/{symbol}")
async def get_stock_news(
    symbol: str,
    current_user: User = Depends(get_current_user)
):
    """Get news for a specific stock"""
    
    try:
        # Check cache first
        cached_news = cache_service.get_stock_news(symbol)
        if cached_news:
            return {"source": "cache", "data": cached_news}
        
        # Get news from Yahoo Finance
        ticker = yf.Ticker(symbol)
        news = ticker.news
        
        news_data = []
        for article in news[:10]:  # Limit to 10 articles
            news_data.append({
                "title": article.get("title", ""),
                "summary": article.get("summary", ""),
                "link": article.get("link", ""),
                "publisher": article.get("publisher", ""),
                "published": article.get("providerPublishTime", ""),
                "image": article.get("image", {}).get("url", "")
            })
        
        # Cache for 1 hour
        cache_service.cache_stock_news(symbol, news_data, 3600)
        
        return {"source": "live", "data": news_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch news: {str(e)}")

@router.get("/trending")
async def get_trending_stocks(
    current_user: User = Depends(get_current_user)
):
    """Get trending stocks based on volume and price movement"""
    
    try:
        # Check cache first
        cached_trending = cache_service.get_trending_stocks()
        if cached_trending:
            return {"source": "cache", "data": cached_trending}
        
        # Popular stocks for trending
        trending_symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX"]
        trending_data = []
        
        for symbol in trending_symbols:
            try:
                ticker = yf.Ticker(symbol)
                info = ticker.info
                
                trending_data.append({
                    "symbol": symbol,
                    "name": info.get("longName", symbol),
                    "price": info.get("regularMarketPrice", 0),
                    "change_percent": info.get("regularMarketChangePercent", 0),
                    "volume": info.get("volume", 0),
                    "market_cap": info.get("marketCap", 0)
                })
                
            except Exception as e:
                trending_data.append({"symbol": symbol, "error": str(e)})
        
        # Cache for 30 minutes
        cache_service.cache_trending_stocks(trending_data, 1800)
        
        return {"source": "live", "data": trending_data}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch trending stocks: {str(e)}")

@router.get("/indian/quote/{symbol}")
async def get_indian_stock_quote(
    symbol: str,
    exchange: str = Query("NSE", description="Exchange: NSE or BSE"),
    current_user: User = Depends(get_current_user)
):
    """Get real-time Indian stock quote from NSE or BSE"""
    try:
        market_service = MarketDataService()
        quote = await market_service.get_indian_stock_quote(symbol, exchange)
        
        if "error" in quote:
            raise HTTPException(status_code=400, detail=quote["error"])
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_indian_stock_quote",
            "symbol": symbol,
            "exchange": exchange,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return quote
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/indian/indices/nse")
async def get_nse_indices(
    current_user: User = Depends(get_current_user)
):
    """Get NSE major indices"""
    try:
        market_service = MarketDataService()
        indices = await market_service.get_nse_indices()
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_nse_indices",
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {"indices": indices}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/indian/indices/bse")
async def get_bse_indices(
    current_user: User = Depends(get_current_user)
):
    """Get BSE major indices"""
    try:
        market_service = MarketDataService()
        indices = await market_service.get_bse_indices()
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_bse_indices",
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {"indices": indices}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/indian/search")
async def search_indian_stocks(
    query: str = Query(..., description="Search query for stock symbol or company name"),
    exchange: str = Query("NSE", description="Exchange: NSE or BSE"),
    current_user: User = Depends(get_current_user)
):
    """Search for Indian stocks"""
    try:
        market_service = MarketDataService()
        results = await market_service.search_indian_stocks(query, exchange)
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "searched_indian_stocks",
            "query": query,
            "exchange": exchange,
            "results_count": len(results),
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {"results": results, "query": query, "exchange": exchange}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/indian/market-status")
async def get_indian_market_status(
    current_user: User = Depends(get_current_user)
):
    """Get Indian market status (open/closed)"""
    try:
        market_service = MarketDataService()
        status = await market_service.get_indian_market_status()
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_indian_market_status",
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return status
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/indian/popular-stocks")
async def get_indian_popular_stocks(
    current_user: User = Depends(get_current_user)
):
    """Get popular Indian stocks for quick access"""
    try:
        # Popular NSE stocks
        popular_nse = [
            "RELIANCE", "TCS", "HDFC", "INFY", "ICICIBANK", 
            "HINDUNILVR", "ITC", "SBIN", "BHARTIARTL", "KOTAKBANK"
        ]
        
        # Popular BSE stocks
        popular_bse = [
            "500325", "532540", "500180", "500209", "532174",
            "500696", "500875", "500112", "532454", "500247"
        ]
        
        market_service = MarketDataService()
        
        # Get quotes for popular stocks
        nse_quotes = []
        bse_quotes = []
        
        for symbol in popular_nse[:5]:  # Limit to 5 for performance
            try:
                quote = await market_service.get_indian_stock_quote(symbol, "NSE")
                if "error" not in quote:
                    nse_quotes.append(quote)
            except:
                continue
        
        for symbol in popular_bse[:5]:  # Limit to 5 for performance
            try:
                quote = await market_service.get_indian_stock_quote(symbol, "BSE")
                if "error" not in quote:
                    bse_quotes.append(quote)
            except:
                continue
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_indian_popular_stocks",
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {
            "nse_popular": nse_quotes,
            "bse_popular": bse_quotes,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
