import asyncio
import json
import httpx
from typing import List, Dict, Any, Optional, Set
from datetime import datetime, timedelta
from fastapi import WebSocket
import logging
from config import settings

logger = logging.getLogger(__name__)

class LiveNewsService:
    """Service for real-time live news updates"""
    
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.news_cache: List[Dict[str, Any]] = []
        self.last_update = datetime.now()
        self.update_interval = 30  # Update every 30 seconds
        
        # API keys
        self.news_api_key = getattr(settings, 'NEWS_API_KEY', None)
        self.alpha_vantage_api_key = getattr(settings, 'ALPHA_VANTAGE_API_KEY', None)
        
        # News sources for live updates
        self.live_sources = [
            "reuters.com", "bloomberg.com", "cnbc.com", "marketwatch.com",
            "wsj.com", "ft.com", "economist.com", "forbes.com",
            "businessinsider.com", "yahoo.com", "moneycontrol.com",
            "livemint.com", "ndtv.com", "zeebiz.com", "economic-times.com"
        ]
        
        # Start background task for live updates
        self.is_running = False
        self.background_task = None
        
        # Initialize with sample news as fallback
        self._initialize_sample_news()
    
    def _initialize_sample_news(self):
        """Initialize with sample news data as fallback"""
        sample_news = [
            {
                "title": "Global Markets Update: Major indices show mixed performance",
                "description": "Global stock markets displayed mixed performance as investors weigh economic data and central bank policies. The S&P 500 and NASDAQ showed resilience while European markets faced pressure from economic concerns.",
                "url": "https://example.com/markets-update",
                "source": "Financial Times",
                "publishedAt": datetime.now().isoformat(),
                "urlToImage": None,
                "category": "markets",
                "sentiment": "neutral",
                "relevance_score": 0.85,
                "isBreaking": False,
                "priority": 1
            },
            {
                "title": "NIFTY 50 and SENSEX: Indian markets show resilience",
                "description": "Indian stock markets demonstrate strength with NIFTY 50 and SENSEX maintaining positive momentum. Banking and IT sectors lead the gains as investors remain optimistic about domestic growth prospects.",
                "url": "https://example.com/indian-markets",
                "source": "Economic Times",
                "publishedAt": (datetime.now() - timedelta(hours=1)).isoformat(),
                "urlToImage": None,
                "category": "markets",
                "sentiment": "positive",
                "relevance_score": 0.90,
                "isBreaking": False,
                "priority": 1
            },
            {
                "title": "Tech Sector Earnings: Major companies report strong Q4 results",
                "description": "Technology companies continue to show resilience with strong quarterly earnings despite market volatility. Cloud services and AI-driven products remain key growth drivers for the sector.",
                "url": "https://example.com/tech-earnings",
                "source": "Reuters",
                "publishedAt": (datetime.now() - timedelta(hours=2)).isoformat(),
                "urlToImage": None,
                "category": "technology",
                "sentiment": "positive",
                "relevance_score": 0.92,
                "isBreaking": False,
                "priority": 1
            },
            {
                "title": "RBI Policy Decision: Interest rates remain unchanged",
                "description": "The Reserve Bank of India maintains status quo on key policy rates, keeping the repo rate at 6.5%. The central bank signals continued focus on inflation control while supporting growth.",
                "url": "https://example.com/rbi-policy",
                "source": "Business Standard",
                "publishedAt": (datetime.now() - timedelta(hours=3)).isoformat(),
                "urlToImage": None,
                "category": "economy",
                "sentiment": "neutral",
                "relevance_score": 0.88,
                "isBreaking": False,
                "priority": 2
            },
            {
                "title": "Oil Prices: Crude oil futures show volatility",
                "description": "Crude oil prices exhibit mixed trading as supply concerns balance against demand outlook. Brent and WTI futures show divergent movements amid geopolitical tensions.",
                "url": "https://example.com/oil-prices",
                "source": "Bloomberg",
                "publishedAt": (datetime.now() - timedelta(hours=4)).isoformat(),
                "urlToImage": None,
                "category": "commodities",
                "sentiment": "neutral",
                "relevance_score": 0.75,
                "isBreaking": False,
                "priority": 1
            }
        ]
        
        self.news_cache = sample_news
        logger.info(f"Initialized with {len(sample_news)} sample news articles")
    
    async def start_live_updates(self):
        """Start background task for live news updates"""
        if not self.is_running:
            self.is_running = True
            logger.info("Starting live news updates...")
            
            # Fetch initial news immediately
            try:
                logger.info("Fetching initial news...")
                initial_news = await self._fetch_live_news()
                logger.info(f"Fetched {len(initial_news)} initial news articles")
                
                if initial_news:
                    await self._process_and_broadcast_news(initial_news)
                else:
                    logger.warning("No initial news fetched, using sample news")
                    # Broadcast sample news if no fresh news available
                    await self._process_and_broadcast_news(self.news_cache)
            except Exception as e:
                logger.error(f"Error fetching initial news: {e}")
                # Broadcast sample news on error
                await self._process_and_broadcast_news(self.news_cache)
            
            self.background_task = asyncio.create_task(self._live_update_loop())
            logger.info("Live news updates started")
    
    async def stop_live_updates(self):
        """Stop background task for live news updates"""
        if self.is_running:
            self.is_running = False
            if self.background_task:
                self.background_task.cancel()
                try:
                    await self.background_task
                except asyncio.CancelledError:
                    pass
            logger.info("Live news updates stopped")
    
    async def _live_update_loop(self):
        """Background loop for fetching and broadcasting live news"""
        while self.is_running:
            try:
                # Fetch latest news
                new_news = await self._fetch_live_news()
                
                if new_news:
                    # Update cache and broadcast to all connected clients
                    await self._process_and_broadcast_news(new_news)
                
                # Wait for next update
                await asyncio.sleep(self.update_interval)
                
            except Exception as e:
                logger.error(f"Error in live update loop: {e}")
                await asyncio.sleep(60)  # Wait longer on error
    
    async def _fetch_live_news(self) -> List[Dict[str, Any]]:
        """Fetch latest news from multiple sources"""
        try:
            logger.info("Starting to fetch live news...")
            all_news = []
            
            # Fetch from News API
            if self.news_api_key:
                logger.info("Fetching from News API...")
                news_api_news = await self._fetch_from_news_api_live()
                logger.info(f"News API returned {len(news_api_news)} articles")
                all_news.extend(news_api_news)
            else:
                logger.warning("No News API key configured")
            
            # Fetch from Alpha Vantage
            if self.alpha_vantage_api_key:
                logger.info("Fetching from Alpha Vantage...")
                alpha_news = await self._fetch_from_alpha_vantage_live()
                logger.info(f"Alpha Vantage returned {len(alpha_news)} articles")
                all_news.extend(alpha_news)
            else:
                logger.warning("No Alpha Vantage API key configured")
            
            # Remove duplicates and sort by published time
            unique_news = self._deduplicate_news(all_news)
            unique_news.sort(key=lambda x: x.get('publishedAt', ''), reverse=True)
            
            logger.info(f"Total unique news: {len(unique_news)}")
            return unique_news[:50]  # Limit to 50 most recent
            
        except Exception as e:
            logger.error(f"Error fetching live news: {e}")
            return []
    
    async def _fetch_from_news_api_live(self) -> List[Dict[str, Any]]:
        """Fetch live news from News API"""
        try:
            logger.info("Fetching from News API live endpoint...")
            
            # Calculate date range for recent news
            from_date = (datetime.now() - timedelta(hours=24)).strftime('%Y-%m-%d')
            
            params = {
                "q": "stock market OR trading OR finance OR economy",
                "language": "en",
                "sortBy": "publishedAt",
                "pageSize": 50,
                "apiKey": self.news_api_key,
                "from": from_date
            }
            
            logger.info(f"News API params: {params}")
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://newsapi.org/v2/everything",
                    params=params,
                    timeout=30.0
                )
                
                logger.info(f"News API response status: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    articles = data.get("articles", [])
                    logger.info(f"News API returned {len(articles)} articles")
                    
                    processed_articles = []
                    for article in articles:
                        processed = self._process_news_api_article(article, "stock market OR trading OR finance OR economy")
                        if processed:
                            processed_articles.append(processed)
                    
                    logger.info(f"Processed {len(processed_articles)} articles from News API")
                    return processed_articles
                elif response.status_code == 429:
                    logger.warning("News API rate limited. Using sample news as fallback.")
                    return []
                else:
                    logger.error(f"News API error: {response.status_code} - {response.text}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error fetching from News API: {e}")
            return []
    
    async def _fetch_from_alpha_vantage_live(self) -> List[Dict[str, Any]]:
        """Fetch live news from Alpha Vantage"""
        try:
            logger.info("Fetching from Alpha Vantage live endpoint...")
            
            # Calculate time range for recent news
            time_from = (datetime.now() - timedelta(hours=24)).strftime('%Y%m%dT%H%M')
            
            params = {
                "function": "NEWS_SENTIMENT",
                "topics": "technology,earnings,forex,ipo",
                "time_from": time_from,
                "limit": 50,
                "apikey": self.alpha_vantage_api_key
            }
            
            logger.info(f"Alpha Vantage params: {params}")
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://www.alphavantage.co/query",
                    params=params,
                    timeout=30.0
                )
                
                logger.info(f"Alpha Vantage response status: {response.status_code}")
                
                if response.status_code == 200:
                    data = response.json()
                    feed = data.get("feed", [])
                    logger.info(f"Alpha Vantage returned {len(feed)} articles")
                    
                    processed_articles = []
                    for article in feed:
                        processed = self._process_alpha_vantage_article(article)
                        if processed:
                            processed_articles.append(processed)
                    
                    logger.info(f"Processed {len(processed_articles)} articles from Alpha Vantage")
                    return processed_articles
                else:
                    logger.error(f"Alpha Vantage error: {response.status_code} - {response.text}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error fetching from Alpha Vantage: {e}")
            return []
    
    def _process_news_api_article(self, article: Dict[str, Any], query: str) -> Optional[Dict[str, Any]]:
        """Process News API article into standardized format"""
        try:
            # Get published time for display (removed 2-hour filter)
            published_at = article.get('publishedAt')
            
            return {
                "title": article.get('title', ''),
                "description": article.get('description', ''),
                "url": article.get('url', ''),
                "source": article.get('source', {}).get('name', ''),
                "publishedAt": published_at,
                "urlToImage": article.get('urlToImage'),
                "category": self._categorize_article(article.get('title', ''), query),
                "sentiment": self._analyze_sentiment(article.get('title', '') + ' ' + article.get('description', '')),
                "relevance_score": self._calculate_relevance(article.get('title', ''), query),
                "isBreaking": self._is_breaking_news(article.get('title', '')),
                "priority": self._calculate_priority(article.get('title', ''), article.get('source', {}).get('name', ''))
            }
        except Exception as e:
            logger.error(f"Error processing News API article: {e}")
            return None
    
    def _process_alpha_vantage_article(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """Process Alpha Vantage article into standardized format"""
        try:
            return {
                "title": article.get('title', ''),
                "description": article.get('summary', ''),
                "url": article.get('url', ''),
                "source": article.get('source', ''),
                "publishedAt": article.get('time_published', ''),
                "urlToImage": None,
                "category": self._categorize_article(article.get('title', ''), ''),
                "sentiment": article.get('overall_sentiment_label', 'neutral'),
                "relevance_score": float(article.get('overall_sentiment_score', 0)),
                "isBreaking": self._is_breaking_news(article.get('title', '')),
                "priority": self._calculate_priority(article.get('title', ''), article.get('source', ''))
            }
        except Exception as e:
            logger.error(f"Error processing Alpha Vantage article: {e}")
            return {}
    
    def _categorize_article(self, title: str, query: str) -> str:
        """Categorize article based on title and query"""
        title_lower = title.lower()
        
        if any(word in title_lower for word in ['nifty', 'sensex', 'nse', 'bse', 'stock', 'market']):
            return 'markets'
        elif any(word in title_lower for word in ['rbi', 'fed', 'ecb', 'economy', 'gdp', 'inflation']):
            return 'economy'
        elif any(word in title_lower for word in ['earnings', 'profit', 'revenue', 'business']):
            return 'business'
        elif any(word in title_lower for word in ['crypto', 'bitcoin', 'ethereum']):
            return 'crypto'
        elif any(word in title_lower for word in ['oil', 'gold', 'commodities']):
            return 'commodities'
        else:
            return 'general'
    
    def _analyze_sentiment(self, text: str) -> str:
        """Simple sentiment analysis"""
        text_lower = text.lower()
        
        positive_words = ['surge', 'rally', 'gain', 'profit', 'growth', 'positive', 'bullish', 'up']
        negative_words = ['crash', 'fall', 'decline', 'loss', 'drop', 'negative', 'bearish', 'down']
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'
    
    def _calculate_relevance(self, title: str, query: str) -> float:
        """Calculate relevance score based on query match"""
        title_lower = title.lower()
        query_lower = query.lower()
        
        query_words = query_lower.split()
        matches = sum(1 for word in query_words if word in title_lower)
        
        return min(matches / len(query_words), 1.0) if query_words else 0.0
    
    def _is_breaking_news(self, title: str) -> bool:
        """Check if article is breaking news"""
        breaking_keywords = [
            'breaking', 'urgent', 'just in', 'flash', 'alert', 'update',
            'crash', 'rally', 'announcement', 'emergency', 'crisis'
        ]
        
        title_lower = title.lower()
        return any(keyword in title_lower for keyword in breaking_keywords)
    
    def _calculate_priority(self, title: str, source: str) -> int:
        """Calculate priority score for article"""
        priority = 1
        
        # Higher priority for breaking news
        if self._is_breaking_news(title):
            priority += 3
        
        # Higher priority for trusted sources
        trusted_sources = ['reuters.com', 'bloomberg.com', 'cnbc.com', 'wsj.com']
        if source in trusted_sources:
            priority += 2
        
        # Higher priority for market-related news
        market_keywords = ['nifty', 'sensex', 'stock', 'market', 'trading']
        if any(keyword in title.lower() for keyword in market_keywords):
            priority += 1
        
        return priority
    
    def _deduplicate_news(self, news_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate news articles"""
        seen_titles = set()
        unique_news = []
        
        for article in news_list:
            title = article.get('title', '').strip()
            if title and title not in seen_titles:
                seen_titles.add(title)
                unique_news.append(article)
        
        return unique_news
    
    async def _process_and_broadcast_news(self, new_news: List[Dict[str, Any]]):
        """Process new news and broadcast to connected clients"""
        try:
            # Update cache with new news
            self.news_cache = new_news
            self.last_update = datetime.now()
            
            # Prepare broadcast message
            broadcast_data = {
                "type": "news_update",
                "timestamp": datetime.now().isoformat(),
                "count": len(new_news),
                "breaking_news": [article for article in new_news if article.get('isBreaking')],
                "latest_news": new_news[:10]  # Send top 10 for immediate display
            }
            
            # Broadcast to all connected clients
            if self.active_connections:
                await self._broadcast_to_all(broadcast_data)
                logger.info(f"Broadcasted news update to {len(self.active_connections)} clients")
            
        except Exception as e:
            logger.error(f"Error processing and broadcasting news: {e}")
    
    async def _broadcast_to_all(self, message: Dict[str, Any]):
        """Broadcast message to all connected WebSocket clients"""
        if not self.active_connections:
            return
        
        # Convert message to JSON string
        message_json = json.dumps(message)
        
        # Broadcast to all connections
        disconnected = set()
        for connection in self.active_connections:
            try:
                await connection.send_text(message_json)
            except Exception as e:
                logger.error(f"Error broadcasting to client: {e}")
                disconnected.add(connection)
        
        # Remove disconnected clients
        self.active_connections -= disconnected
    
    async def connect(self, websocket: WebSocket):
        """Handle new WebSocket connection"""
        # Note: websocket.accept() is already called in the router
        self.active_connections.add(websocket)
        
        # Send initial news data
        if self.news_cache:
            initial_data = {
                "type": "initial_news",
                "timestamp": datetime.now().isoformat(),
                "news": self.news_cache[:20],
                "last_update": self.last_update.isoformat()
            }
            await websocket.send_text(json.dumps(initial_data))
        
        logger.info(f"New WebSocket connection. Total connections: {len(self.active_connections)}")
    
    async def disconnect(self, websocket: WebSocket):
        """Handle WebSocket disconnection"""
        self.active_connections.discard(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def get_latest_news(self) -> List[Dict[str, Any]]:
        """Get latest news from cache"""
        return self.news_cache.copy()
    
    async def refresh_news(self) -> List[Dict[str, Any]]:
        """Manually refresh news from APIs"""
        try:
            logger.info("Manual news refresh requested...")
            new_news = await self._fetch_live_news()
            
            if new_news:
                await self._process_and_broadcast_news(new_news)
                logger.info(f"News refreshed successfully: {len(new_news)} articles")
            else:
                logger.warning("No new news fetched during refresh, keeping existing cache")
            
            return self.news_cache.copy()
        except Exception as e:
            logger.error(f"Error during manual news refresh: {e}")
            return self.news_cache.copy()
    
    async def get_breaking_news(self) -> List[Dict[str, Any]]:
        """Get breaking news from cache"""
        return [article for article in self.news_cache if article.get('isBreaking')]
    
    async def get_news_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get news filtered by category"""
        return [article for article in self.news_cache if article.get('category') == category]

# Global instance
live_news_service = LiveNewsService()
