import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiExternalLink, FiTrash2, FiRefreshCw } from 'react-icons/fi';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ConnectButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
  }
`;

const TradingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BrokerCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BrokerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const BrokerName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const BrokerStatus = styled.span<{ isActive: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme, isActive }) => 
    isActive ? theme.colors.success : theme.colors.textSecondary
  };
`;

const BrokerActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button<{ variant?: 'disconnect' | 'refresh' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme, variant }) => 
    variant === 'disconnect' ? theme.colors.error : theme.colors.info
  };
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }
`;

const OrderForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
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
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const PlaceOrderButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.success};
    opacity: 0.9;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

const TradeHistory = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TradeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  background: ${({ theme }) => theme.colors.surfaceHover};

  &:last-child {
    border-bottom: none;
  }
`;

const TradeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TradeSymbol = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const TradeDetails = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TradeStatus = styled.span<{ status: string }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme, status }) => {
    switch (status) {
      case 'filled': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  }};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xxl};
  width: 90%;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  background: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.surfaceBorder : theme.colors.primary};
  color: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.text : theme.colors.white};

  &:hover {
    background: ${({ theme, variant }) =>
      variant === 'secondary' ? theme.colors.surfaceHover : theme.colors.primaryHover};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface BrokerConnection {
  id: number;
  broker_name: string;
  is_active: boolean;
  created_at: string;
}

interface Trade {
  id: number;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  order_type: string;
  status: string;
  timestamp: string;
}

const Trading: React.FC = () => {
  const { user } = useAuth();
  const [brokerConnections, setBrokerConnections] = useState<BrokerConnection[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderForm, setOrderForm] = useState({
    symbol: '',
    side: 'buy',
    quantity: '',
    price: '',
    order_type: 'market',
    broker_connection_id: ''
  });

  useEffect(() => {
    fetchBrokerConnections();
    fetchTradeHistory();
  }, []);

  const fetchBrokerConnections = async () => {
    try {
      const response = await api.get('/api/trading/broker/connections');
      setBrokerConnections(response.data);
    } catch (error) {
      console.error('Failed to fetch broker connections:', error);
    }
  };

  const fetchTradeHistory = async () => {
    try {
      const response = await api.get('/api/trading/orders');
      setTrades(response.data);
    } catch (error) {
      console.error('Failed to fetch trade history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectBroker = async (brokerId: number) => {
    if (window.confirm('Are you sure you want to disconnect this broker?')) {
      try {
        await api.post(`/api/trading/broker/${brokerId}/disconnect`);
        fetchBrokerConnections();
      } catch (error) {
        console.error('Failed to disconnect broker:', error);
      }
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.broker_connection_id) {
      alert('Please select a broker connection');
      return;
    }

    try {
      const orderData = {
        ...orderForm,
        quantity: parseFloat(orderForm.quantity),
        price: parseFloat(orderForm.price),
        broker_connection_id: parseInt(orderForm.broker_connection_id)
      };

      await api.post('/api/trading/order', orderData);
      
      // Reset form
      setOrderForm({
        symbol: '',
        side: 'buy',
        quantity: '',
        price: '',
        order_type: 'market',
        broker_connection_id: ''
      });

      // Refresh trade history
      fetchTradeHistory();
      
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Container>
        <EmptyState>Loading trading platform...</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Trading Platform</Title>
        <ConnectButton onClick={() => setShowConnectModal(true)}>
          <FiPlus />
          Connect Broker
        </ConnectButton>
      </Header>

      <TradingGrid>
        {/* Broker Connections */}
        <Section>
          <SectionTitle>
            <FiExternalLink />
            Broker Connections
          </SectionTitle>
          
          {brokerConnections.length === 0 ? (
            <EmptyState>
              <p>No broker connections yet.</p>
              <p>Connect your first broker to start trading.</p>
            </EmptyState>
          ) : (
            brokerConnections.map((connection) => (
              <BrokerCard key={connection.id}>
                <BrokerInfo>
                  <BrokerName>{connection.broker_name}</BrokerName>
                  <BrokerStatus isActive={connection.is_active}>
                    {connection.is_active ? 'Connected' : 'Disconnected'}
                  </BrokerStatus>
                </BrokerInfo>
                <BrokerActions>
                  <ActionButton title="Refresh Connection">
                    <FiRefreshCw />
                  </ActionButton>
                  <ActionButton
                    variant="disconnect"
                    title="Disconnect"
                    onClick={() => handleDisconnectBroker(connection.id)}
                  >
                    <FiTrash2 />
                  </ActionButton>
                </BrokerActions>
              </BrokerCard>
            ))
          )}
        </Section>

        {/* Order Placement */}
        <Section>
          <SectionTitle>
            <FiTrendingUp />
            Place Order
          </SectionTitle>
          
          {brokerConnections.filter(c => c.is_active).length === 0 ? (
            <EmptyState>
              <p>No active broker connections.</p>
              <p>Connect a broker to place orders.</p>
            </EmptyState>
          ) : (
            <OrderForm onSubmit={handlePlaceOrder}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input
                    id="symbol"
                    type="text"
                    value={orderForm.symbol}
                    onChange={(e) => setOrderForm({ ...orderForm, symbol: e.target.value.toUpperCase() })}
                    placeholder="e.g., AAPL"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="side">Side</Label>
                  <Select
                    id="side"
                    value={orderForm.side}
                    onChange={(e) => setOrderForm({ ...orderForm, side: e.target.value })}
                  >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </Select>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={orderForm.quantity}
                    onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={orderForm.price}
                    onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="order_type">Order Type</Label>
                  <Select
                    id="order_type"
                    value={orderForm.order_type}
                    onChange={(e) => setOrderForm({ ...orderForm, order_type: e.target.value })}
                  >
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                    <option value="stop_loss">Stop Loss</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="broker_connection_id">Broker</Label>
                  <Select
                    id="broker_connection_id"
                    value={orderForm.broker_connection_id}
                    onChange={(e) => setOrderForm({ ...orderForm, broker_connection_id: e.target.value })}
                    required
                  >
                    <option value="">Select Broker</option>
                    {brokerConnections
                      .filter(c => c.is_active)
                      .map(connection => (
                        <option key={connection.id} value={connection.id}>
                          {connection.broker_name}
                        </option>
                      ))
                    }
                  </Select>
                </FormGroup>
              </FormRow>

              <PlaceOrderButton type="submit">
                Place {orderForm.side === 'buy' ? 'Buy' : 'Sell'} Order
              </PlaceOrderButton>
            </OrderForm>
          )}
        </Section>
      </TradingGrid>

      {/* Trade History */}
      <Section>
        <SectionTitle>
          <FiTrendingDown />
          Trade History
        </SectionTitle>
        
        {trades.length === 0 ? (
          <EmptyState>
            <p>No trades yet.</p>
            <p>Your trade history will appear here.</p>
          </EmptyState>
        ) : (
          <TradeHistory>
            {trades.map((trade) => (
              <TradeItem key={trade.id}>
                <TradeInfo>
                  <TradeSymbol>{trade.symbol}</TradeSymbol>
                  <TradeDetails>
                    {trade.quantity} shares @ ${trade.price} ({trade.order_type})
                  </TradeDetails>
                </TradeInfo>
                <TradeStatus status={trade.status}>
                  {trade.status.toUpperCase()}
                </TradeStatus>
              </TradeItem>
            ))}
          </TradeHistory>
        )}
      </Section>

      {/* Connect Broker Modal */}
      {showConnectModal && (
        <Modal onClick={() => setShowConnectModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Connect Broker</ModalTitle>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '24px' }}>
              Broker connection setup is coming soon. For now, you can use the demo mode.
            </p>
            <ButtonGroup>
              <Button variant="secondary" onClick={() => setShowConnectModal(false)}>
                Close
              </Button>
              <Button onClick={() => setShowConnectModal(false)}>
                Demo Mode
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Trading;
