import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiClock,
  FiCheck,
  FiX
} from 'react-icons/fi';
import TradingViewChart from '../components/common/TradingViewChart';

const TradingContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const TradingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HeaderLeft = styled.div``;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const TradingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const TradingCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const StockSearch = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const StockInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const StockDetails = styled.div``;

const StockSymbol = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const StockName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StockPrice = styled.div`
  text-align: right;
`;

const PriceValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const PriceChange = styled.div<{ isPositive: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme, isPositive }) => isPositive ? theme.colors.positive : theme.colors.negative};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const OrderForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const BuyButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.positive};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.success};
    transform: translateY(-1px);
  }
`;

const SellButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.negative};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.error};
    transform: translateY(-1px);
  }
`;

const OrderBook = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const OrderBookRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  &:last-child {
    border-bottom: none;
  }
`;

const OrderBookHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.surfaceBorder};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TradeHistory = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const TradeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TradeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.surfaceBorder};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  background: ${({ theme, status }) => {
    if (status === 'completed') return theme.colors.positive + '20';
    if (status === 'pending') return theme.colors.warning + '20';
    if (status === 'cancelled') return theme.colors.error + '20';
    return theme.colors.surfaceBorder;
  }};
  color: ${({ theme, status }) => {
    if (status === 'completed') return theme.colors.positive;
    if (status === 'pending') return theme.colors.warning;
    if (status === 'cancelled') return theme.colors.error;
    return theme.colors.textSecondary;
  }};
`;

// Sample data
const orderBookData = {
  buy: [
    { price: 2450.50, quantity: 100, total: 245050 },
    { price: 2450.25, quantity: 150, total: 367537.5 },
    { price: 2450.00, quantity: 200, total: 490000 },
    { price: 2449.75, quantity: 120, total: 293970 },
    { price: 2449.50, quantity: 180, total: 440910 },
  ],
  sell: [
    { price: 2451.00, quantity: 80, total: 196080 },
    { price: 2451.25, quantity: 120, total: 294150 },
    { price: 2451.50, quantity: 160, total: 392240 },
    { price: 2451.75, quantity: 90, total: 220657.5 },
    { price: 2452.00, quantity: 140, total: 343280 },
  ]
};

const tradeHistoryData = [
  { time: '14:30:25', price: 2450.50, quantity: 50, type: 'buy', status: 'completed' },
  { time: '14:28:15', price: 2450.25, quantity: 100, type: 'sell', status: 'completed' },
  { time: '14:25:42', price: 2450.75, quantity: 75, type: 'buy', status: 'completed' },
  { time: '14:22:18', price: 2451.00, quantity: 120, type: 'sell', status: 'pending' },
  { time: '14:20:05', price: 2449.50, quantity: 200, type: 'buy', status: 'cancelled' },
];

