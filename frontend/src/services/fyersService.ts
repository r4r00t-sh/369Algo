// Fyers API Connect Service
// This service handles integration with the Fyers API Connect library

declare global {
  interface Window {
    Fyers: any;
  }
}

export interface FyersOrder {
  symbol: string;
  quantity: number;
  order_type: 'MARKET' | 'LIMIT';
  transaction_type: 'BUY' | 'SELL';
  product: 'INTRADAY' | 'CNC' | 'MARGIN';
  disclosed_quantity: number;
  price?: number;
}

export interface FyersBasketOrder {
  orders: FyersOrder[];
}

export interface FyersStatus {
  isReady: boolean;
  isConnected: boolean;
  error?: string;
}

class FyersService {
  private fyers: any = null;
  private apiKey: string = '';
  private isInitialized: boolean = false;

  // Initialize Fyers API Connect
  async initialize(apiKey: string): Promise<FyersStatus> {
    try {
      this.apiKey = apiKey;
      
      // Check if Fyers library is loaded
      if (typeof window === 'undefined' || !window.Fyers) {
        throw new Error('Fyers API Connect library not loaded');
      }

      // Wait for Fyers to be ready
      await this.waitForFyersReady();
      
      // Initialize Fyers instance
      this.fyers = new window.Fyers(this.apiKey);
      this.isInitialized = true;

      return {
        isReady: true,
        isConnected: true
      };
    } catch (error) {
      return {
        isReady: false,
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Wait for Fyers library to be ready
  private waitForFyersReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      const maxAttempts = 50; // 5 seconds max wait
      let attempts = 0;

      const checkReady = () => {
        attempts++;
        
        if (window.Fyers && typeof window.Fyers === 'function') {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Fyers library failed to load within timeout'));
        } else {
          setTimeout(checkReady, 100);
        }
      };

      checkReady();
    });
  }

  // Check if service is ready
  isReady(): boolean {
    return this.isInitialized && this.fyers !== null;
  }

  // Place a single order
  async placeOrder(order: FyersOrder): Promise<{ success: boolean; orderId?: string; error?: string }> {
    if (!this.isReady()) {
      return { success: false, error: 'Fyers service not initialized' };
    }

    try {
      // Add order to Fyers
      this.fyers.add({
        symbol: order.symbol,
        quantity: order.quantity,
        order_type: order.order_type,
        transaction_type: order.transaction_type,
        product: order.product,
        disclosed_quantity: order.disclosed_quantity,
        price: order.price || 0
      });

      // Simulate order placement (replace with actual Fyers API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderId = `FY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        orderId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to place order'
      };
    }
  }

  // Place basket order
  async placeBasketOrder(orders: FyersOrder[]): Promise<{ success: boolean; orderIds?: string[]; error?: string }> {
    if (!this.isReady()) {
      return { success: false, error: 'Fyers service not initialized' };
    }

    if (orders.length === 0) {
      return { success: false, error: 'No orders in basket' };
    }

    try {
      // Clear any existing orders
      this.fyers.clear();

      // Add all orders to Fyers
      orders.forEach(order => {
        this.fyers.add({
          symbol: order.symbol,
          quantity: order.quantity,
          order_type: order.order_type,
          transaction_type: order.transaction_type,
          product: order.product,
          disclosed_quantity: order.disclosed_quantity,
          price: order.price || 0
        });
      });

      // Simulate basket order placement (replace with actual Fyers API call)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const orderIds = orders.map((_, index) => 
        `FY_BASKET_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`
      );
      
      return {
        success: true,
        orderIds
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to place basket order'
      };
    }
  }

  // Link orders to a custom button
  linkToButton(buttonSelector: string): boolean {
    if (!this.isReady()) {
      console.error('Fyers service not initialized');
      return false;
    }

    try {
      this.fyers.link(buttonSelector);
      return true;
    } catch (error) {
      console.error('Failed to link orders to button:', error);
      return false;
    }
  }

  // Clear all orders
  clearOrders(): boolean {
    if (!this.isReady()) {
      return false;
    }

    try {
      this.fyers.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear orders:', error);
      return false;
    }
  }

  // Get current status
  getStatus(): FyersStatus {
    return {
      isReady: this.isReady(),
      isConnected: this.isInitialized,
      error: this.isInitialized ? undefined : 'Service not initialized'
    };
  }

  // Validate order data
  validateOrder(order: FyersOrder): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!order.symbol || order.symbol.trim() === '') {
      errors.push('Symbol is required');
    }

    if (!order.quantity || order.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }

    if (order.order_type === 'LIMIT' && (!order.price || order.price <= 0)) {
      errors.push('Price is required for limit orders');
    }

    if (order.disclosed_quantity < 0) {
      errors.push('Disclosed quantity cannot be negative');
    }

    if (order.disclosed_quantity > order.quantity) {
      errors.push('Disclosed quantity cannot exceed total quantity');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get available products
  getAvailableProducts(): string[] {
    return ['INTRADAY', 'CNC', 'MARGIN'];
  }

  // Get available order types
  getAvailableOrderTypes(): string[] {
    return ['MARKET', 'LIMIT'];
  }

  // Get available transaction types
  getAvailableTransactionTypes(): string[] {
    return ['BUY', 'SELL'];
  }

  // Format symbol for Fyers API
  formatSymbol(symbol: string): string {
    // Ensure symbol is in correct format (e.g., NSE:RELIANCE-EQ)
    if (!symbol.includes(':')) {
      // Default to NSE if no exchange specified
      return `NSE:${symbol}-EQ`;
    }
    return symbol;
  }

  // Parse symbol from Fyers format
  parseSymbol(fyersSymbol: string): { exchange: string; symbol: string; instrument: string } {
    const parts = fyersSymbol.split(':');
    if (parts.length === 2) {
      const [exchange, rest] = parts;
      const symbolParts = rest.split('-');
      return {
        exchange,
        symbol: symbolParts[0],
        instrument: symbolParts[1] || 'EQ'
      };
    }
    
    return {
      exchange: 'NSE',
      symbol: fyersSymbol,
      instrument: 'EQ'
    };
  }
}

// Export singleton instance
export const fyersService = new FyersService();

// Export the class for testing purposes
export { FyersService };
