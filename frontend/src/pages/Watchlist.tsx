import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiPlus, 
  FiTrash2, 
  FiTrendingUp, 
  FiTrendingDown,
  FiBell,
  FiEdit2
} from 'react-icons/fi';

const WatchlistContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const WatchlistHeader = styled.div`
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

const PrimaryButton = styled(ActionButton)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-color: ${({ theme }) => theme.colors.primary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }) => theme.colors.primaryHover};
    color: white;
  }
`;

const SearchSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const WatchlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const WatchlistCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const StockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StockItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.small};
  }
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StockSymbol = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const StockName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StockPrice = styled.div`
  text-align: right;
`;

const PriceValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PriceChange = styled.div<{ isPositive: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme, isPositive }) => isPositive ? theme.colors.positive : theme.colors.negative};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StockActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const AlertSection = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const AlertTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const AlertItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const AlertInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const AlertStock = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const AlertCondition = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AlertStatus = styled.span<{ isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  background: ${({ theme, isActive }) => isActive ? theme.colors.positive + '20' : theme.colors.surfaceBorder};
  color: ${({ theme, isActive }) => isActive ? theme.colors.positive : theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Sample data
const watchlistData = [
  {
    name: 'Technology',
    stocks: [
      { symbol: 'TCS', name: 'Tata Consultancy', price: 3850.75, change: -45.25, changePercent: -1.16 },
      { symbol: 'INFY', name: 'Infosys', price: 1450.00, change: 25.50, changePercent: 1.79 },
      { symbol: 'WIPRO', name: 'Wipro Ltd', price: 445.50, change: -15.75, changePercent: -3.42 },
    ]
  },
  {
    name: 'Banking',
    stocks: [
      { symbol: 'HDFC', name: 'HDFC Bank', price: 1650.25, change: 12.75, changePercent: 0.78 },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 950.50, change: -8.25, changePercent: -0.86 },
      { symbol: 'AXISBANK', name: 'Axis Bank', price: 1150.25, change: 45.75, changePercent: 4.14 },
    ]
  },
  {
    name: 'Energy',
    stocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2450.50, change: 35.25, changePercent: 1.46 },
      { symbol: 'ONGC', name: 'Oil & Natural Gas', price: 185.75, change: -2.50, changePercent: -1.33 },
    ]
  }
];

const alertData = [
  { stock: 'TCS', condition: 'Price drops below ₹3,800', isActive: true },
  { stock: 'RELIANCE', condition: 'Price rises above ₹2,500', isActive: false },
  { stock: 'HDFC', condition: 'Price drops below ₹1,600', isActive: true },
];

const Watchlist: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddStock = () => {
    console.log('Add stock to watchlist');
    // In real app, this would open a modal to add stocks
  };

  const handleRemoveStock = (watchlistName: string, symbol: string) => {
    console.log(`Remove ${symbol} from ${watchlistName}`);
    // In real app, this would remove the stock from the watchlist
  };

  const handleEditWatchlist = (watchlistName: string) => {
    console.log(`Edit watchlist: ${watchlistName}`);
    // In real app, this would open a modal to edit the watchlist
  };

  const handleDeleteWatchlist = (watchlistName: string) => {
    console.log(`Delete watchlist: ${watchlistName}`);
    // In real app, this would delete the watchlist
  };

  return (
    <WatchlistContainer>
      <WatchlistHeader>
        <HeaderLeft>
          <Title>Watchlist</Title>
          <Subtitle>Monitor your favorite stocks and set price alerts</Subtitle>
        </HeaderLeft>
        <HeaderActions>
          <ActionButton>
            <FiBell />
            Alerts
          </ActionButton>
          <PrimaryButton onClick={handleAddStock}>
            <FiPlus />
            Add Stock
          </PrimaryButton>
        </HeaderActions>
      </WatchlistHeader>

      <SearchSection>
        <SearchInput
          type="text"
          placeholder="Search watchlists or stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchSection>

      <WatchlistGrid>
        {watchlistData.map((watchlist) => (
          <WatchlistCard key={watchlist.name}>
            <CardHeader>
              <CardTitle>{watchlist.name}</CardTitle>
              <CardActions>
                <IconButton onClick={() => handleEditWatchlist(watchlist.name)} title="Edit Watchlist">
                  <FiEdit2 />
                </IconButton>
                <IconButton onClick={() => handleDeleteWatchlist(watchlist.name)} title="Delete Watchlist">
                  <FiTrash2 />
                </IconButton>
              </CardActions>
            </CardHeader>
            
            <StockList>
              {watchlist.stocks.map((stock) => (
                <StockItem key={stock.symbol}>
                  <StockInfo>
                    <StockSymbol>{stock.symbol}</StockSymbol>
                    <StockName>{stock.name}</StockName>
                  </StockInfo>
                  
                  <StockPrice>
                    <PriceValue>₹{stock.price.toLocaleString()}</PriceValue>
                    <PriceChange isPositive={stock.change >= 0}>
                      {stock.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                      {stock.change >= 0 ? '+' : ''}₹{stock.change.toLocaleString()} ({stock.changePercent.toFixed(2)}%)
                    </PriceChange>
                  </StockPrice>
                  
                  <StockActions>
                    <IconButton title="Set Alert">
                      <FiBell />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleRemoveStock(watchlist.name, stock.symbol)}
                      title="Remove from Watchlist"
                    >
                      <FiTrash2 />
                    </IconButton>
                  </StockActions>
                </StockItem>
              ))}
            </StockList>
          </WatchlistCard>
        ))}
      </WatchlistGrid>

      <AlertSection>
        <AlertHeader>
          <AlertTitle>Price Alerts</AlertTitle>
          <ActionButton>
            <FiPlus />
            Add Alert
          </ActionButton>
        </AlertHeader>
        
        {alertData.length === 0 ? (
          <EmptyState>
            <FiBell style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
            <div>No price alerts set</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>Set alerts to get notified about price movements</div>
          </EmptyState>
        ) : (
          <AlertList>
            {alertData.map((alert, index) => (
              <AlertItem key={index}>
                <AlertInfo>
                  <AlertStock>{alert.stock}</AlertStock>
                  <AlertCondition>{alert.condition}</AlertCondition>
                </AlertInfo>
                <AlertStatus isActive={alert.isActive}>
                  {alert.isActive ? 'Active' : 'Inactive'}
                </AlertStatus>
              </AlertItem>
            ))}
          </AlertList>
        )}
      </AlertSection>
    </WatchlistContainer>
  );
};

export default Watchlist;
