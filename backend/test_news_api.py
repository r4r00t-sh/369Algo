#!/usr/bin/env python3
"""
Test script to verify News API integration
Run this to test your News API key and see what news you can fetch
"""

import os
import asyncio
import httpx
from datetime import datetime

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

NEWS_API_KEY = os.getenv('NEWS_API_KEY')
NEWS_API_BASE = "https://newsapi.org/v2"

async def test_news_api():
    """Test the News API with different queries"""
    
    if not NEWS_API_KEY:
        print("❌ NEWS_API_KEY not found in .env file")
        return
    
    print(f"🔑 Testing News API Key: {NEWS_API_KEY[:8]}...")
    print("=" * 50)
    
    # Test queries for different markets
    test_queries = [
        {
            "name": "Global Financial News",
            "query": "finance OR business OR markets",
            "description": "General financial and business news"
        },
        {
            "name": "Indian Markets (NSE/BSE)",
            "query": "NIFTY OR SENSEX OR NSE OR BSE",
            "description": "Indian stock market news"
        },
        {
            "name": "US Markets",
            "query": "S&P 500 OR NASDAQ OR Dow Jones",
            "description": "US stock market news"
        },
        {
            "name": "Indian Companies",
            "query": "Reliance OR TCS OR HDFC OR Infosys",
            "description": "Major Indian company news"
        },
        {
            "name": "Global Economy",
            "query": "Fed OR ECB OR RBI OR inflation",
            "description": "Central bank and economic news"
        }
    ]
    
    for test in test_queries:
        print(f"\n📰 Testing: {test['name']}")
        print(f"🔍 Query: {test['query']}")
        print(f"📝 Description: {test['description']}")
        
        try:
            params = {
                "q": test["query"],
                "language": "en",
                "sortBy": "publishedAt",
                "pageSize": 3,  # Just get 3 articles for testing
                "apiKey": NEWS_API_KEY
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{NEWS_API_BASE}/everything", params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    articles = data.get("articles", [])
                    
                    print(f"✅ Success! Found {len(articles)} articles")
                    
                    for i, article in enumerate(articles[:2], 1):  # Show first 2 articles
                        print(f"  {i}. {article.get('title', 'No title')}")
                        print(f"     Source: {article.get('source', {}).get('name', 'Unknown')}")
                        print(f"     Published: {article.get('publishedAt', 'Unknown')}")
                        print()
                        
                elif response.status_code == 401:
                    print("❌ API key invalid or expired")
                    break
                elif response.status_code == 429:
                    print("⚠️ Rate limit exceeded (free tier limit)")
                    break
                else:
                    print(f"❌ Error: {response.status_code} - {response.text}")
                    
        except Exception as e:
            print(f"❌ Error: {str(e)}")
        
        print("-" * 50)
    
    print("\n🎯 News API Test Complete!")
    print("If you see articles above, your API key is working correctly!")
    print("You can now use the News page in your 369 Algo app!")

if __name__ == "__main__":
    print("🚀 Testing News API Integration for 369 Algo")
    print("This will verify your API key and show sample news")
    print()
    
    asyncio.run(test_news_api())
