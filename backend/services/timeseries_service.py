from typing import Dict, Any, List, Optional, Union
from datetime import datetime, timedelta
import asyncio
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
from influxdb_client.client.query_api import QueryApi
from database import get_influx_client
from config import settings

class TimeSeriesService:
    """InfluxDB-based time-series service for market data storage and analysis"""
    
    def __init__(self):
        self.influx_client: Optional[InfluxDBClient] = None
        self.write_api: Optional[Any] = None
        self.query_api: Optional[QueryApi] = None
        self.bucket = settings.INFLUXDB_BUCKET
        self.org = settings.INFLUXDB_ORG
    
    async def _get_client(self) -> InfluxDBClient:
        if self.influx_client is None:
            self.influx_client = await get_influx_client()
            self.write_api = self.influx_client.write_api(write_options=SYNCHRONOUS)
            self.query_api = self.influx_client.query_api()
        return self.influx_client
    
    async def store_stock_price(self, symbol: str, price_data: Dict[str, Any], timestamp: Optional[datetime] = None) -> bool:
        """Store stock price data in time-series database"""
        try:
            if not self.write_api:
                await self._get_client()
            
            point = Point("stock_price") \
                .tag("symbol", symbol) \
                .tag("exchange", price_data.get("exchange", "NSE")) \
                .field("price", price_data.get("price", 0)) \
                .field("volume", price_data.get("volume", 0)) \
                .field("high", price_data.get("high", 0)) \
                .field("low", price_data.get("low", 0)) \
                .field("open", price_data.get("open", 0)) \
                .field("close", price_data.get("close", 0)) \
                .field("change", price_data.get("change", 0)) \
                .field("change_percent", price_data.get("change_percent", 0))
            
            if timestamp:
                point.time(timestamp, WritePrecision.NS)
            
            self.write_api.write(bucket=self.bucket, org=self.org, record=point)
            return True
            
        except Exception as e:
            print(f"Error storing stock price: {e}")
            return False
    
    async def store_market_data_batch(self, data_points: List[Dict[str, Any]]) -> bool:
        """Store multiple market data points in batch"""
        try:
            if not self.write_api:
                await self._get_client()
            
            points = []
            for data in data_points:
                symbol = data.get("symbol")
                if not symbol:
                    continue
                
                point = Point("market_data") \
                    .tag("symbol", symbol) \
                    .tag("data_type", data.get("data_type", "price")) \
                    .field("value", data.get("value", 0)) \
                    .field("volume", data.get("volume", 0))
                
                if data.get("timestamp"):
                    point.time(data["timestamp"], WritePrecision.NS)
                
                points.append(point)
            
            if points:
                self.write_api.write(bucket=self.bucket, org=self.org, record=points)
            
            return True
            
        except Exception as e:
            print(f"Error storing batch market data: {e}")
            return False
    
    async def get_stock_price_history(self, symbol: str, start_time: datetime, end_time: datetime, 
                                    interval: str = "1m") -> List[Dict[str, Any]]:
        """Get historical stock price data"""
        try:
            if not self.query_api:
                await self._get_client()
            
            # Convert interval to Flux query format
            interval_map = {
                "1m": "1m",
                "5m": "5m", 
                "15m": "15m",
                "1h": "1h",
                "1d": "1d"
            }
            flux_interval = interval_map.get(interval, "1m")
            
            query = f'''
            from(bucket: "{self.bucket}")
                |> range(start: {start_time.isoformat()}, stop: {end_time.isoformat()})
                |> filter(fn: (r) => r["_measurement"] == "stock_price")
                |> filter(fn: (r) => r["symbol"] == "{symbol}")
                |> aggregateWindow(every: {flux_interval}, fn: mean, createEmpty: false)
                |> yield(name: "mean")
            '''
            
            result = self.query_api.query(query, org=self.org)
            
            data_points = []
            for table in result:
                for record in table.records:
                    data_points.append({
                        "timestamp": record.get_time(),
                        "price": record.get_value(),
                        "field": record.get_field(),
                        "symbol": record.values.get("symbol")
                    })
            
            return data_points
            
        except Exception as e:
            print(f"Error querying stock price history: {e}")
            return []
    
    async def get_market_indices_history(self, index_name: str, start_time: datetime, 
                                       end_time: datetime) -> List[Dict[str, Any]]:
        """Get historical market index data"""
        try:
            if not self.query_api:
                await self._get_client()
            
            query = f'''
            from(bucket: "{self.bucket}")
                |> range(start: {start_time.isoformat()}, stop: {end_time.isoformat()})
                |> filter(fn: (r) => r["_measurement"] == "market_index")
                |> filter(fn: (r) => r["index_name"] == "{index_name}")
                |> yield(name: "index_data")
            '''
            
            result = self.query_api.query(query, org=self.org)
            
            data_points = []
            for table in result:
                for record in table.records:
                    data_points.append({
                        "timestamp": record.get_time(),
                        "value": record.get_value(),
                        "index_name": record.values.get("index_name")
                    })
            
            return data_points
            
        except Exception as e:
            print(f"Error querying market index history: {e}")
            return []
    
    async def get_technical_indicators(self, symbol: str, start_time: datetime, 
                                     end_time: datetime) -> Dict[str, List[float]]:
        """Calculate and retrieve technical indicators"""
        try:
            if not self.query_api:
                await self._get_client()
            
            # Get price data for calculations
            price_data = await self.get_stock_price_history(symbol, start_time, end_time, "1d")
            
            if not price_data:
                return {}
            
            # Extract close prices
            close_prices = [point["price"] for point in price_data if point["field"] == "close"]
            
            if len(close_prices) < 20:
                return {}
            
            # Calculate SMA 20
            sma_20 = []
            for i in range(19, len(close_prices)):
                sma_20.append(sum(close_prices[i-19:i+1]) / 20)
            
            # Calculate SMA 50
            sma_50 = []
            for i in range(49, len(close_prices)):
                sma_50.append(sum(close_prices[i-49:i+1]) / 50)
            
            # Calculate RSI (simplified)
            rsi_values = []
            for i in range(1, len(close_prices)):
                change = close_prices[i] - close_prices[i-1]
                gain = max(change, 0)
                loss = max(-change, 0)
                
                if i >= 14:
                    avg_gain = sum([max(close_prices[j] - close_prices[j-1], 0) for j in range(i-13, i+1)]) / 14
                    avg_loss = sum([max(close_prices[j-1] - close_prices[j], 0) for j in range(i-13, i+1)]) / 14
                    
                    if avg_loss == 0:
                        rsi = 100
                    else:
                        rs = avg_gain / avg_loss
                        rsi = 100 - (100 / (1 + rs))
                    
                    rsi_values.append(rsi)
            
            return {
                "sma_20": sma_20,
                "sma_50": sma_50,
                "rsi": rsi_values,
                "close_prices": close_prices
            }
            
        except Exception as e:
            print(f"Error calculating technical indicators: {e}")
            return {}
    
    async def get_volume_analysis(self, symbol: str, start_time: datetime, 
                                 end_time: datetime) -> Dict[str, Any]:
        """Analyze trading volume patterns"""
        try:
            if not self.query_api:
                await self._get_client()
            
            query = f'''
            from(bucket: "{self.bucket}")
                |> range(start: {start_time.isoformat()}, stop: {end_time.isoformat()})
                |> filter(fn: (r) => r["_measurement"] == "stock_price")
                |> filter(fn: (r) => r["symbol"] == "{symbol}")
                |> filter(fn: (r) => r["_field"] == "volume")
                |> yield(name: "volume_data")
            '''
            
            result = self.query_api.query(query, org=self.org)
            
            volumes = []
            for table in result:
                for record in table.records:
                    volumes.append(record.get_value())
            
            if not volumes:
                return {}
            
            # Calculate volume statistics
            avg_volume = sum(volumes) / len(volumes)
            max_volume = max(volumes)
            min_volume = min(volumes)
            
            # Volume trend (simple linear regression)
            n = len(volumes)
            if n > 1:
                x_sum = sum(range(n))
                y_sum = sum(volumes)
                xy_sum = sum(i * vol for i, vol in enumerate(volumes))
                x2_sum = sum(i * i for i in range(n))
                
                slope = (n * xy_sum - x_sum * y_sum) / (n * x2_sum - x_sum * x_sum)
                volume_trend = "increasing" if slope > 0 else "decreasing" if slope < 0 else "stable"
            else:
                volume_trend = "stable"
            
            return {
                "average_volume": avg_volume,
                "max_volume": max_volume,
                "min_volume": min_volume,
                "total_trading_days": n,
                "volume_trend": volume_trend,
                "volume_data": volumes
            }
            
        except Exception as e:
            print(f"Error analyzing volume: {e}")
            return {}
    
    async def get_price_correlation(self, symbols: List[str], start_time: datetime, 
                                   end_time: datetime) -> Dict[str, float]:
        """Calculate price correlation between different symbols"""
        try:
            if len(symbols) < 2:
                return {}
            
            # Get price data for all symbols
            symbol_prices = {}
            for symbol in symbols:
                price_data = await self.get_stock_price_history(symbol, start_time, end_time, "1d")
                close_prices = [point["price"] for point in price_data if point["field"] == "close"]
                if close_prices:
                    symbol_prices[symbol] = close_prices
            
            if len(symbol_prices) < 2:
                return {}
            
            # Calculate correlations
            correlations = {}
            symbol_list = list(symbol_prices.keys())
            
            for i in range(len(symbol_list)):
                for j in range(i + 1, len(symbol_list)):
                    symbol1 = symbol_list[i]
                    symbol2 = symbol_list[j]
                    
                    prices1 = symbol_prices[symbol1]
                    prices2 = symbol_prices[symbol2]
                    
                    # Align prices by length
                    min_length = min(len(prices1), len(prices2))
                    if min_length < 2:
                        continue
                    
                    prices1 = prices1[:min_length]
                    prices2 = prices2[:min_length]
                    
                    # Calculate correlation coefficient
                    correlation = self._calculate_correlation(prices1, prices2)
                    key = f"{symbol1}_vs_{symbol2}"
                    correlations[key] = correlation
            
            return correlations
            
        except Exception as e:
            print(f"Error calculating price correlation: {e}")
            return {}
    
    def _calculate_correlation(self, x: List[float], y: List[float]) -> float:
        """Calculate Pearson correlation coefficient"""
        try:
            n = len(x)
            if n != len(y) or n < 2:
                return 0.0
            
            # Calculate means
            x_mean = sum(x) / n
            y_mean = sum(y) / n
            
            # Calculate correlation coefficient
            numerator = sum((x[i] - x_mean) * (y[i] - y_mean) for i in range(n))
            x_variance = sum((x[i] - x_mean) ** 2 for i in range(n))
            y_variance = sum((y[i] - y_mean) ** 2 for i in range(n))
            
            denominator = (x_variance * y_variance) ** 0.5
            
            if denominator == 0:
                return 0.0
            
            return numerator / denominator
            
        except Exception:
            return 0.0
    
    async def get_market_summary(self, start_time: datetime, end_time: datetime) -> Dict[str, Any]:
        """Get market summary statistics"""
        try:
            if not self.query_api:
                await self._get_client()
            
            # Get all stock prices in the time range
            query = f'''
            from(bucket: "{self.bucket}")
                |> range(start: {start_time.isoformat()}, stop: {end_time.isoformat()})
                |> filter(fn: (r) => r["_measurement"] == "stock_price")
                |> filter(fn: (r) => r["_field"] == "close")
                |> yield(name: "market_data")
            '''
            
            result = self.query_api.query(query, org=self.org)
            
            # Group by symbol and calculate statistics
            symbol_stats = {}
            for table in result:
                for record in table.records:
                    symbol = record.values.get("symbol")
                    if not symbol:
                        continue
                    
                    if symbol not in symbol_stats:
                        symbol_stats[symbol] = []
                    
                    symbol_stats[symbol].append(record.get_value())
            
            # Calculate market-wide statistics
            market_summary = {
                "total_symbols": len(symbol_stats),
                "total_data_points": sum(len(prices) for prices in symbol_stats.values()),
                "symbols_with_data": list(symbol_stats.keys()),
                "time_range": {
                    "start": start_time.isoformat(),
                    "end": end_time.isoformat()
                }
            }
            
            return market_summary
            
        except Exception as e:
            print(f"Error getting market summary: {e}")
            return {}
    
    async def cleanup_old_data(self, retention_days: int = 365) -> bool:
        """Clean up old data based on retention policy"""
        try:
            # InfluxDB handles data retention automatically based on bucket configuration
            # This method can be used to manually trigger cleanup or check retention status
            print(f"Data retention policy: {retention_days} days")
            return True
            
        except Exception as e:
            print(f"Error during data cleanup: {e}")
            return False
    
    async def health_check(self) -> Dict[str, str]:
        """Check time-series service health"""
        try:
            client = await self._get_client()
            health = client.health()
            if health.status == "pass":
                return {"status": "healthy", "service": "influxdb-timeseries"}
            else:
                return {"status": "unhealthy", "service": "influxdb-timeseries", "error": health.message}
        except Exception as e:
            return {"status": "unhealthy", "service": "influxdb-timeseries", "error": str(e)}
