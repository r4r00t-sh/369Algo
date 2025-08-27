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
    // Fyers dark theme colors - exact match
    primary: '#6366f1', // Purple accent from the image
    primaryHover: '#4f46e5',
    secondary: '#94a3b8',
    success: '#10b981', // Green for profits
    warning: '#f59e0b', // Orange for warnings
    error: '#ef4444', // Red for losses
    info: '#3b82f6',
    
    // Fyers dark dashboard colors - exact match
    background: '#000000', // Pure black background
    surface: '#0a0a0a', // Very dark surface
    surfaceHover: '#1a1a1a',
    surfaceBorder: '#1f1f1f',
    cardBackground: '#0a0a0a',
    
    text: '#ffffff', // Pure white text
    textSecondary: '#e5e5e5', // Light grey text
    textMuted: '#a3a3a3', // Muted text
    
    white: '#ffffff',
    black: '#000000',
    
    // Trading specific colors - Fyers dark style
    positive: '#10b981', // Green for profits
    negative: '#ef4444', // Red for losses
    neutral: '#94a3b8',
    
    // Chart colors - Fyers dark style
    chartLine: '#6366f1',
    chartArea: 'rgba(99, 102, 241, 0.1)',
    chartGrid: '#1f1f1f',
    
    // Fyers specific colors
    fyersBlue: '#6366f1',
    fyersDarkBlue: '#4f46e5',
    fyersLightBlue: '#818cf8',
    fyersAccent: '#06b6d4',
    
    // Navigation and UI specific colors
    navActive: '#6366f1', // Purple for active nav
    navInactive: '#64748b',
    navBackground: '#000000',
    
    // Table and data colors
    tableHeader: '#0a0a0a',
    tableRow: '#000000',
    tableBorder: '#1f1f1f',
    
    // Status colors
    statusActive: '#10b981',
    statusPending: '#f59e0b',
    statusInactive: '#64748b',
    
    // Button colors
    buttonPrimary: '#6366f1',
    buttonSecondary: '#1f1f1f',
    buttonSuccess: '#10b981',
    buttonDanger: '#ef4444',
  },
  
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.8), 0 1px 2px 0 rgba(0, 0, 0, 0.7)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.9), 0 2px 4px -1px rgba(0, 0, 0, 0.8)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.9), 0 4px 6px -2px rgba(0, 0, 0, 0.8)',
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.8), 0 1px 2px 0 rgba(0, 0, 0, 0.7)',
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

// Dark theme matching the trading platform image
export const darkTradingTheme = {
  colors: {
    // Primary colors matching the image
    primary: '#22c55e', // Green accent from the image
    primaryHover: '#16a34a',
    secondary: '#64748b',
    success: '#22c55e', // Green for profits
    warning: '#f59e0b', // Orange for warnings
    error: '#ef4444', // Red for losses
    info: '#3b82f6',
    
    // Dark background colors matching the image
    background: '#0f0f0f', // Very dark background
    surface: '#1a1a1a', // Dark surface
    surfaceHover: '#2a2a2a',
    surfaceBorder: '#333333',
    cardBackground: '#1a1a1a',
    
    // Text colors matching the image
    text: '#ffffff', // White text
    textSecondary: '#e5e5e5', // Light grey text
    textMuted: '#a3a3a3', // Muted text
    
    white: '#ffffff',
    black: '#000000',
    
    // Trading specific colors matching the image
    positive: '#22c55e', // Green for profits (like NIFTY Realty +16.80)
    negative: '#ef4444', // Red for losses (like Nifty Next 50 -62.10)
    neutral: '#94a3b8',
    
    // Chart colors
    chartLine: '#22c55e',
    chartArea: 'rgba(34, 197, 94, 0.1)',
    chartGrid: '#333333',
    
    // Navigation colors
    navActive: '#22c55e', // Green for active nav items
    navInactive: '#64748b',
    
    // Table colors
    tableHeader: '#1a1a1a',
    tableRow: '#0f0f0f',
    tableBorder: '#333333',
    
    // Status colors
    statusActive: '#22c55e',
    statusPending: '#f59e0b',
    statusInactive: '#64748b',
    
    // Fyers specific colors (required for compatibility)
    fyersBlue: '#22c55e',
    fyersDarkBlue: '#16a34a',
    fyersLightBlue: '#4ade80',
    fyersAccent: '#06b6d4',
  },
  
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.4)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.5)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.4)',
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

// Extend the DefaultTheme interface for styled-components
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
