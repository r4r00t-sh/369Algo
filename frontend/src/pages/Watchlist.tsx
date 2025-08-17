import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { FiPlus, FiTrash2, FiStar, FiTrendingUp, FiTrendingDown, FiSearch, FiEdit2 } from 'react-icons/fi';

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

const AddButton = styled.button`
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

const WatchlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const WatchlistCard = styled.div`
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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StockSymbol = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`;

const StockName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme, variant }) => 
    variant === 'delete' ? theme.colors.error : theme.colors.info
  };
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
    transform: scale(1.1);
  }
`;

const StockStats = styled.div`
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

const AddedDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
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

const LoadingState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface WatchlistItem {
  id: number;
  symbol: string;
  name: string | null;
  added_at: string;
}

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap: number;
}

const Watchlist: React.FC = () => {
  const { user } = useAuth();
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [stockQuotes, setStockQuotes] = useState<{ [key: string]: StockQuote }>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<WatchlistItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    symbol: '',
    name: ''
  });

  useEffect(() => {
    fetchWatchlist();
  }, []);

  useEffect(() => {
    if (watchlistItems.length > 0) {
      fetchStockQuotes();
    }
  }, [watchlistItems]);

  const fetchWatchlist = async () => {
    try {
      const response = await api.get('/api/watchlist/list');
      setWatchlistItems(response.data);
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStockQuotes = async () => {
    try {
      const symbols = watchlistItems.map(item => item.symbol).join(',');
      if (symbols) {
        const response = await api.get(`/api/market/quotes/batch?symbols=${symbols}`);
        if (response.data) {
          const quotes: { [key: string]: StockQuote } = {};
          Object.entries(response.data).forEach(([symbol, data]: [string, any]) => {
            if (data.data && !data.error) {
              quotes[symbol] = data.data;
            }
          });
          setStockQuotes(quotes);
        }
      }
    } catch (error) {
      console.error('Failed to fetch stock quotes:', error);
    }
  };

  const handleAddToWatchlist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/watchlist/add', formData);
      setShowAddModal(false);
      setFormData({ symbol: '', name: '' });
      fetchWatchlist();
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      alert('Failed to add to watchlist. Please try again.');
    }
  };

  const handleEditWatchlistItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await api.put(`/api/watchlist/${editingItem.id}`, formData);
      setShowEditModal(false);
      setEditingItem(null);
      setFormData({ symbol: '', name: '' });
      fetchWatchlist();
    } catch (error) {
      console.error('Failed to update watchlist item:', error);
      alert('Failed to update watchlist item. Please try again.');
    }
  };

  const handleRemoveFromWatchlist = async (itemId: number) => {
    if (window.confirm('Are you sure you want to remove this stock from your watchlist?')) {
      try {
        await api.delete(`/api/watchlist/${itemId}`);
        fetchWatchlist();
      } catch (error) {
        console.error('Failed to remove from watchlist:', error);
        alert('Failed to remove from watchlist. Please try again.');
      }
    }
  };

  const openEditModal = (item: WatchlistItem) => {
    setEditingItem(item);
    setFormData({
      symbol: item.symbol,
      name: item.name || ''
    });
    setShowEditModal(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingState>Loading watchlist...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Watchlist</Title>
        <AddButton onClick={() => setShowAddModal(true)}>
          <FiPlus />
          Add Stock
        </AddButton>
      </Header>

      {watchlistItems.length === 0 ? (
        <EmptyState>
          <FiStar style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
          <h3>Your watchlist is empty</h3>
          <p>Add stocks you want to track to get started.</p>
        </EmptyState>
      ) : (
        <WatchlistGrid>
          {watchlistItems.map((item) => {
            const quote = stockQuotes[item.symbol];
            const isPositive = quote ? quote.change_percent >= 0 : undefined;

            return (
              <WatchlistCard key={item.id}>
                <CardHeader>
                  <StockInfo>
                    <StockSymbol>{item.symbol}</StockSymbol>
                    <StockName>{item.name || item.symbol}</StockName>
                  </StockInfo>
                  <CardActions>
                    <ActionButton
                      variant="edit"
                      title="Edit"
                      onClick={() => openEditModal(item)}
                    >
                      <FiEdit2 />
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      title="Remove"
                      onClick={() => handleRemoveFromWatchlist(item.id)}
                    >
                      <FiTrash2 />
                    </ActionButton>
                  </CardActions>
                </CardHeader>

                {quote ? (
                  <>
                    <StockStats>
                      <StatItem>
                        <StatLabel>Current Price</StatLabel>
                        <StatValue>{formatCurrency(quote.price)}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Change</StatLabel>
                        <StatValue isPositive={isPositive}>
                          {isPositive ? '+' : ''}{formatCurrency(quote.change)}
                        </StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Change %</StatLabel>
                        <StatValue isPositive={isPositive}>
                          {isPositive ? '+' : ''}{quote.change_percent.toFixed(2)}%
                        </StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Volume</StatLabel>
                        <StatValue>
                          {quote.volume >= 1e6 
                            ? `${(quote.volume / 1e6).toFixed(1)}M`
                            : quote.volume >= 1e3
                            ? `${(quote.volume / 1e3).toFixed(1)}K`
                            : quote.volume.toString()
                          }
                        </StatValue>
                      </StatItem>
                    </StockStats>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '16px 0' }}>
                    Loading quote...
                  </div>
                )}

                <AddedDate>
                  Added on {formatDate(item.added_at)}
                </AddedDate>
              </WatchlistCard>
            );
          })}
        </WatchlistGrid>
      )}

      {/* Add Stock Modal */}
      {showAddModal && (
        <Modal onClick={() => setShowAddModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Add Stock to Watchlist</ModalTitle>
            <Form onSubmit={handleAddToWatchlist}>
              <FormGroup>
                <Label htmlFor="symbol">Stock Symbol</Label>
                <Input
                  id="symbol"
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  placeholder="e.g., AAPL"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="name">Custom Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Apple Inc."
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add to Watchlist
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* Edit Stock Modal */}
      {showEditModal && editingItem && (
        <Modal onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Edit Watchlist Item</ModalTitle>
            <Form onSubmit={handleEditWatchlistItem}>
              <FormGroup>
                <Label htmlFor="edit_symbol">Stock Symbol</Label>
                <Input
                  id="edit_symbol"
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="edit_name">Custom Name</Label>
                <Input
                  id="edit_name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Apple Inc."
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Watchlist;
