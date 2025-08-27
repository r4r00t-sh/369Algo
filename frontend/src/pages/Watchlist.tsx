import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { 
  MoreVertical, 
  ZoomIn, 
  ZoomOut, 
  BarChart3, 
  Grid3X3, 
  RotateCcw, 
  RotateCw, 
  Moon, 
  Magnet, 
  Lock, 
  Camera, 
  Maximize2, 
  List,
  EyeOff,
  ChevronUp
} from 'lucide-react';
import { cn } from '../lib/utils';

const Watchlist: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Charts');
  
  const navigationTabs = ['Watchlist', 'My watchlist', 'Predefined', 'Smart watchlist'];
  const contentTabs = ['Overview', 'Charts', 'F&O', 'Technicals'];
  const timeframes = ['1d', '5d', '1m', '3m', '6m', '1y', '5y', '10y', 'All'];

  const selectedItem = {
    name: 'NATURALGAS FUT',
    price: '252.3',
    change: '0.00',
    changePercent: '3.06%',
    isPositive: true,
    details: {
      open: '252.30',
      high: '252.40',
      low: '252.30',
      close: '252.30'
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation Bar */}
      <div className="bg-purple-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {navigationTabs.map((tab) => (
              <button
                key={tab}
                className={cn(
                  "text-sm font-medium transition-colors",
                  tab === 'Watchlist' 
                    ? "text-blue-400 border-b-2 border-blue-400 pb-1" 
                    : "text-gray-300 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              + Create watchlist
            </Button>
            <button className="text-gray-300 hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Header with Instrument Info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-xl font-bold">
                    {selectedItem.name} {selectedItem.price} {selectedItem.changePercent}
                  </h1>
                  <div className="text-sm text-gray-400">
                    Change: {selectedItem.change} ({selectedItem.changePercent})
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  B
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                  S
                </Button>
                <button className="text-gray-300 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex space-x-1">
              {contentTabs.map((tab) => (
                <button
                  key={tab}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded transition-colors",
                    tab === activeTab
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  )}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Controls Bar */}
          <div className="bg-gray-800 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm">
                  30m
                </Button>
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <BarChart3 className="w-4 h-4" />
                </button>
                <Button variant="outline" className="text-sm border-gray-600 text-gray-300 hover:bg-gray-700">
                  fx Indicators
                </Button>
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <RotateCw className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <Moon className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <Magnet className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <Lock className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <Camera className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white">
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <select className="bg-gray-700 text-white px-3 py-1 rounded text-sm border-gray-600">
                  <option>Autosaved Ch...</option>
                </select>
                <div className="text-sm text-gray-300">
                  NATURALGAS 25 Sep 25 FUT - 30 - MCX
                </div>
                <div className="text-sm text-green-400 font-medium">
                  O{selectedItem.details.open} H{selectedItem.details.high} L{selectedItem.details.low} C{selectedItem.details.close} {selectedItem.change} ({selectedItem.changePercent})
                </div>
              </div>
            </div>
          </div>

          {/* Main Chart Area */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4 relative">
            <div className="h-96 bg-gray-700 rounded relative">
              {/* Left Panel with Indicators and Trading */}
              <div className="absolute left-4 top-4 z-10 space-y-4">
                {/* Instrument Name */}
                <div className="text-sm text-gray-300 font-medium">
                  NATURALGAS 25 Sep 25 FUT - 30 - MCX
                </div>
                
                {/* Trading Buttons */}
                <div className="space-y-2">
                  <Button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm w-32">
                    SELL {selectedItem.price} 0.10
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm w-32">
                    BUY 252.40 0.10
                  </Button>
                </div>
                
                {/* Indicator Values */}
                <div className="space-y-2 text-xs">
                  <div className="text-blue-400">
                    CPR with Pivot levels 236.23 232.70
                  </div>
                  <div className="text-green-400 flex items-center gap-1">
                    SuperTrend 10 3 244.89 
                    <EyeOff className="w-3 h-3" />
                    <EyeOff className="w-3 h-3" />
                  </div>
                  <div className="text-gray-400">
                    DEMA 9
                  </div>
                  <div className="text-gray-400">
                    Pivots Traditional Auto 15
                  </div>
                  <div className="text-gray-400 flex items-center gap-1">
                    MAC 8 22 0 0
                    <EyeOff className="w-3 h-3" />
                  </div>
                  <div className="flex items-center gap-1">
                    <ChevronUp className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
                
                {/* Support Levels */}
                <div className="space-y-1">
                  <div className="text-yellow-400 text-xs">S2</div>
                  <div className="text-yellow-400 text-xs">S3</div>
                </div>
              </div>
              
              {/* Main Chart Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400 mb-2">📈</div>
                  <div className="text-gray-400">Chart Component</div>
                  <div className="text-sm text-gray-500 mt-2">
                    NATURALGAS 25 Sep 25 FUT - 30 - MCX
                  </div>
                </div>
              </div>
              
              {/* Price Details Overlay */}
              <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded text-sm font-medium">
                {selectedItem.name} 25 Sep 25 FUT {selectedItem.price}
              </div>
              
              {/* Pivot Point Label */}
              <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 text-blue-400 text-sm font-medium">
                P
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">O:</span>
                <span className="ml-2 text-white">{selectedItem.details.open}</span>
              </div>
              <div>
                <span className="text-gray-400">H:</span>
                <span className="ml-2 text-white">{selectedItem.details.high}</span>
              </div>
              <div>
                <span className="text-gray-400">L:</span>
                <span className="ml-2 text-white">{selectedItem.details.low}</span>
              </div>
              <div>
                <span className="text-gray-400">C:</span>
                <span className="ml-2 text-white">{selectedItem.details.close}</span>
              </div>
            </div>
          </div>

          {/* Indicator Panels */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm font-medium mb-2">Stoch RSI 14 14 3 3</div>
              <div className="h-24 bg-gray-700 rounded flex items-center justify-center relative">
                <div className="text-gray-400 text-sm">Stoch RSI Chart</div>
                <div className="absolute bottom-2 right-2 text-xs text-gray-300">
                  76.29 77.51
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm font-medium mb-2">RSI 14</div>
              <div className="h-24 bg-gray-700 rounded flex items-center justify-center relative">
                <div className="text-gray-400 text-sm">RSI Chart</div>
                <div className="absolute bottom-2 right-2 text-xs text-gray-300">
                  70.37
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm font-medium mb-2">MACD 12 26 close 9 EMA EMA</div>
              <div className="h-24 bg-gray-700 rounded flex items-center justify-center relative">
                <div className="text-gray-400 text-sm">MACD Chart</div>
                <div className="absolute bottom-2 right-2 text-xs text-gray-300">
                  0.70 4.62 3.93
                </div>
                <div className="absolute top-2 right-2 text-xs text-gray-300">
                  -5.00 to 5.00
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm font-medium mb-2">MFI 14</div>
              <div className="h-24 bg-gray-700 rounded flex items-center justify-center relative">
                <div className="text-gray-400 text-sm">MFI Chart</div>
                <div className="absolute bottom-2 right-2 text-xs text-gray-300">
                  79.33
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="bg-gray-800 rounded-lg p-3 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    className={cn(
                      "px-3 py-1 text-xs font-medium rounded transition-colors",
                      timeframe === '1d'
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    )}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-300">
                  21:30:08 UTC+5:30
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-700 rounded">
                    %
                  </button>
                  <button className="px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-700 rounded">
                    log
                  </button>
                  <button className="px-2 py-1 text-xs text-gray-300 hover:text-white hover:bg-gray-700 rounded">
                    auto
                  </button>
                  <button className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
                    ⚙️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
