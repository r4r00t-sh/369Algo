// Configuration file for all API and WebSocket endpoints
// This ensures all connections use localhost for development

export const config = {
  // API Configuration
  api: {
    baseURL: 'http://localhost:8000',
    timeout: 10000,
  },
  
  // WebSocket Configuration
  websocket: {
    host: 'localhost:8000',
    protocol: 'ws', // Will be converted to wss if on HTTPS
  },
  
  // Live News Configuration
  liveNews: {
    wsPath: '/api/live-news/ws/live-news',
  },
  
  // Trading Configuration
  trading: {
    wsPath: '/api/trading/ws',
  },
  
  // Development Settings
  development: {
    forceLocalhost: true, // Always use localhost in development
    enableLogging: true,
  }
};

// Helper function to get WebSocket URL
export const getWebSocketURL = (path: string, token?: string): string => {
  // Safety check: Always use localhost in development
  if (config.development.forceLocalhost) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = config.websocket.host;
    const wsPath = token ? `${path}/${token}` : path;
    const wsUrl = `${protocol}//${host}${wsPath}`;
    
    console.log('=== WebSocket URL Generation ===');
    console.log('Forced localhost mode enabled');
    console.log('Generated URL:', wsUrl);
    console.log('===============================');
    
    return wsUrl;
  }
  
  // Fallback (should not be used in development)
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = config.websocket.host;
  const wsPath = token ? `${path}/${token}` : path;
  return `${protocol}//${host}${wsPath}`;
};

// Helper function to get API URL
export const getAPIURL = (endpoint: string): string => {
  return `${config.api.baseURL}${endpoint}`;
};

export default config;
