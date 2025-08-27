import React, { useState, useEffect } from 'react';
import { FiClock, FiTrendingUp, FiTrendingDown, FiCheck } from 'react-icons/fi';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Simulate loading news data
    setTimeout(() => {
      const mockNews: NewsItem[] = [
        {
          id: 1,
          title: "NIFTY 50 Hits New All-Time High Amid Strong Corporate Earnings",
          summary: "The benchmark index surged to record levels as major companies reported better-than-expected quarterly results, boosting investor confidence.",
          source: "Economic Times",
          publishedAt: "2 hours ago",
          url: "#",
          sentiment: "positive",
          category: "markets"
        },
        {
          id: 2,
          title: "RBI Maintains Repo Rate at 6.5% in Latest Monetary Policy Review",
          summary: "The central bank kept the key interest rate unchanged for the sixth consecutive time, signaling a cautious approach to inflation management.",
          source: "Business Standard",
          publishedAt: "4 hours ago",
          url: "#",
          sentiment: "neutral",
          category: "economy"
        },
        {
          id: 3,
          title: "Tech Stocks Face Pressure as Global Markets React to Fed Comments",
          summary: "Indian technology shares declined following negative cues from US markets after Federal Reserve officials signaled potential rate hikes.",
          source: "Money Control",
          publishedAt: "6 hours ago",
          url: "#",
          sentiment: "negative",
          category: "markets"
        },
        {
          id: 4,
          title: "Oil Prices Surge on Supply Concerns and Geopolitical Tensions",
          summary: "Crude oil prices jumped 3% as concerns over supply disruptions and escalating tensions in key oil-producing regions weighed on markets.",
          source: "Reuters",
          publishedAt: "8 hours ago",
          url: "#",
          sentiment: "negative",
          category: "commodities"
        },
        {
          id: 5,
          title: "Banking Sector Shows Strong Growth with Improved Asset Quality",
          summary: "Major banks reported robust quarterly performance with declining NPAs and improved credit growth across retail and corporate segments.",
          source: "Financial Express",
          publishedAt: "10 hours ago",
          url: "#",
          sentiment: "positive",
          category: "banking"
        }
      ];
      setNews(mockNews);
        setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'all', name: 'All News', count: news.length },
    { id: 'markets', name: 'Markets', count: news.filter(n => n.category === 'markets').length },
    { id: 'economy', name: 'Economy', count: news.filter(n => n.category === 'economy').length },
    { id: 'banking', name: 'Banking', count: news.filter(n => n.category === 'banking').length },
    { id: 'commodities', name: 'Commodities', count: news.filter(n => n.category === 'commodities').length }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <FiTrendingUp className="text-green-500" />;
      case 'negative': return <FiTrendingDown className="text-red-500" />;
      default: return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Market News</h1>
          <p className="text-muted-foreground">Stay updated with the latest financial news and market insights</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
        </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="inline-block px-2 py-1 bg-muted text-xs font-medium rounded text-muted-foreground">
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  {getSentimentIcon(item.sentiment)}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <FiClock size={14} />
                  {item.publishedAt}
                </span>
                <span>{item.source}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${getSentimentColor(item.sentiment)}`}>
                  {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                </span>
                <a
                  href={item.url}
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Read More
                  <FiCheck size={14} />
                </a>
              </div>
              </div>
            </div>
        ))}
            </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No news found for the selected category.</p>
        </div>
      )}
    </div>
  );
};

export default News;
