import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

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

const CreateButton = styled.button`
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

const PortfolioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PortfolioCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-2px);
  }
`;

const PortfolioHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PortfolioName = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`;

const PortfolioActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' | 'view' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme, variant }) => {
    if (variant === 'edit') return theme.colors.info;
    if (variant === 'delete') return theme.colors.error;
    return theme.colors.primary;
  }};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }
`;

const PortfolioStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatValue = styled.div<{ isPositive?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme, isPositive }) =>
    isPositive === undefined
      ? theme.colors.text
      : isPositive
        ? theme.colors.positive
        : theme.colors.negative
  };
`;

const HoldingsList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const HoldingsTitle = styled.h4`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const HoldingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};

  &:last-child {
    border-bottom: none;
  }
`;

const HoldingSymbol = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const HoldingDetails = styled.div`
  text-align: right;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
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

const Form = styled.form`
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
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  resize: vertical;
  min-height: 80px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
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

interface Portfolio {
  id: number;
  name: string;
  description: string;
  is_default: boolean;
  created_at: string;
}

interface Holding {
  id: number;
  symbol: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  last_updated: string;
}

const Portfolio: React.FC = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [holdings, setHoldings] = useState<{ [key: number]: Holding[] }>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_default: false
  });

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/portfolio/list');
      setPortfolios(response.data);

      // Fetch holdings for each portfolio
      for (const portfolio of response.data) {
        try {
          const holdingsResponse = await api.get(`/api/portfolio/${portfolio.id}/holdings`);
          setHoldings(prev => ({
            ...prev,
            [portfolio.id]: holdingsResponse.data
          }));
        } catch (error) {
          console.error(`Failed to fetch holdings for portfolio ${portfolio.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/portfolio/create', formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', is_default: false });
      fetchPortfolios();
    } catch (error) {
      console.error('Failed to create portfolio:', error);
    }
  };

  const handleDeletePortfolio = async (portfolioId: number) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      try {
        await api.delete(`/api/portfolio/${portfolioId}`);
        fetchPortfolios();
      } catch (error) {
        console.error('Failed to delete portfolio:', error);
      }
    }
  };

  const calculatePortfolioValue = (portfolioId: number) => {
    const portfolioHoldings = holdings[portfolioId] || [];
    return portfolioHoldings.reduce((total, holding) => {
      return total + (holding.quantity * holding.current_price);
    }, 0);
  };

  const calculatePortfolioPnl = (portfolioId: number) => {
    const portfolioHoldings = holdings[portfolioId] || [];
    return portfolioHoldings.reduce((total, holding) => {
      const currentValue = holding.quantity * holding.current_price;
      const costBasis = holding.quantity * holding.avg_price;
      return total + (currentValue - costBasis);
    }, 0);
  };

  if (isLoading) {
    return (
      <Container>
        <EmptyState>Loading portfolios...</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Portfolio Management</Title>
        <CreateButton onClick={() => setShowCreateModal(true)}>
          <FiPlus />
          Create Portfolio
        </CreateButton>
      </Header>

      {portfolios.length === 0 ? (
        <EmptyState>
          <h3>No portfolios yet</h3>
          <p>Create your first portfolio to start tracking your investments.</p>
        </EmptyState>
      ) : (
        <PortfolioGrid>
          {portfolios.map((portfolio) => (
            <PortfolioCard key={portfolio.id}>
              <PortfolioHeader>
                <PortfolioName>{portfolio.name}</PortfolioName>
                <PortfolioActions>
                  <ActionButton variant="view" title="View Details">
                    <FiEye />
                  </ActionButton>
                  <ActionButton variant="edit" title="Edit Portfolio">
                    <FiEdit2 />
                  </ActionButton>
                  <ActionButton
                    variant="delete"
                    title="Delete Portfolio"
                    onClick={() => handleDeletePortfolio(portfolio.id)}
                  >
                    <FiTrash2 />
                  </ActionButton>
                </PortfolioActions>
              </PortfolioHeader>

              {portfolio.description && (
                <p style={{ color: '#64748b', marginBottom: '16px' }}>
                  {portfolio.description}
                </p>
              )}

              <PortfolioStats>
                <StatItem>
                  <StatLabel>Total Value</StatLabel>
                  <StatValue>
                    ${calculatePortfolioValue(portfolio.id).toFixed(2)}
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>P&L</StatLabel>
                  <StatValue isPositive={calculatePortfolioPnl(portfolio.id) >= 0}>
                    {calculatePortfolioPnl(portfolio.id) >= 0 ? '+' : ''}
                    ${calculatePortfolioPnl(portfolio.id).toFixed(2)}
                  </StatValue>
                </StatItem>
              </PortfolioStats>

              <HoldingsList>
                <HoldingsTitle>Holdings ({holdings[portfolio.id]?.length || 0})</HoldingsTitle>
                {holdings[portfolio.id]?.slice(0, 3).map((holding) => (
                  <HoldingItem key={holding.id}>
                    <HoldingSymbol>{holding.symbol}</HoldingSymbol>
                    <HoldingDetails>
                      {holding.quantity} @ ${holding.current_price.toFixed(2)}
                    </HoldingDetails>
                  </HoldingItem>
                ))}
                {holdings[portfolio.id]?.length > 3 && (
                  <HoldingItem>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>
                      +{holdings[portfolio.id].length - 3} more
                    </span>
                  </HoldingItem>
                )}
              </HoldingsList>
            </PortfolioCard>
          ))}
        </PortfolioGrid>
      )}

      {showCreateModal && (
        <Modal onClick={() => setShowCreateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create New Portfolio</ModalTitle>
            <Form onSubmit={handleCreatePortfolio}>
              <FormGroup>
                <Label htmlFor="name">Portfolio Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter portfolio name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">Description (Optional)</Label>
                <TextArea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter portfolio description"
                />
              </FormGroup>

              <CheckboxGroup>
                <Checkbox
                  id="is_default"
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                />
                <Label htmlFor="is_default">Set as default portfolio</Label>
              </CheckboxGroup>

              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Portfolio
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Portfolio;