const Trading: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState('RELIANCE');
  const [orderType, setOrderType] = useState('market');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const [brokerConnections, setBrokerConnections] = useState<any[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<number | null>(null);

  // Fetch broker connections on component mount
  useEffect(() => {
    fetchBrokerConnections();
  }, []);

  const fetchBrokerConnections = async () => {
    try {
      const response = await fetch('/api/broker/connections', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const connections = await response.json();
        setBrokerConnections(connections);
        if (connections.length > 0) {
          setSelectedBroker(connections[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch broker connections:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent, action: 'buy' | 'sell') => {
    e.preventDefault();
    
    if (!selectedBroker) {
      alert('Please connect a broker account first in Settings');
      return;
    }

    if (!quantity || (orderType !== 'market' && !price)) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const orderData = {
        symbol: selectedStock,
        side: action,
        quantity: parseInt(quantity),
        price: orderType === 'market' ? undefined : parseFloat(price),
        order_type: orderType
      };

      const response = await fetch(`/api/broker/${selectedBroker}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to place order');
      }

      const result = await response.json();
      alert(`${action.toUpperCase()} order placed successfully! Order ID: ${result.order_id}`);
      
      // Reset form
      setQuantity('');
      setPrice('');
      
    } catch (error: any) {
      console.error('Order placement failed:', error);
      alert(`Failed to place order: ${error.message || 'Unknown error'}`);
    }
  };

    return (
    <TradingContainer>
      <TradingHeader>
        <HeaderLeft>
          <Title>Trading</Title>
          <Subtitle>Place orders and monitor market activity</Subtitle>
        </HeaderLeft>
        <HeaderActions>
          <ActionButton>
            <FiClock />
            Orders
          </ActionButton>
          <ActionButton>
            <FiDollarSign />
            Positions
          </ActionButton>
        </HeaderActions>
      </TradingHeader>

      {/* Chart Section */}
      <div style={{ marginBottom: '24px' }}>
        <TradingViewChart symbol={selectedStock} height={400} />
      </div>

      <TradingGrid>
        {/* Order Placement */}
        <TradingCard>
          <CardHeader>
            <CardTitle>Place Order</CardTitle>
          </CardHeader>
          
          <StockSearch>
            <SearchInput
                    type="text"
              placeholder="Search stocks..."
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
            />
          </StockSearch>
          
          {brokerConnections.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <Label>Broker Account</Label>
              <Select 
                value={selectedBroker || ''} 
                onChange={(e) => setSelectedBroker(parseInt(e.target.value))}
                style={{ width: '100%', marginTop: '4px' }}
              >
                {brokerConnections.map((broker) => (
                  <option key={broker.id} value={broker.id}>
                    {broker.broker_name.toUpperCase()} - Connected
                  </option>
                ))}
              </Select>
            </div>
          )}
          
          {brokerConnections.length === 0 && (
            <div style={{ 
              background: '#fef3c7', 
              border: '1px solid #f59e0b', 
              borderRadius: '6px', 
              padding: '12px', 
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
                ⚠️ No broker account connected. 
                <a 
                  href="/settings" 
                  style={{ color: '#92400e', textDecoration: 'underline', marginLeft: '4px' }}
                >
                  Connect a broker in Settings
                </a>
              </p>
            </div>
          )}
          
          <StockInfo>
            <StockDetails>
              <StockSymbol>{selectedStock}</StockSymbol>
              <StockName>Reliance Industries</StockName>
            </StockDetails>
            <StockPrice>
              <PriceValue>₹2,450.50</PriceValue>
              <PriceChange isPositive={true}>+₹12.50 (+0.51%)</PriceChange>
            </StockPrice>
          </StockInfo>
          
          <OrderForm>
                <FormGroup>
              <Label>Order Type</Label>
              <Select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                <option value="market">Market</option>
                <option value="limit">Limit</option>
                <option value="stop">Stop Loss</option>
                  </Select>
                </FormGroup>

                <FormGroup>
              <Label>Quantity</Label>
                  <Input
                    type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                  />
                </FormGroup>
            
            {orderType !== 'market' && (
                <FormGroup>
                <Label>Price</Label>
                  <Input
                    type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  />
                </FormGroup>
            )}
            
            <ButtonGroup>
              <BuyButton onClick={(e) => handleSubmit(e, 'buy')}>
                <FiTrendingUp />
                Buy
              </BuyButton>
              <SellButton onClick={(e) => handleSubmit(e, 'sell')}>
                <FiTrendingDown />
                Sell
              </SellButton>
            </ButtonGroup>
          </OrderForm>
        </TradingCard>

        {/* Order Book */}
        <TradingCard>
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
          </CardHeader>
          
          <OrderBook>
            <OrderBookHeader>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </OrderBookHeader>
            
            {/* Sell orders (higher prices) */}
            {orderBookData.sell.map((order, index) => (
              <OrderBookRow key={`sell-${index}`}>
                <span style={{ color: '#dc2626' }}>₹{order.price.toLocaleString()}</span>
                <span>{order.quantity}</span>
                <span>₹{order.total.toLocaleString()}</span>
              </OrderBookRow>
            ))}
            
            <div style={{ 
              padding: '8px 0', 
              textAlign: 'center', 
              fontWeight: 600, 
              color: '#1e40af',
              borderTop: '2px solid #e2e8f0',
              borderBottom: '2px solid #e2e8f0',
              margin: '8px 0'
            }}>
              ₹2,450.50
            </div>
            
            {/* Buy orders (lower prices) */}
            {orderBookData.buy.map((order, index) => (
              <OrderBookRow key={`buy-${index}`}>
                <span style={{ color: '#059669' }}>₹{order.price.toLocaleString()}</span>
                <span>{order.quantity}</span>
                <span>₹{order.total.toLocaleString()}</span>
              </OrderBookRow>
            ))}
          </OrderBook>
        </TradingCard>

      {/* Trade History */}
        <TradingCard>
          <CardHeader>
            <CardTitle>Trade History</CardTitle>
          </CardHeader>
          
          <TradeHistory>
            <TradeHeader>
              <span>Time</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Status</span>
            </TradeHeader>
            
            {tradeHistoryData.map((trade, index) => (
              <TradeRow key={index}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{trade.time}</span>
                <span style={{ fontWeight: 500 }}>₹{trade.price.toLocaleString()}</span>
                <span>{trade.quantity}</span>
                <StatusBadge status={trade.status}>
                  {trade.status === 'completed' && <FiCheck style={{ marginRight: '4px' }} />}
                  {trade.status === 'cancelled' && <FiX style={{ marginRight: '4px' }} />}
                  {trade.status}
                </StatusBadge>
              </TradeRow>
            ))}
          </TradeHistory>
        </TradingCard>
      </TradingGrid>
    </TradingContainer>
  );
};

export default Trading;
