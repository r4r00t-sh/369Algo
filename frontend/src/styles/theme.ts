// Removed unused import of DefaultTheme

export const lightTheme = {
  colors: {
    // Fyers signature colors
    primary: '#1e40af', // Fyers blue
    primaryHover: '#1d4ed8',
    secondary: '#475569',
    success: '#059669', // Green for profits
    warning: '#d97706', // Orange for warnings
    error: '#dc2626', // Red for losses
    info: '#2563eb',
    
    // Fyers dashboard background colors
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceHover: '#f1f5f9',
    surfaceBorder: '#e2e8f0',
    cardBackground: '#ffffff',
    
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    
    white: '#ffffff',
    black: '#000000',
    
    // Trading specific colors - Fyers style
    positive: '#059669', // Profit green
    negative: '#dc2626', // Loss red
    neutral: '#64748b',
    
    // Chart colors - Fyers style
    chartLine: '#1e40af',
    chartArea: 'rgba(30, 64, 175, 0.1)',
    chartGrid: '#e2e8f0',
    
    // Fyers specific colors
    fyersBlue: '#1e40af',
    fyersDarkBlue: '#1e3a8a',
    fyersLightBlue: '#3b82f6',
    fyersAccent: '#06b6d4',
  },
  
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  
  borderRadius: {
    small: '6px',
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
      xs: '11px',
      sm: '13px',
      md: '14px',
      lg: '16px',
      xl: '18px',
      xxl: '20px',
      xxxl: '24px',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
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
    // Fyers dark theme colors
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    secondary: '#94a3b8',
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    
    // Fyers dark dashboard colors
    background: '#0f172a',
    surface: '#1e293b',
    surfaceHover: '#334155',
    surfaceBorder: '#475569',
    cardBackground: '#1e293b',
    
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    
    white: '#ffffff',
    black: '#000000',
    
    // Trading specific colors - Fyers dark style
    positive: '#22c55e',
    negative: '#f87171',
    neutral: '#94a3b8',
    
    // Chart colors - Fyers dark style
    chartLine: '#3b82f6',
    chartArea: 'rgba(59, 130, 246, 0.1)',
    chartGrid: '#334155',
    
    // Fyers specific colors
    fyersBlue: '#3b82f6',
    fyersDarkBlue: '#1e40af',
    fyersLightBlue: '#60a5fa',
    fyersAccent: '#06b6d4',
  },
  
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
  },
  
  borderRadius: {
    small: '6px',
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
      xs: '11px',
      sm: '13px',
      md: '14px',
      lg: '16px',
      xl: '18px',
      xxl: '20px',
      xxxl: '24px',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
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

// Extend the DefaultTheme interface for styled-components
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
