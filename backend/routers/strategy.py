from fastapi import APIRouter, Depends, HTTPException, Query, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional, Dict, Any
from jose import jwt
import json
from datetime import datetime

from database import get_postgres_db
from models.user import User
from config import settings
from services.strategy_service import StrategyService
from services.cache_service import cache_service
from schemas.strategy import (
    StrategyCreate, StrategyUpdate, StrategyResponse, StrategyListResponse,
    StrategyBacktestCreate, StrategyBacktestResponse, StrategyExecuteRequest,
    StrategyExecuteResponse, StrategyPerformanceResponse, StrategyTemplate
)

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
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# Strategy CRUD Operations
@router.post("/", response_model=StrategyResponse)
async def create_strategy(
    strategy_data: StrategyCreate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Create a new trading strategy"""
    try:
        strategy_service = StrategyService(db)
        strategy = await strategy_service.create_strategy(current_user.id, strategy_data)
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "created_strategy",
            "strategy_name": strategy.name,
            "strategy_category": strategy.category,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return strategy
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create strategy: {str(e)}")

@router.get("/", response_model=StrategyListResponse)
async def get_strategies(
    skip: int = Query(0, ge=0, description="Number of strategies to skip"),
    limit: int = Query(100, ge=1, le=200, description="Number of strategies to return"),
    category: Optional[str] = Query(None, description="Filter by strategy category"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Get all strategies for the current user"""
    try:
        strategy_service = StrategyService(db)
        result = await strategy_service.get_user_strategies(
            current_user.id, skip, limit, category, is_active
        )
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_strategies",
            "filters": {"category": category, "is_active": is_active},
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch strategies: {str(e)}")

@router.get("/{strategy_id}", response_model=StrategyResponse)
async def get_strategy(
    strategy_id: int,
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Get a specific strategy by ID"""
    try:
        strategy_service = StrategyService(db)
        strategy = await strategy_service.get_strategy(strategy_id, current_user.id)
        
        if not strategy:
            raise HTTPException(status_code=404, detail="Strategy not found")
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_strategy",
            "strategy_id": strategy_id,
            "strategy_name": strategy.name,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return strategy
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch strategy: {str(e)}")

@router.put("/{strategy_id}", response_model=StrategyResponse)
async def update_strategy(
    strategy_id: int,
    strategy_data: StrategyUpdate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Update an existing strategy"""
    try:
        strategy_service = StrategyService(db)
        strategy = await strategy_service.update_strategy(strategy_id, current_user.id, strategy_data)
        
        if not strategy:
            raise HTTPException(status_code=404, detail="Strategy not found")
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "updated_strategy",
            "strategy_id": strategy_id,
            "strategy_name": strategy.name,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return strategy
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update strategy: {str(e)}")

@router.delete("/{strategy_id}")
async def delete_strategy(
    strategy_id: int,
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Delete a strategy"""
    try:
        strategy_service = StrategyService(db)
        success = await strategy_service.delete_strategy(strategy_id, current_user.id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Strategy not found")
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "deleted_strategy",
            "strategy_id": strategy_id,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {"message": "Strategy deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete strategy: {str(e)}")

@router.patch("/{strategy_id}/toggle")
async def toggle_strategy_status(
    strategy_id: int,
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Toggle strategy active/inactive status"""
    try:
        strategy_service = StrategyService(db)
        strategy = await strategy_service.toggle_strategy_status(strategy_id, current_user.id)
        
        if not strategy:
            raise HTTPException(status_code=404, detail="Strategy not found")
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "toggled_strategy_status",
            "strategy_id": strategy_id,
            "strategy_name": strategy.name,
            "new_status": strategy.is_active,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {
            "message": f"Strategy '{strategy.name}' {'activated' if strategy.is_active else 'deactivated'}",
            "is_active": strategy.is_active
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to toggle strategy status: {str(e)}")

# Strategy Backtesting
@router.post("/{strategy_id}/backtest", response_model=StrategyBacktestResponse)
async def create_backtest(
    strategy_id: int,
    backtest_data: StrategyBacktestCreate,
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Create a new strategy backtest"""
    try:
        strategy_service = StrategyService(db)
        backtest = await strategy_service.create_backtest(current_user.id, backtest_data)
        
        if not backtest:
            raise HTTPException(status_code=400, detail="Failed to create backtest")
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "created_strategy_backtest",
            "strategy_id": strategy_id,
            "backtest_id": backtest.id,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return backtest
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create backtest: {str(e)}")

@router.get("/{strategy_id}/backtest/{backtest_id}", response_model=StrategyBacktestResponse)
async def get_backtest_results(
    strategy_id: int,
    backtest_id: int,
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Get backtest results"""
    try:
        strategy_service = StrategyService(db)
        backtest = await strategy_service.get_backtest_results(backtest_id, current_user.id)
        
        if not backtest:
            raise HTTPException(status_code=404, detail="Backtest not found")
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_backtest_results",
            "strategy_id": strategy_id,
            "backtest_id": backtest_id,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return backtest
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch backtest results: {str(e)}")

# Strategy Execution
@router.post("/{strategy_id}/execute", response_model=StrategyExecuteResponse)
async def execute_strategy(
    strategy_id: int,
    execution_data: StrategyExecuteRequest,
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Execute a trading strategy"""
    try:
        strategy_service = StrategyService(db)
        result = await strategy_service.execute_strategy(current_user.id, execution_data)
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "executed_strategy",
            "strategy_id": strategy_id,
            "execution_id": result.execution_id,
            "symbols_count": len(execution_data.symbols),
            "dry_run": execution_data.dry_run,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute strategy: {str(e)}")

# Strategy Performance
@router.get("/{strategy_id}/performance", response_model=StrategyPerformanceResponse)
async def get_strategy_performance(
    strategy_id: int,
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Get comprehensive strategy performance metrics"""
    try:
        strategy_service = StrategyService(db)
        performance = await strategy_service.get_strategy_performance(strategy_id, current_user.id)
        
        if not performance:
            raise HTTPException(status_code=404, detail="Strategy not found")
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_strategy_performance",
            "strategy_id": strategy_id,
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return performance
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch strategy performance: {str(e)}")

# Strategy Templates
@router.get("/templates", response_model=List[StrategyTemplate])
async def get_strategy_templates(
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Get predefined strategy templates"""
    try:
        strategy_service = StrategyService(db)
        templates = await strategy_service.get_strategy_templates()
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_strategy_templates",
            "templates_count": len(templates),
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return templates
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch strategy templates: {str(e)}")

# Strategy Categories
@router.get("/categories")
async def get_strategy_categories(
    current_user: User = Depends(get_current_user),
    db = Depends(get_postgres_db)
):
    """Get available strategy categories"""
    try:
        categories = [
            {"id": "custom", "name": "Custom Strategy", "description": "User-defined custom strategies"},
            {"id": "moving_average_crossover", "name": "Moving Average Crossover", "description": "Trend-following strategies based on MA crossovers"},
            {"id": "mean_reversion", "name": "Mean Reversion", "description": "Contrarian strategies based on price deviations"},
            {"id": "momentum", "name": "Momentum", "description": "Momentum-based strategies for trend continuation"},
            {"id": "breakout", "name": "Breakout", "description": "Strategies based on price breakouts from ranges"},
            {"id": "arbitrage", "name": "Arbitrage", "description": "Risk-free profit strategies from price differences"},
            {"id": "pairs_trading", "name": "Pairs Trading", "description": "Statistical arbitrage between correlated assets"},
            {"id": "options", "name": "Options Strategies", "description": "Advanced options-based trading strategies"}
        ]
        
        # Log user activity
        user_action = {
            "user_id": current_user.id,
            "username": current_user.username,
            "action": "viewed_strategy_categories",
            "categories_count": len(categories),
            "timestamp": datetime.now().isoformat()
        }
        
        cache_service.redis_client.lpush(f"user:actions:{current_user.id}", json.dumps(user_action))
        cache_service.redis_client.ltrim(f"user:actions:{current_user.id}", 0, 49)
        cache_service.redis_client.expire(f"user:actions:{current_user.id}", 3600)
        
        return {"categories": categories}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch strategy categories: {str(e)}")
