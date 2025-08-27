# 369 Algo - Trading Web Application

**369 Algo** is a comprehensive trading platform built with React TypeScript frontend and Python FastAPI backend, featuring multi-broker support, real-time market data, and portfolio management.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure JWT-based authentication system
- **Portfolio Management** - Create, manage, and track multiple investment portfolios
- **Trading Platform** - Connect to brokers and place orders
- **Market Data** - Real-time stock quotes and market information
- **Watchlist** - Track stocks of interest
- **Responsive Dashboard** - Modern UI with dark/light theme support

### Technical Features
- **FastAPI Backend** - High-performance Python web framework
- **React Frontend** - Modern TypeScript-based user interface
- **Database Integration** - SQLAlchemy with PostgreSQL support
- **Real-time Updates** - WebSocket support for live market data
- **Caching System** - Redis-based caching for improved performance
 - **Type Safety** - Full TypeScript implementation

## 🏗️ Project Structure

```
trading-web-app/
├── backend/                 # Python FastAPI backend
│   ├── models/             # Database models
│   │   ├── broker.py       # Broker connection models
│   │   ├── market_data.py  # Market data models
│   │   ├── portfolio.py    # Portfolio models
│   │   ├── trade.py        # Trading models
│   │   ├── user.py         # User models
│   │   └── watchlist.py    # Watchlist models
│   ├── routers/            # API route handlers
│   │   ├── auth.py         # Authentication routes
│   │   ├── broker.py       # Broker management routes
│   │   ├── market_data.py  # Market data routes
│   │   ├── portfolio.py    # Portfolio routes
│   │   ├── settings.py     # User settings routes
│   │   ├── trading.py      # Trading routes
│   │   └── watchlist.py    # Watchlist routes
│   ├── schemas/            # Pydantic data models
│   ├── services/           # Business logic services
│   │   ├── broker_service.py      # Broker integration
│   │   ├── cache_service.py       # Caching service
│   │   ├── market_data_service.py # Market data handling
│   │   ├── portfolio_service.py   # Portfolio management
│   │   └── timeseries_service.py  # Time series data
│   ├── config.py           # Configuration management
│   ├── database.py         # Database connection
│   ├── main.py             # FastAPI application entry point
│   ├── realtime_updater.py # Real-time data updates
│   ├── requirements.txt    # Python dependencies
│   └── docker-compose.yml  # Database services
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── common/     # Common components
│   │   │   │   ├── BrokerConnection.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   └── TradingViewChart.tsx
│   │   │   └── layout/     # Layout components
│   │   │       ├── Navbar.tsx
│   │   │       └── Sidebar.tsx
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/          # Custom hooks
│   │   │   └── useTheme.ts
│   │   ├── pages/          # Application pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── MarketData.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Trading.tsx
│   │   │   └── Watchlist.tsx
│   │   ├── services/       # API services
│   │   │   └── api.ts
│   │   ├── styles/         # Styling and themes
│   │   │   ├── GlobalStyles.ts
│   │   │   └── theme.ts
│   │   └── types/          # TypeScript type definitions
│   ├── package.json        # Node.js dependencies
│   └── tsconfig.json       # TypeScript configuration
└── README.md               # Project documentation
```

## 🛠️ Technology Stack

### Frontend
- **React** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Styled Components** - CSS-in-JS styling
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **Axios** - HTTP client for API calls

### Backend
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **JWT** - Authentication tokens
- **Pydantic** - Data validation
- **WebSockets** - Real-time communication

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Docker and Docker Compose
- PostgreSQL and Redis

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/r4r00t-sh/369Algo.git
   cd 369Algo
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
DATABASE_URL=postgresql://user:password@localhost/trading_app
REDIS_URL=redis://localhost:6379

# Broker API Keys (configure as needed)
ZERODHA_API_KEY=your-zerodha-api-key
ZERODHA_API_SECRET=your-zerodha-api-secret

# Market Data APIs (configure as needed)
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
1. Connect broker accounts
2. Place buy/sell orders
3. View trade history and order status

### Market Data
1. **Global Markets**: Search for stocks and companies worldwide
2. **Indian Markets**: Real-time NSE and BSE data with popular stocks
3. **Real-time Quotes**: Live stock quotes and market information
4. **Market Indices**: NIFTY 50, SENSEX, and other major indices
5. **Market Status**: Indian market open/close status with IST timing

### Financial News
1. **Live News Feed**: Real-time financial and business news
2. **News Categories**: Business, Markets, Economy, Technology, Crypto, etc.
3. **Stock-Specific News**: Company and stock-related news
4. **Breaking News**: High-priority market updates
5. **News Search**: Search through financial news articles
6. **Trending News**: Most relevant and popular news

### Watchlist
1. Add stocks to your personal watchlist
2. Monitor real-time price changes
3. Customize stock names and descriptions

