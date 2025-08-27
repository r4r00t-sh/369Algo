import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, MoreVertical, TrendingUp, TrendingDown, Wallet, Lock, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Set active tab based on current route
    if (location.pathname === '/') return 'Markets';
    if (location.pathname === '/home') return 'Home';
    if (location.pathname === '/screener') return 'Screeners';
    if (location.pathname === '/news') return 'News';
    if (location.pathname === '/watchlist') return 'Watchlist';
    if (location.pathname === '/options') return 'Options';
    if (location.pathname === '/portfolio') return 'Portfolio';
    if (location.pathname === '/orders') return 'Orders';
    return 'Markets';
  });

  const navTabs = [
    { name: 'Markets', path: '/' },
    { name: 'Home', path: '/home' },
    { name: 'Screeners', path: '/screener' },
    { name: 'News', path: '/news' },
    { name: 'Watchlist', path: '/watchlist' },
    { name: 'Options', path: '/options' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Orders', path: '/orders' }
  ];

  return (
    <>
      <nav className="bg-background border-b border-border h-20 flex items-center justify-between px-6 sticky top-0 z-50">
        {/* Left Section - Logo and Market Data */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <div className="bg-card border border-border rounded-lg px-4 py-2">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-medium">NIFTY50</span>
                <span className="text-base font-semibold text-foreground">24,712.05</span>
                <div className="flex items-center gap-1 text-sm font-medium text-destructive">
                  <TrendingDown className="w-4 h-4" />
                  -255.70 (-1.02%)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Navigation Tabs */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {navTabs.map((tab) => (
              <Button
                key={tab.name}
                variant={activeTab === tab.name ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all duration-200",
                  activeTab === tab.name 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => {
                  setActiveTab(tab.name);
                  navigate(tab.path);
                }}
              >
                {tab.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Right Section - User Controls */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="w-10 h-10">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-3 h-3 p-0 bg-destructive" />
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10">
            <Wallet className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-primary/90 transition-colors">
            KV
          </div>
          <Button variant="ghost" size="icon" className="w-10 h-10">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Secondary Bar */}
      <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Margin Available: ******</span>
          <Button size="sm" className="h-8 px-3">
            Add funds
          </Button>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>FIA</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-foreground">INDIAVIX 12.19</span>
          <div className="flex items-center gap-1 text-sm font-medium text-success">
            <TrendingUp className="w-4 h-4" />
            +0.43 (3.66%)
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
