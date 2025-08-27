import asyncio
import json
import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import base64
import hashlib
import hmac
import time

from config import settings

class FyersService:
    """Service for integrating with Fyers API Connect"""
    
    def __init__(self):
        self.base_url = "https://api.fyers.in"
        self.api_version = "v2"
        self.app_id = getattr(settings, 'FYERS_APP_ID', None)
        self.app_secret = getattr(settings, 'FYERS_APP_SECRET', None)
        self.redirect_uri = getattr(settings, 'FYERS_REDIRECT_URI', None)
        
        # API endpoints
        self.auth_url = f"{self.base_url}/oauth/authorize"
        self.token_url = f"{self.base_url}/oauth/token"
        self.profile_url = f"{self.base_url}/api/{self.api_version}/profile"
        self.holdings_url = f"{self.base_url}/api/{self.api_version}/holdings"
        self.orders_url = f"{self.base_url}/api/{self.api_version}/orders"
        self.positions_url = f"{self.base_url}/api/{self.api_version}/positions"
        self.quotes_url = f"{self.base_url}/api/{self.api_version}/quotes"
        self.history_url = f"{self.base_url}/api/{self.api_version}/history"
        
        # Session management
        self.access_token = None
        self.refresh_token = None
        self.token_expiry = None
    
    def get_auth_url(self, state: str = None) -> str:
        """Generate Fyers authorization URL"""
        if not self.app_id or not self.redirect_uri:
            raise ValueError("Fyers app credentials not configured")
        
        params = {
            "client_id": self.app_id,
            "redirect_uri": self.redirect_uri,
            "response_type": "code",
            "state": state or "default",
            "grant_type": "authorization_code"
        }
        
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{self.auth_url}?{query_string}"
    
    async def exchange_auth_code(self, auth_code: str) -> Dict[str, Any]:
        """Exchange authorization code for access token"""
        if not self.app_id or not self.app_secret:
            raise ValueError("Fyers app credentials not configured")
        
        # Generate app signature
        app_signature = self._generate_app_signature()
        
        data = {
            "grant_type": "authorization_code",
            "appIdHash": app_signature,
            "code": auth_code
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.token_url,
                    json=data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    token_data = response.json()
                    
                    # Store tokens
                    self.access_token = token_data.get("access_token")
                    self.refresh_token = token_data.get("refresh_token")
                    expires_in = token_data.get("expires_in", 3600)
                    self.token_expiry = datetime.utcnow() + timedelta(seconds=expires_in)
                    
                    return token_data
                else:
                    error_data = response.json()
                    raise Exception(f"Token exchange failed: {error_data.get('message', 'Unknown error')}")
                    
        except Exception as e:
            raise Exception(f"Failed to exchange auth code: {str(e)}")
    
    async def refresh_access_token(self) -> Dict[str, Any]:
        """Refresh access token using refresh token"""
        if not self.refresh_token:
            raise ValueError("No refresh token available")
        
        # Generate app signature
        app_signature = self._generate_app_signature()
        
        data = {
            "grant_type": "refresh_token",
            "appIdHash": app_signature,
            "refresh_token": self.refresh_token
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.token_url,
                    json=data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    token_data = response.json()
                    
                    # Update tokens
                    self.access_token = token_data.get("access_token")
                    if "refresh_token" in token_data:
                        self.refresh_token = token_data.get("refresh_token")
                    expires_in = token_data.get("expires_in", 3600)
                    self.token_expiry = datetime.utcnow() + timedelta(seconds=expires_in)
                    
                    return token_data
                else:
                    error_data = response.json()
                    raise Exception(f"Token refresh failed: {error_data.get('message', 'Unknown error')}")
                    
        except Exception as e:
            raise Exception(f"Failed to refresh token: {str(e)}")
    
    def _generate_app_signature(self) -> str:
        """Generate app signature for Fyers API"""
        if not self.app_id or not self.app_secret:
            raise ValueError("Fyers app credentials not configured")
        
        # Create app signature hash
        app_id_hash = hashlib.sha256(self.app_id.encode()).hexdigest()
        return app_id_hash
    
    def _get_auth_headers(self) -> Dict[str, str]:
        """Get authentication headers for API requests"""
        if not self.access_token:
            raise ValueError("No access token available")
        
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
    
    async def _ensure_valid_token(self):
        """Ensure access token is valid, refresh if needed"""
        if not self.access_token:
            raise ValueError("No access token available")
        
        if self.token_expiry and datetime.utcnow() >= self.token_expiry:
            await self.refresh_access_token()
    
    async def get_profile(self) -> Dict[str, Any]:
        """Get user profile information"""
        await self._ensure_valid_token()
        
        headers = self._get_auth_headers()
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    self.profile_url,
                    headers=headers
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    error_data = response.json()
                    raise Exception(f"Failed to get profile: {error_data.get('message', 'Unknown error')}")
                    
        except Exception as e:
            raise Exception(f"Failed to get profile: {str(e)}")
    
    async def get_holdings(self) -> Dict[str, Any]:
        """Get user holdings/portfolio"""
        await self._ensure_valid_token()
        
        headers = self._get_auth_headers()
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    self.holdings_url,
                    headers=headers
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    error_data = response.json()
                    raise Exception(f"Failed to get holdings: {error_data.get('message', 'Unknown error')}")
                    
        except Exception as e:
            raise Exception(f"Failed to get holdings: {str(e)}")
    
    async def get_positions(self) -> Dict[str, Any]:
        """Get current positions"""
        await self._ensure_valid_token()
        
        headers = self._get_auth_headers()
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    self.positions_url,
                    headers=headers
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    error_data = response.json()
                    raise Exception(f"Failed to get positions: {error_data.get('message', 'Unknown error')}")
                    
        except Exception as e:
            raise Exception(f"Failed to get positions: {str(e)}")
    
    async def get_orders(self, order_id: Optional[str] = None) -> Dict[str, Any]:
        """Get orders (all or specific order)"""
        await self._ensure_valid_token()
        
        headers = self._get_auth_headers()
        url = f"{self.orders_url}/{order_id}" if order_id else self.orders_url
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, headers=headers)
                
                if response.status_code == 200:
                    return response.json()
                else:
                    error_data = response.json()
                    raise Exception(f"Failed to get orders: {error_data.get('message', 'Unknown error')}")
                    
        except Exception as e:
            raise Exception(f"Failed to get orders: {str(e)}")
    
    async def place_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Place a new order"""
        await self._ensure_valid_token()
        
        headers = self._get_auth_headers()
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.orders_url,
                    json=order_data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    error_data = response.json()
                    raise Exception(f"Failed to place order: {error_data.get('message', 'Unknown error')}")
                    
        except Exception as e:
            raise Exception(f"Failed to place order: {str(e)}")
    
    async def modify_order(self, order_id: str, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Modify an existing order"""
        await self._ensure_valid_token()
        
        headers = self._get_auth_headers()
        url = f"{self.orders_url}/{order_id}"
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.put(
                    url,
                    json=order_data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    error_data = response.json()
                    raise Exception(f"Failed to modify order: {error_data.get('message', 'Unknown error')}")
                    
        except Exception as e:
            raise Exception(f"Failed to modify order: {str(e)}")
    
    async def cancel_order(self, order_id: str) -> Dict[str, Any]:
        """Cancel an order"""
        await self._ensure_valid_token()
        
        headers = self._get_auth_headers()
        url = f"{self.orders_url}/{order_id}"
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.delete(url, headers=headers)
                
                if response.status_code == 200:
                    return response.json()
                else:
                    error_data = response.json()
                    raise Exception(f"Failed to cancel order: {error_data.get('message', 'Unknown error')}")
                    
        except Exception as e:
            raise Exception(f"Failed to cancel order: {str(e)}")
    
    async def get_quotes(self, symbols: List[str]) -> Dict[str, Any]:
        """Get quotes for multiple symbols"""
        await self._ensure_valid_token()
        
        headers = self._get_auth_headers()
        
        # Fyers expects symbols in specific format
        formatted_symbols = [f"NSE:{symbol}" for symbol in symbols]
        
        data = {
            "symbols": formatted_symbols
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.quotes_url,
                    json=data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    error_data = response.json()
                    raise Exception(f"Failed to get quotes: {error_data.get('message', 'Unknown error')}")
                    
        except Exception as e:
            raise Exception(f"Failed to get quotes: {str(e)}")
    
    async def get_history(
        self, 
        symbol: str, 
        resolution: str = "1D",
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """Get historical data for a symbol"""
        await self._ensure_valid_token()
        
        headers = self._get_auth_headers()
        
        # Set default dates if not provided
        if not end_date:
            end_date = datetime.now().strftime("%Y-%m-%d")
        if not start_date:
            start_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        
        data = {
            "symbol": f"NSE:{symbol}",
            "resolution": resolution,
            "date_format": "1",
            "range_from": start_date,
            "range_to": end_date
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.history_url,
                    json=data,
                    headers=headers
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    error_data = response.json()
                    raise Exception(f"Failed to get history: {error_data.get('message', 'Unknown error')}")
                    
        except Exception as e:
            raise Exception(f"Failed to get history: {str(e)}")
    
    async def get_market_status(self) -> Dict[str, Any]:
        """Get market status (open/closed)"""
        # This is a simplified market status check
        # In a real implementation, you'd call Fyers API for market status
        
        current_time = datetime.now()
        current_hour = current_time.hour
        
        # Simple logic for Indian market hours (9:15 AM to 3:30 PM)
        is_market_open = (
            (current_hour >= 9 and current_time.minute >= 15) or 
            (current_hour > 9 and current_hour < 15) or
            (current_hour == 15 and current_time.minute <= 30)
        )
        
        return {
            "market_status": "open" if is_market_open else "closed",
            "current_time": current_time.isoformat(),
            "next_open": "09:15:00",
            "next_close": "15:30:00"
        }
    
    async def get_account_summary(self) -> Dict[str, Any]:
        """Get account summary including balance, P&L, etc."""
        try:
            # Get profile and holdings
            profile = await self.get_profile()
            holdings = await self.get_holdings()
            positions = await self.get_positions()
            
            # Calculate account summary
            total_holdings_value = sum(
                holding.get("market_value", 0) for holding in holdings.get("holdings", [])
            )
            
            total_pnl = sum(
                position.get("realized_pnl", 0) + position.get("unrealized_pnl", 0)
                for position in positions.get("positions", [])
            )
            
            return {
                "profile": profile,
                "account_summary": {
                    "total_holdings_value": total_holdings_value,
                    "total_pnl": total_pnl,
                    "total_positions": len(positions.get("positions", [])),
                    "total_holdings": len(holdings.get("holdings", []))
                },
                "holdings": holdings,
                "positions": positions
            }
            
        except Exception as e:
            raise Exception(f"Failed to get account summary: {str(e)}")
    
    def is_connected(self) -> bool:
        """Check if connected to Fyers API"""
        return (
            self.access_token is not None and 
            self.token_expiry is not None and 
            datetime.utcnow() < self.token_expiry
        )
    
    def disconnect(self):
        """Disconnect from Fyers API"""
        self.access_token = None
        self.refresh_token = None
        self.token_expiry = None
