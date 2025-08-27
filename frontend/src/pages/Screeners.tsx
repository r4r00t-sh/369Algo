import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { 
  Search,
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  Plus,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';

const Screeners: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [sortBy, setSortBy] = useState('marketCap');
  const [sortOrder, setSortOrder] = useState('desc');

  const screenerTabs = [
    'Overview', 'Performance', 'Extended Hours', 'Valuation', 'Dividends',
    'Profitability', 'Income Statement', 'Balance Sheet', 'Cash Flow', 'Per Share', 'Technicals'
  ];

  const filterOptions = [
    'All stocks', 'Market', 'IN', 'Watchlist', 'Index', 'Price', 'Change %',
    'Market cap', 'P/E', 'EPS dil growth', 'Div yield %', 'Sector', 'Analyst Rating',
    'Perf %', 'Revenue growth', 'PEG', 'ROE', 'Beta'
  ];

  const stocks = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Limited',
      price: '1,384.90',
      change: '-1.96%',
      isPositive: false,
      volume: '12.15M',
      relVolume: '1.2',
      marketCap: '18.75 T',
      pe: '22.99',
      eps: '60.23',
      epsGrowth: '+18.55%',
      epsGrowthPositive: true,
      divYield: '0.36%',
      sector: 'Energy minerals',
      analystRating: 'Strong buy',
      ratingPositive: true
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services Limited',
      price: '3,157.20',
      change: '+0.53%',
      isPositive: true,
      volume: '5.52 M',
      relVolume: '0.8',
      marketCap: '11.42 T',
      pe: '23.18',
      eps: '136.19',
      epsGrowth: '+5.63%',
      epsGrowthPositive: true,
      divYield: '1.93%',
      sector: 'Technology services',
      analystRating: 'Buy',
      ratingPositive: true
    },
    {
      symbol: 'BHARTIARTL',
      name: 'Bharti Airtel Limited',
      price: '1,904.70',
      change: '-1.35%',
      isPositive: false,
      volume: '5.98M',
      relVolume: '1.1',
      marketCap: '10.86 T',
      pe: '32.80',
      eps: '58.07',
      epsGrowth: '+250.52%',
      epsGrowthPositive: true,
      divYield: '0.84%',
      sector: 'Communications',
      analystRating: 'Buy',
      ratingPositive: true
    },
    {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank Limited',
      price: '1,416.60',
      change: '-1.16%',
      isPositive: false,
      volume: '8.72 M',
      relVolume: '1.3',
      marketCap: '10.12T',
      pe: '19.66',
      eps: '72.05',
      epsGrowth: '+13.68%',
      epsGrowthPositive: true,
      divYield: '0.71%',
      sector: 'Finance',
      analystRating: 'Strong buy',
      ratingPositive: true
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Limited',
      price: '1,678.45',
      change: '-0.89%',
      isPositive: false,
      volume: '7.23M',
      relVolume: '0.9',
      marketCap: '9.87 T',
      pe: '18.45',
      eps: '91.02',
      epsGrowth: '+12.34%',
      epsGrowthPositive: true,
      divYield: '0.95%',
      sector: 'Finance',
      analystRating: 'Buy',
      ratingPositive: true
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      price: '1,456.78',
      change: '+0.67%',
      isPositive: true,
      volume: '6.45M',
      relVolume: '1.0',
      marketCap: '8.92 T',
      pe: '25.67',
      eps: '56.78',
      epsGrowth: '+8.92%',
      epsGrowthPositive: true,
      divYield: '2.15%',
      sector: 'Technology services',
      analystRating: 'Strong buy',
      ratingPositive: true
    }
  ];

  const redList = [
    { symbol: 'BANKNIF', price: '54,450.45', change: '-688.85', changePercent: '-1.25%' },
    { symbol: 'CRUDEOIL', price: '5,615', change: '48', changePercent: '0.86%' },
    { symbol: 'NATURAL', price: '2.8987', change: '0.0648', changePercent: '2.29%' },
    { symbol: 'NATURALC', price: '253.2', change: '16.7', changePercent: '7.06%' },
    { symbol: 'WTICOUSE', price: '64.502', change: '0.577', changePercent: '0.90%' },
    { symbol: 'USOIL', price: '63.88', change: '0.58', changePercent: '0.92%' },
    { symbol: 'SILVER', price: '38.483', change: '-0.120', changePercent: '-0.31%' },
    { symbol: 'NG1!', price: '2.873', change: '0.156', changePercent: '5.74%' }
  ];

  const performanceMetrics = [
    { period: '1W', value: '-0.72%', isPositive: false },
    { period: '1M', value: '-1.19%', isPositive: false },
    { period: '3M', value: '-0.49%', isPositive: false },
    { period: '6M', value: '9.50%', isPositive: true },
    { period: 'YTD', value: '4.55%', isPositive: true },
    { period: '1Y', value: '-0.78%', isPositive: false }
  ];

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Left Sidebar - Screener Controls */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Stock Screener</h2>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Filter Bar */}
            <div className="space-y-3">
              {filterOptions.map((filter, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer">
                  <span className="text-sm text-gray-300">{filter}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
            
            {/* Date Filters */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span className="text-sm text-gray-300">Recent earnings date</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                <span className="text-sm text-gray-300">Upcoming earnings date</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <Button className="p-2 bg-gray-700 hover:bg-gray-600">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button className="p-2 bg-gray-700 hover:bg-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Content Tabs */}
          <div className="flex space-x-1 mb-6 overflow-x-auto">
            {screenerTabs.map((tab) => (
              <button
                key={tab}
                className={cn(
                  "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  tab === activeTab
                    ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                    : "text-gray-300 hover:text-white"
                )}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Stock Screener Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4" />
                        <span>Symbol</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">5018</div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Change %</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Volume</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Rel Volume</th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-medium text-gray-300 cursor-pointer hover:bg-gray-600"
                      onClick={() => handleSort('marketCap')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>↓ Market cap</span>
                        {sortBy === 'marketCap' && (
                          sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">P/E</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">EPS dil TTM</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">EPS dil growth TTM YoY</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Div yield %</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Sector</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Analyst Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {stocks.map((stock, index) => (
                    <tr key={index} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-white">{stock.symbol}</div>
                          <div className="text-xs text-gray-400">{stock.name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white">{stock.price}</td>
                      <td className={cn(
                        "px-4 py-3 font-medium",
                        stock.isPositive ? "text-green-400" : "text-red-400"
                      )}>
                        {stock.change}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{stock.volume}</td>
                      <td className="px-4 py-3 text-gray-300">{stock.relVolume}</td>
                      <td className="px-4 py-3 text-white">{stock.marketCap}</td>
                      <td className="px-4 py-3 text-gray-300">{stock.pe}</td>
                      <td className="px-4 py-3 text-white">{stock.eps}</td>
                      <td className={cn(
                        "px-4 py-3 font-medium",
                        stock.epsGrowthPositive ? "text-green-400" : "text-red-400"
                      )}>
                        {stock.epsGrowth}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{stock.divYield}</td>
                      <td className="px-4 py-3 text-gray-300">{stock.sector}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <span className={cn(
                            "text-sm font-medium",
                            stock.ratingPositive ? "text-green-400" : "text-gray-400"
                          )}>
                            {stock.analystRating}
                          </span>
                          {stock.ratingPositive && (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Market Overview */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          {/* Red List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Red List</h3>
            <div className="space-y-2">
              {redList.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                  <span className="text-sm font-medium">{item.symbol}</span>
                  <div className="text-right">
                    <div className="text-sm text-white">{item.price}</div>
                    <div className="text-xs text-gray-400">
                      {item.change} ({item.changePercent})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NIFTY 50 Index */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <h3 className="text-lg font-semibold">NIFTY</h3>
              <div className="w-6 h-6 bg-blue-600 rounded text-xs font-bold text-white flex items-center justify-center">50</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-300 mb-1">Nifty 50 Index - NSE Index</div>
              <div className="text-xl font-bold text-white mb-1">24,712.05 INR</div>
              <div className="text-red-400 font-medium mb-2">-255.70 -1.02%</div>
              <div className="text-sm text-gray-400 mb-3">- Market closed</div>
              <div className="text-xs text-gray-400 mb-3">Last update at Aug 26, 15:29 GMT+5:30</div>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Day's Range</span>
                    <span>24,689.60 - 24,919.65</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>52WK Range</span>
                    <span>21,743.65 - 26,277.35</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">News</h3>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-2">14 hours ago</div>
              <div className="text-sm text-gray-300">
                Indian financial markets closed on August 27 for holiday
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Performance</h3>
            <div className="grid grid-cols-3 gap-2">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="bg-gray-700 rounded p-2 text-center">
                  <div className="text-xs text-gray-400 mb-1">{metric.period}</div>
                  <div className={cn(
                    "text-sm font-medium",
                    metric.isPositive ? "text-green-400" : "text-red-400"
                  )}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seasonals */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Seasonals</h3>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="h-32 bg-gray-600 rounded flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-sm mb-2">Seasonal Chart</div>
                  <div className="text-xs">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>2023</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>2024</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <span>2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screeners;
