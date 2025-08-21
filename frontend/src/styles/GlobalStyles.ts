import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.4;
    font-size: 14px;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }

  /* Fyers-style scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.surfaceBorder};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textMuted};
  }

  /* Trading-specific styles */
  .positive {
    color: ${({ theme }) => theme.colors.positive} !important;
  }

  .negative {
    color: ${({ theme }) => theme.colors.negative} !important;
  }

  .neutral {
    color: ${({ theme }) => theme.colors.neutral} !important;
  }

  /* Fyers card styles */
  .fyers-card {
    background: ${({ theme }) => theme.colors.cardBackground};
    border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    box-shadow: ${({ theme }) => theme.shadows.card};
    padding: ${({ theme }) => theme.spacing.md};
  }

  /* Fyers button styles */
  .fyers-btn {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.small};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primaryHover};
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }

  .fyers-btn-secondary {
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: white;
    }
  }

  /* Fyers input styles */
  .fyers-input {
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
    transition: border-color ${({ theme }) => theme.transitions.fast};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }

  /* Fyers table styles */
  .fyers-table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
      text-align: left;
      border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
      font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    }
    
    th {
      background: ${({ theme }) => theme.colors.surface};
      font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
      color: ${({ theme }) => theme.colors.textSecondary};
    }
    
    tr:hover {
      background: ${({ theme }) => theme.colors.surfaceHover};
    }
  }

  /* Utility classes */
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }
  
  .font-bold { font-weight: ${({ theme }) => theme.typography.fontWeights.bold}; }
  .font-medium { font-weight: ${({ theme }) => theme.typography.fontWeights.medium}; }
  .font-normal { font-weight: ${({ theme }) => theme.typography.fontWeights.normal}; }
  
  .text-xs { font-size: ${({ theme }) => theme.typography.fontSizes.xs}; }
  .text-sm { font-size: ${({ theme }) => theme.typography.fontSizes.sm}; }
  .text-md { font-size: ${({ theme }) => theme.typography.fontSizes.md}; }
  .text-lg { font-size: ${({ theme }) => theme.typography.fontSizes.lg}; }
  
  .mb-1 { margin-bottom: ${({ theme }) => theme.spacing.xs}; }
  .mb-2 { margin-bottom: ${({ theme }) => theme.spacing.sm}; }
  .mb-3 { margin-bottom: ${({ theme }) => theme.spacing.md}; }
  .mb-4 { margin-bottom: ${({ theme }) => theme.spacing.lg}; }
  
  .mt-1 { margin-top: ${({ theme }) => theme.spacing.xs}; }
  .mt-2 { margin-top: ${({ theme }) => theme.spacing.sm}; }
  .mt-3 { margin-top: ${({ theme }) => theme.spacing.md}; }
  .mt-4 { margin-top: ${({ theme }) => theme.spacing.lg}; }
  
  .p-1 { padding: ${({ theme }) => theme.spacing.xs}; }
  .p-2 { padding: ${({ theme }) => theme.spacing.sm}; }
  .p-3 { padding: ${({ theme }) => theme.spacing.md}; }
  .p-4 { padding: ${({ theme }) => theme.spacing.lg}; }
`;
