# Broker Integration Guide

This guide explains how to connect your demat account to the trading application and place real orders.

## Supported Brokers

The application currently supports the following brokers:

### 1. Zerodha (Recommended)
- **Website**: https://zerodha.com
- **API Documentation**: https://kite.trade/docs/connect/v3/
- **Features**: Equity, F&O, Currency, Commodity, Mutual Funds
- **Pricing**: Low-cost trading with advanced charting tools

### 2. Angel One
- **Website**: https://angelone.in
- **API Documentation**: https://smartapi.angelbroking.com/
- **Features**: Equity, F&O, Currency, Commodity, Research
- **Pricing**: Full-service broker with research and advisory

### 3. Upstox
- **Website**: https://upstox.com
- **API Documentation**: https://api-docs.upstox.com/
- **Features**: Equity, F&O, Currency, Commodity
- **Pricing**: Discount broker with modern interface

## How to Connect Your Broker Account

### Step 1: Get API Credentials

#### For Zerodha:
1. Log in to your Zerodha account at https://kite.trade
2. Go to **My Account** → **API Management**
3. Click **Enable API Access**
4. Generate a new API key and secret
5. Note down your **API Key** and **API Secret**

#### For Angel One:
1. Log in to your Angel One account
2. Go to **Smart API** section
3. Generate API credentials
4. Note down your **API Key** and **API Secret**

#### For Upstox:
1. Log in to your Upstox account
2. Go to **API Settings**
3. Generate new API credentials
4. Note down your **API Key** and **API Secret**

### Step 2: Connect in the Application

1. **Open Settings**: Go to the Settings page in the application
2. **Select Broker**: Click on the broker you want to connect
3. **Enter Credentials**: 
   - API Key: Your broker's API key
   - API Secret: Your broker's API secret
4. **Connect**: Click the "Connect" button

### Step 3: Complete OAuth (if required)

Some brokers require OAuth authentication:
1. You'll be redirected to your broker's login page
2. Log in with your broker credentials
3. Authorize the application
4. You'll be redirected back with a request token
5. The application will automatically complete the connection

## How to Place Orders

### Step 1: Ensure Broker is Connected
- Go to Settings and verify your broker shows as "Connected"
- If not connected, follow the connection steps above

### Step 2: Navigate to Trading Page
- Go to the Trading page in the application
- Select the stock you want to trade
- Choose your broker account from the dropdown

### Step 3: Place Your Order
1. **Order Type**: Choose Market, Limit, or Stop Loss
2. **Quantity**: Enter the number of shares
3. **Price**: For limit orders, enter your desired price
4. **Action**: Click Buy or Sell

### Step 4: Order Confirmation
- Your order will be sent to your broker
- You'll receive an order ID
- Check your broker's platform for order status

## Order Types Explained

### Market Order
- **What it is**: Order to buy/sell at the current market price
- **When to use**: When you want immediate execution
- **Risk**: Price may vary from expected due to market movement

### Limit Order
- **What it is**: Order to buy/sell at a specific price or better
- **When to use**: When you want to control the price
- **Risk**: Order may not execute if market doesn't reach your price

### Stop Loss Order
- **What it is**: Order to sell when price falls below a certain level
- **When to use**: To limit potential losses
- **Risk**: May execute at a price worse than expected in volatile markets

## Security Best Practices

### 1. API Key Security
- Never share your API credentials
- Use different API keys for different applications
- Regularly rotate your API keys

### 2. Account Security
- Enable 2FA on your broker account
- Use strong, unique passwords
- Monitor your account activity regularly

### 3. Trading Security
- Start with small orders to test the system
- Verify all order details before confirming
- Keep your trading credentials secure

## Troubleshooting

### Common Issues

#### "Authentication Failed"
- Check your API key and secret are correct
- Ensure your broker account is active
- Try refreshing your API credentials

#### "Order Placement Failed"
- Verify your broker is connected
- Check if you have sufficient funds
- Ensure the stock symbol is correct
- Verify market hours and trading restrictions

#### "Broker Not Responding"
- Check your internet connection
- Verify broker's servers are operational
- Try reconnecting your broker account

### Getting Help

1. **Check Broker Status**: Go to Settings → Broker Connections
2. **Verify Credentials**: Ensure API key and secret are correct
3. **Check Broker Platform**: Verify your account status on broker's website
4. **Contact Support**: Reach out to your broker's support team

## Important Notes

### Trading Hours
- **Equity**: 9:15 AM - 3:30 PM (IST), Monday to Friday
- **F&O**: 9:15 AM - 3:30 PM (IST), Monday to Friday
- **Currency**: 9:00 AM - 5:00 PM (IST), Monday to Friday

### Market Holidays
- Check NSE/BSE holiday calendar
- No trading on weekends and public holidays
- Limited trading on special market days

### Risk Disclaimer
- Trading involves substantial risk of loss
- Past performance doesn't guarantee future results
- Only trade with money you can afford to lose
- Consider consulting a financial advisor

## API Rate Limits

### Zerodha
- **Orders**: 10 orders per second
- **Quotes**: 3 requests per second
- **Historical Data**: 5 requests per second

### Angel One
- **Orders**: 5 orders per second
- **Quotes**: 2 requests per second
- **Historical Data**: 3 requests per second

### Upstox
- **Orders**: 8 orders per second
- **Quotes**: 4 requests per second
- **Historical Data**: 6 requests per second

## Support and Updates

- **Application Updates**: Check for updates regularly
- **Broker Updates**: Monitor broker API changes
- **Documentation**: Refer to broker's official API docs
- **Community**: Join trading communities for tips and support

---

**Remember**: Always start with paper trading or small amounts to familiarize yourself with the system before placing significant orders.
