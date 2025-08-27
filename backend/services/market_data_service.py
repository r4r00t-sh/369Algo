import yfinance as yf
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import asyncio
import httpx
import json
import os
from config import settings

class MarketDataService:
    """Service for fetching market data from various sources including Indian markets (NSE/BSE)"""
    
    def __init__(self):
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes default cache
        self.alpha_vantage_api_key = settings.ALPHA_VANTAGE_API_KEY
        self.alpha_vantage_base_url = "https://www.alphavantage.co/query"
        
        # Indian market data sources
        self.nse_base_url = "https://www.nseindia.com/api"
        self.bse_base_url = "https://api.bseindia.com"
        self.moneycontrol_base_url = "https://www.moneycontrol.com/api"
        
        # Indian market headers
        self.nse_headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive"
        }
    
    async def get_indian_stock_quote(self, symbol: str, exchange: str = "NSE") -> Dict[str, Any]:
        """Get real-time Indian stock quote from NSE or BSE"""
        try:
            # Check cache first
            cache_key = f"indian_quote_{exchange}_{symbol}"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            if exchange.upper() == "NSE":
                quote = await self.get_nse_stock_quote(symbol)
            elif exchange.upper() == "BSE":
                quote = await self.get_bse_stock_quote(symbol)
            else:
                return {"error": "Invalid exchange. Use NSE or BSE"}
            
            if "error" not in quote:
                self._cache_data(cache_key, quote)
            
            return quote
            
        except Exception as e:
            print(f"Error fetching Indian stock quote for {symbol}: {e}")
            return {"error": str(e)}
    
    async def get_nse_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """Get NSE stock quote"""
        try:
            # NSE API endpoint for quote
            url = f"{self.nse_base_url}/quote-equity"
            params = {"symbol": symbol}
            
            async with httpx.AsyncClient(headers=self.nse_headers, timeout=10.0) as client:
                response = await client.get(url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if "priceInfo" in data and "marketDeptOrderBook" in data:
                        price_info = data["priceInfo"]
                        market_data = data["marketDeptOrderBook"]
                        
                        quote = {
                            "symbol": symbol,
                            "exchange": "NSE",
                            "price": float(price_info.get("lastPrice", 0)),
                            "change": float(price_info.get("change", 0)),
                            "change_percent": float(price_info.get("pChange", 0)),
                            "open": float(price_info.get("open", 0)),
                            "high": float(price_info.get("dayHigh", 0)),
                            "low": float(price_info.get("dayLow", 0)),
                            "previous_close": float(price_info.get("previousClose", 0)),
                            "volume": int(market_data.get("totalTradedVolume", 0)),
                            "market_cap": price_info.get("marketCap", 0),
                            "source": "NSE India",
                            "timestamp": datetime.utcnow().isoformat()
                        }
                        
                        return quote
                    else:
                        return {"error": "Invalid data format from NSE"}
                else:
                    return {"error": f"NSE API error: {response.status_code}"}
                    
        except Exception as e:
            print(f"Error fetching NSE quote for {symbol}: {e}")
            return {"error": str(e)}
    
    async def get_bse_stock_quote(self, symbol: str) -> Dict[str, Any]:
        """Get BSE stock quote"""
        try:
            # BSE API endpoint for quote
            url = f"{self.bse_base_url}/BseIndiaAPI/api/StockReach"
            params = {"scripcode": symbol}
            
            async with httpx.AsyncClient(headers=self.nse_headers, timeout=10.0) as client:
                response = await client.get(url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if "Stock_Reach" in data:
                        stock_data = data["Stock_Reach"]
                        
                        quote = {
                            "symbol": symbol,
                            "exchange": "BSE",
                            "price": float(stock_data.get("LTP", 0)),
                            "change": float(stock_data.get("Change", 0)),
                            "change_percent": float(stock_data.get("ChangePercent", 0)),
                            "open": float(stock_data.get("Open", 0)),
                            "high": float(stock_data.get("High", 0)),
                            "low": float(stock_data.get("Low", 0)),
                            "previous_close": float(stock_data.get("PreviousClose", 0)),
                            "volume": int(stock_data.get("Volume", 0)),
                            "source": "BSE India",
                            "timestamp": datetime.utcnow().isoformat()
                        }
                        
                        return quote
                    else:
                        return {"error": "Invalid data format from BSE"}
                else:
                    return {"error": f"BSE API error: {response.status_code}"}
                    
        except Exception as e:
            print(f"Error fetching BSE quote for {symbol}: {e}")
            return {"error": str(e)}
    
    async def get_nse_indices(self) -> List[Dict[str, Any]]:
        """Get NSE major indices"""
        try:
            # Check cache first
            cache_key = "nse_indices"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            # Major NSE indices
            indices = ["NIFTY 50", "NIFTY BANK", "NIFTY IT", "NIFTY PHARMA", "NIFTY AUTO"]
            indices_data = []
            
            for index in indices:
                try:
                    # Use Yahoo Finance for NSE indices (more reliable)
                    ticker = yf.Ticker(f"{index}.NS")
                    info = ticker.info
                    
                    index_data = {
                        "name": index,
                        "symbol": f"{index}.NS",
                        "price": info.get("regularMarketPrice", 0),
                        "change": info.get("regularMarketChange", 0),
                        "change_percent": info.get("regularMarketChangePercent", 0),
                        "volume": info.get("volume", 0),
                        "exchange": "NSE"
                    }
                    indices_data.append(index_data)
                    
                except Exception as e:
                    indices_data.append({"name": index, "error": str(e)})
            
            # Cache the data
            self._cache_data(cache_key, indices_data)
            return indices_data
            
        except Exception as e:
            print(f"Error fetching NSE indices: {e}")
            return []
    
    async def get_bse_indices(self) -> List[Dict[str, Any]]:
        """Get BSE major indices"""
        try:
            # Check cache first
            cache_key = "bse_indices"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            # Major BSE indices
            indices = ["SENSEX", "BSE100", "BSE200", "BSE500", "BSE MIDCAP", "BSE SMALLCAP"]
            indices_data = []
            
            for index in indices:
                try:
                    # Use Yahoo Finance for BSE indices
                    ticker = yf.Ticker(f"{index}.BO")
                    info = ticker.info
                    
                    index_data = {
                        "name": index,
                        "symbol": f"{index}.BO",
                        "price": info.get("regularMarketPrice", 0),
                        "change": info.get("regularMarketChange", 0),
                        "change_percent": info.get("regularMarketChangePercent", 0),
                        "volume": info.get("volume", 0),
                        "exchange": "BSE"
                    }
                    indices_data.append(index_data)
                    
                except Exception as e:
                    indices_data.append({"name": index, "error": str(e)})
            
            # Cache the data
            self._cache_data(cache_key, indices_data)
            return indices_data
            
        except Exception as e:
            print(f"Error fetching BSE indices: {e}")
            return []
    
    async def search_indian_stocks(self, query: str, exchange: str = "NSE") -> List[Dict[str, Any]]:
        """Search for Indian stocks by symbol or company name"""
        try:
            # Check cache first
            cache_key = f"indian_search_{exchange}_{query}"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            results = []
            
            if exchange.upper() == "NSE":
                # Search NSE stocks
                url = f"{self.nse_base_url}/search"
                params = {"q": query}
                
                async with httpx.AsyncClient(headers=self.nse_headers, timeout=10.0) as client:
                    response = await client.get(url, params=params)
                    
                    if response.status_code == 200:
                        data = response.json()
                        if "data" in data:
                            for item in data["data"][:10]:  # Limit to 10 results
                                results.append({
                                    "symbol": item.get("symbol", ""),
                                    "name": item.get("companyName", ""),
                                    "exchange": "NSE",
                                    "isin": item.get("isin", "")
                                })
            elif exchange.upper() == "BSE":
                # Search BSE stocks
                url = f"{self.bse_base_url}/BseIndiaAPI/api/StockSearch"
                params = {"search": query}
                
                async with httpx.AsyncClient(headers=self.nse_headers, timeout=10.0) as client:
                    response = await client.get(url, params=params)
                    
                    if response.status_code == 200:
                        data = response.json()
                        if "data" in data:
                            for item in data["data"][:10]:  # Limit to 10 results
                                results.append({
                                    "symbol": item.get("scripcode", ""),
                                    "name": item.get("scripname", ""),
                                    "exchange": "BSE",
                                    "isin": item.get("isin", "")
                                })
            
            # Cache the results
            self._cache_data(cache_key, results)
            return results
            
        except Exception as e:
            print(f"Error searching Indian stocks: {e}")
            return []
    
    async def get_indian_market_status(self) -> Dict[str, Any]:
        """Get Indian market status (open/closed)"""
        try:
            # Check cache first
            cache_key = "indian_market_status"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            # Get current time in IST
            ist_time = datetime.utcnow() + timedelta(hours=5, minutes=30)
            current_time = ist_time.time()
            
            # Market hours: 9:15 AM to 3:30 PM IST (Monday to Friday)
            market_open = datetime.strptime("09:15:00", "%H:%M:%S").time()
            market_close = datetime.strptime("15:30:00", "%H:%M:%S").time()
            
            # Check if market is open
            is_weekday = ist_time.weekday() < 5  # Monday = 0, Sunday = 6
            is_market_hours = market_open <= current_time <= market_close
            
            market_status = {
                "nse": {
                    "status": "OPEN" if (is_weekday and is_market_hours) else "CLOSED",
                    "exchange": "NSE",
                    "timing": "9:15 AM - 3:30 PM IST",
                    "next_open": self._get_next_market_open(ist_time)
                },
                "bse": {
                    "status": "OPEN" if (is_weekday and is_market_hours) else "CLOSED",
                    "exchange": "BSE",
                    "timing": "9:15 AM - 3:30 PM IST",
                    "next_open": self._get_next_market_open(ist_time)
                },
                "current_time_ist": ist_time.strftime("%Y-%m-%d %H:%M:%S IST"),
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Cache the status
            self._cache_data(cache_key, market_status)
            return market_status
            
        except Exception as e:
            print(f"Error getting Indian market status: {e}")
            return {"error": str(e)}
    
    def _get_next_market_open(self, current_time: datetime) -> str:
        """Calculate next market open time"""
        if current_time.weekday() >= 5:  # Weekend
            days_until_monday = 7 - current_time.weekday()
            next_monday = current_time + timedelta(days=days_until_monday)
            return next_monday.replace(hour=9, minute=15, second=0, microsecond=0).strftime("%Y-%m-%d %H:%M:%S IST")
        elif current_time.time() > datetime.strptime("15:30:00", "%H:%M:%S").time():  # After market close
            next_day = current_time + timedelta(days=1)
            if next_day.weekday() < 5:  # Next day is weekday
                return next_day.replace(hour=9, minute=15, second=0, microsecond=0).strftime("%Y-%m-%d %H:%M:%S IST")
            else:  # Next day is weekend, go to Monday
                days_until_monday = 7 - next_day.weekday()
                next_monday = next_day + timedelta(days=days_until_monday)
                return next_monday.replace(hour=9, minute=15, second=0, microsecond=0).strftime("%Y-%m-%d %H:%M:%S IST")
        else:
            return "Market is currently open"
    
    async def get_stock_quote_alpha_vantage(self, symbol: str) -> Dict[str, Any]:
        """Get real-time stock quote from Alpha Vantage"""
        try:
            if not self.alpha_vantage_api_key:
                return {"error": "Alpha Vantage API key not configured"}
            
            # Check cache first
            cache_key = f"alpha_quote_{symbol}"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            # Fetch from Alpha Vantage
            params = {
                "function": "GLOBAL_QUOTE",
                "symbol": symbol,
                "apikey": self.alpha_vantage_api_key
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(self.alpha_vantage_base_url, params=params)
                data = response.json()
            
            if "Global Quote" in data and data["Global Quote"]:
                quote_data = data["Global Quote"]
                quote = {
                    "symbol": symbol,
                    "price": float(quote_data.get("05. price", 0)),
                    "change": float(quote_data.get("09. change", 0)),
                    "change_percent": quote_data.get("10. change percent", "0%").replace("%", ""),
                    "volume": int(quote_data.get("06. volume", 0)),
                    "open": float(quote_data.get("02. open", 0)),
                    "high": float(quote_data.get("03. high", 0)),
                    "low": float(quote_data.get("04. low", 0)),
                    "previous_close": float(quote_data.get("08. previous close", 0)),
                    "source": "Alpha Vantage",
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                # Cache the data
                self._cache_data(cache_key, quote)
                return quote
            else:
                return {"error": "No data available from Alpha Vantage"}
                
        except Exception as e:
            print(f"Error fetching Alpha Vantage quote for {symbol}: {e}")
            return {"error": str(e)}
    
    async def get_stock_quote(self, symbol: str, source: str = "auto") -> Dict[str, Any]:
        """Get real-time stock quote with fallback sources"""
        try:
            # Try Alpha Vantage first if configured
            if source == "alpha_vantage" or (source == "auto" and self.alpha_vantage_api_key):
                alpha_quote = await self.get_stock_quote_alpha_vantage(symbol)
                if "error" not in alpha_quote:
                    return alpha_quote
            
            # Fallback to Yahoo Finance
            return await self.get_stock_quote_yahoo(symbol)
            
        except Exception as e:
            print(f"Error fetching quote for {symbol}: {e}")
            return {"error": str(e)}
    
    async def get_stock_quote_yahoo(self, symbol: str) -> Dict[str, Any]:
        """Get real-time stock quote from Yahoo Finance (existing method)"""
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
                "source": "Yahoo Finance",
                "timestamp": datetime.utcnow().isoformat()
            }
            
            return quote
            
        except Exception as e:
            print(f"Error fetching Yahoo Finance quote for {symbol}: {e}")
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
    
    async def get_historical_data_alpha_vantage(self, symbol: str, interval: str = "daily") -> Dict[str, Any]:
        """Get historical data from Alpha Vantage"""
        try:
            if not self.alpha_vantage_api_key:
                return {"error": "Alpha Vantage API key not configured"}
            
            # Check cache first
            cache_key = f"alpha_historical_{symbol}_{interval}"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            # Map interval to Alpha Vantage function
            function_map = {
                "daily": "TIME_SERIES_DAILY",
                "weekly": "TIME_SERIES_WEEKLY",
                "monthly": "TIME_SERIES_MONTHLY",
                "intraday": "TIME_SERIES_INTRADAY"
            }
            
            function = function_map.get(interval, "TIME_SERIES_DAILY")
            params = {
                "function": function,
                "symbol": symbol,
                "apikey": self.alpha_vantage_api_key
            }
            
            if interval == "intraday":
                params["interval"] = "5min"
            
            async with httpx.AsyncClient() as client:
                response = await client.get(self.alpha_vantage_base_url, params=params)
                data = response.json()
            
            # Process the data
            time_series_key = None
            for key in data.keys():
                if "Time Series" in key:
                    time_series_key = key
                    break
            
            if time_series_key and data[time_series_key]:
                historical_data = []
                for date, values in data[time_series_key].items():
                    historical_data.append({
                        "timestamp": date,
                        "open": float(values.get("1. open", 0)),
                        "high": float(values.get("2. high", 0)),
                        "low": float(values.get("3. low", 0)),
                        "close": float(values.get("4. close", 0)),
                        "volume": int(values.get("5. volume", 0))
                    })
                
                # Sort by date
                historical_data.sort(key=lambda x: x["timestamp"])
                
                result = {
                    "symbol": symbol,
                    "interval": interval,
                    "data": historical_data,
                    "source": "Alpha Vantage"
                }
                
                # Cache the data
                self._cache_data(cache_key, result)
                return result
            else:
                return {"error": "No historical data available"}
                
        except Exception as e:
            print(f"Error fetching Alpha Vantage historical data for {symbol}: {e}")
            return {"error": str(e)}
    
    async def get_company_overview_alpha_vantage(self, symbol: str) -> Dict[str, Any]:
        """Get company overview information from Alpha Vantage"""
        try:
            if not self.alpha_vantage_api_key:
                return {"error": "Alpha Vantage API key not configured"}
            
            # Check cache first
            cache_key = f"alpha_overview_{symbol}"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            params = {
                "function": "OVERVIEW",
                "symbol": symbol,
                "apikey": self.alpha_vantage_api_key
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(self.alpha_vantage_base_url, params=params)
                data = response.json()
            
            if data and "Symbol" in data:
                overview = {
                    "symbol": data.get("Symbol", ""),
                    "name": data.get("Name", ""),
                    "description": data.get("Description", ""),
                    "exchange": data.get("Exchange", ""),
                    "currency": data.get("Currency", ""),
                    "country": data.get("Country", ""),
                    "sector": data.get("Sector", ""),
                    "industry": data.get("Industry", ""),
                    "market_cap": data.get("MarketCapitalization", ""),
                    "pe_ratio": data.get("PERatio", ""),
                    "dividend_yield": data.get("DividendYield", ""),
                    "eps": data.get("EPS", ""),
                    "beta": data.get("Beta", ""),
                    "source": "Alpha Vantage"
                }
                
                # Cache the data
                self._cache_data(cache_key, overview)
                return overview
            else:
                return {"error": "No company overview available"}
                
        except Exception as e:
            print(f"Error fetching Alpha Vantage company overview for {symbol}: {e}")
            return {"error": str(e)}
    
    async def get_technical_indicators_alpha_vantage(self, symbol: str, indicator: str = "SMA", time_period: int = 20) -> Dict[str, Any]:
        """Get technical indicators from Alpha Vantage"""
        try:
            if not self.alpha_vantage_api_key:
                return {"error": "Alpha Vantage API key not configured"}
            
            # Check cache first
            cache_key = f"alpha_technical_{symbol}_{indicator}_{time_period}"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            params = {
                "function": "TECHNICAL_INDICATORS",
                "symbol": symbol,
                "interval": "daily",
                "time_period": time_period,
                "series_type": "close",
                "apikey": self.alpha_vantage_api_key
            }
            
            # Map indicator to function
            indicator_map = {
                "SMA": "SMA",
                "EMA": "EMA",
                "RSI": "RSI",
                "MACD": "MACD",
                "BBANDS": "BBANDS"
            }
            
            function = indicator_map.get(indicator, "SMA")
            params["function"] = function
            
            async with httpx.AsyncClient() as client:
                response = await client.get(self.alpha_vantage_base_url, params=params)
                data = response.json()
            
            # Process the data based on indicator type
            if function in data:
                indicator_data = data[function]
                result = {
                    "symbol": symbol,
                    "indicator": indicator,
                    "time_period": time_period,
                    "data": indicator_data,
                    "source": "Alpha Vantage"
                }
                
                # Cache the data
                self._cache_data(cache_key, result)
                return result
            else:
                return {"error": f"No {indicator} data available"}
                
        except Exception as e:
            print(f"Error fetching Alpha Vantage technical indicators for {symbol}: {e}")
            return {"error": str(e)}
    
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
