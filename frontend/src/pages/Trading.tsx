import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ColorType } from 'lightweight-charts';

const Trading: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
          const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
      height: 400,
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

    // Sample volume data
    const volumeData = [
      { time: '2024-01-01', value: 1000, color: '#22c55e' },
      { time: '2024-01-02', value: 1200, color: '#22c55e' },
      { time: '2024-01-03', value: 800, color: '#ef4444' },
      { time: '2024-01-04', value: 1500, color: '#22c55e' },
      { time: '2024-01-05', value: 900, color: '#ef4444' },
    ];

    // Add candlestick series
          const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Add volume series
          const volSeries = chart.addHistogramSeries({
      color: '#22c55e',
            priceFormat: {
              type: 'volume',
            },
            priceScaleId: '',
          });

    // Set data
    candleSeries.setData(candleData);
    volSeries.setData(volumeData);

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
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Trading</h1>
          <p className="text-muted-foreground">Advanced trading interface with real-time charts</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Buy
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Sell
          </button>
                </div>
                </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Price Chart</h3>
            <div ref={chartContainerRef} className="w-full h-[400px]" />
          </div>
        </div>

        {/* Trading Panel */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Quick Trade</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Symbol</label>
                <input
                  type="text"
                  placeholder="e.g., RELIANCE"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Buy
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Sell
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Market Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">LTP</span>
                <span className="font-semibold">₹2,450.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Change</span>
                <span className="text-green-500 font-semibold">+45.00 (+1.87%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-semibold">1,234,567</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
