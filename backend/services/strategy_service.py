import asyncio
import json
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func

from models.strategy import Strategy, StrategyTrade, StrategyBacktest
from models.user import User
from schemas.strategy import (
    StrategyCreate, StrategyUpdate, StrategyBacktestCreate,
    StrategyExecuteRequest, StrategyExecuteResponse
)

class StrategyService:
    """Service for managing trading strategies"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def create_strategy(self, user_id: int, strategy_data: StrategyCreate) -> Strategy:
        """Create a new trading strategy"""
        try:
            # Check if strategy name already exists for this user
            existing_strategy = self.db.query(Strategy).filter(
                and_(
                    Strategy.user_id == user_id,
                    Strategy.name == strategy_data.name
                )
            ).first()
            
            if existing_strategy:
                raise ValueError(f"Strategy with name '{strategy_data.name}' already exists")
            
            # Create new strategy
            db_strategy = Strategy(
                user_id=user_id,
                **strategy_data.dict()
            )
            
            self.db.add(db_strategy)
            self.db.commit()
            self.db.refresh(db_strategy)
            
            return db_strategy
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    async def get_strategy(self, strategy_id: int, user_id: int) -> Optional[Strategy]:
        """Get a specific strategy by ID"""
        return self.db.query(Strategy).filter(
            and_(
                Strategy.id == strategy_id,
                Strategy.user_id == user_id
            )
        ).first()
    
    async def get_user_strategies(
        self, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100,
        category: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> Dict[str, Any]:
        """Get all strategies for a user with pagination and filtering"""
        query = self.db.query(Strategy).filter(Strategy.user_id == user_id)
        
        # Apply filters
        if category:
            query = query.filter(Strategy.category == category)
        if is_active is not None:
            query = query.filter(Strategy.is_active == is_active)
        
        # Get total count
        total = query.count()
        
        # Apply pagination and ordering
        strategies = query.order_by(desc(Strategy.updated_at)).offset(skip).limit(limit).all()
        
        return {
            "strategies": strategies,
            "total": total,
            "page": skip // limit + 1,
            "size": limit
        }
    
    async def update_strategy(
        self, 
        strategy_id: int, 
        user_id: int, 
        strategy_data: StrategyUpdate
    ) -> Optional[Strategy]:
        """Update an existing strategy"""
        try:
            strategy = await self.get_strategy(strategy_id, user_id)
            if not strategy:
                return None
            
            # Update only provided fields
            update_data = strategy_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(strategy, field, value)
            
            strategy.updated_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(strategy)
            
            return strategy
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    async def delete_strategy(self, strategy_id: int, user_id: int) -> bool:
        """Delete a strategy"""
        try:
            strategy = await self.get_strategy(strategy_id, user_id)
            if not strategy:
                return False
            
            self.db.delete(strategy)
            self.db.commit()
            return True
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    async def toggle_strategy_status(self, strategy_id: int, user_id: int) -> Optional[Strategy]:
        """Toggle strategy active/inactive status"""
        try:
            strategy = await self.get_strategy(strategy_id, user_id)
            if not strategy:
                return None
            
            strategy.is_active = not strategy.is_active
            strategy.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(strategy)
            
            return strategy
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    async def create_backtest(
        self, 
        user_id: int, 
        backtest_data: StrategyBacktestCreate
    ) -> Optional[StrategyBacktest]:
        """Create a new strategy backtest"""
        try:
            # Verify strategy belongs to user
            strategy = await self.get_strategy(backtest_data.strategy_id, user_id)
            if not strategy:
                raise ValueError("Strategy not found or access denied")
            
            # Create backtest
            db_backtest = StrategyBacktest(
                **backtest_data.dict()
            )
            
            self.db.add(db_backtest)
            self.db.commit()
            self.db.refresh(db_backtest)
            
            return db_backtest
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    async def get_backtest_results(self, backtest_id: int, user_id: int) -> Optional[StrategyBacktest]:
        """Get backtest results"""
        backtest = self.db.query(StrategyBacktest).join(Strategy).filter(
            and_(
                StrategyBacktest.id == backtest_id,
                Strategy.user_id == user_id
            )
        ).first()
        
        return backtest
    
    async def execute_strategy(
        self, 
        user_id: int, 
        execution_data: StrategyExecuteRequest
    ) -> StrategyExecuteResponse:
        """Execute a trading strategy"""
        try:
            # Verify strategy belongs to user and is active
            strategy = await self.get_strategy(execution_data.strategy_id, user_id)
            if not strategy:
                raise ValueError("Strategy not found or access denied")
            
            if not strategy.is_active:
                raise ValueError("Strategy is not active")
            
            # Generate execution ID
            execution_id = str(uuid.uuid4())
            
            # Execute strategy logic (placeholder - implement actual strategy execution)
            trades_generated = await self._execute_strategy_logic(strategy, execution_data)
            
            # Update strategy execution timestamp
            strategy.last_executed = datetime.utcnow()
            self.db.commit()
            
            return StrategyExecuteResponse(
                strategy_id=execution_data.strategy_id,
                execution_id=execution_id,
                status="completed",
                trades_generated=trades_generated,
                estimated_pnl=0.0,  # Calculate based on strategy logic
                risk_metrics={},  # Calculate risk metrics
                execution_time=datetime.utcnow()
            )
            
        except Exception as e:
            raise e
    
    async def _execute_strategy_logic(
        self, 
        strategy: Strategy, 
        execution_data: StrategyExecuteRequest
    ) -> List[Dict[str, Any]]:
        """Execute the actual strategy logic (placeholder implementation)"""
        # This is a placeholder - implement actual strategy execution logic
        # based on strategy.conditions, strategy.parameters, etc.
        
        trades = []
        
        # Example: Simple moving average crossover strategy
        if strategy.category == "moving_average_crossover":
            trades = await self._execute_ma_crossover(strategy, execution_data)
        elif strategy.category == "mean_reversion":
            trades = await self._execute_mean_reversion(strategy, execution_data)
        elif strategy.category == "momentum":
            trades = await self._execute_momentum(strategy, execution_data)
        else:
            # Custom strategy - implement based on strategy.conditions
            trades = await self._execute_custom_strategy(strategy, execution_data)
        
        return trades
    
    async def _execute_ma_crossover(
        self, 
        strategy: Strategy, 
        execution_data: StrategyExecuteRequest
    ) -> List[Dict[str, Any]]:
        """Execute moving average crossover strategy"""
        # Placeholder implementation
        trades = []
        
        for symbol in execution_data.symbols:
            # Get market data for symbol
            # Calculate moving averages
            # Generate buy/sell signals based on crossover
            
            trade = {
                "symbol": symbol,
                "action": "BUY",  # or "SELL"
                "quantity": 100,
                "price": 0.0,  # Current market price
                "timestamp": datetime.utcnow().isoformat(),
                "reason": "MA Crossover Signal"
            }
            trades.append(trade)
        
        return trades
    
    async def _execute_mean_reversion(
        self, 
        strategy: Strategy, 
        execution_data: StrategyExecuteRequest
    ) -> List[Dict[str, Any]]:
        """Execute mean reversion strategy"""
        # Placeholder implementation
        trades = []
        
        for symbol in execution_data.symbols:
            # Get market data for symbol
            # Calculate mean reversion indicators
            # Generate signals based on deviation from mean
            
            trade = {
                "symbol": symbol,
                "action": "BUY",  # or "SELL"
                "quantity": 100,
                "price": 0.0,
                "timestamp": datetime.utcnow().isoformat(),
                "reason": "Mean Reversion Signal"
            }
            trades.append(trade)
        
        return trades
    
    async def _execute_momentum(
        self, 
        strategy: Strategy, 
        execution_data: StrategyExecuteRequest
    ) -> List[Dict[str, Any]]:
        """Execute momentum strategy"""
        # Placeholder implementation
        trades = []
        
        for symbol in execution_data.symbols:
            # Get market data for symbol
            # Calculate momentum indicators
            # Generate signals based on momentum strength
            
            trade = {
                "symbol": symbol,
                "action": "BUY",  # or "SELL"
                "quantity": 100,
                "price": 0.0,
                "timestamp": datetime.utcnow().isoformat(),
                "reason": "Momentum Signal"
            }
            trades.append(trade)
        
        return trades
    
    async def _execute_custom_strategy(
        self, 
        strategy: Strategy, 
        execution_data: StrategyExecuteRequest
    ) -> List[Dict[str, Any]]:
        """Execute custom strategy based on user-defined conditions"""
        # Placeholder implementation
        trades = []
        
        # Parse strategy.conditions and strategy.parameters
        # Execute custom logic
        
        for symbol in execution_data.symbols:
            trade = {
                "symbol": symbol,
                "action": "BUY",  # or "SELL"
                "quantity": 100,
                "price": 0.0,
                "timestamp": datetime.utcnow().isoformat(),
                "reason": "Custom Strategy Signal"
            }
            trades.append(trade)
        
        return trades
    
    async def get_strategy_performance(self, strategy_id: int, user_id: int) -> Dict[str, Any]:
        """Get comprehensive strategy performance metrics"""
        strategy = await self.get_strategy(strategy_id, user_id)
        if not strategy:
            return {}
        
        # Get recent trades
        recent_trades = self.db.query(StrategyTrade).filter(
            StrategyTrade.strategy_id == strategy_id
        ).order_by(desc(StrategyTrade.created_at)).limit(100).all()
        
        # Calculate performance metrics
        total_trades = len(recent_trades)
        successful_trades = sum(1 for trade in recent_trades if trade.performance_metrics and 
                              trade.performance_metrics.get('pnl', 0) > 0)
        
        win_rate = (successful_trades / total_trades * 100) if total_trades > 0 else 0
        
        # Get backtest results
        backtests = self.db.query(StrategyBacktest).filter(
            StrategyBacktest.strategy_id == strategy_id
        ).order_by(desc(StrategyBacktest.created_at)).limit(5).all()
        
        return {
            "strategy_id": strategy_id,
            "strategy_name": strategy.name,
            "total_trades": total_trades,
            "successful_trades": successful_trades,
            "win_rate": win_rate,
            "total_pnl": strategy.total_pnl,
            "recent_backtests": backtests,
            "last_executed": strategy.last_executed,
            "is_active": strategy.is_active
        }
    
    async def get_strategy_templates(self) -> List[Dict[str, Any]]:
        """Get predefined strategy templates"""
        templates = [
            {
                "name": "Moving Average Crossover",
                "description": "Buy when short MA crosses above long MA, sell when it crosses below",
                "category": "moving_average_crossover",
                "parameters_template": {
                    "short_period": {"type": "number", "default": 10, "min": 5, "max": 50},
                    "long_period": {"type": "number", "default": 20, "min": 10, "max": 200}
                },
                "conditions_template": {
                    "entry": "short_ma > long_ma",
                    "exit": "short_ma < long_ma"
                },
                "risk_management_template": {
                    "stop_loss": {"type": "percentage", "default": 2.0},
                    "take_profit": {"type": "percentage", "default": 6.0},
                    "position_size": {"type": "percentage", "default": 10.0}
                },
                "example_config": {
                    "short_period": 10,
                    "long_period": 20,
                    "stop_loss": 2.0,
                    "take_profit": 6.0
                },
                "tags": ["trend-following", "moving-average", "crossover"]
            },
            {
                "name": "Mean Reversion",
                "description": "Buy when price is below moving average, sell when above",
                "category": "mean_reversion",
                "parameters_template": {
                    "ma_period": {"type": "number", "default": 20, "min": 10, "max": 100},
                    "deviation_threshold": {"type": "percentage", "default": 2.0, "min": 0.5, "max": 10.0}
                },
                "conditions_template": {
                    "entry": "price < ma - threshold",
                    "exit": "price > ma + threshold"
                },
                "risk_management_template": {
                    "stop_loss": {"type": "percentage", "default": 3.0},
                    "take_profit": {"type": "percentage", "default": 4.0},
                    "position_size": {"type": "percentage", "default": 8.0}
                },
                "example_config": {
                    "ma_period": 20,
                    "deviation_threshold": 2.0,
                    "stop_loss": 3.0,
                    "take_profit": 4.0
                },
                "tags": ["mean-reversion", "oscillator", "contrarian"]
            },
            {
                "name": "Momentum",
                "description": "Buy stocks with strong upward momentum, sell when momentum weakens",
                "category": "momentum",
                "parameters_template": {
                    "momentum_period": {"type": "number", "default": 14, "min": 5, "max": 50},
                    "momentum_threshold": {"type": "number", "default": 0.5, "min": 0.1, "max": 2.0}
                },
                "conditions_template": {
                    "entry": "momentum > threshold",
                    "exit": "momentum < threshold"
                },
                "risk_management_template": {
                    "stop_loss": {"type": "percentage", "default": 2.5},
                    "take_profit": {"type": "percentage", "default": 8.0},
                    "position_size": {"type": "percentage", "default": 12.0}
                },
                "example_config": {
                    "momentum_period": 14,
                    "momentum_threshold": 0.5,
                    "stop_loss": 2.5,
                    "take_profit": 8.0
                },
                "tags": ["momentum", "trend-following", "breakout"]
            }
        ]
        
        return templates
