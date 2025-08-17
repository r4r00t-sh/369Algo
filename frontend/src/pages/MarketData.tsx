import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { FiSearch, FiTrendingUp, FiTrendingDown, FiStar, FiPlus, FiNews, FiBarChart3 } from 'react-icons/fi';

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

const SearchSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const SearchForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const MarketGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
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

const StockCard = styled.div`
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StockSymbol = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const StockName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StockPrice = styled.div`
  text-align: right;
`;

const PriceValue = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const PriceChange = styled.div<{ isPositive: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme, isPositive }) =>
    isPositive ? theme.colors.positive : theme.colors.negative
  };
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: flex-end;
`;

const AddToWatchlistButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: scale(1.1);
  }
`;

const NewsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const NewsItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NewsTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

const NewsSummary = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const NewsMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
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

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap: number;
  pe_ratio: number;
  high: number;
  low: number;
  open: number;
  previous_close: number;
  timestamp: string;
}

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
}

interface NewsArticle {
  title: string;
  summary: string;
  link: string;
  publisher: string;
  published: string;
  image: string;
}

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  price: number;
}

const MarketData: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [stockQuote, setStockQuote] = useState<StockQuote | null>(null);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [trendingStocks, setTrendingStocks] = useState<StockQuote[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'news'>('overview');

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      // Fetch market indices
      const indicesResponse = await api.get('/api/market/indices');
      if (indicesResponse.data?.data) {
        setMarketIndices(indicesResponse.data.data);
      }

      // Fetch trending stocks
      const trendingResponse = await api.get('/api/market/trending');
      if (trendingResponse.data?.data) {
        setTrendingStocks(trendingResponse.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/api/market/search?query=${encodeURIComponent(searchQuery)}`);
      if (response.data?.results) {
        setSearchResults(response.data.results);
        setActiveTab('search');
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockSelect = async (symbol: string) => {
    try {
      const response = await api.get(`/api/market/quote/${symbol}`);
      if (response.data?.data) {
        setStockQuote(response.data.data);
        setActiveTab('overview');
      }
    } catch (error) {
      console.error('Failed to fetch stock quote:', error);
    }
  };

  const handleAddToWatchlist = async (symbol: string) => {
    try {
      await api.post('/api/watchlist/add', { symbol });
      alert(`${symbol} added to watchlist!`);
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      alert('Failed to add to watchlist. Please try again.');
    }
  };

  const fetchNews = async (symbol: string) => {
    try {
      const response = await api.get(`/api/market/news/${symbol}`);
      if (response.data?.data) {
        setNews(response.data.data);
        setActiveTab('news');
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toString();
  };

  return (
    <Container>
      <Header>
        <Title>Market Data</Title>
      </Header>

      <SearchSection>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for stocks, companies, or symbols..."
            required
          />
          <SearchButton type="submit" disabled={isLoading}>
            <FiSearch />
            {isLoading ? 'Searching...' : 'Search'}
          </SearchButton>
        </SearchForm>
      </SearchSection>

      {/* Market Overview */}
      {activeTab === 'overview' && (
        <>
          <MarketGrid>
            {/* Market Indices */}
            <Section>
              <SectionTitle>
                <FiBarChart3 />
                Market Indices
              </SectionTitle>
              
              {marketIndices.length === 0 ? (
                <EmptyState>Loading market indices...</EmptyState>
              ) : (
                marketIndices.map((index) => (
                  <StockCard key={index.symbol}>
                    <StockInfo>
                      <StockSymbol>{index.symbol}</StockSymbol>
                      <StockName>{index.name}</StockName>
                    </StockInfo>
                    <StockPrice>
                      <PriceValue>{formatCurrency(index.price)}</PriceValue>
                      <PriceChange isPositive={index.change_percent >= 0}>
                        {index.change_percent >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                        {index.change_percent >= 0 ? '+' : ''}{index.change_percent.toFixed(2)}%
                      </PriceChange>
                    </StockPrice>
                  </StockCard>
                ))
              )}
            </Section>

            {/* Trending Stocks */}
            <Section>
              <SectionTitle>
                <FiTrendingUp />
                Trending Stocks
              </SectionTitle>
              
              {trendingStocks.length === 0 ? (
                <EmptyState>Loading trending stocks...</EmptyState>
              ) : (
                trendingStocks.map((stock) => (
                  <StockCard key={stock.symbol}>
                    <StockInfo>
                      <StockSymbol>{stock.symbol}</StockSymbol>
                      <StockName>{stock.symbol}</StockName>
                    </StockInfo>
                    <StockPrice>
                      <PriceValue>{formatCurrency(stock.price)}</PriceValue>
                      <PriceChange isPositive={stock.change_percent >= 0}>
                        {stock.change_percent >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                        {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                      </PriceChange>
                    </StockPrice>
                  </StockCard>
                ))
              )}
            </Section>
          </MarketGrid>

          {/* Selected Stock Quote */}
          {stockQuote && (
            <Section>
              <SectionTitle>
                <FiBarChart3 />
                {stockQuote.symbol} - Stock Quote
              </SectionTitle>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <strong>Current Price:</strong> {formatCurrency(stockQuote.price)}
                </div>
                <div>
                  <strong>Change:</strong> 
                  <span style={{ color: stockQuote.change >= 0 ? '#10b981' : '#ef4444' }}>
                    {stockQuote.change >= 0 ? '+' : ''}{formatCurrency(stockQuote.change)} ({stockQuote.change_percent >= 0 ? '+' : ''}{stockQuote.change_percent.toFixed(2)}%)
                  </span>
                </div>
                <div>
                  <strong>Volume:</strong> {formatNumber(stockQuote.volume)}
                </div>
                <div>
                  <strong>Market Cap:</strong> {formatCurrency(stockQuote.market_cap)}
                </div>
                <div>
                  <strong>P/E Ratio:</strong> {stockQuote.pe_ratio?.toFixed(2) || 'N/A'}
                </div>
                <div>
                  <strong>Day Range:</strong> {formatCurrency(stockQuote.low)} - {formatCurrency(stockQuote.high)}
                </div>
              </div>
              
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <AddToWatchlistButton
                  onClick={() => handleAddToWatchlist(stockQuote.symbol)}
                  title="Add to Watchlist"
                >
                  <FiStar />
                </AddToWatchlistButton>
                <button
                  onClick={() => fetchNews(stockQuote.symbol)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <FiNews />
                  View News
                </button>
              </div>
            </Section>
          )}
        </>
      )}

      {/* Search Results */}
      {activeTab === 'search' && (
        <Section>
          <SectionTitle>
            <FiSearch />
            Search Results for "{searchQuery}"
          </SectionTitle>
          
          {searchResults.length === 0 ? (
            <EmptyState>No results found. Try a different search term.</EmptyState>
          ) : (
            searchResults.map((result) => (
              <StockCard key={result.symbol} style={{ cursor: 'pointer' }} onClick={() => handleStockSelect(result.symbol)}>
                <StockInfo>
                  <StockSymbol>{result.symbol}</StockSymbol>
                  <StockName>{result.name}</StockName>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    {result.exchange} • {result.type}
                  </span>
                </StockInfo>
                <StockPrice>
                  <PriceValue>{formatCurrency(result.price)}</PriceValue>
                  <AddToWatchlistButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWatchlist(result.symbol);
                    }}
                    title="Add to Watchlist"
                  >
                    <FiPlus />
                  </AddToWatchlistButton>
                </StockPrice>
              </StockCard>
            ))
          )}
        </Section>
      )}

      {/* News */}
      {activeTab === 'news' && (
        <Section>
          <SectionTitle>
            <FiNews />
            Latest News
          </SectionTitle>
          
          {news.length === 0 ? (
            <EmptyState>No news available for this stock.</EmptyState>
          ) : (
            <NewsSection>
              {news.map((article, index) => (
                <NewsItem key={index}>
                  <NewsTitle>{article.title}</NewsTitle>
                  <NewsSummary>{article.summary}</NewsSummary>
                  <NewsMeta>
                    <span>{article.publisher}</span>
                    <span>{new Date(article.published).toLocaleDateString()}</span>
                  </NewsMeta>
                </NewsItem>
              ))}
            </NewsSection>
          )}
        </Section>
      )}
    </Container>
  );
};

export default MarketData;
