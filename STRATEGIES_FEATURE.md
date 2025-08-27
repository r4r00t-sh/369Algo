# 🚀 Trading Strategies & Fyers API Integration

## Overview

The **369 Algo** trading platform now includes a comprehensive **Strategies** module that allows users to create, manage, and execute custom trading strategies with automated execution capabilities. This feature is fully integrated with the **Fyers API Connect** for seamless broker integration.

## ✨ Key Features

### 🎯 **Custom Trading Strategies**
- **Strategy Builder**: Create custom trading strategies with visual condition builders
- **Parameter Management**: Configure strategy-specific parameters and risk management rules
- **Condition Engine**: Define entry/exit conditions using technical indicators
- **Risk Management**: Set stop-loss, take-profit, and position sizing rules

### 📊 **Strategy Templates**
- **Pre-built Templates**: Ready-to-use strategies for common trading approaches
- **Moving Average Crossover**: Trend-following strategy based on MA crossovers
- **Mean Reversion**: Contrarian strategy based on price deviations
- **Momentum Trading**: Momentum-based strategies for trend continuation
- **Customizable**: Modify templates to suit your trading style

### 🔄 **Automated Execution**
- **Real-time Monitoring**: Continuous market data monitoring for strategy signals
- **Auto-execution**: Automatically execute trades when conditions are met
- **Risk Controls**: Built-in risk management and position sizing
- **Performance Tracking**: Monitor strategy performance and P&L

### 🔌 **Fyers API Integration**
- **Seamless Connection**: Direct integration with Fyers trading platform
- **Real-time Data**: Live market data and order execution
- **Account Management**: Access to holdings, positions, and orders
- **Secure Authentication**: OAuth2-based secure authentication

## 🏗️ Architecture

### Backend Components

```
backend/
├── models/
│   ├── strategy.py              # Strategy data models
│   ├── strategy_trade.py        # Strategy trade tracking
│   └── strategy_backtest.py     # Backtest results
├── schemas/
│   └── strategy.py              # Pydantic schemas
├── services/
│   ├── strategy_service.py      # Strategy business logic
│   └── fyers_service.py        # Fyers API integration
└── routers/
    └── strategy.py              # API endpoints
```

### Frontend Components

```
frontend/src/
├── pages/
│   └── Strategies.tsx           # Main strategies page
├── components/
│   └── layout/
│       └── Sidebar.tsx          # Navigation with Strategies menu
└── App.tsx                      # Routing configuration
```

## 🚀 Getting Started

### 1. **Backend Setup**

#### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Environment Configuration
Create a `.env` file with the following variables:

```env
# Fyers API Connect Configuration
FYERS_APP_ID=your_fyers_app_id_here
FYERS_APP_SECRET=your_fyers_app_secret_here
FYERS_REDIRECT_URI=http://localhost:3000/fyers-callback

# News API Key
NEWS_API_KEY=ed871179c02644b3a43b7cebd2f701ee

# Alpha Vantage API Key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

#### Database Migration
```bash
# The strategy models will be automatically created when you start the backend
python main.py
```

### 2. **Frontend Setup**

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Development Server
```bash
npm start
```

### 3. **Fyers API Setup**

#### Create Fyers App
1. Visit [Fyers Developer Portal](https://myapi.fyers.in/)
2. Create a new application
3. Get your `APP_ID` and `APP_SECRET`
4. Set redirect URI to `http://localhost:3000/fyers-callback`

#### Include Fyers Script
Add this script to your HTML (already included in the Strategies page):

```html
<script src="https://api-connect-docs.fyers.in/fyers-lib.js"></script>
```

## 📱 User Interface

### **Strategies Page Layout**

