import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';

const FyersOrderPlacement: React.FC = () => {
  const [orderType, setOrderType] = useState<'buy' | 'sell' | 'basket'>('buy');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [basketOrders, setBasketOrders] = useState<Array<{ symbol: string; quantity: string; price: string }>>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const addToBasket = () => {
    if (symbol && quantity && price) {
      setBasketOrders([...basketOrders, { symbol, quantity, price }]);
      setSymbol('');
      setQuantity('');
      setPrice('');
    }
  };

  const removeFromBasket = (index: number) => {
    setBasketOrders(basketOrders.filter((_, i) => i !== index));
  };

  const placeOrder = () => {
    if (orderType === 'basket' && basketOrders.length === 0) {
      setStatus({ type: 'error', message: 'Please add orders to basket first' });
      return;
    }

    if (orderType !== 'basket' && (!symbol || !quantity || !price)) {
      setStatus({ type: 'error', message: 'Please fill all fields' });
      return;
    }

    setStatus({ type: 'success', message: `${orderType.toUpperCase()} order placed successfully!` });
    
    // Reset form
    if (orderType !== 'basket') {
      setSymbol('');
      setQuantity('');
      setPrice('');
    } else {
      setBasketOrders([]);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-semibold text-foreground mb-6">Fyers Order Placement</h3>
      
      {/* Order Type Selection */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setOrderType('buy')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            orderType === 'buy' 
              ? 'bg-green-600 text-white' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setOrderType('sell')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            orderType === 'sell' 
              ? 'bg-red-600 text-white' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Sell
        </button>
        <button
          onClick={() => setOrderType('basket')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            orderType === 'basket' 
              ? 'bg-blue-600 text-white' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Basket
        </button>
      </div>

      {/* Order Form */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g., RELIANCE"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="100"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
        </div>

        {orderType === 'basket' && (
          <div className="flex gap-2">
            <button
              onClick={addToBasket}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <FiPlus size={16} />
              Add to Basket
            </button>
          </div>
        )}
      </div>

      {/* Basket Orders */}
      {orderType === 'basket' && basketOrders.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-foreground mb-4">Basket Orders</h4>
          <div className="space-y-2">
            {basketOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex gap-4">
                  <span className="font-medium">{order.symbol}</span>
                  <span className="text-muted-foreground">Qty: {order.quantity}</span>
                  <span className="text-muted-foreground">Price: ₹{order.price}</span>
                </div>
                <button
                  onClick={() => removeFromBasket(index)}
                  className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Place Order Button */}
      <div className="flex gap-3">
        <button
          onClick={placeOrder}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            orderType === 'buy' 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : orderType === 'sell'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <FiCheck size={16} />
          Place {orderType.toUpperCase()} Order
        </button>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`mt-4 p-3 rounded-lg ${
          status.type === 'success' ? 'bg-green-500/10 text-green-600' :
          status.type === 'error' ? 'bg-red-500/10 text-red-600' :
          'bg-blue-500/10 text-blue-600'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
};

export default FyersOrderPlacement;
