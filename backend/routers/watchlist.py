from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
import jwt

from database import get_postgres_db
from models.user import User
from models.watchlist import Watchlist
from schemas.watchlist import WatchlistCreate, WatchlistResponse, WatchlistUpdate
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
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

@router.post("/add", response_model=WatchlistResponse)
async def add_to_watchlist(
    watchlist_data: WatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Add a stock to user's watchlist"""

    # Check if already in watchlist
    existing_item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.symbol == watchlist_data.symbol.upper()
    ).first()

    if existing_item:
        raise HTTPException(status_code=400, detail="Stock already in watchlist")

    # Create new watchlist item
    watchlist_item = Watchlist(
        user_id=current_user.id,
        symbol=watchlist_data.symbol.upper(),
        name=watchlist_data.name
    )

    db.add(watchlist_item)
    db.commit()
    db.refresh(watchlist_item)

    return WatchlistResponse(
        id=watchlist_item.id,
        symbol=watchlist_item.symbol,
        name=watchlist_item.name,
        added_at=watchlist_item.added_at
    )

@router.get("/list", response_model=List[WatchlistResponse])
async def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Get user's watchlist"""

    watchlist_items = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id
    ).order_by(Watchlist.added_at.desc()).all()

    return [
        WatchlistResponse(
            id=item.id,
            symbol=item.symbol,
            name=item.name,
            added_at=item.added_at
        )
        for item in watchlist_items
    ]

@router.put("/{item_id}", response_model=WatchlistResponse)
async def update_watchlist_item(
    item_id: int,
    watchlist_data: WatchlistUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Update a watchlist item (e.g., custom name)"""

    watchlist_item = db.query(Watchlist).filter(
        Watchlist.id == item_id,
        Watchlist.user_id == current_user.id
    ).first()

    if not watchlist_item:
        raise HTTPException(status_code=404, detail="Watchlist item not found")

    # Update fields
    if watchlist_data.name is not None:
        watchlist_item.name = watchlist_data.name

    db.commit()
    db.refresh(watchlist_item)

    return WatchlistResponse(
        id=watchlist_item.id,
        symbol=watchlist_item.symbol,
        name=watchlist_item.name,
        added_at=watchlist_item.added_at
    )

@router.delete("/{item_id}")
async def remove_from_watchlist(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Remove a stock from user's watchlist"""

    watchlist_item = db.query(Watchlist).filter(
        Watchlist.id == item_id,
        Watchlist.user_id == current_user.id
    ).first()

    if not watchlist_item:
        raise HTTPException(status_code=404, detail="Watchlist item not found")

    db.delete(watchlist_item)
    db.commit()

    return {"message": "Stock removed from watchlist successfully"}

@router.delete("/symbol/{symbol}")
async def remove_symbol_from_watchlist(
    symbol: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_postgres_db)
):
    """Remove a stock from watchlist by symbol"""

    watchlist_item = db.query(Watchlist).filter(
        Watchlist.user_id == current_user.id,
        Watchlist.symbol == symbol.upper()
    ).first()

    if not watchlist_item:
        raise HTTPException(status_code=404, detail="Stock not found in watchlist")

    db.delete(watchlist_item)
    db.commit()

    return {"message": "Stock removed from watchlist successfully"}