```
┌─────────────────────────────────────────────────────────────┐
│                    Trading Strategies                       │
│  Create, manage, and execute custom trading strategies     │
│  [Create Strategy] [Import] [Export]                       │
├─────────────────────────────────────────────────────────────┤
│ [My Strategies] [Templates] [Fyers Integration]            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Strategy Card 1 │  │ Strategy Card 2 │  │ Template 1  │ │
│  │ [Active]        │  │ [Inactive]      │  │ [Use]       │ │
│  │ Execute | Edit  │  │ Execute | Edit  │  │ [Preview]   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Strategy Card Features**
- **Status Indicator**: Active/Inactive status with visual feedback
- **Performance Metrics**: Total trades, win rate, P&L, successful trades
- **Quick Actions**: Execute, Edit, Performance, Delete
- **Real-time Updates**: Live performance tracking

## 🔧 API Endpoints

### **Strategy Management**

#### Create Strategy
```http
POST /api/strategy/
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "My Moving Average Strategy",
  "description": "Simple MA crossover strategy",
  "category": "moving_average_crossover",
  "parameters": {
    "short_period": 10,
    "long_period": 20
  },
  "conditions": {
    "entry": "short_ma > long_ma",
    "exit": "short_ma < long_ma"
  },
  "risk_management": {
    "stop_loss": 2.0,
    "take_profit": 6.0,
    "position_size": 10.0
  }
}
```

#### Get Strategies
```http
GET /api/strategy/?category=moving_average_crossover&is_active=true
Authorization: Bearer <token>
```

#### Update Strategy
```http
PUT /api/strategy/{strategy_id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "parameters": {
    "short_period": 15,
    "long_period": 25
  }
}
```

#### Execute Strategy
```http
POST /api/strategy/{strategy_id}/execute
Content-Type: application/json
Authorization: Bearer <token>

{
  "symbols": ["RELIANCE", "TCS", "INFY"],
  "capital": 100000,
  "dry_run": true
}
```

### **Strategy Backtesting**

#### Create Backtest
```http
POST /api/strategy/{strategy_id}/backtest
Content-Type: application/json
Authorization: Bearer <token>

{
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-12-31T23:59:59Z",
  "initial_capital": 100000
}
```

#### Get Backtest Results
```http
GET /api/strategy/{strategy_id}/backtest/{backtest_id}
Authorization: Bearer <token>
```

### **Strategy Templates**

#### Get Templates
```http
GET /api/strategy/templates
Authorization: Bearer <token>
```

#### Get Categories
```http
GET /api/strategy/categories
Authorization: Bearer <token>
```

## 📊 Strategy Templates

### **1. Moving Average Crossover**
- **Description**: Buy when short MA crosses above long MA, sell when it crosses below
- **Parameters**: Short period (5-50), Long period (10-200)
- **Risk Management**: Stop loss (2-10%), Take profit (4-15%), Position size (5-20%)
- **Best For**: Trend-following markets

### **2. Mean Reversion**
- **Description**: Buy when price is below moving average, sell when above
- **Parameters**: MA period (10-100), Deviation threshold (0.5-10%)
- **Risk Management**: Stop loss (2-8%), Take profit (3-12%), Position size (5-15%)
- **Best For**: Range-bound markets

### **3. Momentum Trading**
- **Description**: Buy stocks with strong upward momentum, sell when momentum weakens
- **Parameters**: Momentum period (5-50), Momentum threshold (0.1-2.0)
- **Risk Management**: Stop loss (2-5%), Take profit (5-15%), Position size (8-20%)
- **Best For**: Trending markets

## 🔌 Fyers API Integration

### **Authentication Flow**

```
1. User clicks "Connect Fyers Account"
2. Redirect to Fyers OAuth page
3. User authorizes application
4. Fyers redirects with auth code
5. Backend exchanges code for tokens
6. Store tokens securely
7. Enable strategy execution
```

### **Available Operations**

#### **Account Management**
- Get user profile and account details
- View holdings and positions
- Check account balance and P&L

#### **Market Data**
- Real-time quotes for multiple symbols
- Historical data with various timeframes
- Market status and trading hours

#### **Order Management**
- Place market and limit orders
- Modify existing orders
- Cancel orders
- View order history

#### **Strategy Execution**
- Execute strategies automatically
- Place orders based on signals
- Manage risk with stop-loss orders

### **Security Features**
- **OAuth2 Authentication**: Secure token-based authentication
- **Token Refresh**: Automatic token refresh before expiry
- **Secure Storage**: Encrypted storage of sensitive credentials
- **Access Control**: User-specific strategy access

## 📈 Performance Tracking

### **Strategy Metrics**
- **Total Return**: Overall strategy performance
- **Annualized Return**: Yearly performance rate
- **Sharpe Ratio**: Risk-adjusted returns
- **Maximum Drawdown**: Largest peak-to-trough decline
- **Win Rate**: Percentage of profitable trades
- **Total Trades**: Number of executed trades

### **Risk Metrics**
- **Volatility**: Price fluctuation measure
- **Beta**: Market correlation
- **Alpha**: Excess return over market
- **Sortino Ratio**: Downside risk-adjusted returns

### **Trade Analysis**
- **Average Trade Duration**: Typical holding period
- **Average Win/Loss**: Typical profit/loss per trade
- **Largest Win/Loss**: Best and worst trades
- **Consecutive Wins/Losses**: Streak analysis

## 🚀 Advanced Features

### **Custom Strategy Builder**
- **Visual Condition Builder**: Drag-and-drop interface for strategy creation
- **Technical Indicators**: 50+ built-in technical indicators
- **Custom Functions**: Write custom logic and functions
- **Backtesting Engine**: Test strategies on historical data

### **Portfolio Optimization**
- **Position Sizing**: Kelly criterion and risk-based sizing
- **Correlation Analysis**: Reduce portfolio risk
- **Rebalancing**: Automatic portfolio rebalancing
- **Risk Allocation**: Distribute risk across strategies

### **Real-time Alerts**
- **Signal Notifications**: Instant alerts for strategy signals
- **Performance Alerts**: Notifications for significant P&L changes
- **Risk Alerts**: Warnings for excessive drawdown
- **Market Alerts**: Important market event notifications

## 🔒 Security & Compliance

### **Data Protection**
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Role-based access control (RBAC)
- **Audit Logging**: Complete audit trail of all actions
- **Data Retention**: Configurable data retention policies

### **Trading Safety**
- **Risk Limits**: Maximum position and loss limits
- **Circuit Breakers**: Automatic trading suspension on extreme moves
- **Order Validation**: Pre-trade risk checks
- **Compliance Monitoring**: Regulatory compliance checks

## 🧪 Testing & Development

### **Backend Testing**
```bash
cd backend
python -m pytest tests/ -v
```

### **Frontend Testing**
```bash
cd frontend
npm test
```

### **API Testing**
```bash
# Test strategy creation
curl -X POST http://localhost:8000/api/strategy/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Strategy", "category": "custom"}'

