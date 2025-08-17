# Trading Web Application

A comprehensive, production-grade trading platform built with React TypeScript frontend and Python FastAPI backend, featuring multi-broker support, multi-database architecture, and real-time market data.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure JWT-based authentication system
- **Portfolio Management** - Create, manage, and track multiple investment portfolios
- **Trading Platform** - Connect to brokers and place orders (Zerodha, Angel One, Upstox)
- **Market Data** - Real-time stock quotes, market indices, and financial news
- **Watchlist** - Track stocks of interest with real-time updates
- **Advanced Analytics** - Portfolio performance tracking and P&L calculations

### Technical Features
- **Multi-Database Architecture** - PostgreSQL, Redis, InfluxDB, ClickHouse, MongoDB
- **Real-time Data** - WebSocket support for live market updates
- **Caching System** - Redis-based caching for improved performance
- **Time-series Analytics** - InfluxDB for historical market data analysis
- **Responsive Design** - Modern UI with dark/light theme support
- **Type Safety** - Full TypeScript implementation

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Common components (ThemeToggle, etc.)
│   │   └── layout/         # Layout components (Navbar, Sidebar)
│   ├── contexts/           # React contexts (AuthContext)
│   ├── hooks/              # Custom hooks (useTheme)
│   ├── pages/              # Application pages
│   ├── services/           # API services
│   └── styles/             # Styled-components themes and global styles
```

### Backend (Python + FastAPI)
```
backend/
├── models/                  # SQLAlchemy database models
├── routers/                # API route handlers
├── schemas/                # Pydantic data models
├── services/               # Business logic services
├── database.py            # Database connection management
├── main.py                # FastAPI application entry point
└── config.py              # Configuration management
```

### Database Architecture
- **PostgreSQL** - Primary database for user accounts, portfolios, and transactions
- **Redis** - Caching and session management
- **InfluxDB** - Time-series data for market analytics
- **ClickHouse** - Columnar database
- **MongoDB** - Document database

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Styled Components** - CSS-in-JS styling
- **React Router v7** - Client-side routing
- **Recharts** - Data visualization and charts
- **React Icons** - Icon library
- **Axios** - HTTP client for API calls

### Backend
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy 2.0** - Database ORM
- **Alembic** - Database migrations
- **Redis** - In-memory data store
- **Celery** - Background task processing
- **JWT** - Authentication tokens
- **Pydantic** - Data validation

### Databases
- **PostgreSQL** - Primary relational database
- **Redis** - Caching and sessions
- **InfluxDB** - Time-series database
- **ClickHouse** - Columnar database
- **MongoDB** - Document database

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Docker and Docker Compose
- PostgreSQL, Redis, InfluxDB, ClickHouse, MongoDB

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trading-web-app
   ```

2. **Set up databases using Docker**
   ```bash
   cd backend
   docker-compose up -d
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

5. **Configure environment variables**
   ```bash
   # Create .env file in backend directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Start the backend**
   ```bash
   cd backend
   python main.py
   ```

7. **Start the frontend**
   ```bash
   cd frontend
   npm start
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database Configuration
USE_MULTI_DB=true
CACHE_ENABLED=true
TIME_SERIES_ENABLED=true

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=trading_user
POSTGRES_PASSWORD=trading_password
POSTGRES_DB=trading_app

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# InfluxDB
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-influxdb-token
INFLUXDB_ORG=your-org
INFLUXDB_BUCKET=trading_data

# ClickHouse
CLICKHOUSE_HOST=localhost
CLICKHOUSE_PORT=9000
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=
CLICKHOUSE_DB=trading_analytics

# MongoDB
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_DB=trading_app

# Broker API Keys
ZERODHA_API_KEY=your-zerodha-api-key
ZERODHA_API_SECRET=your-zerodha-api-secret
ANGEL_ONE_API_KEY=your-angel-one-api-key
ANGEL_ONE_API_SECRET=your-angel-one-api-secret
UPSTOX_API_KEY=your-upstox-api-key
UPSTOX_API_SECRET=your-upstox-api-secret

# Market Data APIs
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
```

## 🚀 Usage

### User Registration & Authentication
1. Navigate to `/register` to create a new account
2. Use `/login` to authenticate
3. JWT tokens are automatically managed by the application

### Portfolio Management
1. Create portfolios from the Portfolio page
2. Add holdings with current market prices
3. Track portfolio performance and P&L

### Trading
1. Connect broker accounts (Zerodha, Angel One, Upstox)
2. Place buy/sell orders with various order types
3. View trade history and order status

### Market Data
1. Search for stocks and companies
2. View real-time quotes and market indices
3. Access financial news and trending stocks

### Watchlist
1. Add stocks to your personal watchlist
2. Monitor real-time price changes
3. Customize stock names and descriptions

## 🔧 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm start
```

### Database Migrations

```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### Testing

**Backend:**
```bash
cd backend
pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Trading
- `POST /api/trading/broker/connect` - Connect broker
- `GET /api/trading/broker/connections` - List broker connections
- `POST /api/trading/order` - Place order
- `GET /api/trading/orders` - Get trade history

### Portfolio
- `POST /api/portfolio/create` - Create portfolio
- `GET /api/portfolio/list` - List portfolios
- `POST /api/portfolio/{id}/holdings` - Add holding
- `GET /api/portfolio/{id}/holdings` - Get holdings

### Market Data
- `GET /api/market/quote/{symbol}` - Get stock quote
- `GET /api/market/quotes/batch` - Get batch quotes
- `GET /api/market/indices` - Get market indices
- `GET /api/market/search` - Search stocks
- `GET /api/market/news/{symbol}` - Get stock news

### Watchlist
- `POST /api/watchlist/add` - Add to watchlist
- `GET /api/watchlist/list` - Get watchlist
- `PUT /api/watchlist/{id}` - Update watchlist item
- `DELETE /api/watchlist/{id}` - Remove from watchlist

### Settings
- `GET /api/settings/profile` - Get user profile
- `PUT /api/settings/profile` - Update profile
- `GET /api/settings/preferences` - Get preferences
- `PUT /api/settings/preferences` - Update preferences
- `GET /api/settings/system` - Get system info

## 🐳 Docker Deployment

### Production Deployment

1. **Build Docker images**
   ```bash
   docker build -t trading-backend ./backend
   docker build -t trading-frontend ./frontend
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment-specific configurations
- `docker-compose.yml` - Development environment
- `docker-compose.prod.yml` - Production environment

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS middleware configuration
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy
- Rate limiting (configurable)

## 📈 Performance Features

- Redis caching for frequently accessed data
- Database connection pooling
- Asynchronous API endpoints
- Optimized database queries with indexes
- Background task processing with Celery

## 🧪 Testing

### Backend Testing
- Unit tests with pytest
- API endpoint testing
- Database integration tests
- Mock services for external APIs

### Frontend Testing
- Component testing with React Testing Library
- Integration tests
- E2E testing capabilities

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the API endpoints

## 🔮 Roadmap

### Upcoming Features
- [ ] Real-time WebSocket market data
- [ ] Advanced charting with TradingView integration
- [ ] Mobile app (React Native)
- [ ] Algorithmic trading strategies
- [ ] Social trading features
- [ ] Advanced portfolio analytics
- [ ] Multi-currency support
- [ ] Tax reporting and compliance

### Performance Improvements
- [ ] GraphQL API implementation
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] CDN integration
- [ ] Advanced caching strategies

---

**Built with ❤️ using modern web technologies**
