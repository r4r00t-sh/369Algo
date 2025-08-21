#!/usr/bin/env python3
"""
Database Connection Test Script
Run this to verify PostgreSQL and Redis connections
"""

import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import check_database_health, init_database
from config import settings

def test_connections():
    """Test database connections"""
    print("🔍 Testing Database Connections...")
    print("=" * 50)
    
    # Test PostgreSQL
    print(f"📊 PostgreSQL:")
    print(f"   Host: {settings.POSTGRES_HOST}")
    print(f"   Port: {settings.POSTGRES_PORT}")
    print(f"   Database: {settings.POSTGRES_DB}")
    print(f"   User: {settings.POSTGRES_USER}")
    print(f"   URL: {settings.POSTGRES_URL}")
    
    # Test Redis
    print(f"\n🔴 Redis:")
    print(f"   Host: {settings.REDIS_HOST}")
    print(f"   Port: {settings.REDIS_PORT}")
    print(f"   Database: {settings.REDIS_DB}")
    print(f"   URL: {settings.REDIS_URL}")
    
    print("\n" + "=" * 50)
    
    # Test connections
    try:
        if check_database_health():
            print("✅ All database connections successful!")
            
            # Initialize database tables
            print("\n🗄️  Initializing database tables...")
            if init_database():
                print("✅ Database tables created successfully!")
            else:
                print("❌ Failed to create database tables")
        else:
            print("❌ Database connection failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Trading Web App - Database Test")
    print("=" * 50)
    
    success = test_connections()
    
    if success:
        print("\n🎉 Setup complete! You can now run your backend server.")
        print("Run: python main.py")
    else:
        print("\n💥 Setup failed! Please check your configuration.")
        print("Make sure:")
        print("1. PostgreSQL is running on localhost:5432")
        print("2. Redis is running on localhost:6379")
        print("3. Database 'trading_app' exists")
        print("4. User 'trading_user' has proper permissions")
