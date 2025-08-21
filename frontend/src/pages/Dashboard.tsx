import React from 'react';
import styled from 'styled-components';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiPieChart,
  FiEye,
  FiStar
} from 'react-icons/fi';
import TradingViewChart from '../components/common/TradingViewChart';

const DashboardContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const DashboardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const StatIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatChange = styled.div<{ isPositive: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme, isPositive }) => isPositive ? theme.colors.positive : theme.colors.negative};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const WatchlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const WatchlistCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const WatchlistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WatchlistTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const StockItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  
  &:last-child {
    border-bottom: none;
  }
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
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
`;

const PriceChange = styled.div<{ isPositive: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme, isPositive }) => isPositive ? theme.colors.positive : theme.colors.negative};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// Sample data
const portfolioData = [
  { name: 'Jan', value: 100000 },
  { name: 'Feb', value: 105000 },
  { name: 'Mar', value: 110000 },
  { name: 'Apr', value: 108000 },
  { name: 'May', value: 115000 },
  { name: 'Jun', value: 120000 },
];

const marketData = [
  { name: 'NIFTY', value: 19500, change: 0.8 },
  { name: 'SENSEX', value: 64500, change: 1.2 },
  { name: 'BANKNIFTY', value: 44500, change: -0.5 },
];

const watchlistData = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2450.50, change: 2.5 },
  { symbol: 'TCS', name: 'Tata Consultancy', price: 3850.75, change: -1.2 },
  { symbol: 'HDFC', name: 'HDFC Bank', price: 1650.25, change: 0.8 },
  { symbol: 'INFY', name: 'Infosys', price: 1450.00, change: 1.5 },
];

const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Dashboard</Title>
        <Subtitle>Welcome back! Here's what's happening with your portfolio today.</Subtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Portfolio Value</StatTitle>
            <StatIcon color="#1e40af">
                              <FiPieChart />
            </StatIcon>
          </StatHeader>
          <StatValue>₹12,45,000</StatValue>
          <StatChange isPositive={true}>
            <FiTrendingUp />
            +₹45,000 (+3.8%)
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Today's P&L</StatTitle>
                          <StatIcon color="#059669">
                <FiTrendingUp />
              </StatIcon>
          </StatHeader>
          <StatValue>₹12,500</StatValue>
          <StatChange isPositive={true}>
            <FiTrendingUp />
            +₹2,500 (+25.0%)
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Available Balance</StatTitle>
            <StatIcon color="#06b6d4">
              <FiDollarSign />
            </StatIcon>
          </StatHeader>
          <StatValue>₹2,15,000</StatValue>
          <StatChange isPositive={false}>
            <FiTrendingDown />
            -₹5,000 (-2.3%)
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Active Positions</StatTitle>
            <StatIcon color="#d97706">
              <FiEye />
            </StatIcon>
          </StatHeader>
          <StatValue>8</StatValue>
          <StatChange isPositive={true}>
            <FiTrendingUp />
            +2 positions
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Market Chart - NIFTY 50</ChartTitle>
          </ChartHeader>
          <TradingViewChart symbol="NIFTY 50" height={300} />
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Market Indices</ChartTitle>
          </ChartHeader>
          <div>
            {marketData.map((index) => (
              <div key={index.name} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{index.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{index.value.toLocaleString()}</div>
                </div>
                <div style={{ 
                  color: index.change >= 0 ? '#059669' : '#dc2626',
                  fontWeight: 500
                }}>
                  {index.change >= 0 ? '+' : ''}{index.change}%
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </ChartsGrid>

      <WatchlistGrid>
        <WatchlistCard>
          <WatchlistHeader>
            <WatchlistTitle>Watchlist</WatchlistTitle>
            <FiStar style={{ color: '#fbbf24', cursor: 'pointer' }} />
          </WatchlistHeader>
          {watchlistData.map((stock) => (
            <StockItem key={stock.symbol}>
              <StockInfo>
                <StockSymbol>{stock.symbol}</StockSymbol>
                <StockName>{stock.name}</StockName>
              </StockInfo>
              <StockPrice>
                <PriceValue>₹{stock.price.toLocaleString()}</PriceValue>
                <PriceChange isPositive={stock.change >= 0}>
                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                </PriceChange>
              </StockPrice>
            </StockItem>
          ))}
        </WatchlistCard>

        <WatchlistCard>
          <WatchlistHeader>
            <WatchlistTitle>Recent Trades</WatchlistTitle>
          </WatchlistHeader>
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <FiTrendingUp style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
            <div>No recent trades</div>
            <div style={{ fontSize: '12px', marginTop: '8px' }}>Your trading activity will appear here</div>
          </div>
        </WatchlistCard>
      </WatchlistGrid>
    </DashboardContainer>
  );
};

export default Dashboard;
