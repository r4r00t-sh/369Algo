# Trading Web App Backend

A modern, high-performance backend for the Trading Web Application built with FastAPI, PostgreSQL, and Redis.

## 🏗️ **Architecture Overview**

### **Simplified Database Architecture**
- **PostgreSQL 15+** - Primary database for all relational data
- **Redis 7+** - Caching, sessions, and real-time updates

### **Key Features**
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy 2.0** - Advanced ORM with async support
- **PostgreSQL JSON** - Flexible data storage for market data
- **Redis Pub/Sub** - Real-time market updates
- **JWT Authentication** - Secure user authentication
- **Multi-broker Support** - Zerodha, Angel One, Upstox

## 🚀 **Quick Start**

### **1. Start Databases**
```bash
cd backend
docker-compose up -d
```

### **2. Install Dependencies**
```bash
pip install -r requirements.txt
```

### **3. Run Application**
```bash
python main.py
```

The API will be available at: http://localhost:8000

## 🗄️ **Database Structure**

### **PostgreSQL Tables**
- **users** - User accounts and authentication
- **broker_connections** - Broker API credentials
- **portfolios** - Investment portfolios
- **holdings** - Stock holdings within portfolios
- **trades** - Trade execution records
- **watchlists** - User stock watchlists
- **market_data** - Time-series market data
- **stock_quotes** - Current stock quotes
- **market_indices** - Market index data
- **news_articles** - Financial news

### **Redis Usage**
- **User Sessions** - Authentication tokens
- **Market Data Cache** - Stock quotes, indices
- **Portfolio Cache** - User portfolio data
- **Real-time Updates** - Market data streaming
- **Rate Limiting** - API request throttling

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=trading_app
POSTGRES_USER=trading_user
POSTGRES_PASSWORD=trading_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256

# Broker APIs
ZERODHA_API_KEY=your_key
ZERODHA_API_SECRET=your_secret
```

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### **Trading**
- `GET /api/trading/broker/connections` - List broker connections
- `POST /api/trading/order` - Place trade order
- `GET /api/trading/orders` - Get trade history

### **Portfolio**
- `GET /api/portfolio/list` - List user portfolios
- `POST /api/portfolio/create` - Create portfolio
- `GET /api/portfolio/{id}/holdings` - Get portfolio holdings

### **Market Data**
- `GET /api/market/quote/{symbol}` - Get stock quote
- `GET /api/market/indices` - Get market indices
- `GET /api/market/trending` - Get trending stocks
- `GET /api/market/search` - Search stocks

### **Watchlist**
- `GET /api/watchlist/list` - Get user watchlist
- `POST /api/watchlist/add` - Add stock to watchlist
- `DELETE /api/watchlist/{id}` - Remove from watchlist

### **Settings**
- `GET /api/settings/profile` - Get user profile
- `PUT /api/settings/profile` - Update profile
- `GET /api/settings/preferences` - Get preferences

## 🧪 **Testing**

### **Health Check**
```bash
curl http://localhost:8000/health
```

### **API Documentation**
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📈 **Performance Features**

### **PostgreSQL Optimizations**
- **JSON Columns** - Flexible data storage
- **Time-series Indexing** - Efficient market data queries
- **Connection Pooling** - Optimized database connections
- **Partitioning** - Large table performance

### **Redis Optimizations**
- **Memory Management** - LRU eviction policy
- **Connection Pooling** - Efficient Redis connections
- **Pub/Sub** - Real-time data streaming
- **TTL Management** - Automatic cache expiration

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **CORS Protection** - Cross-origin security
- **Input Validation** - Pydantic schema validation
- **Rate Limiting** - API abuse prevention

## 🚀 **Deployment**

### **Production Considerations**
- **Environment Variables** - Secure configuration
- **Database Backups** - Regular PostgreSQL dumps
- **Redis Persistence** - AOF and RDB snapshots
- **Health Monitoring** - Application health checks
- **Logging** - Structured application logs

### **Scaling**
- **Horizontal Scaling** - Multiple API instances
- **Database Replication** - PostgreSQL read replicas
- **Redis Cluster** - Distributed caching
- **Load Balancing** - Nginx reverse proxy

## 🛠️ **Development**

### **Code Structure**
```
backend/
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── database.py          # Database connections
├── models/              # SQLAlchemy models
├── schemas/             # Pydantic schemas
├── routers/             # API route handlers
├── services/            # Business logic
└── requirements.txt     # Python dependencies
```

### **Adding New Features**
1. **Create Model** - Add SQLAlchemy modells
2. **Create Schema** - Add Pydantic schema
3. **Create Router** - Add API endpoints
4. **Add Service** - Add business logic
5. **Update Tests** - Add test coverage

## 📚 **Resources**

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

---

**Built with ❤️ using modern web technologies**
