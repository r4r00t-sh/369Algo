import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiTrendingUp, FiClock, FiStar, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage?: string;
  category: string;
  sentiment: string;
  relevance_score: number;
}

interface NewsCategory {
  [key: string]: string;
}

const NewsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  margin-left: 240px;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SearchSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SearchContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CategoryTab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.surface};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.textSecondary};
  border: 1px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primaryHover : theme.colors.surfaceHover};
  }
`;

const SentimentFilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SentimentFilterTab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.surface};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.textSecondary};
  border: 1px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primaryHover : theme.colors.surfaceHover};
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
  
  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  }
`;

const NewsCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NewsTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1.4;
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const NewsMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Source = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const Time = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Sentiment = styled.span<{ sentiment: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  background: ${({ sentiment, theme }) => {
    switch (sentiment) {
      case 'positive': return theme.colors.success + '20';
      case 'negative': return theme.colors.error + '20';
      default: return theme.colors.warning + '20';
    }
  }};
  color: ${({ sentiment, theme }) => {
    switch (sentiment) {
      case 'positive': return theme.colors.success;
      case 'negative': return theme.colors.error;
      default: return theme.colors.warning;
    }
  }};
`;

const NewsDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NewsActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReadMoreButton = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const RelevanceScore = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.error};
`;

const RefreshButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.surfaceBorder};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const LoadMoreContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const LoadMoreButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const PaginationInfo = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.surface};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text};
  border: 1px solid ${({ active, theme }) => active ? theme.colors.primary : theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primaryHover : theme.colors.surfaceHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const News: React.FC = () => {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('business');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentLimit, setCurrentLimit] = useState<number>(50);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [articlesPerPage] = useState<number>(12);
  
  // Sentiment filtering
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [availableSentiments, setAvailableSentiments] = useState<string[]>(['all', 'positive', 'neutral', 'negative']);

  // Default categories if API fails
  const defaultCategories = {
    'business': 'Business & Finance',
    'markets': 'Stock Markets',
    'indian-markets': 'Indian Markets (NSE/BSE)',
    'global-markets': 'Global Markets',
    'economy': 'Economy & Policy',
    'technology': 'Technology & Innovation',
    'crypto': 'Cryptocurrency',
    'commodities': 'Commodities & Oil'
  };

  useEffect(() => {
    fetchCategories();
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/news/categories');
      setCategories(response.data.categories || defaultCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Use default categories if API fails
      setCategories(defaultCategories);
      setError('Using default news categories');
    }
  };

  const fetchNews = async (category: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Special handling for Indian markets
      let endpoint = `/api/news/latest?category=${category}&limit=${currentLimit}`;
      if (category === 'indian-markets') {
        endpoint = `/api/news/indian-markets?limit=${currentLimit}`;
      } else if (category === 'global-markets') {
        endpoint = `/api/news/global-markets?limit=${currentLimit}`;
      }
      
      const response = await api.get(endpoint);
      setNews(response.data.news || response.data.news || []);
      setHasMore(response.data.hasMore || false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/api/news/search?query=${encodeURIComponent(searchQuery)}&category=${selectedCategory}&limit=${currentLimit}`);
      setNews(response.data.news);
      setHasMore(response.data.hasMore || false);
    } catch (error) {
      console.error('Error searching news:', error);
      setError('Failed to search news');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setCurrentLimit(50); // Reset limit when category changes
    setHasMore(true); // Reset hasMore when category changes
    setCurrentPage(1); // Reset to first page
    setSelectedSentiment('all'); // Reset sentiment filter
  };

  const handleRefresh = () => {
    setError('');
    fetchNews(selectedCategory);
  };

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      const newLimit = currentLimit + 25;
      setCurrentLimit(newLimit);
      
      let endpoint = `/api/news/latest?category=${selectedCategory}&limit=${newLimit}`;
      if (selectedCategory === 'indian-markets') {
        endpoint = `/api/news/indian-markets?limit=${newLimit}`;
      } else if (selectedCategory === 'global-markets') {
        endpoint = `/api/news/global-markets?limit=${newLimit}`;
      }
      
      const response = await api.get(endpoint);
      setNews(response.data.news || []);
      setHasMore(response.data.hasMore || false);
    } catch (error) {
      console.error('Error loading more news:', error);
      setError('Failed to load more news');
    } finally {
      setLoading(false);
    }
  };

  const handleSentimentFilter = (sentiment: string) => {
    setSelectedSentiment(sentiment);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFilteredAndPaginatedNews = () => {
    let filteredNews = news;
    
    // Apply sentiment filter
    if (selectedSentiment !== 'all') {
      filteredNews = news.filter(article => article.sentiment === selectedSentiment);
    }
    
    // Calculate pagination
    const totalFiltered = filteredNews.length;
    const totalPages = Math.ceil(totalFiltered / articlesPerPage);
    setTotalPages(totalPages);
    
    // Get current page articles
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    
    return {
      currentPageNews: filteredNews.slice(startIndex, endIndex),
      totalPages,
      totalFiltered
    };
  };

  const formatTimeAgo = (publishedAt: string) => {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Bullish';
      case 'negative': return 'Bearish';
      default: return 'Neutral';
    }
  };

  if (loading && news.length === 0) {
    return (
      <NewsContainer>
        <Header>
          <HeaderContent>
            <Title>Financial News</Title>
            <Subtitle>Stay updated with the latest market news and insights</Subtitle>
          </HeaderContent>
          <RefreshButton onClick={handleRefresh} title="Refresh news">
            <FiRefreshCw />
          </RefreshButton>
        </Header>
        <LoadingSpinner>Loading news...</LoadingSpinner>
      </NewsContainer>
    );
  }

  return (
    <NewsContainer>
      <Header>
        <HeaderContent>
          <Title>Financial News</Title>
          <Subtitle>Stay updated with the latest market news and insights</Subtitle>
        </HeaderContent>
        <RefreshButton onClick={handleRefresh} title="Refresh news">
          <FiRefreshCw />
        </RefreshButton>
      </Header>

      <SearchSection>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for news articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <SearchButton onClick={handleSearch}>
            <FiSearch />
          </SearchButton>
        </SearchContainer>

        <CategoryTabs>
          {Object.entries(categories).map(([key, label]) => (
            <CategoryTab
              key={key}
              active={selectedCategory === key}
              onClick={() => handleCategoryChange(key)}
            >
              {label}
            </CategoryTab>
          ))}
        </CategoryTabs>

        <SentimentFilterTabs>
          {availableSentiments.map((sentiment) => (
            <SentimentFilterTab
              key={sentiment}
              active={selectedSentiment === sentiment}
              onClick={() => handleSentimentFilter(sentiment)}
            >
              {sentiment === 'all' ? 'All Sentiments' : 
               sentiment === 'positive' ? 'Bullish' : 
               sentiment === 'negative' ? 'Bearish' : 'Neutral'}
            </SentimentFilterTab>
          ))}
        </SentimentFilterTabs>
      </SearchSection>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading && (
        <LoadingSpinner>Loading news...</LoadingSpinner>
      )}

      {!loading && !error && (
        <>
          <NewsGrid>
            {getFilteredAndPaginatedNews().currentPageNews.map((article, index) => (
              <NewsCard key={index}>
                <NewsHeader>
                  <NewsTitle>{article.title}</NewsTitle>
                  <Sentiment sentiment={article.sentiment}>
                    {getSentimentLabel(article.sentiment)}
                  </Sentiment>
                </NewsHeader>

                <NewsMeta>
                  <Source>{article.source}</Source>
                  <Time>
                    <FiClock />
                    {formatTimeAgo(article.publishedAt)}
                  </Time>
                </NewsMeta>

                <NewsDescription>{article.description}</NewsDescription>

                <NewsActions>
                  <ReadMoreButton href={article.url} target="_blank" rel="noopener noreferrer">
                    <FiTrendingUp />
                    Read More
                  </ReadMoreButton>
                  <RelevanceScore>
                    <FiStar />
                    {Math.round(article.relevance_score * 100)}%
                  </RelevanceScore>
                </NewsActions>
              </NewsCard>
            ))}
          </NewsGrid>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationInfo>
                Showing {((currentPage - 1) * articlesPerPage) + 1} - {Math.min(currentPage * articlesPerPage, getFilteredAndPaginatedNews().totalFiltered)} of {getFilteredAndPaginatedNews().totalFiltered} articles
              </PaginationInfo>
              <PaginationControls>
                <PaginationButton 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationButton>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationButton
                    key={page}
                    onClick={() => handlePageChange(page)}
                    active={currentPage === page}
                  >
                    {page}
                  </PaginationButton>
                ))}
                
                <PaginationButton 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationButton>
              </PaginationControls>
            </PaginationContainer>
          )}
        </>
      )}

      {!loading && !error && hasMore && (
        <LoadMoreContainer>
          <LoadMoreButton onClick={handleLoadMore}>
            Load More News
          </LoadMoreButton>
        </LoadMoreContainer>
      )}

      {!loading && !error && news.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No news articles found. Try adjusting your search or category selection.
        </div>
      )}
    </NewsContainer>
  );
};

export default News;
