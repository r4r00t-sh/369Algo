import React, { useState } from 'react';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import TradingViewChart from '../components/common/TradingViewChart';

const MarketData: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const indices = [
    { name: 'NIFTY 50', value: '24,712.05', change: '-255.70', changePercent: '-1.02%', isPositive: false },
    { name: 'SENSEX', value: '81,210.68', change: '-847.27', changePercent: '-1.03%', isPositive: false },
    { name: 'BANK NIFTY', value: '52,123.45', change: '-234.56', changePercent: '-0.45%', isPositive: false },
    { name: 'NIFTY IT', value: '34,567.89', change: '+123.45', changePercent: '+0.36%', isPositive: true },
  ];

  const topMovers = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,456.78', change: '+45.67', changePercent: '+1.89%', isPositive: true },
    { symbol: 'TCS', name: 'Tata Consultancy', price: '3,234.56', change: '-67.89', changePercent: '-2.05%', isPositive: false },
    { symbol: 'HDFC', name: 'HDFC Bank', price: '1,678.90', change: '+23.45', changePercent: '+1.42%', isPositive: true },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Market Data</h1>
          <p className="text-muted-foreground">Real-time market information and analysis</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card text-muted-foreground hover:bg-muted transition-colors">
            <FiFilter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card text-muted-foreground hover:bg-muted transition-colors">
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search stocks, indices, or markets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Indices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {indices.map((index, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">{index.name}</div>
            <div className="text-2xl font-bold text-foreground mb-2">{index.value}</div>
            <div className={`flex items-center gap-1 text-sm font-medium ${index.isPositive ? 'text-success' : 'text-destructive'}`}>
              {index.isPositive ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
              {index.change} ({index.changePercent})
            </div>
          </div>
        ))}
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Market Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Market Cap</span>
              <span className="font-medium">₹3,456,789 Cr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Advance/Decline</span>
              <span className="font-medium">1,234 / 567</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume</span>
              <span className="font-medium">₹45,678 Cr</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Movers</h3>
          <div className="space-y-3">
            {topMovers.map((stock, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-foreground">{stock.symbol}</div>
                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-foreground">{stock.price}</div>
                  <div className={`text-sm ${stock.isPositive ? 'text-success' : 'text-destructive'}`}>
                    {stock.change} ({stock.changePercent})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Market Chart</h3>
        <div className="h-96">
          <TradingViewChart symbol="NIFTY 50" height={300} />
        </div>
      </div>
    </div>
  );
};

export default MarketData;
