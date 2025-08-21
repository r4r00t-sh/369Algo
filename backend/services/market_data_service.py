import yfinance as yf
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import asyncio
import httpx
import json

class MarketDataService:
    """Service for fetching market data from various sources"""
    
    def __init__(self):
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes default cache
    
    async def get_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """Get real-time stock quote"""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            quote = {
                "symbol": symbol,
                "price": info.get("regularMarketPrice", 0),
                "change": info.get("regularMarketChange", 0),
                "change_percent": info.get("regularMarketChangePercent", 0),
                "volume": info.get("volume", 0),
                "market_cap": info.get("marketCap", 0),
                "pe_ratio": info.get("trailingPE", 0),
                "high_52_week": info.get("fiftyTwoWeekHigh", 0),
                "low_52_week": info.get("fiftyTwoWeekLow", 0),
                "open": info.get("open", 0),
                "previous_close": info.get("previousClose", 0),
                "timestamp": datetime.utcnow().isoformat()
            }
            
            return quote
            
        except Exception as e:
            print(f"Error fetching quote for {symbol}: {e}")
            return {"error": str(e)}
    
    async def get_batch_quotes(self, symbols: List[str]) -> Dict[str, Any]:
        """Get quotes for multiple symbols"""
        try:
            results = {}
            
            for symbol in symbols:
                quote = await self.get_stock_quote(symbol)
                results[symbol] = quote
            
            return results
            
        except Exception as e:
            print(f"Error fetching batch quotes: {e}")
            return {"error": str(e)}
    
    async def get_chart_data(self, symbol: str, timeframe: str = "1d") -> Dict[str, Any]:
        """Get chart data for a symbol"""
        try:
            ticker = yf.Ticker(symbol)
            
            # Map timeframe to Yahoo Finance period
            period_map = {
                "1d": "1d",
                "5d": "5d", 
                "1mo": "1mo",
                "3mo": "3mo",
                "6mo": "6mo",
                "1y": "1y",
                "2y": "2y",
                "5y": "5y",
                "10y": "10y",
                "ytd": "ytd",
                "max": "max"
            }
            
            period = period_map.get(timeframe, "1d")
            history = ticker.history(period=period)
            
            # Convert to list format for frontend
            chart_data = []
            for index, row in history.iterrows():
                chart_data.append({
                    "timestamp": index.isoformat(),
                    "open": float(row["Open"]),
                    "high": float(row["High"]),
                    "low": float(row["Low"]),
                    "close": float(row["Close"]),
                    "volume": int(row["Volume"])
                })
            
            return {
                "symbol": symbol,
                "timeframe": timeframe,
                "data": chart_data
            }
            
        except Exception as e:
            print(f"Error fetching chart data for {symbol}: {e}")
            return {"error": str(e)}
    
    async def search_stocks(self, query: str) -> List[Dict[str, Any]]:
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
            
            return results
            
        except Exception as e:
            print(f"Error searching stocks: {e}")
            return []
    
    async def get_market_indices(self) -> List[Dict[str, Any]]:
        """Get major market indices"""
        try:
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
            
            return indices_data
            
        except Exception as e:
            print(f"Error fetching market indices: {e}")
            return []
    
    async def get_stock_news(self, symbol: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get news for a specific stock"""
        try:
            ticker = yf.Ticker(symbol)
            news = ticker.news
            
            news_data = []
            for article in news[:limit]:
                news_data.append({
                    "title": article.get("title", ""),
                    "summary": article.get("summary", ""),
                    "link": article.get("link", ""),
                    "publisher": article.get("publisher", ""),
                    "published": article.get("providerPublishTime", ""),
                    "image": article.get("image", {}).get("url", "")
                })
            
            return news_data
            
        except Exception as e:
            print(f"Error fetching news for {symbol}: {e}")
            return []
    
    async def get_trending_stocks(self) -> List[Dict[str, Any]]:
        """Get trending stocks based on volume and price movement"""
        try:
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
            
            return trending_data
            
        except Exception as e:
            print(f"Error fetching trending stocks: {e}")
            return []
    
    async def screen_stocks(self, min_market_cap: Optional[float] = None,
                           max_pe: Optional[float] = None,
                           min_pe: Optional[float] = None,
                           sector: Optional[str] = None,
                           limit: int = 50) -> List[Dict[str, Any]]:
        """Screen stocks based on criteria"""
        try:
            # This is a simplified screening - in production you'd use a proper screening API
            # For now, we'll return some popular stocks
            
            popular_stocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX", "BRK-A", "JPM"]
            screened_stocks = []
            
            for symbol in popular_stocks[:limit]:
                try:
                    ticker = yf.Ticker(symbol)
                    info = ticker.info
                    
                    # Apply filters
                    market_cap = info.get("marketCap", 0)
                    pe_ratio = info.get("trailingPE", 0)
                    
                    if min_market_cap and market_cap < min_market_cap:
                        continue
                    if max_pe and pe_ratio > max_pe:
                        continue
                    if min_pe and pe_ratio < min_pe:
                        continue
                    
                    screened_stocks.append({
                        "symbol": symbol,
                        "name": info.get("longName", symbol),
                        "price": info.get("regularMarketPrice", 0),
                        "market_cap": market_cap,
                        "pe_ratio": pe_ratio,
                        "sector": info.get("sector", ""),
                        "industry": info.get("industry", "")
                    })
                    
                except Exception as e:
                    continue
            
            return screened_stocks
            
        except Exception as e:
            print(f"Error screening stocks: {e}")
            return []
    
    async def get_sector_performance(self) -> List[Dict[str, Any]]:
        """Get sector performance data"""
        try:
            # This is a placeholder - in production you'd fetch from a sector performance API
            sectors = [
                {"name": "Technology", "change": 2.5, "performance": "positive"},
                {"name": "Healthcare", "change": -1.2, "performance": "negative"},
                {"name": "Finance", "change": 0.8, "performance": "positive"},
                {"name": "Energy", "change": -0.5, "performance": "negative"},
                {"name": "Consumer", "change": 1.1, "performance": "positive"}
            ]
            
            return sectors
            
        except Exception as e:
            print(f"Error fetching sector performance: {e}")
            return []
    
    def _is_cache_valid(self, key: str) -> bool:
        """Check if cached data is still valid"""
        if key not in self.cache:
            return False
        
        cache_entry = self.cache[key]
        if datetime.utcnow() - cache_entry["timestamp"] > timedelta(seconds=self.cache_ttl):
            return False
        
        return True
    
    def _cache_data(self, key: str, data: Any):
        """Cache data with timestamp"""
        self.cache[key] = {
            "data": data,
            "timestamp": datetime.utcnow()
        }
    
    def _get_cached_data(self, key: str) -> Optional[Any]:
        """Get cached data if valid"""
        if self._is_cache_valid(key):
            return self.cache[key]["data"]
        return None
