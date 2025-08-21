import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiPieChart,
  FiEye,
  FiFilter,
  FiDownload
} from 'react-icons/fi';
import TradingViewChart from '../components/common/TradingViewChart';

const PortfolioContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PortfolioHeader = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  grid-template-columns: 1fr 1fr;
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

const HoldingsSection = styled.div`
  background: ${({ theme }) => theme.colors.cardBackground};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const HoldingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const HoldingsTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const FilterSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, active }) => active ? theme.colors.primary : theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, active }) => active ? theme.colors.white : theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};

  &:hover {
    background: ${({ theme, active }) => active ? theme.colors.primaryHover : theme.colors.surfaceHover};
  }
`;

const HoldingsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: ${({ theme }) => theme.spacing.md};
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
const portfolioData = [
  { name: 'Jan', value: 100000 },
  { name: 'Feb', value: 105000 },
  { name: 'Mar', value: 110000 },
  { name: 'Apr', value: 108000 },
  { name: 'May', value: 115000 },
  { name: 'Jun', value: 120000 },
];

const allocationData = [
  { name: 'Stocks', value: 60, color: '#1e40af' },
  { name: 'Bonds', value: 25, color: '#059669' },
  { name: 'Cash', value: 10, color: '#06b6d4' },
  { name: 'Others', value: 5, color: '#d97706' },
];

const holdingsData = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 100, avgPrice: 2400, currentPrice: 2450.50, pnl: 5050, pnlPercent: 2.1 },
  { symbol: 'TCS', name: 'Tata Consultancy', quantity: 50, avgPrice: 3900, currentPrice: 3850.75, pnl: -2462.5, pnlPercent: -1.3 },
  { symbol: 'HDFC', name: 'HDFC Bank', quantity: 200, avgPrice: 1600, currentPrice: 1650.25, pnl: 10050, pnlPercent: 3.1 },
  { symbol: 'INFY', name: 'Infosys', quantity: 150, avgPrice: 1400, currentPrice: 1450.00, pnl: 7500, pnlPercent: 3.6 },
  { symbol: 'WIPRO', name: 'Wipro Ltd', quantity: 300, avgPrice: 450, currentPrice: 445.50, pnl: -1350, pnlPercent: -1.0 },
];

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const totalValue = holdingsData.reduce((sum, holding) => sum + (holding.quantity * holding.currentPrice), 0);
  const totalPnL = holdingsData.reduce((sum, holding) => sum + holding.pnl, 0);
  const totalPnLPercent = (totalPnL / (holdingsData.reduce((sum, holding) => sum + (holding.quantity * holding.avgPrice), 0))) * 100;

  return (
    <PortfolioContainer>
              <PortfolioHeader>
        <HeaderLeft>
          <Title>Portfolio</Title>
          <Subtitle>Track your investments and performance</Subtitle>
        </HeaderLeft>
        <HeaderActions>
          <ActionButton>
            <FiFilter />
            Filter
                  </ActionButton>
          <ActionButton>
            <FiDownload />
            Export
                  </ActionButton>
        </HeaderActions>
              </PortfolioHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Portfolio Value</StatTitle>
            <StatIcon color="#1e40af">
              <FiPieChart />
            </StatIcon>
          </StatHeader>
          <StatValue>₹{totalValue.toLocaleString()}</StatValue>
          <StatChange isPositive={totalPnL >= 0}>
            {totalPnL >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
            ₹{totalPnL.toLocaleString()} ({totalPnLPercent.toFixed(1)}%)
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total P&L</StatTitle>
            <StatIcon color={totalPnL >= 0 ? "#059669" : "#dc2626"}>
              <FiTrendingUp />
            </StatIcon>
          </StatHeader>
          <StatValue>₹{totalPnL.toLocaleString()}</StatValue>
          <StatChange isPositive={totalPnL >= 0}>
            {totalPnL >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
            {totalPnLPercent.toFixed(1)}%
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Holdings</StatTitle>
            <StatIcon color="#06b6d4">
              <FiEye />
            </StatIcon>
          </StatHeader>
          <StatValue>{holdingsData.length}</StatValue>
          <StatChange isPositive={true}>
            <FiTrendingUp />
            Active positions
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Cash Balance</StatTitle>
            <StatIcon color="#d97706">
              <FiPieChart />
            </StatIcon>
          </StatHeader>
          <StatValue>₹2,15,000</StatValue>
          <StatChange isPositive={false}>
            <FiTrendingDown />
            Available for trading
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Portfolio Performance</ChartTitle>
          </ChartHeader>
          <TradingViewChart symbol="PORTFOLIO" height={300} />
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Asset Allocation</ChartTitle>
          </ChartHeader>
          <TradingViewChart symbol="ASSETS" height={300} />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
            {allocationData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: item.color, borderRadius: '2px' }} />
                <span style={{ fontSize: '12px', color: '#64748b' }}>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </ChartsGrid>

      <HoldingsSection>
        <HoldingsHeader>
          <HoldingsTitle>Holdings</HoldingsTitle>
        </HoldingsHeader>
        
        <FilterSection>
          <FilterButton 
            active={activeFilter === 'all'} 
            onClick={() => setActiveFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'profit'} 
            onClick={() => setActiveFilter('profit')}
          >
            Profitable
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'loss'} 
            onClick={() => setActiveFilter('loss')}
          >
            Loss Making
          </FilterButton>
        </FilterSection>

        <HoldingsTable>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Quantity</th>
              <th>Avg Price</th>
              <th>Current Price</th>
              <th>Market Value</th>
              <th>P&L</th>
              <th>P&L %</th>
            </tr>
          </thead>
          <tbody>
            {holdingsData
              .filter(holding => {
                if (activeFilter === 'profit') return holding.pnl > 0;
                if (activeFilter === 'loss') return holding.pnl < 0;
                return true;
              })
              .map((holding) => (
                <tr key={holding.symbol}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{holding.symbol}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{holding.name}</div>
                    </div>
                  </td>
                  <td>{holding.quantity}</td>
                  <td>₹{holding.avgPrice.toLocaleString()}</td>
                  <td>₹{holding.currentPrice.toLocaleString()}</td>
                  <td>₹{(holding.quantity * holding.currentPrice).toLocaleString()}</td>
                  <td style={{ color: holding.pnl >= 0 ? '#059669' : '#dc2626', fontWeight: 500 }}>
                    ₹{holding.pnl.toLocaleString()}
                  </td>
                  <td style={{ color: holding.pnl >= 0 ? '#059669' : '#dc2626', fontWeight: 500 }}>
                    {holding.pnlPercent.toFixed(1)}%
                  </td>
                </tr>
              ))}
          </tbody>
        </HoldingsTable>
      </HoldingsSection>
    </PortfolioContainer>
  );
};

export default Portfolio;
