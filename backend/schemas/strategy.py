from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

# Base Strategy Schema
class StrategyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Strategy name")
    description: Optional[str] = Field(None, description="Strategy description")
    category: str = Field(default="custom", description="Strategy category")
    
    # Strategy parameters
    parameters: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Strategy-specific parameters")
    conditions: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Entry/exit conditions")
    risk_management: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Risk management settings")
    
    # Execution settings
    is_active: bool = Field(default=True, description="Whether strategy is active")
    auto_execute: bool = Field(default=False, description="Whether to auto-execute trades")
    broker_integration: Optional[str] = Field(None, description="Broker integration (fyers, zerodha, etc.)")

# Create Strategy Schema
class StrategyCreate(StrategyBase):
    pass

# Update Strategy Schema
class StrategyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    conditions: Optional[Dict[str, Any]] = None
    risk_management: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    auto_execute: Optional[bool] = None
    broker_integration: Optional[str] = None

# Strategy Response Schema
class StrategyResponse(StrategyBase):
    id: int
    user_id: int
    
    # Performance tracking
    total_trades: int
    successful_trades: int
    total_pnl: float
    win_rate: float
    
    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime]
    last_executed: Optional[datetime]
    
    class Config:
        from_attributes = True

# Strategy List Response
class StrategyListResponse(BaseModel):
    strategies: List[StrategyResponse]
    total: int
    page: int
    size: int

# Strategy Trade Schema
class StrategyTradeBase(BaseModel):
    execution_reason: Optional[str] = None
    strategy_parameters: Optional[Dict[str, Any]] = None
    performance_metrics: Optional[Dict[str, Any]] = None

class StrategyTradeCreate(StrategyTradeBase):
    strategy_id: int
    trade_id: int

class StrategyTradeResponse(StrategyTradeBase):
    id: int
    strategy_id: int
    trade_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Strategy Backtest Schema
class StrategyBacktestBase(BaseModel):
    start_date: datetime
    end_date: datetime
    initial_capital: float = Field(..., gt=0, description="Initial capital for backtest")

class StrategyBacktestCreate(StrategyBacktestBase):
    strategy_id: int

class StrategyBacktestResponse(StrategyBacktestBase):
    id: int
    strategy_id: int
    
    # Results
    total_return: Optional[float] = None
    annualized_return: Optional[float] = None
    sharpe_ratio: Optional[float] = None
    max_drawdown: Optional[float] = None
    win_rate: Optional[float] = None
    total_trades: Optional[int] = None
    
    # Detailed results
    equity_curve: Optional[Dict[str, Any]] = None
    trade_history: Optional[Dict[str, Any]] = None
    monthly_returns: Optional[Dict[str, Any]] = None
    
    created_at: datetime
    
    class Config:
        from_attributes = True

# Strategy Execution Schema
class StrategyExecuteRequest(BaseModel):
    strategy_id: int
    symbols: List[str] = Field(..., min_items=1, description="Symbols to execute strategy on")
    capital: float = Field(..., gt=0, description="Capital to allocate")
    dry_run: bool = Field(default=True, description="Whether to execute in dry-run mode")

class StrategyExecuteResponse(BaseModel):
    strategy_id: int
    execution_id: str
    status: str  # pending, executing, completed, failed
    trades_generated: List[Dict[str, Any]]
    estimated_pnl: Optional[float] = None
    risk_metrics: Optional[Dict[str, Any]] = None
    execution_time: datetime

# Strategy Performance Schema
class StrategyPerformanceResponse(BaseModel):
    strategy_id: int
    strategy_name: str
    
    # Overall performance
    total_return: float
    annualized_return: float
    sharpe_ratio: float
    max_drawdown: float
    win_rate: float
    total_trades: int
    
    # Recent performance
    daily_returns: List[Dict[str, Any]]
    monthly_returns: List[Dict[str, Any]]
    
    # Risk metrics
    volatility: float
    beta: float
    alpha: float
    sortino_ratio: float
    
    # Trade analysis
    avg_trade_duration: float
    avg_win: float
    avg_loss: float
    largest_win: float
    largest_loss: float
    
    last_updated: datetime

# Strategy Template Schema
class StrategyTemplate(BaseModel):
    name: str
    description: str
    category: str
    parameters_template: Dict[str, Any]
    conditions_template: Dict[str, Any]
    risk_management_template: Dict[str, Any]
    example_config: Dict[str, Any]
    tags: List[str]

# Strategy Import/Export Schema
class StrategyExport(BaseModel):
    strategy: StrategyResponse
    backtests: List[StrategyBacktestResponse]
    trades: List[StrategyTradeResponse]
    export_metadata: Dict[str, Any]

class StrategyImport(BaseModel):
    strategy_data: StrategyExport
    overwrite_existing: bool = False
    import_backtests: bool = True
    import_trades: bool = True
