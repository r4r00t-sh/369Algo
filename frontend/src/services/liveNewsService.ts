import { EventEmitter } from 'events';
import { getWebSocketURL } from '../config/endpoints';

export interface LiveNewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage?: string;
  category: string;
  sentiment: string;
  relevance_score: number;
  isBreaking: boolean;
  priority: number;
}

export interface LiveNewsMessage {
  type: 'connection_status' | 'news_update' | 'breaking_news_response' | 'news_response' | 'category_news_response' | 'error' | 'pong' | 'initial_news' | 'news_refreshed';
  status?: string;
  message?: string;
  timestamp?: string;
  news?: LiveNewsArticle[];
  latest_news?: LiveNewsArticle[];
  breaking_news?: LiveNewsArticle[];
  count?: number;
  category?: string;
}

export interface LiveNewsConnectionStatus {
  isConnected: boolean;
  lastUpdate: string | null;
  error: string | null;
  connectionTime: Date | null;
}

class LiveNewsService extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private pingInterval: NodeJS.Timeout | null = null;
  private connectionStatus: LiveNewsConnectionStatus = {
    isConnected: false,
    lastUpdate: null,
    error: null,
    connectionTime: null
  };
  private newsCache: LiveNewsArticle[] = [];
  private breakingNewsCache: LiveNewsArticle[] = [];

  constructor() {
    super();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Handle connection events
    this.on('connected', () => {
      this.connectionStatus.isConnected = true;
      this.connectionStatus.connectionTime = new Date();
      this.connectionStatus.error = null;
      this.startPingInterval();
      this.emit('statusChanged', this.connectionStatus);
    });

    this.on('disconnected', () => {
      this.connectionStatus.isConnected = false;
      this.connectionStatus.error = 'Disconnected';
      this.stopPingInterval();
      this.emit('statusChanged', this.connectionStatus);
    });

    this.on('error', (error: string) => {
      this.connectionStatus.error = error;
      this.emit('statusChanged', this.connectionStatus);
    });
  }

  /**
   * Connect to live news WebSocket
   */
  async connect(token?: string): Promise<void> {
    try {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log('Already connected to live news service');
        return;
      }

      // Determine WebSocket URL - Use centralized configuration
      const wsUrl = getWebSocketURL('/api/live-news/ws/live-news', token);
      
      console.log('=== WebSocket Connection Debug ===');
      console.log('Window location:', window.location.href);
      console.log('Protocol:', window.location.protocol);
      console.log('Generated WebSocket URL:', wsUrl);
      console.log('Token provided:', !!token);
      console.log('================================');

      this.ws = new WebSocket(wsUrl);
      this.setupWebSocketHandlers();

    } catch (error) {
      console.error('Failed to connect to live news service:', error);
      this.emit('error', `Connection failed: ${error}`);
    }
  }

  /**
   * Disconnect from live news WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.stopPingInterval();
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupWebSocketHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('Connected to live news service');
      this.reconnectAttempts = 0;
      this.emit('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message: LiveNewsMessage = JSON.parse(event.data);
        this.handleWebSocketMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('Disconnected from live news service:', event.code, event.reason);
      this.emit('disconnected');
      
      // Attempt to reconnect if not intentionally closed
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.attemptReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', 'WebSocket connection error');
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(message: LiveNewsMessage): void {
    console.log('Received WebSocket message:', message.type, message);
    
    switch (message.type) {
      case 'connection_status':
        console.log('Live news connection status:', message);
        break;

      case 'initial_news':
        if (message.news) {
          console.log('Received initial news:', message.news.length, 'articles');
          this.newsCache = message.news;
          this.emit('newsUpdated', message.news);
        }
        break;

      case 'news_update':
        if (message.news) {
          console.log('Received news update:', message.news.length, 'articles');
          this.newsCache = message.news;
          this.emit('newsUpdated', message.news);
        }
        if (message.latest_news) {
          console.log('Received latest news:', message.latest_news.length, 'articles');
          this.newsCache = message.latest_news;
          this.emit('newsUpdated', message.latest_news);
        }
        if (message.breaking_news) {
          this.breakingNewsCache = message.breaking_news;
          this.emit('breakingNewsUpdated', message.breaking_news);
        }
        if (message.timestamp) {
          this.connectionStatus.lastUpdate = message.timestamp;
          this.emit('statusChanged', this.connectionStatus);
        }
        break;

      case 'breaking_news_response':
        if (message.news) {
          this.breakingNewsCache = message.news;
          this.emit('breakingNewsUpdated', message.news);
        }
        break;

      case 'news_response':
        if (message.news) {
          this.newsCache = message.news;
          this.emit('newsUpdated', message.news);
        }
        break;

      case 'category_news_response':
        if (message.news) {
          this.emit('categoryNewsUpdated', message.category, message.news);
        }
        break;

      case 'error':
        console.error('Live news service error:', message.message);
        this.emit('error', message.message || 'Unknown error');
        break;

      case 'pong':
        // Handle pong response for keep-alive
        break;

      case 'news_refreshed':
        console.log('Live news service news refreshed:', message.news);
        if (message.news) {
          this.newsCache = message.news;
          this.emit('newsUpdated', message.news);
        }
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }

  /**
   * Start ping interval to keep connection alive
   */
  private startPingInterval(): void {
    this.stopPingInterval();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stop ping interval
   */
  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Attempt to reconnect to the service
   */
  private async attemptReconnect(): Promise<void> {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.connect();
      } else {
        this.emit('error', 'Max reconnection attempts reached');
      }
    }, delay);
  }

  /**
   * Request latest news from the service
   */
  requestLatestNews(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'request_news' }));
    }
  }

  /**
   * Request manual news refresh from the service
   */
  requestNewsRefresh(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'refresh_news' }));
    }
  }

  /**
   * Request breaking news from the service
   */
  requestBreakingNews(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'request_breaking_news' }));
    }
  }

  /**
   * Request news by category
   */
  requestCategoryNews(category: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ 
        type: 'request_category_news', 
        category 
      }));
    }
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): LiveNewsConnectionStatus {
    return { ...this.connectionStatus };
  }

  /**
   * Get cached news
   */
  getCachedNews(): LiveNewsArticle[] {
    return [...this.newsCache];
  }

  /**
   * Get cached breaking news
   */
  getCachedBreakingNews(): LiveNewsArticle[] {
    return [...this.breakingNewsCache];
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionStatus.isConnected;
  }

  /**
   * Get news by category from cache
   */
  getNewsByCategory(category: string): LiveNewsArticle[] {
    return this.newsCache.filter(article => article.category === category);
  }

  /**
   * Get news by sentiment from cache
   */
  getNewsBySentiment(sentiment: string): LiveNewsArticle[] {
    return this.newsCache.filter(article => article.sentiment === sentiment);
  }

  /**
   * Get high priority news
   */
  getHighPriorityNews(): LiveNewsArticle[] {
    return this.newsCache.filter(article => article.priority >= 3);
  }

  /**
   * Search news in cache
   */
  searchNews(query: string): LiveNewsArticle[] {
    const lowerQuery = query.toLowerCase();
    return this.newsCache.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.description.toLowerCase().includes(lowerQuery) ||
      article.source.toLowerCase().includes(lowerQuery)
    );
  }
}

// Create singleton instance
const liveNewsService = new LiveNewsService();

export default liveNewsService;
