import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const DateDisplay = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const StatTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatValue = styled.div<{ isPositive?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme, isPositive }) => 
    isPositive === undefined 
      ? theme.colors.text 
      : isPositive 
        ? theme.colors.positive 
        : theme.colors.negative
  };
`;

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  height: 400px;
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LoadingText = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  padding: ${({ theme }) => theme.spacing.xxl};
`;

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
}

const Dashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await api.get('/api/market/trending');
        if (response.data?.data) {
          setMarketData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  // Sample chart data - in real app, this would come from API
  const chartData = [
    { time: '9:00', value: 100 },
    { time: '10:00', value: 105 },
    { time: '11:00', value: 102 },
    { time: '12:00', value: 108 },
    { time: '13:00', value: 110 },
    { time: '14:00', value: 107 },
    { time: '15:00', value: 112 },
    { time: '16:00', value: 115 },
  ];

  if (isLoading) {
    return <LoadingText>Loading dashboard...</LoadingText>;
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Dashboard</Title>
        <DateDisplay>{currentDate}</DateDisplay>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatTitle>Portfolio Value</StatTitle>
          <StatValue>$125,430.50</StatValue>
        </StatCard>

        <StatCard>
          <StatTitle>Today's P&L</StatTitle>
          <StatValue isPositive={true}>+$2,450.75</StatValue>
        </StatCard>

        <StatCard>
          <StatTitle>Total Holdings</StatTitle>
          <StatValue>24</StatValue>
        </StatCard>

        <StatCard>
          <StatTitle>Active Orders</StatTitle>
          <StatValue>3</StatValue>
        </StatCard>
      </StatsGrid>

      <ChartContainer>
        <ChartTitle>Portfolio Performance (Today)</ChartTitle>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {marketData.length > 0 && (
        <div>
          <ChartTitle>Market Overview</ChartTitle>
          <StatsGrid>
            {marketData.slice(0, 4).map((stock) => (
              <StatCard key={stock.symbol}>
                <StatTitle>{stock.symbol}</StatTitle>
                <StatValue>${stock.price?.toFixed(2) || 'N/A'}</StatValue>
                <div style={{ 
                  color: stock.change_percent >= 0 ? '#10b981' : '#ef4444',
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent?.toFixed(2) || 'N/A'}%
                </div>
              </StatCard>
            ))}
          </StatsGrid>
        </div>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
