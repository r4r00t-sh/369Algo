import json
import redis
from typing import Any, Optional, Dict, List
from datetime import datetime, timedelta
from database import get_redis_client
from config import settings

class CacheService:
    """Enhanced Redis cache service for trading application"""
    
    def __init__(self):
        self.redis_client = get_redis_client()
        self.default_ttl = settings.CACHE_TTL
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set a key-value pair in cache"""
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            ttl = ttl or self.default_ttl
            return self.redis_client.setex(key, ttl, value)
        except Exception as e:
            print(f"Cache set error: {e}")
            return False
    
    def get(self, key: str) -> Optional[Any]:
        """Get a value from cache"""
        try:
            value = self.redis_client.get(key)
            if value:
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return value
            return None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None
    
    def delete(self, key: str) -> bool:
        """Delete a key from cache"""
        try:
            return bool(self.redis_client.delete(key))
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if a key exists in cache"""
        try:
            return bool(self.redis_client.exists(key))
        except Exception as e:
            print(f"Cache exists error: {e}")
            return False
    
    def expire(self, key: str, ttl: int) -> bool:
        """Set expiration for a key"""
        try:
            return self.redis_client.expire(key, ttl)
        except Exception as e:
            print(f"Cache expire error: {e}")
            return False
    
    # Market Data Caching
    def cache_stock_quote(self, symbol: str, quote_data: Dict[str, Any], ttl: int = 300) -> bool:
        """Cache stock quote data"""
        key = f"quote:{symbol.upper()}"
        return self.set(key, quote_data, ttl)
    
    def get_stock_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        """Get cached stock quote"""
        key = f"quote:{symbol.upper()}"
        return self.get(key)
    
    def cache_market_indices(self, indices_data: List[Dict[str, Any]], ttl: int = 600) -> bool:
        """Cache market indices data"""
        return self.set("market:indices", indices_data, ttl)
    
    def get_market_indices(self) -> Optional[List[Dict[str, Any]]]:
        """Get cached market indices"""
        return self.get("market:indices")
    
    def cache_trending_stocks(self, stocks_data: List[Dict[str, Any]], ttl: int = 300) -> bool:
        """Cache trending stocks data"""
        return self.set("market:trending", stocks_data, ttl)
    
    def get_trending_stocks(self) -> Optional[List[Dict[str, Any]]]:
        """Get cached trending stocks"""
        return self.get("market:trending")
    
    # User Session Caching
    def cache_user_session(self, user_id: int, session_data: Dict[str, Any], ttl: int = 3600) -> bool:
        """Cache user session data"""
        key = f"session:{user_id}"
        return self.set(key, session_data, ttl)
    
    def get_user_session(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get cached user session"""
        key = f"session:{user_id}"
        return self.get(key)
    
    def delete_user_session(self, user_id: int) -> bool:
        """Delete user session from cache"""
        key = f"session:{user_id}"
        return self.delete(key)
    
    # Portfolio Caching
    def cache_portfolio_data(self, user_id: int, portfolio_data: Dict[str, Any], ttl: int = 300) -> bool:
        """Cache portfolio data for user"""
        key = f"portfolio:{user_id}"
        return self.set(key, portfolio_data, ttl)
    
    def get_portfolio_data(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get cached portfolio data"""
        key = f"portfolio:{user_id}"
        return self.get(key)
    
    def invalidate_portfolio_cache(self, user_id: int) -> bool:
        """Invalidate portfolio cache for user"""
        key = f"portfolio:{user_id}"
        return self.delete(key)
    
    # Watchlist Caching
    def cache_watchlist_data(self, user_id: int, watchlist_data: List[Dict[str, Any]], ttl: int = 300) -> bool:
        """Cache watchlist data for user"""
        key = f"watchlist:{user_id}"
        return self.set(key, watchlist_data, ttl)
    
    def get_watchlist_data(self, user_id: int) -> Optional[List[Dict[str, Any]]]:
        """Get cached watchlist data"""
        key = f"watchlist:{user_id}"
        return self.get(key)
    
    def invalidate_watchlist_cache(self, user_id: int) -> bool:
        """Invalidate watchlist cache for user"""
        key = f"watchlist:{user_id}"
        return self.delete(key)
    
    # Real-time Updates
    def publish_market_update(self, channel: str, data: Dict[str, Any]) -> bool:
        """Publish market update to Redis pub/sub"""
        try:
            message = json.dumps(data)
            return bool(self.redis_client.publish(channel, message))
        except Exception as e:
            print(f"Publish error: {e}")
            return False
    
    def subscribe_to_market_updates(self, channel: str):
        """Subscribe to market updates (returns pubsub object)"""
        try:
            pubsub = self.redis_client.pubsub()
            pubsub.subscribe(channel)
            return pubsub
        except Exception as e:
            print(f"Subscribe error: {e}")
            return None
    
    # Cache Management
    def clear_all_cache(self) -> bool:
        """Clear all cache (use with caution)"""
        try:
            return bool(self.redis_client.flushdb())
        except Exception as e:
            print(f"Clear cache error: {e}")
            return False
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        try:
            info = self.redis_client.info()
            return {
                "total_connections_received": info.get("total_connections_received", 0),
                "total_commands_processed": info.get("total_commands_processed", 0),
                "keyspace_hits": info.get("keyspace_hits", 0),
                "keyspace_misses": info.get("keyspace_misses", 0),
                "used_memory_human": info.get("used_memory_human", "0B"),
                "connected_clients": info.get("connected_clients", 0)
            }
        except Exception as e:
            print(f"Cache stats error: {e}")
            return {}

# Create global cache service instance
cache_service = CacheService()
