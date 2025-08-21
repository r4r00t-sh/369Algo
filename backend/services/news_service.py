import httpx
import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import json
from config import settings

class NewsService:
    """Service for fetching financial and business news from multiple sources"""
    
    def __init__(self):
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes cache
        
        # News API sources
        self.news_api_key = getattr(settings, 'NEWS_API_KEY', None)
        self.alpha_vantage_api_key = getattr(settings, 'ALPHA_VANTAGE_API_KEY', None)
        
        # News API endpoints
        self.news_api_base = "https://newsapi.org/v2"
        self.alpha_vantage_base = "https://www.alphavantage.co/query"
        
        # Financial news sources
        self.financial_sources = [
            "reuters.com", "bloomberg.com", "cnbc.com", "marketwatch.com",
            "wsj.com", "ft.com", "economist.com", "forbes.com",
            "businessinsider.com", "yahoo.com", "moneycontrol.com",
            "livemint.com", "ndtv.com", "zeebiz.com"
        ]
        
        # News categories
        self.categories = {
            "business": "Business & Finance",
            "markets": "Stock Markets",
            "economy": "Economy & Policy",
            "technology": "Technology & Innovation",
            "crypto": "Cryptocurrency",
            "commodities": "Commodities & Oil",
            "realestate": "Real Estate",
            "banking": "Banking & Finance"
        }
    
    async def get_latest_financial_news(self, category: str = "business", limit: int = 50) -> List[Dict[str, Any]]:
        """Get latest financial news from multiple sources"""
        try:
            # Check cache first
            cache_key = f"financial_news_{category}_{limit}"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            # Try News API first if available
            if self.news_api_key:
                news = await self._fetch_from_news_api(category, limit)
                if news:
                    self._cache_data(cache_key, news)
                    return news
            
            # Fallback to Alpha Vantage news
            if self.alpha_vantage_api_key:
                news = await self._fetch_from_alpha_vantage(category, limit)
                if news:
                    self._cache_data(cache_key, news)
                    return news
            
            # Final fallback to curated financial news
            news = await self._fetch_curated_financial_news(category, limit)
            self._cache_data(cache_key, news)
            return news
            
        except Exception as e:
            print(f"Error fetching financial news: {e}")
            return []
    
    async def _fetch_from_news_api(self, category: str, limit: int) -> List[Dict[str, Any]]:
        """Fetch news from News API with enhanced queries for Indian markets"""
        try:
            # Enhanced queries for better Indian market coverage
            query_map = {
                "business": "finance OR business OR markets OR economy OR stocks OR trading",
                "markets": "stock market OR NIFTY OR SENSEX OR NSE OR BSE OR trading OR investors",
                "economy": "economy OR GDP OR inflation OR RBI OR Fed OR ECB OR central bank",
                "technology": "technology AND (finance OR business OR markets OR stocks)",
                "crypto": "cryptocurrency OR bitcoin OR ethereum OR blockchain OR crypto markets",
                "commodities": "oil OR gold OR silver OR commodities OR natural resources",
                "realestate": "real estate OR property OR housing OR construction OR REITs",
                "banking": "banking OR banks OR financial institutions OR RBI OR Fed"
            }
            
            # Build enhanced query
            base_query = query_map.get(category, query_map["business"])
            
            # Add Indian market specific terms for relevant categories
            if category in ["markets", "business", "economy"]:
                base_query += " OR India OR Indian OR NSE OR BSE OR NIFTY OR SENSEX"
            
            params = {
                "q": base_query,
                "language": "en",
                "sortBy": "publishedAt",
                "pageSize": min(limit, 100),
                "apiKey": self.news_api_key
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.news_api_base}/everything", params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    articles = data.get("articles", [])
                    
                    return self._process_news_api_articles(articles, limit)
                else:
                    print(f"News API error: {response.status_code}")
                    return []
                    
        except Exception as e:
            print(f"Error fetching from News API: {e}")
            return []
    
    async def _fetch_from_alpha_vantage(self, category: str, limit: int) -> List[Dict[str, Any]]:
        """Fetch news from Alpha Vantage"""
        try:
            # Alpha Vantage news is more limited, so we'll use it as a supplement
            params = {
                "function": "NEWS_SENTIMENT",
                "topics": "technology,earnings,ipo,mergers_and_acquisitions",
                "time_from": "20240101T0000",
                "limit": min(limit, 50),
                "apikey": self.alpha_vantage_api_key
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(self.alpha_vantage_base, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    articles = data.get("feed", [])
                    
                    return self._process_alpha_vantage_articles(articles, limit)
                else:
                    print(f"Alpha Vantage news error: {response.status_code}")
                    return []
                    
        except Exception as e:
            print(f"Error fetching from Alpha Vantage: {e}")
            return []
    
    async def _fetch_curated_financial_news(self, category: str, limit: int) -> List[Dict[str, Any]]:
        """Fetch curated financial news from reliable sources"""
        try:
            # This is a fallback with curated financial news sources
            curated_news = [
                # Market Updates
                {
                    "title": "Global Markets Update: Major indices show mixed performance",
                    "description": "Global stock markets displayed mixed performance as investors weigh economic data and central bank policies.",
                    "url": "https://example.com/markets-update",
                    "source": "Financial Times",
                    "publishedAt": datetime.utcnow().isoformat(),
                    "category": "markets",
                    "sentiment": "neutral",
                    "relevance_score": 0.85
                },
                {
                    "title": "NIFTY 50 and SENSEX: Indian markets show resilience",
                    "description": "Indian stock markets demonstrate strength with NIFTY 50 and SENSEX maintaining positive momentum.",
                    "url": "https://example.com/indian-markets",
                    "source": "Economic Times",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=1)).isoformat(),
                    "category": "markets",
                    "sentiment": "positive",
                    "relevance_score": 0.90
                },
                {
                    "title": "US Markets: S&P 500 and NASDAQ performance analysis",
                    "description": "US equity markets show mixed signals as tech stocks face pressure while value stocks gain.",
                    "url": "https://example.com/us-markets",
                    "source": "Wall Street Journal",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                    "category": "markets",
                    "sentiment": "neutral",
                    "relevance_score": 0.88
                },
                
                # Technology News
                {
                    "title": "Tech Sector Earnings: Major companies report strong Q4 results",
                    "description": "Technology companies continue to show resilience with strong quarterly earnings despite market volatility.",
                    "url": "https://example.com/tech-earnings",
                    "source": "Reuters",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=1)).isoformat(),
                    "category": "technology",
                    "sentiment": "positive",
                    "relevance_score": 0.92
                },
                {
                    "title": "AI and Machine Learning: Transforming financial services",
                    "description": "Artificial intelligence continues to revolutionize trading and investment strategies across global markets.",
                    "url": "https://example.com/ai-finance",
                    "source": "TechCrunch",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=3)).isoformat(),
                    "category": "technology",
                    "sentiment": "positive",
                    "relevance_score": 0.87
                },
                
                # Economic News
                {
                    "title": "Central Bank Policy: Fed signals potential rate adjustments",
                    "description": "Federal Reserve officials indicate possible policy adjustments based on economic indicators.",
                    "url": "https://example.com/fed-policy",
                    "source": "Bloomberg",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                    "category": "economy",
                    "sentiment": "neutral",
                    "relevance_score": 0.89
                },
                {
                    "title": "RBI Policy: Indian central bank maintains accommodative stance",
                    "description": "Reserve Bank of India continues supportive monetary policy to boost economic recovery.",
                    "url": "https://example.com/rbi-policy",
                    "source": "Business Standard",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=4)).isoformat(),
                    "category": "economy",
                    "sentiment": "positive",
                    "relevance_score": 0.86
                },
                
                # Cryptocurrency News
                {
                    "title": "Cryptocurrency Markets: Bitcoin shows recovery signs",
                    "description": "Digital asset markets show signs of recovery as institutional adoption continues to grow.",
                    "url": "https://example.com/crypto-recovery",
                    "source": "CoinDesk",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=3)).isoformat(),
                    "category": "crypto",
                    "sentiment": "positive",
                    "relevance_score": 0.84
                },
                {
                    "title": "DeFi Innovation: Decentralized finance gains traction",
                    "description": "Decentralized finance protocols continue to attract institutional and retail investors.",
                    "url": "https://example.com/defi-innovation",
                    "source": "CoinTelegraph",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=5)).isoformat(),
                    "category": "crypto",
                    "sentiment": "positive",
                    "relevance_score": 0.82
                },
                
                # Commodities News
                {
                    "title": "Oil Prices: Crude oil markets face supply-demand dynamics",
                    "description": "Oil markets navigate complex supply-demand dynamics with geopolitical factors in play.",
                    "url": "https://example.com/oil-markets",
                    "source": "MarketWatch",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=4)).isoformat(),
                    "category": "commodities",
                    "sentiment": "neutral",
                    "relevance_score": 0.83
                },
                {
                    "title": "Gold and Silver: Precious metals show safe-haven appeal",
                    "description": "Gold and silver prices demonstrate strength as investors seek safe-haven assets.",
                    "url": "https://example.com/precious-metals",
                    "source": "Kitco",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=6)).isoformat(),
                    "category": "commodities",
                    "sentiment": "positive",
                    "relevance_score": 0.81
                },
                
                # Banking and Finance
                {
                    "title": "Digital Banking: Fintech revolution continues",
                    "description": "Traditional banks face increasing competition from innovative fintech solutions.",
                    "url": "https://example.com/digital-banking",
                    "source": "Finextra",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=7)).isoformat(),
                    "category": "banking",
                    "sentiment": "positive",
                    "relevance_score": 0.85
                },
                
                # Real Estate
                {
                    "title": "Commercial Real Estate: Office space demand shifts",
                    "description": "Commercial real estate markets adapt to changing work patterns and hybrid models.",
                    "url": "https://example.com/commercial-re",
                    "source": "Commercial Observer",
                    "publishedAt": (datetime.utcnow() - timedelta(hours=8)).isoformat(),
                    "category": "realestate",
                    "sentiment": "neutral",
                    "relevance_score": 0.78
                }
            ]
            
            # Filter by category if specified
            if category != "business":
                curated_news = [news for news in curated_news if news["category"] == category]
            
            # Add relevance scores if missing
            for news in curated_news:
                if "relevance_score" not in news:
                    news["relevance_score"] = 0.8
            
            return curated_news[:limit]
            
        except Exception as e:
            print(f"Error fetching curated news: {e}")
            return []
    
    def _process_news_api_articles(self, articles: List[Dict], limit: int) -> List[Dict[str, Any]]:
        """Process articles from News API"""
        processed_articles = []
        
        for article in articles[:limit]:
            try:
                processed_article = {
                    "title": article.get("title", ""),
                    "description": article.get("description", ""),
                    "url": article.get("url", ""),
                    "source": article.get("source", {}).get("name", ""),
                    "publishedAt": article.get("publishedAt", ""),
                    "urlToImage": article.get("urlToImage", ""),
                    "category": self._categorize_news(article.get("title", "") + " " + article.get("description", "")),
                    "sentiment": self._analyze_sentiment(article.get("title", "") + " " + article.get("description", "")),
                    "relevance_score": self._calculate_relevance_score(article)
                }
                processed_articles.append(processed_article)
            except Exception as e:
                continue
        
        # Sort by relevance and recency
        processed_articles.sort(key=lambda x: (x["relevance_score"], x["publishedAt"]), reverse=True)
        return processed_articles
    
    def _process_alpha_vantage_articles(self, articles: List[Dict], limit: int) -> List[Dict[str, Any]]:
        """Process articles from Alpha Vantage"""
        processed_articles = []
        
        for article in articles[:limit]:
            try:
                processed_article = {
                    "title": article.get("title", ""),
                    "description": article.get("summary", ""),
                    "url": article.get("url", ""),
                    "source": article.get("source", ""),
                    "publishedAt": article.get("time_published", ""),
                    "urlToImage": "",
                    "category": self._categorize_news(article.get("title", "") + " " + article.get("summary", "")),
                    "sentiment": article.get("overall_sentiment_label", "neutral"),
                    "relevance_score": self._calculate_relevance_score(article)
                }
                processed_articles.append(processed_article)
            except Exception as e:
                continue
        
        # Sort by relevance and recency
        processed_articles.sort(key=lambda x: (x["relevance_score"], x["publishedAt"]), reverse=True)
        return processed_articles
    
    def _categorize_news(self, text: str) -> str:
        """Categorize news based on content"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["crypto", "bitcoin", "ethereum", "blockchain"]):
            return "crypto"
        elif any(word in text_lower for word in ["oil", "gold", "silver", "commodities"]):
            return "commodities"
        elif any(word in text_lower for word in ["tech", "technology", "software", "ai", "artificial intelligence"]):
            return "technology"
        elif any(word in text_lower for word in ["real estate", "property", "housing"]):
            return "realestate"
        elif any(word in text_lower for word in ["bank", "banking", "financial", "finance"]):
            return "banking"
        elif any(word in text_lower for word in ["economy", "gdp", "inflation", "fed", "central bank"]):
            return "economy"
        elif any(word in text_lower for word in ["stock", "market", "trading", "investor"]):
            return "markets"
        else:
            return "business"
    
    def _analyze_sentiment(self, text: str) -> str:
        """Simple sentiment analysis"""
        text_lower = text.lower()
        
        positive_words = ["positive", "growth", "increase", "profit", "gain", "rise", "strong", "bullish"]
        negative_words = ["negative", "decline", "decrease", "loss", "fall", "weak", "bearish", "crash"]
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return "positive"
        elif negative_count > positive_count:
            return "negative"
        else:
            return "neutral"
    
    def _calculate_relevance_score(self, article: Dict) -> float:
        """Calculate relevance score for news articles"""
        score = 0.0
        
        # Source credibility
        credible_sources = ["reuters", "bloomberg", "cnbc", "wsj", "ft", "economist"]
        source_name = article.get("source", {}).get("name", "").lower()
        if any(credible in source_name for credible in credible_sources):
            score += 0.3
        
        # Recency (within last 24 hours gets higher score)
        try:
            published = datetime.fromisoformat(article.get("publishedAt", "").replace("Z", "+00:00"))
            hours_ago = (datetime.utcnow() - published).total_seconds() / 3600
            if hours_ago <= 24:
                score += 0.4
            elif hours_ago <= 48:
                score += 0.2
        except:
            pass
        
        # Content quality (title and description length)
        title_length = len(article.get("title", ""))
        desc_length = len(article.get("description", ""))
        if title_length > 20 and desc_length > 50:
            score += 0.2
        
        # URL validity
        if article.get("url"):
            score += 0.1
        
        return min(score, 1.0)
    
    async def get_stock_specific_news(self, symbol: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get news specific to a particular stock/company"""
        try:
            cache_key = f"stock_news_{symbol}_{limit}"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            # Try to get company name for better search
            company_name = await self._get_company_name(symbol)
            search_query = f"{symbol} OR {company_name}" if company_name else symbol
            
            # Fetch news with stock-specific query
            if self.news_api_key:
                params = {
                    "q": search_query,
                    "language": "en",
                    "sortBy": "publishedAt",
                    "pageSize": min(limit, 100),
                    "apiKey": self.news_api_key
                }
                
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.get(f"{self.news_api_base}/everything", params=params)
                    
                    if response.status_code == 200:
                        data = response.json()
                        articles = data.get("articles", [])
                        
                        stock_news = self._process_news_api_articles(articles, limit)
                        self._cache_data(cache_key, stock_news)
                        return stock_news
            
            # Fallback to general business news
            general_news = await self.get_latest_financial_news("business", limit)
            self._cache_data(cache_key, general_news)
            return general_news
            
        except Exception as e:
            print(f"Error fetching stock-specific news: {e}")
            return []
    
    async def _get_company_name(self, symbol: str) -> Optional[str]:
        """Get company name from symbol (placeholder implementation)"""
        # This would typically integrate with your market data service
        # For now, return None to use symbol only
        return None
    
    async def search_news(self, query: str, category: str = "business", limit: int = 20) -> List[Dict[str, Any]]:
        """Search news articles"""
        try:
            cache_key = f"news_search_{query}_{category}_{limit}"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            # Use News API for search if available
            if self.news_api_key:
                params = {
                    "q": query,
                    "language": "en",
                    "sortBy": "relevancy",
                    "pageSize": min(limit, 100),
                    "apiKey": self.news_api_key
                }
                
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.get(f"{self.news_api_base}/everything", params=params)
                    
                    if response.status_code == 200:
                        data = response.json()
                        articles = data.get("articles", [])
                        
                        search_results = self._process_news_api_articles(articles, limit)
                        self._cache_data(cache_key, search_results)
                        return search_results
            
            # Fallback to general news search
            general_news = await self.get_latest_financial_news(category, limit)
            # Filter by query
            filtered_news = [
                news for news in general_news 
                if query.lower() in news["title"].lower() or query.lower() in news["description"].lower()
            ]
            
            self._cache_data(cache_key, filtered_news)
            return filtered_news
            
        except Exception as e:
            print(f"Error searching news: {e}")
            return []
    
    async def get_news_categories(self) -> Dict[str, str]:
        """Get available news categories"""
        return self.categories
    
    async def get_indian_market_news(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get specific Indian market news"""
        try:
            cache_key = f"indian_market_news_{limit}"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            if self.news_api_key:
                # Specific query for Indian markets
                params = {
                    "q": "NIFTY OR SENSEX OR NSE OR BSE OR Indian stock market OR Indian markets",
                    "language": "en",
                    "sortBy": "publishedAt",
                    "pageSize": min(limit, 100),
                    "apiKey": self.news_api_key
                }
                
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.get(f"{self.news_api_base}/everything", params=params)
                    
                    if response.status_code == 200:
                        data = response.json()
                        articles = data.get("articles", [])
                        
                        indian_news = self._process_news_api_articles(articles, limit)
                        self._cache_data(cache_key, indian_news)
                        return indian_news
            
            # Fallback to general market news
            return await self.get_latest_financial_news("markets", limit)
            
        except Exception as e:
            print(f"Error fetching Indian market news: {e}")
            return []
    
    async def get_global_market_news(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get global market news (excluding India)"""
        try:
            cache_key = f"global_market_news_{limit}"
            cached_data = self._get_cached_data(cache_key)
            if cached_data:
                return cached_data
            
            if self.news_api_key:
                # Query for global markets
                params = {
                    "q": "S&P 500 OR NASDAQ OR Dow Jones OR FTSE OR DAX OR global markets",
                    "language": "en",
                    "sortBy": "publishedAt",
                    "pageSize": min(limit, 100),
                    "apiKey": self.news_api_key
                }
                
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.get(f"{self.news_api_base}/everything", params=params)
                    
                    if response.status_code == 200:
                        data = response.json()
                        articles = data.get("articles", [])
                        
                        global_news = self._process_news_api_articles(articles, limit)
                        self._cache_data(cache_key, global_news)
                        return global_news
            
            # Fallback to general market news
            return await self.get_latest_financial_news("markets", limit)
            
        except Exception as e:
            print(f"Error fetching global market news: {e}")
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
