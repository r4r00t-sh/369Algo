import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ColorType } from 'lightweight-charts';

interface TradingViewChartProps {
  symbol: string;
  height: number;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol, height }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a1a' },
        textColor: '#ffffff',
      },
      grid: {
        vertLines: { color: '#333333' },
        horzLines: { color: '#333333' },
      },
      rightPriceScale: {
        borderColor: '#333333',
      },
      timeScale: {
        borderColor: '#333333',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Sample candlestick data
    const candleData = [
      { time: '2024-01-01', open: 100, high: 105, low: 98, close: 103 },
      { time: '2024-01-02', open: 103, high: 108, low: 101, close: 106 },
      { time: '2024-01-03', open: 106, high: 110, low: 104, close: 109 },
      { time: '2024-01-04', open: 109, high: 112, low: 107, close: 111 },
      { time: '2024-01-05', open: 111, high: 115, low: 109, close: 113 },
    ];

    // Add candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Set data
    candleSeries.setData(candleData);

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height]);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">{symbol} Chart</h3>
      </div>
      <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }} />
    </div>
  );
};

export default TradingViewChart;
