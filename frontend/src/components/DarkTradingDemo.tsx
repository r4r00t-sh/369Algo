import React, { useState } from 'react';
import { FiSearch, FiBell, FiEye, FiDownload, FiTrash2 } from 'react-icons/fi';

const DarkTradingDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen font-sans">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#333333] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Nifty 50</span>
              <span className="text-sm text-red-400 flex items-center gap-1">
                ▼ 24,129.25 (-12.70, -0.05%)
              </span>
            </div>
          </div>
          
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            ध
          </div>
          
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Markets</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Watchlist</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Portfolio</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Positions</a>
            <a href="#" className="text-green-500 bg-green-500/10 px-4 py-2 rounded-lg relative">
              Orders
              <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                3
              </span>
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Money</a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4 text-gray-400">
          <span>Live 10:08:22 am</span>
          <FiBell size={20} />
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-80 bg-[#1a1a1a] border-r border-[#333333] p-5">
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="ei"
              className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f] border border-[#333333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-white text-base font-semibold mb-4">First Watchlist</h3>
            <div className="flex gap-2 mb-4">
              <button className="px-4 py-2 bg-green-500 text-white text-xs rounded-lg">1</button>
              <button className="px-4 py-2 bg-[#333333] text-gray-400 text-xs rounded-lg hover:bg-[#444444]">2</button>
              <button className="px-4 py-2 bg-[#333333] text-gray-400 text-xs rounded-lg hover:bg-[#444444]">3</button>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'NIFTY Realty', price: '1,117.85', change: '▲ 16.80, 1.53%', isPositive: true },
              { name: 'Nifty Next 50', price: '72,135.15', change: '▼ 62.10, -0.09%', isPositive: false },
              { name: 'Fin Nifty', price: '23,479.45', change: '▼ 151.60, -0.64%', isPositive: false },
              { name: 'Nifty 50', price: '24,129.25', change: '▼ 12.70, -0.05%', isPositive: false },
              { name: 'Nifty Bank', price: '52,309.15', change: '▼ 265.60, -0.51%', isPositive: false },
              { name: 'Nifty Midcap Select', price: '12,294.00', change: '▲ 16.90, 0.14%', isPositive: true },
              { name: 'Nifty IT', price: '37,147.10', change: '▲ 277.90, 0.75%', isPositive: true },
              { name: 'India VIX', price: '13.73', change: '▼ 0.10, -0.72%', isPositive: false },
              { name: 'Sensex', price: '79,451.37', change: '▼ 24.82, -0.03%', isPositive: false },
            ].map((index, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-[#0f0f0f] rounded-lg border border-[#333333]">
                <span className="text-white text-sm font-medium">{index.name}</span>
                <div className="text-right">
                  <div className="text-white text-sm font-semibold">{index.price}</div>
                  <div className={`text-xs ${index.isPositive ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
                    {index.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-[#0f0f0f]">
          <div className="flex gap-2 mb-6 border-b border-[#333333]">
            {['Today', 'Flash', 'Baskets', 'Forever', 'Draft', 'SIPs', 'Webhooks'].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 text-sm font-medium cursor-pointer transition-colors ${
                  tab === 'Today' 
                    ? 'text-green-500 border-b-2 border-green-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Orders Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-semibold">Pending Orders</h2>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors">
                Cancel Selected Orders
              </button>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] overflow-hidden">
              <div className="grid grid-cols-7 gap-4 p-4 bg-[#333333] text-white font-semibold text-sm">
                <div>Time</div>
                <div>Name</div>
                <div>Order</div>
                <div>Qty</div>
                <div>Price</div>
                <div>LTP</div>
                <div>Status</div>
              </div>
              
              {[
                { time: '10:06:54', name: 'FINNIFTY 02 JUL 23500 CALL', order: 'Intraday', qty: '0/400', price: '50.00', ltp: '51.70' },
                { time: '10:06:53', name: 'FINNIFTY 02 JUL 23500 CALL', order: 'Intraday', qty: '0/1,800', price: '50.00', ltp: '51.70' },
                { time: '10:06:53', name: 'FINNIFTY 02 JUL 23500 CALL', order: 'Intraday', qty: '0/1,800', price: '50.00', ltp: '51.70' },
              ].map((order, i) => (
                <div key={i} className="grid grid-cols-7 gap-4 p-4 border-b border-[#333333] items-center hover:bg-[#2a2a2a] transition-colors">
                  <div className="text-white text-sm">{order.time}</div>
                  <div className="text-white text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">B</div>
                      {order.name}
                      <div className="flex gap-1">
                        <span className="bg-[#333333] text-gray-400 px-2 py-1 rounded text-xs">W NSE</span>
                        <span className="bg-[#333333] text-gray-400 px-2 py-1 rounded text-xs">Iceberg</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-white text-sm">{order.order}</div>
                  <div className="text-white text-sm">{order.qty}</div>
                  <div className="text-white text-sm">{order.price}</div>
                  <div className="text-white text-sm">{order.ltp}</div>
                  <div className="text-white text-sm"></div>
                </div>
              ))}
            </div>
            
            <div className="text-right mt-4">
              <div className="text-green-500 font-semibold text-base">Total: ₹2,00,000.00</div>
            </div>
          </div>

          {/* Executed Orders */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-semibold">Executed</h2>
              <div className="flex gap-4 items-center">
                <button className="px-6 py-3 text-sm font-medium text-green-500 border-b-2 border-green-500">All</button>
                <button className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-white">Cancel (7)</button>
                <a href="#" className="text-green-500 text-sm hover:underline flex items-center gap-1">
                  <FiDownload size={16} />
                  Download as CSV
                </a>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] overflow-hidden">
              <div className="grid grid-cols-7 gap-4 p-4 bg-[#333333] text-white font-semibold text-sm">
                <div>Time</div>
                <div>Name</div>
                <div>Order</div>
                <div>Qty</div>
                <div>Price</div>
                <div>LTP</div>
                <div>Status</div>
              </div>
              
              {[
                { time: '10:06:54', name: 'FINNIFTY 02 JUL 23500 PUT', order: 'Intraday', qty: '0/1,800', price: '50.00', ltp: '93.50', status: 'Cancel' },
                { time: '10:06:53', name: 'FINNIFTY 02 JUL 23500 PUT', order: 'Intraday', qty: '0/400', price: '40.00', ltp: '93.50', status: 'Cancel' },
                { time: '10:06:53', name: 'FINNIFTY 02 JUL 23500 PUT', order: 'Intraday', qty: '0/600', price: '50.00', ltp: '93.50', status: 'Cancel' },
              ].map((order, i) => (
                <div key={i} className="grid grid-cols-7 gap-4 p-4 border-b border-[#333333] items-center hover:bg-[#2a2a2a] transition-colors">
                  <div className="text-white text-sm">{order.time}</div>
                  <div className="text-white text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">B</div>
                      {order.name}
                      <div className="flex gap-1">
                        <span className="bg-[#333333] text-gray-400 px-2 py-1 rounded text-xs">W NSE</span>
                        <span className="bg-[#333333] text-gray-400 px-2 py-1 rounded text-xs">Iceberg</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-white text-sm">{order.order}</div>
                  <div className="text-white text-sm">{order.qty}</div>
                  <div className="text-white text-sm">{order.price}</div>
                  <div className="text-white text-sm">{order.ltp}</div>
                  <div className="text-white text-sm">{order.status}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DarkTradingDemo;