## 🚀 Trading Strategies & Fyers API Integration

### Features
- **Custom Strategy Management**: Create, edit, and manage personalized trading strategies
- **Strategy Templates**: Pre-built strategy templates for quick implementation
- **Automated Execution**: Schedule and automate strategy execution
- **Performance Tracking**: Monitor strategy performance with detailed analytics
- **Risk Management**: Built-in risk management parameters and stop-loss controls
- **Backtesting**: Test strategies against historical data
- **Fyers API Integration**: Connect to Fyers trading platform for order execution
- **Custom Order Buttons**: Pre-configured Buy, Sell, and Basket order buttons

### Architecture
- **Strategy Engine**: Core strategy execution and management system
- **Condition Builder**: Visual interface for defining trading conditions
- **Risk Calculator**: Automated risk assessment and position sizing
- **Performance Analytics**: Comprehensive strategy performance metrics
- **Fyers Service**: Backend service for Fyers API integration
- **Order Management**: Automated order placement and tracking

### Fyers API Connect Features
- **OAuth2 Authentication**: Secure broker account connection
- **Real-time Market Data**: Live quotes, charts, and market information
- **Order Placement**: Buy, Sell, and Basket order execution
- **Account Management**: Holdings, positions, and order history
- **Custom Buttons**: Pre-configured order buttons for quick trading
- **Token Management**: Automatic token refresh and session handling

### API Endpoints
- `POST /api/strategy/create` - Create new trading strategy
- `GET /api/strategy/list` - List user strategies
- `PUT /api/strategy/{id}` - Update strategy
- `DELETE /api/strategy/{id}` - Delete strategy
- `POST /api/strategy/{id}/toggle` - Toggle strategy status
- `POST /api/strategy/{id}/execute` - Execute strategy
- `GET /api/strategy/templates` - Get strategy templates
- `GET /api/strategy/categories` - Get strategy categories

## 🔧 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
python main.py
```

**Frontend:**
```bash
cd frontend
npm start
```

### Database Setup

The project includes a `docker-compose.yml` file for easy database setup:

```bash
cd backend
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Any other required services

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

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
- `GET /api/market/quote/{symbol}` - Get global stock quote
- `GET /api/market/search` - Search global stocks
- `GET /api/market/news/{symbol}` - Get stock news

### Financial News
- `GET /api/news/latest` - Get latest financial news by category
- `GET /api/news/categories` - Get available news categories
- `GET /api/news/stock/{symbol}` - Get stock-specific news
- `GET /api/news/search` - Search news articles
- `GET /api/news/trending` - Get trending financial news
- `GET /api/news/market-updates` - Get market-specific updates
- `GET /api/news/breaking` - Get breaking financial news

### Indian Markets (NSE/BSE)
- `GET /api/market/indian/quote/{symbol}` - Get Indian stock quote (NSE/BSE)
- `GET /api/market/indian/indices/nse` - Get NSE indices (NIFTY 50, etc.)
- `GET /api/market/indian/indices/bse` - Get BSE indices (SENSEX, etc.)
- `GET /api/market/indian/search` - Search Indian stocks
- `GET /api/market/indian/market-status` - Get Indian market status
- `GET /api/market/indian/popular-stocks` - Get popular Indian stocks

### Watchlist
- `POST /api/watchlist/add` - Add to watchlist
- `GET /api/watchlist/list` - Get watchlist
- `PUT /api/watchlist/{id}` - Update watchlist item
- `DELETE /api/watchlist/{id}` - Remove from watchlist

## 🐳 Docker Deployment

### Development Environment

```bash
cd backend
docker-compose up -d
```

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

## 🔒 Security Features

- JWT-based authentication
- Password hashing
- CORS middleware configuration
- Input validation with Pydantic
- SQL injection protection with SQLAlchemy

## 📈 Performance Features

- Redis caching for frequently accessed data
- Database connection pooling
- Asynchronous API endpoints
- Optimized database queries

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 Contributing

1. **Get Repository Access** - Contact your team lead for access
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request for team review

## 📄 License

This project is proprietary software owned by **369 Algo**. 
- **Internal Use Only** - For authorized team members and collaborators
- **Confidential** - Contains proprietary trading algorithms and business logic
- **No Public Distribution** - Not intended for open source or public use

See the [LICENSE](LICENSE) file for complete terms and restrictions.

## 🤝 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Contact your team lead or project manager
- Use your team's communication channels (Slack, Teams, etc.)

## 🔮 Roadmap

### Upcoming Features
- [ ] Enhanced real-time WebSocket market data
- [ ] Advanced charting with TradingView integration
- [ ] Mobile app (React Native)
- [x] Algorithmic trading strategies
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

**App Name**: 369 Algo  
**Repository**: https://github.com/r4r00t-sh/369Algo.git