# Test strategy execution
curl -X POST http://localhost:8000/api/strategy/1/execute \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["RELIANCE"], "capital": 10000, "dry_run": true}'
```

## 📚 Documentation & Support

### **API Documentation**
- **Swagger UI**: Available at `/docs` when backend is running
- **OpenAPI Spec**: Machine-readable API specification
- **Code Examples**: Sample code in multiple languages

### **User Guides**
- **Strategy Creation**: Step-by-step strategy building guide
- **Fyers Integration**: Complete integration setup guide
- **Risk Management**: Best practices for risk control
- **Performance Analysis**: How to interpret strategy results

### **Support Resources**
- **FAQ**: Common questions and answers
- **Video Tutorials**: Visual learning resources
- **Community Forum**: User community support
- **Technical Support**: Developer support for advanced users

## 🔮 Future Enhancements

### **Planned Features**
- **Machine Learning**: AI-powered strategy optimization
- **Social Trading**: Copy successful traders' strategies
- **Mobile App**: Native mobile applications
- **Advanced Analytics**: Predictive analytics and forecasting

### **Integration Roadmap**
- **Additional Brokers**: Zerodha, Angel One, Upstox
- **Global Markets**: US, European, and Asian markets
- **Cryptocurrency**: Digital asset trading support
- **Options Trading**: Advanced derivatives strategies

## 🎯 Getting Help

### **Immediate Support**
- **Documentation**: Check this guide and API docs
- **Error Logs**: Review backend and frontend logs
- **Community**: Ask questions in user forums

### **Technical Issues**
- **Backend Errors**: Check FastAPI logs and database connectivity
- **Frontend Issues**: Verify React component rendering and API calls
- **Fyers Integration**: Ensure API credentials and permissions are correct

### **Feature Requests**
- **GitHub Issues**: Submit feature requests and bug reports
- **User Feedback**: Share your experience and suggestions
- **Roadmap**: Check planned features and development timeline

---

## 🚀 **Ready to Start Trading with Strategies?**

The **369 Algo** platform now provides you with professional-grade trading strategy capabilities:

1. **Create** custom strategies with our intuitive builder
2. **Test** strategies with comprehensive backtesting
3. **Execute** strategies automatically with Fyers integration
4. **Monitor** performance with real-time analytics
5. **Optimize** strategies based on market conditions

Start building your automated trading empire today! 🎯📈
