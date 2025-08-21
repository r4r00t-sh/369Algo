from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional, Dict, Any
from jose import jwt
import json
from datetime import datetime

from database import get_postgres_db
from models.user import User
from config import settings
from services.news_service import NewsService
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

@router.get("/latest")
async def get_latest_financial_news(
    category: str = Query("business", description="News category"),
    limit: int = Query(50, description="Number of news articles to fetch", ge=1, le=200),
    current_user: User = Depends(get_current_user)
):
    """Get latest financial news by category"""
    try:
        news_service = NewsService()
        news = await news_service.get_latest_financial_news(category, limit)
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_financial_news",
            "category": category,
            "limit": limit,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        # Check if there might be more news available
        has_more = len(news) >= limit
        
        return {
            "category": category,
            "count": len(news),
            "news": news,
            "hasMore": has_more,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
async def get_news_categories(
    current_user: User = Depends(get_current_user)
):
    """Get available news categories"""
    try:
        news_service = NewsService()
        categories = await news_service.get_news_categories()
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_news_categories",
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {"categories": categories}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stock/{symbol}")
async def get_stock_specific_news(
    symbol: str,
    limit: int = Query(10, description="Number of news articles to fetch", ge=1, le=50),
    current_user: User = Depends(get_current_user)
):
    """Get news specific to a particular stock/company"""
    try:
        news_service = NewsService()
        news = await news_service.get_stock_specific_news(symbol, limit)
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_stock_news",
            "symbol": symbol,
            "limit": limit,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {
            "symbol": symbol,
            "count": len(news),
            "news": news,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_news(
    query: str = Query(..., description="Search query for news articles"),
    category: str = Query("business", description="News category to search in"),
    limit: int = Query(20, description="Number of news articles to fetch", ge=1, le=100),
    current_user: User = Depends(get_current_user)
):
    """Search news articles"""
    try:
        news_service = NewsService()
        news = await news_service.search_news(query, category, limit)
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "searched_news",
            "query": query,
            "category": category,
            "limit": limit,
            "results_count": len(news),
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {
            "query": query,
            "category": category,
            "count": len(news),
            "news": news,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trending")
async def get_trending_news(
    limit: int = Query(10, description="Number of trending news articles", ge=1, le=50),
    current_user: User = Depends(get_current_user)
):
    """Get trending financial news"""
    try:
        news_service = NewsService()
        
        # Get news from multiple categories for trending
        categories = ["business", "markets", "technology", "crypto"]
        all_news = []
        
        for category in categories:
            try:
                category_news = await news_service.get_latest_financial_news(category, limit // len(categories))
                all_news.extend(category_news)
            except:
                continue
        
        # Sort by relevance score and recency
        all_news.sort(key=lambda x: (x.get("relevance_score", 0), x.get("publishedAt", "")), reverse=True)
        
        # Take top trending news
        trending_news = all_news[:limit]
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_trending_news",
            "limit": limit,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {
            "count": len(trending_news),
            "trending_news": trending_news,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/market-updates")
async def get_market_updates(
    limit: int = Query(15, description="Number of market update news", ge=1, le=50),
    current_user: User = Depends(get_current_user)
):
    """Get market-specific news and updates"""
    try:
        news_service = NewsService()
        
        # Get market-focused news
        market_news = await news_service.get_latest_financial_news("markets", limit)
        
        # Also get some economy news
        economy_news = await news_service.get_latest_financial_news("economy", limit // 3)
        
        # Combine and sort by relevance
        all_market_news = market_news + economy_news
        all_market_news.sort(key=lambda x: (x.get("relevance_score", 0), x.get("publishedAt", "")), reverse=True)
        
        # Take top market updates
        market_updates = all_market_news[:limit]
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_market_updates",
            "limit": limit,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {
            "count": len(market_updates),
            "market_updates": market_updates,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/breaking")
async def get_breaking_news(
    limit: int = Query(10, description="Number of breaking news articles", ge=1, le=30),
    current_user: User = Depends(get_current_user)
):
    """Get breaking financial news (high priority)"""
    try:
        news_service = NewsService()
        
        # Get news from all categories
        all_categories = ["business", "markets", "economy", "technology", "crypto"]
        breaking_news = []
        
        for category in all_categories:
            try:
                category_news = await news_service.get_latest_financial_news(category, limit // len(all_categories))
                # Filter for high-relevance news (potential breaking news)
                high_relevance = [news for news in category_news if news.get("relevance_score", 0) > 0.7]
                breaking_news.extend(high_relevance)
            except:
                continue
        
        # Sort by relevance and recency
        breaking_news.sort(key=lambda x: (x.get("relevance_score", 0), x.get("publishedAt", "")), reverse=True)
        
        # Take top breaking news
        top_breaking = breaking_news[:limit]
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_breaking_news",
            "limit": limit,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {
            "count": len(top_breaking),
            "breaking_news": top_breaking,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/indian-markets")
async def get_indian_market_news(
    limit: int = Query(50, description="Number of Indian market news articles", ge=1, le=200),
    current_user: User = Depends(get_current_user)
):
    """Get specific Indian market news (NSE, BSE, NIFTY, SENSEX)"""
    try:
        news_service = NewsService()
        news = await news_service.get_indian_market_news(limit)
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_indian_market_news",
            "limit": limit,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        # Check if there might be more news available
        has_more = len(news) >= limit
        
        return {
            "market": "Indian Markets",
            "count": len(news),
            "news": news,
            "hasMore": has_more,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/global-markets")
async def get_global_market_news(
    limit: int = Query(50, description="Number of global market news articles", ge=1, le=200),
    current_user: User = Depends(get_current_user)
):
    """Get global market news (US, Europe, Asia markets)"""
    try:
        news_service = NewsService()
        news = await news_service.get_global_market_news(limit)
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_global_market_news",
            "limit": limit,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        # Check if there might be more news available
        has_more = len(news) >= limit
        
        return {
            "market": "Global Markets",
            "count": len(news),
            "news": news,
            "hasMore": has_more,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
