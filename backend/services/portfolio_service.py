from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from database import Portfolio, Holding
from services.market_data_service import MarketDataService
from datetime import datetime

class PortfolioService:
    """Service for portfolio management and calculations"""
    
    def __init__(self):
        self.market_service = MarketDataService()
    
    async def get_portfolio_with_values(self, portfolio_id: int, db: Session) -> Dict[str, Any]:
        """Get portfolio with calculated total value and P&L"""
        portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        if not portfolio:
            return None
        
        holdings = db.query(Holding).filter(Holding.portfolio_id == portfolio_id).all()
        
        total_value = 0
        total_cost = 0
        
        # Calculate portfolio values
        for holding in holdings:
            try:
                # Get current price
                quote = await self.market_service.get_stock_quote(holding.symbol)
                current_price = quote['price']
                
                # Update holding with current price
                holding.current_price = current_price
                holding.last_updated = datetime.utcnow()
                
                # Calculate values
                market_value = holding.quantity * current_price
                cost_value = holding.quantity * holding.avg_price
                
                total_value += market_value
                total_cost += cost_value
                
            except Exception as e:
                # If we can't get current price, use last known price
                if holding.current_price:
                    market_value = holding.quantity * holding.current_price
                    cost_value = holding.quantity * holding.avg_price
                    total_value += market_value
                    total_cost += cost_value
        
        # Calculate total P&L
        total_pnl = total_value - total_cost
        total_pnl_percent = (total_pnl / total_cost * 100) if total_cost > 0 else 0
        
        # Commit price updates
        db.commit()
        
        return {
            "id": portfolio.id,
            "name": portfolio.name,
            "description": portfolio.description,
            "is_default": portfolio.is_default,
            "created_at": portfolio.created_at,
            "total_value": round(total_value, 2),
            "total_pnl": round(total_pnl, 2),
            "total_pnl_percent": round(total_pnl_percent, 2)
        }
    
    async def update_holding_prices(self, holding: Holding, db: Session) -> Dict[str, Any]:
        """Update holding with current prices and calculate P&L"""
        try:
            # Get current price
            quote = await self.market_service.get_stock_quote(holding.symbol)
            current_price = quote['price']
            
            # Update holding
            holding.current_price = current_price
            holding.last_updated = datetime.utcnow()
            
            # Calculate values
            market_value = holding.quantity * current_price
            cost_value = holding.quantity * holding.avg_price
            pnl = market_value - cost_value
            pnl_percent = (pnl / cost_value * 100) if cost_value > 0 else 0
            
            # Commit updates
            db.commit()
            
            return {
                "id": holding.id,
                "symbol": holding.symbol,
                "quantity": holding.quantity,
                "avg_price": holding.avg_price,
                "current_price": current_price,
                "market_value": round(market_value, 2),
                "pnl": round(pnl, 2),
                "pnl_percent": round(pnl_percent, 2),
                "last_updated": holding.last_updated
            }
            
        except Exception as e:
            # Return holding with last known values if update fails
            if holding.current_price:
                market_value = holding.quantity * holding.current_price
                cost_value = holding.quantity * holding.avg_price
                pnl = market_value - cost_value
                pnl_percent = (pnl / cost_value * 100) if cost_value > 0 else 0
                
                return {
                    "id": holding.id,
                    "symbol": holding.symbol,
                    "quantity": holding.quantity,
                    "avg_price": holding.avg_price,
                    "current_price": holding.current_price,
                    "market_value": round(market_value, 2),
                    "pnl": round(pnl, 2),
                    "pnl_percent": round(pnl_percent, 2),
                    "last_updated": holding.last_updated
                }
            else:
                return {
                    "id": holding.id,
                    "symbol": holding.symbol,
                    "quantity": holding.quantity,
                    "avg_price": holding.avg_price,
                    "current_price": 0,
                    "market_value": 0,
                    "pnl": 0,
                    "pnl_percent": 0,
                    "last_updated": holding.last_updated
                }
    
    async def calculate_portfolio_metrics(self, portfolio_id: int, db: Session) -> Dict[str, Any]:
        """Calculate comprehensive portfolio metrics"""
        portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        if not portfolio:
            return None
        
        holdings = db.query(Holding).filter(Holding.portfolio_id == portfolio_id).all()
        
        if not holdings:
            return {
                "total_value": 0,
                "total_cost": 0,
                "total_pnl": 0,
                "total_pnl_percent": 0,
                "best_performer": None,
                "worst_performer": None,
                "sector_allocation": {},
                "risk_metrics": {}
            }
        
        total_value = 0
        total_cost = 0
        holding_metrics = []
        sector_allocation = {}
        
        # Calculate individual holding metrics
        for holding in holdings:
            try:
                quote = await self.market_service.get_stock_quote(holding.symbol)
                current_price = quote['price']
                
                # Update holding
                holding.current_price = current_price
                holding.last_updated = datetime.utcnow()
                
                # Calculate values
                market_value = holding.quantity * current_price
                cost_value = holding.quantity * holding.avg_price
                pnl = market_value - cost_value
                pnl_percent = (pnl / cost_value * 100) if cost_value > 0 else 0
                
                total_value += market_value
                total_cost += cost_value
                
                holding_metrics.append({
                    "symbol": holding.symbol,
                    "pnl_percent": pnl_percent,
                    "market_value": market_value,
                    "weight": 0  # Will be calculated later
                })
                
            except Exception as e:
                # Use last known values
                if holding.current_price:
                    market_value = holding.quantity * holding.current_price
                    cost_value = holding.quantity * holding.avg_price
                    pnl = market_value - cost_value
                    pnl_percent = (pnl / cost_value * 100) if cost_value > 0 else 0
                    
                    total_value += market_value
                    total_cost += cost_value
                    
                    holding_metrics.append({
                        "symbol": holding.symbol,
                        "pnl_percent": pnl_percent,
                        "market_value": market_value,
                        "weight": 0
                    })
        
        # Calculate weights and find best/worst performers
        best_performer = None
        worst_performer = None
        best_pnl = float('-inf')
        worst_pnl = float('inf')
        
        for metric in holding_metrics:
            metric["weight"] = (metric["market_value"] / total_value * 100) if total_value > 0 else 0
            
            if metric["pnl_percent"] > best_pnl:
                best_pnl = metric["pnl_percent"]
                best_performer = metric["symbol"]
            
            if metric["pnl_percent"] < worst_pnl:
                worst_pnl = metric["pnl_percent"]
                worst_performer = metric["symbol"]
        
        # Calculate total P&L
        total_pnl = total_value - total_cost
        total_pnl_percent = (total_pnl / total_cost * 100) if total_cost > 0 else 0
        
        # Calculate risk metrics (simplified)
        if len(holding_metrics) > 1:
            pnl_percentages = [m["pnl_percent"] for m in holding_metrics]
            volatility = (max(pnl_percentages) - min(pnl_percentages)) / 2
        else:
            volatility = 0
        
        # Commit updates
        db.commit()
        
        return {
            "total_value": round(total_value, 2),
            "total_cost": round(total_cost, 2),
            "total_pnl": round(total_pnl, 2),
            "total_pnl_percent": round(total_pnl_percent, 2),
            "best_performer": best_performer,
            "worst_performer": worst_performer,
            "sector_allocation": sector_allocation,
            "risk_metrics": {
                "volatility": round(volatility, 2),
                "holdings_count": len(holdings),
                "diversification_score": min(len(holdings) / 10 * 100, 100)  # Simple diversification score
            }
        }
    
    async def rebalance_portfolio(self, portfolio_id: int, target_weights: Dict[str, float], 
                                db: Session) -> Dict[str, Any]:
        """Rebalance portfolio to target weights"""
        portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        if not portfolio:
            return {"error": "Portfolio not found"}
        
        holdings = db.query(Holding).filter(Holding.portfolio_id == portfolio_id).all()
        
        # Get current portfolio value
        portfolio_with_values = await self.get_portfolio_with_values(portfolio_id, db)
        total_value = portfolio_with_values["total_value"]
        
        if total_value == 0:
            return {"error": "Portfolio has no value"}
        
        rebalance_orders = []
        
        for holding in holdings:
            current_weight = (holding.quantity * holding.current_price / total_value * 100) if total_value > 0 else 0
            target_weight = target_weights.get(holding.symbol, 0)
            
            if abs(current_weight - target_weight) > 1:  # 1% threshold
                target_value = (target_weight / 100) * total_value
                target_quantity = target_value / holding.current_price if holding.current_price > 0 else 0
                quantity_diff = target_quantity - holding.quantity
                
                if abs(quantity_diff) > 0:
                    order_type = "BUY" if quantity_diff > 0 else "SELL"
                    rebalance_orders.append({
                        "symbol": holding.symbol,
                        "action": order_type,
                        "quantity": abs(quantity_diff),
                        "current_weight": round(current_weight, 2),
                        "target_weight": round(target_weight, 2),
                        "estimated_value": abs(quantity_diff) * holding.current_price
                    })
        
        return {
            "portfolio_id": portfolio_id,
            "total_value": total_value,
            "rebalance_orders": rebalance_orders,
            "estimated_cost": sum(order["estimated_value"] for order in rebalance_orders)
        }
    
    async def get_portfolio_performance(self, portfolio_id: int, period: str = "1y", 
                                      db: Session) -> Dict[str, Any]:
        """Get portfolio performance over time"""
        portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        if not portfolio:
            return None
        
        holdings = db.query(Holding).filter(Holding.portfolio_id == portfolio_id).all()
        
        if not holdings:
            return {
                "period": period,
                "total_return": 0,
                "annualized_return": 0,
                "volatility": 0,
                "sharpe_ratio": 0,
                "max_drawdown": 0
            }
        
        # This is a simplified performance calculation
        # In production, you'd want to use historical price data
        
        total_return = 0
        total_weight = 0
        
        for holding in holdings:
            if holding.current_price and holding.avg_price:
                weight = holding.quantity * holding.current_price
                return_pct = (holding.current_price - holding.avg_price) / holding.avg_price
                total_return += weight * return_pct
                total_weight += weight
        
        if total_weight > 0:
            portfolio_return = total_return / total_weight
        else:
            portfolio_return = 0
        
        # Simplified metrics
        annualized_return = portfolio_return * 12  # Assuming monthly rebalancing
        volatility = abs(portfolio_return) * 0.5  # Simplified volatility
        sharpe_ratio = annualized_return / volatility if volatility > 0 else 0
        max_drawdown = min(portfolio_return * 0.3, 0)  # Simplified max drawdown
        
        return {
            "period": period,
            "total_return": round(portfolio_return * 100, 2),
            "annualized_return": round(annualized_return * 100, 2),
            "volatility": round(volatility * 100, 2),
            "sharpe_ratio": round(sharpe_ratio, 2),
            "max_drawdown": round(max_drawdown * 100, 2)
        }
