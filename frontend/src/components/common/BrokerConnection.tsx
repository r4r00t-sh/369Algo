import React, { useState } from 'react';
import { FiZap, FiCheck, FiX, FiSettings } from 'react-icons/fi';

const BrokerConnection: React.FC = () => {
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const brokers = [
    {
      id: 'fyers',
      name: 'Fyers',
      description: 'Connect to Fyers trading platform for real-time market data and order execution',
      isConnected: true,
      features: ['Real-time Data', 'Order Execution', 'Portfolio Management']
    },
    {
      id: 'zerodha',
      name: 'Zerodha',
      description: 'Connect to Zerodha Kite platform for seamless trading experience',
      isConnected: false,
      features: ['Market Data', 'Trading', 'Analytics']
    },
    {
      id: 'upstox',
      name: 'Upstox',
      description: 'Connect to Upstox for low-cost trading and advanced charting',
      isConnected: false,
      features: ['Low-cost Trading', 'Advanced Charts', 'Research']
    }
  ];

  const handleConnect = async (brokerId: string) => {
    setSelectedBroker(brokerId);
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = (brokerId: string) => {
    // Handle disconnection logic
    console.log(`Disconnecting from ${brokerId}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-semibold text-foreground mb-6">Broker Connections</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brokers.map((broker) => (
          <div key={broker.id} className="bg-muted/30 border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-foreground">{broker.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    broker.isConnected 
                      ? 'text-green-500 bg-green-500/10' 
                      : 'text-gray-500 bg-gray-500/10'
                  }`}>
                                         {broker.isConnected ? <FiCheck size={12} /> : <FiX size={12} />}
                    {broker.isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <FiSettings className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" size={20} />
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{broker.description}</p>
            
            <div className="mb-4">
              <h5 className="text-sm font-medium text-foreground mb-2">Features:</h5>
              <div className="flex flex-wrap gap-1">
                {broker.features.map((feature, index) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              {broker.isConnected ? (
                <button
                  onClick={() => handleDisconnect(broker.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(broker.id)}
                  disabled={isConnecting && selectedBroker === broker.id}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isConnecting && selectedBroker === broker.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FiZap size={16} />
                      Connect
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrokerConnection;
