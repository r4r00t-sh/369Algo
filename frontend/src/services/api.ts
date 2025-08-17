import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me',
    logout: '/api/auth/logout',
  },
  trading: {
    brokerConnect: '/api/trading/broker/connect',
    brokerConnections: '/api/trading/broker/connections',
    brokerDisconnect: (id: number) => `/api/trading/broker/${id}/disconnect`,
    placeOrder: '/api/trading/order',
    orders: '/api/trading/orders',
    orderDetails: (id: number) => `/api/trading/orders/${id}`,
  },
  market: {
    quote: (symbol: string) => `/api/market/quote/${symbol}`,
    batchQuotes: '/api/market/quotes/batch',
    indices: '/api/market/indices',
    search: '/api/market/search',
    news: (symbol: string) => `/api/market/news/${symbol}`,
    trending: '/api/market/trending',
  },
  portfolio: {
    create: '/api/portfolio/create',
    list: '/api/portfolio/list',
    details: (id: number) => `/api/portfolio/${id}`,
    update: (id: number) => `/api/portfolio/${id}`,
    delete: (id: number) => `/api/portfolio/${id}`,
    addHolding: (id: number) => `/api/portfolio/${id}/holdings`,
    getHoldings: (id: number) => `/api/portfolio/${id}/holdings`,
    updateHolding: (portfolioId: number, holdingId: number) => 
      `/api/portfolio/${portfolioId}/holdings/${holdingId}`,
    removeHolding: (portfolioId: number, holdingId: number) => 
      `/api/portfolio/${portfolioId}/holdings/${holdingId}`,
  },
};

export default api;
