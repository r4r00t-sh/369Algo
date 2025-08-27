import { useState, useEffect } from 'react';
import { lightTheme, darkTheme, darkTradingTheme, Theme } from '../styles/theme';

export type ThemeMode = 'light' | 'dark' | 'dark-trading';

export const useTheme = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['light', 'dark', 'dark-trading'].includes(savedTheme)) {
      return savedTheme as ThemeMode;
    }
    // Default to dark theme for Fyers-style design
    return 'dark';
  });

  const getTheme = (): Theme => {
    switch (themeMode) {
      case 'dark-trading':
        return darkTradingTheme;
      case 'dark':
        return darkTheme;
      default:
        return lightTheme;
    }
  };

  const theme: Theme = getTheme();

  const toggleTheme = () => {
    // Cycle through themes: light -> dark -> dark-trading -> light
    setThemeMode(prev => {
      switch (prev) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'dark-trading';
        case 'dark-trading':
          return 'light';
        default:
          return 'light';
      }
    });
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  useEffect(() => {
    localStorage.setItem('theme', themeMode);
    
    // Update document body class for global styling
    document.body.className = themeMode;
  }, [themeMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isDark = themeMode === 'dark' || themeMode === 'dark-trading';

  return { theme, isDark, themeMode, toggleTheme, setTheme };
};
