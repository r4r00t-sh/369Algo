from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
from jose import jwt

from database import get_postgres_db
from models.user import User
from models.portfolio import Portfolio, Holding
from schemas.portfolio import PortfolioCreate, PortfolioResponse, HoldingCreate, HoldingResponse
from config import settings

router = APIRouter()
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_postgres_db)
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

@router.post("/create", response_model=PortfolioResponse)
async def create_portfolio(
    portfolio_data: PortfolioCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Create a new portfolio"""
    
    # Check if portfolio with same name already exists
    existing_portfolio = db.query(Portfolio).filter(
        Portfolio.user_id == current_user.id,
        Portfolio.name == portfolio_data.name
    ).first()
    
    if existing_portfolio:
        raise HTTPException(status_code=400, detail="Portfolio with this name already exists")
    
    # Create new portfolio
    portfolio = Portfolio(
        user_id=current_user.id,
        name=portfolio_data.name,
        description=portfolio_data.description,
        is_default=portfolio_data.is_default
    )
    
    # If this is set as default, unset other default portfolios
    if portfolio_data.is_default:
        db.query(Portfolio).filter(
            Portfolio.user_id == current_user.id,
            Portfolio.is_default == True
        ).update({"is_default": False})
    
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)
    
    return PortfolioResponse(
        id=portfolio.id,
        name=portfolio.name,
        description=portfolio.description,
        is_default=portfolio.is_default,
        created_at=portfolio.created_at
    )

@router.get("/list", response_model=List[PortfolioResponse])
async def get_portfolios(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Get all portfolios for the current user"""
    
    portfolios = db.query(Portfolio).filter(
        Portfolio.user_id == current_user.id
    ).all()
    
    return [
        PortfolioResponse(
            id=portfolio.id,
            name=portfolio.name,
            description=portfolio.description,
            is_default=portfolio.is_default,
            created_at=portfolio.created_at
        )
        for portfolio in portfolios
    ]

@router.get("/{portfolio_id}", response_model=PortfolioResponse)
async def get_portfolio(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Get a specific portfolio by ID"""
    
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    return PortfolioResponse(
        id=portfolio.id,
        name=portfolio.name,
        description=portfolio.description,
        is_default=portfolio.is_default,
        created_at=portfolio.created_at
    )

@router.put("/{portfolio_id}", response_model=PortfolioResponse)
async def update_portfolio(
    portfolio_id: int,
    portfolio_data: PortfolioCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Update a portfolio"""
    
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Check if name is being changed and if it conflicts with existing portfolio
    if portfolio_data.name != portfolio.name:
        existing_portfolio = db.query(Portfolio).filter(
            Portfolio.user_id == current_user.id,
            Portfolio.name == portfolio_data.name,
            Portfolio.id != portfolio_id
        ).first()
        
        if existing_portfolio:
            raise HTTPException(status_code=400, detail="Portfolio with this name already exists")
    
    # Update portfolio
    portfolio.name = portfolio_data.name
    portfolio.description = portfolio_data.description
    
    # Handle default portfolio setting
    if portfolio_data.is_default and not portfolio.is_default:
        # Unset other default portfolios
        db.query(Portfolio).filter(
            Portfolio.user_id == current_user.id,
            Portfolio.is_default == True
        ).update({"is_default": False})
        portfolio.is_default = True
    elif not portfolio_data.is_default and portfolio.is_default:
        portfolio.is_default = False
    
    db.commit()
    db.refresh(portfolio)
    
    return PortfolioResponse(
        id=portfolio.id,
        name=portfolio.name,
        description=portfolio.description,
        is_default=portfolio.is_default,
        created_at=portfolio.created_at
    )

@router.delete("/{portfolio_id}")
async def delete_portfolio(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Delete a portfolio and all its holdings"""
    
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Don't allow deletion of default portfolio if it's the only one
    if portfolio.is_default:
        portfolio_count = db.query(Portfolio).filter(
            Portfolio.user_id == current_user.id
        ).count()
        
        if portfolio_count == 1:
            raise HTTPException(status_code=400, detail="Cannot delete the only portfolio")
    
    db.delete(portfolio)
    db.commit()
    
    return {"message": "Portfolio deleted successfully"}

@router.post("/{portfolio_id}/holdings", response_model=HoldingResponse)
async def add_holding(
    portfolio_id: int,
    holding_data: HoldingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Add a holding to a portfolio"""
    
    # Verify portfolio exists and belongs to user
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Check if holding already exists for this symbol
    existing_holding = db.query(Holding).filter(
        Holding.portfolio_id == portfolio_id,
        Holding.symbol == holding_data.symbol
    ).first()
    
    if existing_holding:
        # Update existing holding
        existing_holding.quantity += holding_data.quantity
        existing_holding.avg_price = (
            (existing_holding.avg_price * existing_holding.quantity + 
             holding_data.price * holding_data.quantity) / 
            (existing_holding.quantity + holding_data.quantity)
        )
        existing_holding.current_price = holding_data.price
        existing_holding.last_updated = holding_data.last_updated
        
        db.commit()
        db.refresh(existing_holding)
        
        return HoldingResponse(
            id=existing_holding.id,
            symbol=existing_holding.symbol,
            quantity=existing_holding.quantity,
            avg_price=existing_holding.avg_price,
            current_price=existing_holding.current_price,
            last_updated=existing_holding.last_updated
        )
    
    # Create new holding
    holding = Holding(
        portfolio_id=portfolio_id,
        symbol=holding_data.symbol,
        quantity=holding_data.quantity,
        avg_price=holding_data.price,
        current_price=holding_data.price,
        last_updated=holding_data.last_updated
    )
    
    db.add(holding)
    db.commit()
    db.refresh(holding)
    
    return HoldingResponse(
        id=holding.id,
        symbol=holding.symbol,
        quantity=holding.quantity,
        avg_price=holding.avg_price,
        current_price=holding.current_price,
        last_updated=holding.last_updated
    )

@router.get("/{portfolio_id}/holdings", response_model=List[HoldingResponse])
async def get_portfolio_holdings(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Get all holdings in a portfolio"""
    
    # Verify portfolio exists and belongs to user
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    holdings = db.query(Holding).filter(
        Holding.portfolio_id == portfolio_id
    ).all()
    
    return [
        HoldingResponse(
            id=holding.id,
            symbol=holding.symbol,
            quantity=holding.quantity,
            avg_price=holding.avg_price,
            current_price=holding.current_price,
            last_updated=holding.last_updated
        )
        for holding in holdings
    ]

@router.put("/{portfolio_id}/holdings/{holding_id}", response_model=HoldingResponse)
async def update_holding(
    portfolio_id: int,
    holding_id: int,
    holding_data: HoldingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Update a holding in a portfolio"""
    
    # Verify portfolio exists and belongs to user
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Get the holding
    holding = db.query(Holding).filter(
        Holding.id == holding_id,
        Holding.portfolio_id == portfolio_id
    ).first()
    
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
    
    # Update holding
    holding.quantity = holding_data.quantity
    holding.avg_price = holding_data.price
    holding.current_price = holding_data.price
    holding.last_updated = holding_data.last_updated
    
    db.commit()
    db.refresh(holding)
    
    return HoldingResponse(
        id=holding.id,
        symbol=holding.symbol,
        quantity=holding.quantity,
        avg_price=holding.avg_price,
        current_price=holding.current_price,
        last_updated=holding.last_updated
    )

@router.delete("/{portfolio_id}/holdings/{holding_id}")
async def remove_holding(
    portfolio_id: int,
    holding_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Remove a holding from a portfolio"""
    
    # Verify portfolio exists and belongs to user
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Get the holding
    holding = db.query(Holding).filter(
        Holding.id == holding_id,
        Holding.portfolio_id == portfolio_id
    ).first()
    
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
    
    db.delete(holding)
    db.commit()
    
    return {"message": "Holding removed successfully"}
