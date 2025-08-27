import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faPlay,
  faPause
} from '@fortawesome/free-solid-svg-icons';

interface Strategy {
  id: number;
  name: string;
  description: string;
  type: 'momentum' | 'mean-reversion' | 'arbitrage' | 'trend-following';
  status: 'active' | 'paused' | 'draft';
  performance: {
    totalReturn: number;
    dailyReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  lastExecuted: string;
  nextExecution: string;
}

const Strategies: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: 1,
      name: 'NIFTY Momentum Strategy',
      description: 'Buy stocks that are showing strong upward momentum based on technical indicators',
      type: 'momentum',
      status: 'active',
      performance: {
        totalReturn: 15.8,
        dailyReturn: 0.45,
        sharpeRatio: 1.2,
        maxDrawdown: -8.5
      },
      lastExecuted: '2 hours ago',
      nextExecution: 'Next market open'
    },
    {
      id: 2,
      name: 'Bank Nifty Mean Reversion',
      description: 'Trade bank stocks when they deviate significantly from their moving averages',
      type: 'mean-reversion',
      status: 'active',
      performance: {
        totalReturn: 12.3,
        dailyReturn: 0.32,
        sharpeRatio: 0.95,
        maxDrawdown: -12.1
      },
      lastExecuted: '1 hour ago',
      nextExecution: 'Next market open'
    },
    {
      id: 3,
      name: 'Options Calendar Spread',
      description: 'Sell near-term options and buy far-term options to profit from time decay',
      type: 'arbitrage',
      status: 'paused',
      performance: {
        totalReturn: 8.7,
        dailyReturn: 0.18,
        sharpeRatio: 0.78,
        maxDrawdown: -15.3
      },
      lastExecuted: '1 day ago',
      nextExecution: 'Paused'
    },
    {
      id: 4,
      name: 'Trend Following with Stop Loss',
      description: 'Follow established trends with strict stop-loss management',
      type: 'trend-following',
      status: 'draft',
      performance: {
        totalReturn: 0,
        dailyReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0
      },
      lastExecuted: 'Never',
      nextExecution: 'Not scheduled'
    }
  ]);

  const [selectedType, setSelectedType] = useState('all');

  const strategyTypes = [
    { id: 'all', name: 'All Strategies', count: strategies.length },
    { id: 'momentum', name: 'Momentum', count: strategies.filter(s => s.type === 'momentum').length },
    { id: 'mean-reversion', name: 'Mean Reversion', count: strategies.filter(s => s.type === 'mean-reversion').length },
    { id: 'arbitrage', name: 'Arbitrage', count: strategies.filter(s => s.type === 'arbitrage').length },
    { id: 'trend-following', name: 'Trend Following', count: strategies.filter(s => s.type === 'trend-following').length }
  ];

  const filteredStrategies = selectedType === 'all' 
    ? strategies 
    : strategies.filter(strategy => strategy.type === selectedType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'paused': return 'text-yellow-500 bg-yellow-500/10';
      case 'draft': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'momentum': return 'text-blue-500 bg-blue-500/10';
      case 'mean-reversion': return 'text-purple-500 bg-purple-500/10';
      case 'arbitrage': return 'text-orange-500 bg-orange-500/10';
      case 'trend-following': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const toggleStrategyStatus = (id: number) => {
    setStrategies(prev => prev.map(strategy => {
      if (strategy.id === id) {
        if (strategy.status === 'active') {
          return { ...strategy, status: 'paused' as const };
        } else if (strategy.status === 'paused') {
          return { ...strategy, status: 'active' as const };
        }
      }
      return strategy;
    }));
  };

  const deleteStrategy = (id: number) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== id));
  };

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Trading Strategies</h1>
          <p className="text-muted-foreground">Automate your trading with algorithmic strategies</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Create Strategy
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
            Import Strategy
          </button>
        </div>
      </div>

      {/* Strategy Type Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {strategyTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedType === type.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {type.name} ({type.count})
          </button>
        ))}
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStrategies.map((strategy) => (
          <div key={strategy.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{strategy.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(strategy.status)}`}>
                    {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
                  </span>
                </div>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(strategy.type)}`}>
                  {strategy.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div className="flex gap-2">
                <button
          onClick={() => toggleStrategyStatus(strategy.id)}
                  className={`p-2 rounded transition-colors ${
                    strategy.status === 'active' 
                      ? 'text-yellow-500 hover:bg-yellow-500/10' 
                      : 'text-green-500 hover:bg-green-500/10'
                  }`}
                  title={strategy.status === 'active' ? 'Pause Strategy' : 'Activate Strategy'}
                >
                  {strategy.status === 'active' ? <FontAwesomeIcon icon={faPause} size="sm" /> : <FontAwesomeIcon icon={faPlay} size="sm" />}
                </button>
                <button className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Edit Strategy">
                  <FontAwesomeIcon icon={faEdit} size="sm" />
                </button>
                <button 
                  onClick={() => deleteStrategy(strategy.id)}
                  className="p-2 text-muted-foreground hover:text-red-500 transition-colors" 
                  title="Delete Strategy"
                >
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </button>
    </div>
      </div>
      
            <p className="text-muted-foreground text-sm mb-4">{strategy.description}</p>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Return</p>
                <p className={`text-lg font-semibold ${strategy.performance.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {strategy.performance.totalReturn >= 0 ? '+' : ''}{strategy.performance.totalReturn}%
                </p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Daily Return</p>
                <p className={`text-sm font-medium ${strategy.performance.dailyReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {strategy.performance.dailyReturn >= 0 ? '+' : ''}{strategy.performance.dailyReturn}%
        </p>
      </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Sharpe Ratio</p>
                <p className="text-sm font-medium text-foreground">{strategy.performance.sharpeRatio}</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Max Drawdown</p>
                <p className="text-sm font-medium text-red-500">{strategy.performance.maxDrawdown}%</p>
              </div>
    </div>

            {/* Execution Info */}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Last: {strategy.lastExecuted}</span>
              <span>Next: {strategy.nextExecution}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredStrategies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No strategies found for the selected type.</p>
        </div>
          )}
        </div>
  );
};

export default Strategies;
