import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TradingViewWidgetConfig } from '../../types/tradingview';

interface TradingViewChartProps {
  symbol: string;
  height?: number;
  width?: string;
}

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
`;

const ChartHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SymbolTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

const ChartWrapper = styled.div<{ height: number }>`
  height: ${({ height }) => height}px;
  width: 100%;
`;

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol, 
  height = 400 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // TradingView Chart.js configuration
    const chartConfig: TradingViewWidgetConfig = {
      symbol: symbol,
      interval: '1D',
      timezone: 'Asia/Kolkata',
      theme: 'light' as const,
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: chartContainerRef.current.id,
      width: chartContainerRef.current.clientWidth,
      height: height,
      studies: [
        'RSI@tv-basicstudies',
        'MACD@tv-basicstudies',
        'BB@tv-basicstudies'
      ],
      disabled_features: [
        'use_localstorage_for_settings',
        'volume_force_overlay',
        'create_volume_indicator_by_default'
      ],
      enabled_features: [
        'study_templates',
        'side_toolbar_in_fullscreen_mode'
      ],
      overrides: {
        'mainSeriesProperties.candleStyle.upColor': '#26a69a',
        'mainSeriesProperties.candleStyle.downColor': '#ef5350',
        'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
        'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350'
      }
    };

    // Create unique ID for the chart container
    const chartId = `tradingview-chart-${Date.now()}`;
    chartContainerRef.current.id = chartId;

    // Load TradingView Chart.js script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      try {
        if (window.TradingView) {
          new window.TradingView.widget({
            ...chartConfig,
            container_id: chartId,
          });
        }
      } catch (error) {
        console.error('Error creating TradingView widget:', error);
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load TradingView script');
    };

    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, height]);

  return (
    <ChartContainer>
      <ChartHeader>
        <SymbolTitle>{symbol}</SymbolTitle>
      </ChartHeader>
      <ChartWrapper height={height}>
        <div ref={chartContainerRef} />
      </ChartWrapper>
    </ChartContainer>
  );
};

export default TradingViewChart;
