import React, { useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiPieChart, FiBarChart } from 'react-icons/fi';

const Portfolio: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');

  const portfolioData = {
    totalValue: 1250000,
    totalChange: 125000,
    totalChangePercent: 11.11,
    isPositive: true
  };

  const holdings = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 100, avgPrice: 2450, ltp: 2680, change: 230, changePercent: 9.39, isPositive: true },
    { symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 50, avgPrice: 3200, ltp: 3450, change: 250, changePercent: 7.81, isPositive: true },
    { symbol: 'HDFC', name: 'HDFC Bank', quantity: 200, avgPrice: 1400, ltp: 1320, change: -80, changePercent: -5.71, isPositive: false },
    { symbol: 'INFY', name: 'Infosys', quantity: 75, avgPrice: 1800, ltp: 1950, change: 150, changePercent: 8.33, isPositive: true },
    { symbol: 'ITC', name: 'ITC Limited', quantity: 300, avgPrice: 450, ltp: 480, change: 30, changePercent: 6.67, isPositive: true }
  ];

  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Portfolio</h1>
          <p className="text-muted-foreground">Track your investments and performance</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Add Stock
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Value</h3>
            <FiPieChart className="text-muted-foreground" size={20} />
          </div>
          <p className="text-2xl font-bold text-foreground">₹{portfolioData.totalValue.toLocaleString()}</p>
          <div className={`flex items-center gap-1 mt-2 text-sm ${portfolioData.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {portfolioData.isPositive ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
            ₹{portfolioData.totalChange.toLocaleString()} ({portfolioData.totalChangePercent}%)
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total P&L</h3>
            <FiBarChart className="text-muted-foreground" size={20} />
          </div>
          <p className={`text-2xl font-bold ${portfolioData.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            ₹{portfolioData.totalChange.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {portfolioData.isPositive ? 'Profit' : 'Loss'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Holdings</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{holdings.length}</p>
          <p className="text-sm text-muted-foreground mt-2">Stocks</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Avg Return</h3>
          </div>
          <p className={`text-2xl font-bold ${portfolioData.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {portfolioData.totalChangePercent}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">Overall</p>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => setSelectedTimeframe(timeframe)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedTimeframe === timeframe
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {timeframe}
          </button>
        ))}
      </div>

      {/* Holdings Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Holdings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Stock</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Qty</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Avg Price</th>
                <th className="text-left p-4 font-medium text-muted-foreground">LTP</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Change</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Value</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-semibold text-foreground">{holding.symbol}</p>
                      <p className="text-sm text-muted-foreground">{holding.name}</p>
                    </div>
                  </td>
                  <td className="p-4 text-foreground">{holding.quantity}</td>
                  <td className="p-4 text-foreground">₹{holding.avgPrice}</td>
                  <td className="p-4 text-foreground">₹{holding.ltp}</td>
                  <td className="p-4">
                    <div className={`flex items-center gap-1 ${holding.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {holding.isPositive ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
                      ₹{holding.change} ({holding.changePercent}%)
                    </div>
                  </td>
                  <td className="p-4 text-foreground">₹{(holding.quantity * holding.ltp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
