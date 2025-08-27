import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
    </button>
  );
};

export default ThemeToggle;
