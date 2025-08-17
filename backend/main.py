from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from contextlib import asynccontextmanager

from config import settings
from database import init_database, check_database_health
from routers import auth, trading, portfolio, market_data, watchlist, settings as settings_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Trading Web App...")
    
    # Initialize database
    if not init_database():
        print("❌ Failed to initialize database")
        raise RuntimeError("Database initialization failed")
    
    print("✅ Database initialized successfully")
    
    # Health check
    if not check_database_health():
        print("❌ Database health check failed")
        raise RuntimeError("Database health check failed")
    
    print("✅ Database health check passed")
    print("🎯 Trading Web App is ready!")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down Trading Web App...")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="A modern trading web application with real-time market data",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(trading.router, prefix="/api/trading", tags=["Trading"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(market_data.router, prefix="/api/market", tags=["Market Data"])
app.include_router(watchlist.router, prefix="/api/watchlist", tags=["Watchlist"])
app.include_router(settings_router.router, prefix="/api/settings", tags=["Settings"])

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        db_healthy = check_database_health()
        return {
            "status": "healthy" if db_healthy else "unhealthy",
            "database": "healthy" if db_healthy else "unhealthy",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": "2024-01-01T00:00:00Z"
            }
        )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Trading Web App API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
