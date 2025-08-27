import React, { useEffect, useRef } from 'react';

const FyersCustomButtons: React.FC = () => {
  const [status, setStatus] = React.useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isFyersReady, setIsFyersReady] = React.useState(false);
  const buyButtonRef = useRef<HTMLButtonElement>(null);
  const sellButtonRef = useRef<HTMLButtonElement>(null);
  const basketButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkFyers = () => {
      if (typeof window !== 'undefined' && window.Fyers) {
        setIsFyersReady(true);
        setStatus({ type: 'success', message: 'Fyers API Connect is ready! Custom buttons are functional.' });
        initializeCustomButtons();
      } else {
        setIsFyersReady(false);
        setStatus({ type: 'error', message: 'Fyers API Connect not loaded. Please check your internet connection.' });
      }
    };

    checkFyers();
    const timer = setTimeout(checkFyers, 2000);
    return () => clearTimeout(timer);
  }, []);

  const initializeCustomButtons = () => {
    if (!window.Fyers) return;

    try {
      window.Fyers.ready(() => {
        if (buyButtonRef.current) {
          const fyers = new window.Fyers("YOUR_API_KEY");
          fyers.add({
            "symbol": "NSE:RELIANCE-EQ",
            "quantity": 4,
            "order_type": "LIMIT",
            "transaction_type": "BUY",
            "product": "INTRADAY",
            "disclosed_quantity": 0,
            "price": 200
          });
          fyers.link("#buy-button");
        }

        if (sellButtonRef.current) {
          const fyers = new window.Fyers("YOUR_API_KEY");
          fyers.add({
            "symbol": "NSE:RELIANCE-EQ",
            "quantity": 1,
            "order_type": "LIMIT",
            "transaction_type": "SELL",
            "product": "INTRADAY",
            "disclosed_quantity": 0,
            "price": 200
          });
          fyers.link("#sell-button");
        }

        if (basketButtonRef.current) {
          const fyers = new window.Fyers("YOUR_API_KEY");
          fyers.add({
            "symbol": "NSE:RELIANCE-EQ",
            "quantity": 1,
            "order_type": "LIMIT",
            "transaction_type": "BUY",
            "product": "INTRADAY",
            "disclosed_quantity": 0,
            "price": 200
          });
          fyers.add({
            "symbol": "NSE:SBIN-EQ",
            "quantity": 1,
            "order_type": "LIMIT",
            "transaction_type": "SELL",
            "product": "INTRADAY",
            "disclosed_quantity": 0,
            "price": 200
          });
          fyers.link("#basket-button");
        }
      });
    } catch (error) {
      console.error('Failed to initialize Fyers custom buttons:', error);
      setStatus({ type: 'error', message: 'Failed to initialize custom buttons' });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg m-5">
      <h3 className="text-gray-800 text-lg font-semibold mb-5">Fyers API Connect - Custom Buttons</h3>
      <p className="text-gray-600 mb-5 text-sm leading-relaxed">
        These are the exact custom buttons as described in the Fyers API Connect documentation. 
        They demonstrate Buy Order, Sell Order, and Basket Order functionality.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <button
          ref={buyButtonRef}
          id="buy-button"
          className="px-6 py-4 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 min-h-[60px] flex items-center justify-center bg-green-500 text-white hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0"
          onClick={() => setStatus({ type: 'info', message: 'Buy order button clicked! Check Fyers console for order details.' })}
        >
          Buy 4 RELIANCE
        </button>

        <button
          ref={sellButtonRef}
          id="sell-button"
          className="px-6 py-4 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 min-h-[60px] flex items-center justify-center bg-red-500 text-white hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0"
          onClick={() => setStatus({ type: 'info', message: 'Sell order button clicked! Check Fyers console for order details.' })}
        >
          Sell 1 RELIANCE
        </button>

        <button
          ref={basketButtonRef}
          id="basket-button"
          className="px-6 py-4 border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 min-h-[60px] flex items-center justify-center bg-blue-500 text-white hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0"
          onClick={() => setStatus({ type: 'info', message: 'Basket order button clicked! Check Fyers console for order details.' })}
        >
          Trade 2 Stocks
        </button>
      </div>

      <h4 className="text-gray-700 mb-3 text-sm font-semibold">Implementation Code:</h4>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 font-mono text-sm leading-relaxed overflow-x-auto">
        {`// Buy Order Button
<button id="buy-button">Buy 4 RELIANCE</button>
<script>
Fyers.ready(function(){
  var fyers = new Fyers("YOUR_API_KEY")
  fyers.add({
    "symbol": "NSE:RELIANCE-EQ",
    "quantity": 4,
    "order_type": "LIMIT",
    "transaction_type": "BUY",
    "product":"INTRADAY",
    "disclosed_quantity":0,
    "price":200
  });
  fyers.link("#buy-button");
})
</script>

// Sell Order Button
<button id="sell-button">Sell 1 RELIANCE</button>
<script>
Fyers.ready(function(){
  var fyers = new Fyers("YOUR_API_KEY")
  fyers.add({
    "symbol": "NSE:RELIANCE-EQ",
    "quantity": 1,
    "order_type": "LIMIT",
    "transaction_type": "SELL",
    "product":"INTRADAY",
    "disclosed_quantity":0,
    "price":200
  });
  fyers.link("#sell-button");
})
</script>

// Basket Order Button
<button id="basket-button">Trade 2 Stocks</button>
<script>
Fyers.ready(function(){
  var fyers = new Fyers("YOUR_API_KEY")
  fyers.add({
    "symbol": "NSE:RELIANCE-EQ",
    "quantity": 1,
    "order_type": "LIMIT",
    "transaction_type": "BUY",
    "product":"INTRADAY",
    "disclosed_quantity":0,
    "price":200
  });
  fyers.add({
    "symbol": "NSE:SBIN-EQ",
    "quantity": 1,
    "order_type": "LIMIT",
    "transaction_type": "SELL",
    "product":"INTRADAY",
    "disclosed_quantity":0,
    "price":200
  });
  fyers.link("#basket-button");
})
</script>`}
      </div>

      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        <strong>Note:</strong> Replace "YOUR_API_KEY" with your actual Fyers API key. 
        These buttons are linked to the Fyers API Connect library and will execute the specified orders when clicked.
      </p>

      {status && (
        <div className={`p-3 rounded-lg mt-4 text-sm ${
          status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          status.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
          'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {status.message}
        </div>
      )}

      <div className={`p-3 rounded-lg mt-4 text-sm ${
        isFyersReady ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        Fyers API Connect: {isFyersReady ? 'Ready - Custom buttons are functional' : 'Not Available'}
      </div>
    </div>
  );
};

export default FyersCustomButtons;
