import React, { useState } from 'react';
import styled from 'styled-components';
import { FiCheck, FiX, FiPlus } from 'react-icons/fi';

interface BrokerConnectionProps {
  onConnect: (brokerData: any) => void;
  onDisconnect: (brokerId: number) => void;
}

const Container = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BrokerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BrokerCard = styled.div<{ isConnected: boolean }>`
  background: ${({ theme, isConnected }) => 
    isConnected ? theme.colors.success + '10' : theme.colors.surface};
  border: 1px solid ${({ theme, isConnected }) => 
    isConnected ? theme.colors.success : theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const BrokerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const BrokerName = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const StatusBadge = styled.span<{ isConnected: boolean }>`
  background: ${({ theme, isConnected }) => 
    isConnected ? theme.colors.success : theme.colors.textMuted};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const BrokerDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  line-height: 1.4;
`;

const BrokerFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeatureTag = styled.span`
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
`;

const ActionButton = styled.button<{ variant: 'connect' | 'disconnect' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, variant }) => 
    variant === 'connect' ? theme.colors.primary : theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme, variant }) => 
    variant === 'connect' ? theme.colors.primary : 'transparent'};
  color: ${({ theme, variant }) => 
    variant === 'connect' ? 'white' : theme.colors.error};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: 500;
  
  &:hover {
    background: ${({ theme, variant }) => 
      variant === 'connect' ? theme.colors.primaryHover : theme.colors.error + '10'};
    transform: translateY(-1px);
  }
`;

const ConnectionForm = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const FormTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 8px 12px;
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
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
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
`;

const ConnectButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: 500;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
    transform: none;
  }
`;

const brokers = [
  {
    name: 'zerodha',
    displayName: 'Zerodha',
    description: 'India\'s largest stock broker by retail equity volumes. Offers low-cost trading with advanced charting tools.',
    website: 'https://zerodha.com',
    apiDocs: 'https://kite.trade/docs/connect/v3/',
    features: ['Equity', 'F&O', 'Currency', 'Commodity', 'MF'],
    isConnected: false
  },
  {
    name: 'angel_one',
    displayName: 'Angel One',
    description: 'Full-service broker offering research, advisory, and trading services across all market segments.',
    website: 'https://angelone.in',
    apiDocs: 'https://smartapi.angelbroking.com/',
    features: ['Equity', 'F&O', 'Currency', 'Commodity', 'Research'],
    isConnected: false
  },
  {
    name: 'upstox',
    displayName: 'Upstox',
    description: 'Discount broker focused on technology-driven trading with competitive pricing and modern interface.',
    website: 'https://upstox.com',
    apiDocs: 'https://api-docs.upstox.com/',
    features: ['Equity', 'F&O', 'Currency', 'Commodity'],
    isConnected: false
  }
];

const BrokerConnection: React.FC<BrokerConnectionProps> = ({ onConnect, onDisconnect }) => {
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    api_key: '',
    api_secret: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const handleBrokerSelect = (brokerName: string) => {
    setSelectedBroker(brokerName);
    setFormData({ api_key: '', api_secret: '' });
  };

  const handleConnect = async () => {
    if (!selectedBroker || !formData.api_key || !formData.api_secret) {
      return;
    }

    setIsConnecting(true);
    try {
      await onConnect({
        broker_name: selectedBroker,
        ...formData
      });
      setSelectedBroker(null);
      setFormData({ api_key: '', api_secret: '' });
    } catch (error) {
      console.error('Failed to connect broker:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCancel = () => {
    setSelectedBroker(null);
    setFormData({ api_key: '', api_secret: '' });
  };

  return (
    <Container>
             <Title>
         <FiPlus />
         Connect Broker Account
       </Title>
      
      <BrokerGrid>
        {brokers.map((broker) => (
          <BrokerCard 
            key={broker.name}
            isConnected={broker.isConnected}
            onClick={() => handleBrokerSelect(broker.name)}
          >
            <BrokerHeader>
              <BrokerName>{broker.displayName}</BrokerName>
              <StatusBadge isConnected={broker.isConnected}>
                {broker.isConnected ? (
                  <>
                    <FiCheck />
                    Connected
                  </>
                                 ) : (
                   <>
                     <FiPlus />
                     Not Connected
                   </>
                 )}
              </StatusBadge>
            </BrokerHeader>
            
            <BrokerDescription>{broker.description}</BrokerDescription>
            
            <BrokerFeatures>
              {broker.features.map((feature) => (
                <FeatureTag key={feature}>{feature}</FeatureTag>
              ))}
            </BrokerFeatures>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <ActionButton 
                variant={broker.isConnected ? 'disconnect' : 'connect'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (broker.isConnected) {
                    // Handle disconnect
                  } else {
                    handleBrokerSelect(broker.name);
                  }
                }}
              >
                {broker.isConnected ? (
                  <>
                    <FiX />
                    Disconnect
                  </>
                                 ) : (
                   <>
                     <FiPlus />
                     Connect
                   </>
                 )}
              </ActionButton>
              
              <ActionButton 
                variant="connect"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(broker.website, '_blank');
                }}
              >
                Visit
              </ActionButton>
            </div>
          </BrokerCard>
        ))}
      </BrokerGrid>

      {selectedBroker && (
        <ConnectionForm>
          <FormTitle>Connect to {brokers.find(b => b.name === selectedBroker)?.displayName}</FormTitle>
          
          <FormGrid>
            <FormGroup>
              <Label>API Key</Label>
              <Input
                type="text"
                placeholder="Enter your API key"
                value={formData.api_key}
                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>API Secret</Label>
              <Input
                type="password"
                placeholder="Enter your API secret"
                value={formData.api_secret}
                onChange={(e) => setFormData({ ...formData, api_secret: e.target.value })}
              />
            </FormGroup>
          </FormGrid>
          
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              💡 <strong>How to get API credentials:</strong>
            </p>
            <ol style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 0 16px', padding: 0 }}>
              <li>Log in to your {brokers.find(b => b.name === selectedBroker)?.displayName} account</li>
              <li>Go to API settings or developer section</li>
              <li>Generate a new API key and secret</li>
              <li>Copy and paste them here</li>
            </ol>
          </div>
          
          <ButtonGroup>
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
            <ConnectButton 
              onClick={handleConnect}
              disabled={!formData.api_key || !formData.api_secret || isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </ConnectButton>
          </ButtonGroup>
        </ConnectionForm>
      )}
    </Container>
  );
};

export default BrokerConnection;
