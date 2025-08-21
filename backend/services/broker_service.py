from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import asyncio
import requests
from kiteconnect import KiteConnect
import json

class BrokerService:
    """Service for integrating with different broker APIs"""
    
    def __init__(self, broker_connection):
        self.broker_connection = broker_connection
        self.broker_name = broker_connection.broker_name
        self.api_key = broker_connection.api_key
        self.api_secret = broker_connection.api_secret
        self.access_token = broker_connection.access_token
        self.refresh_token = broker_connection.refresh_token
        self.kite = None
        
        # Initialize broker-specific clients
        if self.broker_name == "zerodha":
            self.kite = KiteConnect(api_key=self.api_key)
            if self.access_token:
                self.kite.set_access_token(self.access_token)
    
    async def authenticate(self) -> bool:
        """Authenticate with the broker"""
        try:
            if self.broker_name == "zerodha":
                return await self._authenticate_zerodha()
            elif self.broker_name == "angel_one":
                return await self._authenticate_angel_one()
            elif self.broker_name == "upstox":
                return await self._authenticate_upstox()
            else:
                raise ValueError(f"Unsupported broker: {self.broker_name}")
        except Exception as e:
            print(f"Authentication failed for {self.broker_name}: {e}")
            return False
    
    async def _authenticate_zerodha(self) -> bool:
        """Authenticate with Zerodha"""
        try:
            if not self.kite:
                return False
                
            # Check if we have a valid access token
            if self.access_token:
                try:
                    # Try to get user profile to verify token is valid
                    profile = self.kite.profile()
                    if profile:
                        return True
                except:
                    # Token is invalid, try to refresh
                    pass
            
            # If we have refresh token, try to refresh
            if self.refresh_token:
                try:
                    session = self.kite.renew_access_token(
                        refresh_token=self.refresh_token,
                        api_secret=self.api_secret
                    )
                    self.access_token = session["access_token"]
                    self.refresh_token = session["refresh_token"]
                    
                    # Update the database
                    self.broker_connection.access_token = self.access_token
                    self.broker_connection.refresh_token = self.refresh_token
                    self.broker_connection.token_expires_at = datetime.utcnow() + timedelta(days=1)
                    
                    return True
                except Exception as e:
                    print(f"Failed to refresh Zerodha token: {e}")
                    return False
            
            return False
            
        except Exception as e:
            print(f"Zerodha authentication error: {e}")
            return False
    
    def get_login_url(self) -> str:
        """Get the login URL for OAuth flow"""
        if self.broker_name == "zerodha" and self.kite:
            return self.kite.login_url()
        return ""
    
    async def generate_session(self, request_token: str) -> bool:
        """Generate session from request token (for OAuth flow)"""
        try:
            if self.broker_name == "zerodha" and self.kite:
                session = self.kite.generate_session(
                    request_token, 
                    api_secret=self.api_secret
                )
                
                self.access_token = session["access_token"]
                self.refresh_token = session["refresh_token"]
                
                # Update the database
                self.broker_connection.access_token = self.access_token
                self.broker_connection.refresh_token = self.refresh_token
                self.broker_connection.token_expires_at = datetime.utcnow() + timedelta(days=1)
                
                return True
            return False
            
        except Exception as e:
            print(f"Failed to generate session: {e}")
            return False
    
    async def _authenticate_angel_one(self) -> bool:
        """Authenticate with Angel One"""
        try:
            # Placeholder for Angel One authentication
            # You would implement the actual OAuth flow here
            
            print("Angel One authentication placeholder - implement OAuth flow")
            return True
            
        except Exception as e:
            print(f"Angel One authentication error: {e}")
            return False
    
    async def _authenticate_upstox(self) -> bool:
        """Authenticate with Upstox"""
        try:
            # Placeholder for Upstox authentication
            # You would implement the actual OAuth flow here
            
            print("Upstox authentication placeholder - implement OAuth flow")
            return True
            
        except Exception as e:
            print(f"Upstox authentication error: {e}")
            return False
    
    async def place_order(self, symbol: str, side: str, quantity: float, 
                         price: Optional[float] = None, order_type: str = "market") -> Dict[str, Any]:
        """Place an order with the broker"""
        try:
            if not await self.authenticate():
                raise Exception("Authentication failed")
            
            if self.broker_name == "zerodha":
                return await self._place_order_zerodha(symbol, side, quantity, price, order_type)
            elif self.broker_name == "angel_one":
                return await self._place_order_angel_one(symbol, side, quantity, price, order_type)
            elif self.broker_name == "upstox":
                return await self._place_order_upstox(symbol, side, quantity, price, order_type)
            else:
                raise ValueError(f"Unsupported broker: {self.broker_name}")
                
        except Exception as e:
            print(f"Order placement failed: {e}")
            return {"error": str(e)}
    
    async def _place_order_zerodha(self, symbol: str, side: str, quantity: float, 
                                  price: Optional[float], order_type: str) -> Dict[str, Any]:
        """Place order with Zerodha"""
        try:
            if not self.kite:
                raise Exception("KiteConnect not initialized")
            
            # Map order parameters to Zerodha format
            kite_side = "BUY" if side.lower() == "buy" else "SELL"
            kite_order_type = "MARKET" if order_type.lower() == "market" else "LIMIT"
            
            # Get instrument token for the symbol
            instruments = self.kite.instruments("NSE")
            instrument_token = None
            
            for instrument in instruments:
                if instrument["tradingsymbol"] == symbol:
                    instrument_token = instrument["instrument_token"]
                    break
            
            if not instrument_token:
                raise Exception(f"Symbol {symbol} not found")
            
            # Place the order
            order_params = {
                "tradingsymbol": symbol,
                "exchange": "NSE",
                "transaction_type": kite_side,
                "quantity": int(quantity),
                "product": "CNC",  # CNC for delivery, MIS for intraday
                "order_type": kite_order_type
            }
            
            if kite_order_type == "LIMIT" and price:
                order_params["price"] = price
            
            order_id = self.kite.place_order(
                variety="regular",
                **order_params
            )
            
            order_data = {
                "order_id": str(order_id),
                "status": "pending",
                "broker": "zerodha",
                "symbol": symbol,
                "side": side,
                "quantity": quantity,
                "price": price or 0,
                "order_type": order_type,
                "timestamp": datetime.now().isoformat()
            }
            
            print(f"Zerodha order placed: {order_data}")
            return order_data
            
        except Exception as e:
            print(f"Zerodha order error: {e}")
            return {"error": str(e)}
    
    async def _place_order_angel_one(self, symbol: str, side: str, quantity: float, 
                                    price: Optional[float], order_type: str) -> Dict[str, Any]:
        """Place order with Angel One"""
        try:
            # Placeholder for Angel One order placement
            
            order_data = {
                "order_id": f"ANGEL_{datetime.now().timestamp()}",
                "status": "pending",
                "broker": "angel_one",
                "symbol": symbol,
                "side": side,
                "quantity": quantity,
                "price": price or 0,
                "order_type": order_type,
                "timestamp": datetime.now().isoformat()
            }
            
            print(f"Angel One order placeholder: {order_data}")
            return order_data
            
        except Exception as e:
            print(f"Angel One order error: {e}")
            return {"error": str(e)}
    
    async def _place_order_upstox(self, symbol: str, side: str, quantity: float, 
                                 price: Optional[float], order_type: str) -> Dict[str, Any]:
        """Place order with Upstox"""
        try:
            # Placeholder for Upstox order placement
            
            order_data = {
                "order_id": f"UPSTOX_{datetime.now().timestamp()}",
                "status": "pending",
                "broker": "upstox",
                "symbol": symbol,
                "side": side,
                "quantity": quantity,
                "price": price or 0,
                "order_type": order_type,
                "timestamp": datetime.now().isoformat()
            }
            
            print(f"Upstox order placeholder: {order_data}")
            return order_data
            
        except Exception as e:
            print(f"Upstox order error: {e}")
            return {"error": str(e)}
    
    async def cancel_order(self, order_id: str) -> Dict[str, Any]:
        """Cancel an order"""
        try:
            if not await self.authenticate():
                raise Exception("Authentication failed")
            
            if self.broker_name == "zerodha":
                return await self._cancel_order_zerodha(order_id)
            elif self.broker_name == "angel_one":
                return await self._cancel_order_angel_one(order_id)
            elif self.broker_name == "upstox":
                return await self._cancel_order_upstox(order_id)
            else:
                raise ValueError(f"Unsupported broker: {self.broker_name}")
                
        except Exception as e:
            print(f"Order cancellation failed: {e}")
            return {"error": str(e)}
    
    async def _cancel_order_zerodha(self, order_id: str) -> Dict[str, Any]:
        """Cancel order with Zerodha"""
        try:
            if not self.kite:
                raise Exception("KiteConnect not initialized")
            
            # Cancel the order
            self.kite.cancel_order(
                variety="regular",
                order_id=order_id
            )
            
            return {"status": "cancelled", "order_id": order_id}
            
        except Exception as e:
            print(f"Zerodha cancel order error: {e}")
            return {"error": str(e)}
    
    async def _cancel_order_angel_one(self, order_id: str) -> Dict[str, Any]:
        """Cancel order with Angel One"""
        try:
            # Placeholder for Angel One order cancellation
            print(f"Angel One cancel order placeholder: {order_id}")
            return {"status": "cancelled", "order_id": order_id}
            
        except Exception as e:
            print(f"Angel One cancel order error: {e}")
            return {"error": str(e)}
    
    async def _cancel_order_upstox(self, order_id: str) -> Dict[str, Any]:
        """Cancel order with Upstox"""
        try:
            # Placeholder for Upstox order cancellation
            print(f"Upstox cancel order placeholder: {order_id}")
            return {"status": "cancelled", "order_id": order_id}
            
        except Exception as e:
            print(f"Upstox cancel order error: {e}")
            return {"error": str(e)}
    
    async def get_order_status(self, order_id: str) -> Dict[str, Any]:
        """Get the status of an order"""
        try:
            if not await self.authenticate():
                raise Exception("Authentication failed")
            
            if self.broker_name == "zerodha":
                return await self._get_order_status_zerodha(order_id)
            else:
                # Placeholder for other brokers
                return {
                    "order_id": order_id,
                    "status": "pending",
                    "broker": self.broker_name,
                    "timestamp": datetime.now().isoformat()
                }
            
        except Exception as e:
            print(f"Get order status failed: {e}")
            return {"error": str(e)}
    
    async def _get_order_status_zerodha(self, order_id: str) -> Dict[str, Any]:
        """Get order status from Zerodha"""
        try:
            if not self.kite:
                raise Exception("KiteConnect not initialized")
            
            # Get order history
            orders = self.kite.orders()
            
            for order in orders:
                if str(order["order_id"]) == order_id:
                    return {
                        "order_id": order_id,
                        "status": order["status"],
                        "broker": "zerodha",
                        "symbol": order["tradingsymbol"],
                        "side": order["transaction_type"],
                        "quantity": order["quantity"],
                        "price": order["price"],
                        "order_type": order["order_type"],
                        "timestamp": order["order_timestamp"].isoformat()
                    }
            
            return {"error": "Order not found"}
            
        except Exception as e:
            print(f"Zerodha get order status error: {e}")
            return {"error": str(e)}
    
    async def get_positions(self) -> Dict[str, Any]:
        """Get current positions from the broker"""
        try:
            if not await self.authenticate():
                raise Exception("Authentication failed")
            
            if self.broker_name == "zerodha":
                return await self._get_positions_zerodha()
            else:
                # Placeholder for other brokers
                return {
                    "broker": self.broker_name,
                    "positions": [],
                    "timestamp": datetime.now().isoformat()
                }
            
        except Exception as e:
            print(f"Get positions failed: {e}")
            return {"error": str(e)}
    
    async def _get_positions_zerodha(self) -> Dict[str, Any]:
        """Get positions from Zerodha"""
        try:
            if not self.kite:
                raise Exception("KiteConnect not initialized")
            
            positions = self.kite.positions()
            
            return {
                "broker": "zerodha",
                "positions": positions,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Zerodha get positions error: {e}")
            return {"error": str(e)}
    
    async def get_holdings(self) -> Dict[str, Any]:
        """Get current holdings from the broker"""
        try:
            if not await self.authenticate():
                raise Exception("Authentication failed")
            
            if self.broker_name == "zerodha":
                return await self._get_holdings_zerodha()
            else:
                # Placeholder for other brokers
                return {
                    "broker": self.broker_name,
                    "holdings": [],
                    "timestamp": datetime.now().isoformat()
                }
            
        except Exception as e:
            print(f"Get holdings failed: {e}")
            return {"error": str(e)}
    
    async def _get_holdings_zerodha(self) -> Dict[str, Any]:
        """Get holdings from Zerodha"""
        try:
            if not self.kite:
                raise Exception("KiteConnect not initialized")
            
            holdings = self.kite.holdings()
            
            return {
                "broker": "zerodha",
                "holdings": holdings,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Zerodha get holdings error: {e}")
            return {"error": str(e)}
