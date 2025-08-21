import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import TradingViewChart from '../components/common/TradingViewChart';

const MarketDataContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const MarketDataHeader = styled.div`
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

const IndicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const IndexCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
  text-align: center;
`;

const IndexName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const IndexValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const IndexChange = styled.div<{ isPositive: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme, isPositive }) => isPositive ? theme.colors.positive : theme.colors.negative};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MarketOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const MarketOverviewCard = styled.div`
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

const TopMoversGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TopMoversCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const MoversTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StockItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
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
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const StockName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StockPrice = styled.div`
  text-align: right;
`;

const PriceValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const PriceChange = styled.div<{ isPositive: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme, isPositive }) => isPositive ? theme.colors.positive : theme.colors.negative};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const MarketTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }
  
  th {
    background: ${({ theme }) => theme.colors.surface};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  
  tr:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

// Sample data
const indicesData = [
  { name: 'NIFTY 50', value: 19500.50, change: 156.25, changePercent: 0.81 },
  { name: 'SENSEX', value: 64500.75, change: 425.50, changePercent: 0.66 },
  { name: 'BANK NIFTY', value: 44500.25, change: -225.75, changePercent: -0.50 },
  { name: 'NIFTY IT', value: 32500.00, change: 125.50, changePercent: 0.39 },
  { name: 'NIFTY PHARMA', value: 18500.75, change: -75.25, changePercent: -0.41 },
  { name: 'NIFTY AUTO', value: 22500.50, change: 325.75, changePercent: 1.47 },
];

const marketChartData = [
  { time: '9:00', nifty: 19350, sensex: 64000 },
  { time: '10:00', nifty: 19400, sensex: 64100 },
  { time: '11:00', nifty: 19450, sensex: 64200 },
  { time: '12:00', nifty: 19500, sensex: 64300 },
  { time: '13:00', nifty: 19475, sensex: 64250 },
  { time: '14:00', nifty: 19500, sensex: 64300 },
  { time: '15:00', nifty: 19525, sensex: 64400 },
  { time: '16:00', nifty: 19550, sensex: 64500 },
];

const topGainers = [
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 850.50, change: 45.25, changePercent: 5.62 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 7250.75, change: 325.50, changePercent: 4.71 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2850.00, change: 125.75, changePercent: 4.62 },
  { symbol: 'ITC', name: 'ITC Ltd', price: 425.50, change: 18.25, changePercent: 4.48 },
  { symbol: 'AXISBANK', name: 'Axis Bank', price: 1150.25, change: 45.75, changePercent: 4.14 },
];

const topLosers = [
  { symbol: 'WIPRO', name: 'Wipro Ltd', price: 445.50, change: -25.75, changePercent: -5.46 },
  { symbol: 'TECHM', name: 'Tech Mahindra', price: 1250.00, change: -65.50, changePercent: -4.98 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', price: 1150.75, change: -55.25, changePercent: -4.58 },
  { symbol: 'INFY', name: 'Infosys', price: 1450.00, change: -65.00, changePercent: -4.29 },
  { symbol: 'TCS', name: 'Tata Consultancy', price: 3850.75, change: -175.25, changePercent: -4.35 },
];

const MarketData: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <MarketDataContainer>
      <MarketDataHeader>
        <HeaderLeft>
        <Title>Market Data</Title>
          <Subtitle>Real-time market information and analysis</Subtitle>
        </HeaderLeft>
        <HeaderActions>
          <ActionButton>
            <FiFilter />
            Filter
          </ActionButton>
          <ActionButton>
            <FiRefreshCw />
            Refresh
          </ActionButton>
        </HeaderActions>
      </MarketDataHeader>

      <SearchSection>
          <SearchInput
            type="text"
          placeholder="Search stocks, indices, or sectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      </SearchSection>

      <IndicesGrid>
        {indicesData.map((index) => (
          <IndexCard key={index.name}>
            <IndexName>{index.name}</IndexName>
            <IndexValue>{index.value.toLocaleString()}</IndexValue>
            <IndexChange isPositive={index.change >= 0}>
              {index.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              {index.change >= 0 ? '+' : ''}{index.change.toLocaleString()} ({index.changePercent.toFixed(2)}%)
            </IndexChange>
          </IndexCard>
        ))}
      </IndicesGrid>

      <MarketOverviewGrid>
        <MarketOverviewCard>
          <CardHeader>
            <CardTitle>Market Performance - NIFTY 50</CardTitle>
          </CardHeader>
          <TradingViewChart symbol="NIFTY 50" height={300} />
        </MarketOverviewCard>

        <MarketOverviewCard>
          <CardHeader>
            <CardTitle>Market Summary</CardTitle>
          </CardHeader>
                <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
                <div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>Advance/Decline</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>NSE</div>
                </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#059669', fontWeight: 600 }}>1,245</div>
                <div style={{ color: '#dc2626', fontWeight: 600 }}>856</div>
                </div>
              </div>
              
            <div style={{ 
                    display: 'flex',
              justifyContent: 'space-between', 
                    alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>Market Breadth</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Ratio</div>
              </div>
              <div style={{ color: '#059669', fontWeight: 600 }}>1.45</div>
              </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 0'
            }}>
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>52W High</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>NIFTY 50</div>
              </div>
              <div style={{ color: '#059669', fontWeight: 600 }}>19,850</div>
            </div>
          </div>
        </MarketOverviewCard>
      </MarketOverviewGrid>

      <TopMoversGrid>
        <TopMoversCard>
          <MoversTitle style={{ color: '#059669' }}>
            <FiTrendingUp />
            Top Gainers
          </MoversTitle>
          <StockList>
            {topGainers.map((stock) => (
              <StockItem key={stock.symbol}>
                <StockInfo>
                  <StockSymbol>{stock.symbol}</StockSymbol>
                  <StockName>{stock.name}</StockName>
                </StockInfo>
                <StockPrice>
                  <PriceValue>₹{stock.price.toLocaleString()}</PriceValue>
                  <PriceChange isPositive={true}>
                    +₹{stock.change.toLocaleString()} (+{stock.changePercent.toFixed(2)}%)
                  </PriceChange>
                </StockPrice>
              </StockItem>
            ))}
          </StockList>
        </TopMoversCard>

        <TopMoversCard>
          <MoversTitle style={{ color: '#dc2626' }}>
            <FiTrendingDown />
            Top Losers
          </MoversTitle>
          <StockList>
            {topLosers.map((stock) => (
              <StockItem key={stock.symbol}>
                <StockInfo>
                  <StockSymbol>{stock.symbol}</StockSymbol>
                  <StockName>{stock.name}</StockName>
                </StockInfo>
                <StockPrice>
                  <PriceValue>₹{stock.price.toLocaleString()}</PriceValue>
                  <PriceChange isPositive={false}>
                    ₹{stock.change.toLocaleString()} ({stock.changePercent.toFixed(2)}%)
                  </PriceChange>
                </StockPrice>
              </StockItem>
            ))}
          </StockList>
        </TopMoversCard>
      </TopMoversGrid>

      <MarketOverviewCard>
        <CardHeader>
          <CardTitle>All Stocks</CardTitle>
        </CardHeader>
        <MarketTable>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Last Price</th>
              <th>Change</th>
              <th>Change %</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {[...topGainers.slice(0, 3), ...topLosers.slice(0, 3)].map((stock) => (
              <tr key={stock.symbol}>
                <td>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{stock.symbol}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{stock.name}</div>
                  </div>
                </td>
                <td>{stock.name}</td>
                <td>₹{stock.price.toLocaleString()}</td>
                <td style={{ 
                  color: stock.change >= 0 ? '#059669' : '#dc2626', 
                  fontWeight: 500 
                }}>
                  {stock.change >= 0 ? '+' : ''}₹{stock.change.toLocaleString()}
                </td>
                <td style={{ 
                  color: stock.change >= 0 ? '#059669' : '#dc2626', 
                  fontWeight: 500 
                }}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </td>
                <td>{(Math.random() * 1000000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </MarketTable>
      </MarketOverviewCard>
    </MarketDataContainer>
  );
};

export default MarketData;
