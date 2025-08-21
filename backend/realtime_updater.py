#!/usr/bin/env python3
"""
Real-time market data updater for Redis
Simulates live market data updates
"""
import redis
import json
import time
import random
from datetime import datetime
import threading

# Connect to Redis
redis_client = redis.Redis(
    host='localhost',
    port=6379,
    db=0,
    decode_responses=True
)

def update_stock_price(symbol, base_price, volatility=0.02):
    """Update stock price with realistic movement"""
    # Random price movement within volatility range
    change_percent = random.uniform(-volatility, volatility)
    new_price = base_price * (1 + change_percent)
    
    # Ensure price doesn't go negative
    new_price = max(new_price, base_price * 0.5)
    
    return round(new_price, 2), round(change_percent * 100, 2)

def update_market_data():
    """Update market data every few seconds"""
    print("🚀 Starting real-time market data updates...")
    
    # Base prices for stocks
    stock_prices = {
        "RELIANCE": 2450.75,
        "TCS": 3850.50,
        "HDFC": 1650.25,
        "INFY": 1450.25,
        "WIPRO": 450.75,
        "HCL": 1250.50
    }
    
    # Market indices base values
    indices = {
        "NIFTY 50": 19500.25,
        "SENSEX": 64500.75,
        "BANK NIFTY": 44500.50
    }
    
    try:
        while True:
            current_time = datetime.now()
            
            # Update stock quotes
            updated_quotes = {}
            for symbol, base_price in stock_prices.items():
                new_price, change_percent = update_stock_price(symbol, base_price)
                stock_prices[symbol] = new_price
                
                updated_quotes[symbol] = {
                    "symbol": symbol,
                    "name": f"{symbol} Ltd",
                    "price": new_price,
                    "change": round(new_price - base_price, 2),
                    "change_percent": round(change_percent, 2),
                    "volume": random.randint(500000, 2000000),
                    "market_cap": f"{random.randint(100000, 2000000)} Cr",
                    "timestamp": current_time.isoformat(),
                    "last_updated": current_time.strftime("%H:%M:%S")
                }
                
                # Store individual quote
                redis_client.setex(f"quote:{symbol}", 300, json.dumps(updated_quotes[symbol]))
            
            # Update market indices
            updated_indices = []
            for index_name, base_value in indices.items():
                change_percent = random.uniform(-0.5, 0.5)
                new_value = base_value * (1 + change_percent / 100)
                indices[index_name] = new_value
                
                updated_indices.append({
                    "name": index_name,
                    "value": round(new_value, 2),
                    "change": f"{'+' if change_percent >= 0 else ''}{round(change_percent, 2)}%",
                    "change_percent": f"{'+' if change_percent >= 0 else ''}{round(change_percent, 2)}%",
                    "last_updated": current_time.strftime("%H:%M:%S")
                })
            
            # Store market indices
            redis_client.setex("market:indices", 600, json.dumps(updated_indices))
            
            # Update trending stocks (top gainers/losers)
            sorted_quotes = sorted(updated_quotes.values(), key=lambda x: x['change_percent'], reverse=True)
            trending_stocks = sorted_quotes[:5]  # Top 5
            redis_client.setex("market:trending", 300, json.dumps(trending_stocks))
            
            # Update portfolio values (simulate user portfolio changes)
            portfolio_data = {
                "user_id": 1,
                "total_value": sum([q['price'] * random.randint(10, 100) for q in list(updated_quotes.values())[:3]]),
                "total_invested": 100000.00,
                "last_updated": current_time.isoformat()
            }
            portfolio_data["total_profit"] = portfolio_data["total_value"] - portfolio_data["total_invested"]
            portfolio_data["profit_percent"] = round((portfolio_data["total_profit"] / portfolio_data["total_invested"]) * 100, 2)
            
            redis_client.setex("portfolio:1", 300, json.dumps(portfolio_data))
            
            # Update watchlist with current prices
            watchlist_data = [
                {
                    "symbol": quote["symbol"],
                    "name": quote["name"],
                    "price": quote["price"],
                    "change": f"{'+' if quote['change'] >= 0 else ''}{quote['change']}"
                }
                for quote in list(updated_quotes.values())[:4]
            ]
            redis_client.setex("watchlist:1", 300, json.dumps(watchlist_data))
            
            # Add real-time activity log
            activity_log = {
                "timestamp": current_time.isoformat(),
                "type": "market_update",
                "message": f"Market data updated at {current_time.strftime('%H:%M:%S')}",
                "stocks_updated": len(updated_quotes),
                "indices_updated": len(updated_indices)
            }
            
            # Store in a list (keep last 100 activities)
            redis_client.lpush("activity:log", json.dumps(activity_log))
            redis_client.ltrim("activity:log", 0, 99)  # Keep only last 100
            redis_client.expire("activity:log", 3600)
            
            # Update last refresh time
            redis_client.setex("last_refresh", 300, current_time.strftime("%H:%M:%S"))
            
            print(f"✅ Market data updated at {current_time.strftime('%H:%M:%S')} - {len(updated_quotes)} stocks, {len(updated_indices)} indices")
            
            # Wait before next update
            time.sleep(5)  # Update every 5 seconds
            
    except KeyboardInterrupt:
        print("\n🛑 Real-time updates stopped")
    except Exception as e:
        print(f"❌ Error in real-time updates: {e}")

def update_user_activity():
    """Simulate user activity updates"""
    print("👤 Starting user activity simulation...")
    
    try:
        while True:
            current_time = datetime.now()
            
            # Update user session with last activity
            user_session = {
                "user_id": 1,
                "username": "testuser",
                "email": "test@example.com",
                "full_name": "Test User",
                "last_activity": current_time.isoformat(),
                "permissions": ["read", "write", "trade"],
                "session_duration": random.randint(1, 60)
            }
            
            redis_client.setex("session:1", 3600, json.dumps(user_session))
            
            # Simulate user actions
            actions = ["viewed_portfolio", "checked_watchlist", "searched_stock", "viewed_charts"]
            user_action = {
                "user_id": 1,
                "action": random.choice(actions),
                "timestamp": current_time.isoformat(),
                "details": f"User performed {random.choice(actions)} action"
            }
            
            redis_client.lpush("user:actions:1", json.dumps(user_action))
            redis_client.ltrim("user:actions:1", 0, 49)  # Keep last 50 actions
            redis_client.expire("user:actions:1", 3600)
            
            time.sleep(10)  # Update every 10 seconds
            
    except KeyboardInterrupt:
        print("\n🛑 User activity simulation stopped")
    except Exception as e:
        print(f"❌ Error in user activity simulation: {e}")

if __name__ == "__main__":
    print("🚀 Starting Redis real-time data updater...")
    print("Press Ctrl+C to stop")
    
    # Start market data updates in a separate thread
    market_thread = threading.Thread(target=update_market_data, daemon=True)
    market_thread.start()
    
    # Start user activity simulation in a separate thread
    activity_thread = threading.Thread(target=update_user_activity, daemon=True)
    activity_thread.start()
    
    try:
        # Keep main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down real-time updater...")
