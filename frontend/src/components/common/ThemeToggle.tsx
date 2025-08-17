import React from 'react';
import styled from 'styled-components';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme }) => theme.shadows.small};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <FiSun /> : <FiMoon />}
    </ToggleButton>
  );
};

export default ThemeToggle;
