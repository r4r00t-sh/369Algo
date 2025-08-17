export const lightTheme = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    background: '#ffffff',
    surface: '#f8fafc',
    surfaceHover: '#f1f5f9',
    surfaceBorder: '#e2e8f0',
    
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    
    white: '#ffffff',
    black: '#000000',
    
    // Trading specific colors
    positive: '#10b981',
    negative: '#ef4444',
    neutral: '#64748b',
    
    // Chart colors
    chartLine: '#2563eb',
    chartArea: 'rgba(37, 99, 235, 0.1)',
    chartGrid: '#e2e8f0',
  },
  
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  typography: {
    fontSizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

export const darkTheme = {
  colors: {
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    secondary: '#94a3b8',
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    background: '#0f172a',
    surface: '#1e293b',
    surfaceHover: '#334155',
    surfaceBorder: '#475569',
    
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    
    white: '#ffffff',
    black: '#000000',
    
    // Trading specific colors
    positive: '#22c55e',
    negative: '#f87171',
    neutral: '#94a3b8',
    
    // Chart colors
    chartLine: '#3b82f6',
    chartArea: 'rgba(59, 130, 246, 0.1)',
    chartGrid: '#334155',
  },
  
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
  },
  
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  typography: {
    fontSizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

export type Theme = typeof lightTheme;
export type ThemeColors = typeof lightTheme.colors;
