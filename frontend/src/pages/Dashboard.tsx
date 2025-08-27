import React from 'react';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiBarChart,
  FiEye,
  FiPlus
} from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Total Portfolio Value', value: '₹12,45,678', change: '+12.5%', isPositive: true, icon: FiDollarSign },
    { name: 'Today\'s P&L', value: '₹23,456', change: '+2.1%', isPositive: true, icon: FiTrendingUp },
    { name: 'Total Holdings', value: '24', change: '+3', isPositive: true, icon: FiBarChart },
    { name: 'Watchlist Items', value: '18', change: '+2', isPositive: true, icon: FiEye },
  ];

  const recentTrades = [
    { symbol: 'RELIANCE', type: 'BUY', quantity: 100, price: '2,456.78', time: '10:30 AM' },
    { symbol: 'TCS', type: 'SELL', quantity: 50, price: '3,234.56', time: '09:45 AM' },
    { symbol: 'HDFC', type: 'BUY', quantity: 200, price: '1,678.90', time: '09:15 AM' },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your trading overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                <p className={`text-sm font-medium mt-1 ${stat.isPositive ? 'text-success' : 'text-destructive'}`}>
                  {stat.change}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Portfolio Overview */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Portfolio Overview</h3>
            <button className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              <FiPlus className="w-4 h-4" />
              Add Funds
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cash Balance</span>
              <span className="font-medium">₹45,678</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Invested Amount</span>
              <span className="font-medium">₹12,00,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Available Margin</span>
              <span className="font-medium">₹2,34,567</span>
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Trades</h3>
          <div className="space-y-3">
            {recentTrades.map((trade, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                <div>
                  <div className="font-medium text-foreground">{trade.symbol}</div>
                  <div className="text-sm text-muted-foreground">{trade.time}</div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${trade.type === 'BUY' ? 'text-success' : 'text-destructive'}`}>
                    {trade.type}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {trade.quantity} @ ₹{trade.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-muted transition-colors">
            <FiPlus className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">New Order</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-muted transition-colors">
            <FiEye className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">View Orders</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-muted transition-colors">
            <FiBarChart className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Analytics</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:bg-muted transition-colors">
            <FiTrendingUp className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Strategies</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
