import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSidebar } from '../../contexts/SidebarContext';

const Sidebar: React.FC = () => {
  const [activeWatchlistTab, setActiveWatchlistTab] = useState('My watchlist');
  const { isExpanded, setIsExpanded } = useSidebar();
   
  const watchlistTabs = ['Watchlist', 'My watchlist', 'Predefined', 'Smart watchlist'];
   
  const watchlistData = [
    { 
      name: 'NATURALGAS FUT MCX', 
      expiry: '25 Sep 2025',
      price: '252.8', 
      change: '+8.0', 
      changePercent: '+3.27%',
      isPositive: true,
      isSelected: true
    },
    { 
      name: 'NATURALGAS FUT MCX', 
      expiry: '28 Oct 2025',
      price: '282.7', 
      change: '+7.6', 
      changePercent: '+2.76%',
      isPositive: true,
      isSelected: false
    },
    { 
      name: 'CRUDEOILM 5300 PE MCX', 
      expiry: '17 Sep 2025',
      price: '58.80', 
      change: '-8.00', 
      changePercent: '-11.98%',
      isPositive: false,
      isSelected: false
    },
    { 
      name: 'NIFTY 50 NSE', 
      expiry: '25 Sep 2025',
      price: '24,712.05', 
      change: '-255.70', 
      changePercent: '-1.02%',
      isPositive: false,
      isSelected: false
    },
    { 
      name: 'BANKNIFTY NSE', 
      expiry: '25 Sep 2025',
      price: '52,345.67', 
      change: '-612.45', 
      changePercent: '-1.15%',
      isPositive: false,
      isSelected: false
    },
    { 
      name: 'SENSEX BSE', 
      expiry: '25 Sep 2025',
      price: '81,210.45', 
      change: '-789.23', 
      changePercent: '-0.95%',
      isPositive: false,
      isSelected: false
    }
  ];

    return (
    <aside className={cn(
      "bg-background border-r border-border h-screen fixed left-0 top-0 z-40 overflow-y-auto transition-all duration-300",
      isExpanded ? "w-[500px]" : "w-16"
    )}>
      {/* Hamburger Menu Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 bg-background border border-border hover:bg-muted"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

              <div className={cn(
          "transition-all duration-300 ease-in-out",
          isExpanded ? "p-8" : "p-2"
        )}>
        {/* Watchlist Title */}
        <div className={cn(
          "transition-all duration-300",
          isExpanded ? "mb-8" : "mb-4"
        )}>
          <h2 className={cn(
            "font-bold text-foreground transition-all duration-300",
            isExpanded ? "text-2xl" : "text-lg"
          )}>
            {isExpanded ? "Watchlist" : "W"}
          </h2>
        </div>
 
                 {/* Watchlist Tabs */}
        <div className={cn(
          "bg-card border border-border rounded-xl shadow-sm transition-all duration-300",
          isExpanded ? "p-6" : "p-2"
        )}>
          <div className={cn(
            "transition-all duration-300",
            isExpanded ? "mb-6" : "mb-2"
          )}>
            <div className={cn(
              "transition-all duration-300",
              isExpanded ? "flex gap-2 mb-4" : "hidden"
            )}>
              {watchlistTabs.map((tab) => (
                <Button
                  key={tab}
                  variant={activeWatchlistTab === tab ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 px-3 text-xs font-medium",
                    activeWatchlistTab === tab 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setActiveWatchlistTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
          
                               {/* Watchlist Table */}
          <div className={cn(
            "transition-all duration-300",
            isExpanded ? "max-h-96 overflow-y-auto" : "hidden"
          )}>
            {watchlistData.map((item, index) => (
              <div key={index} className={cn(
                "p-3 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors rounded cursor-pointer",
                item.isSelected ? "bg-primary/10 border-primary/20" : ""
              )}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.expiry}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">{item.price}</div>
                    <div className={cn(
                      "text-xs font-medium",
                      item.isPositive ? "text-green-600" : "text-red-600"
                    )}>
                      {item.change} ({item.changePercent})
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
