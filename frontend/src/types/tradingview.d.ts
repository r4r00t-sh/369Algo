declare global {
  interface Window {
    TradingView: {
      widget: new (config: TradingViewWidgetConfig) => any;
    };
  }
  
  const TradingView: {
    widget: new (config: TradingViewWidgetConfig) => any;
  };
}

export interface TradingViewWidgetConfig {
  symbol: string;
  interval?: string;
  timezone?: string;
  theme?: 'light' | 'dark';
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id: string;
  width?: number | string;
  height?: number | string;
  studies?: string[];
  disabled_features?: string[];
  enabled_features?: string[];
  overrides?: Record<string, any>;
}

export {};
