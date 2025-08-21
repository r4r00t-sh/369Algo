import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiTrendingUp, 
  FiBarChart, 
  FiBookmark, 
  FiSettings, 
  FiPieChart
} from 'react-icons/fi';

const SidebarContainer = styled.div`
  width: 240px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto;
`;

const LogoSection = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`;

const LogoText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const NavSection = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const NavTitle = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  border-right: 3px solid transparent;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
  
  &.active {
    background: ${({ theme }) => theme.colors.primary}10;
    color: ${({ theme }) => theme.colors.primary};
    border-right-color: ${({ theme }) => theme.colors.primary};
  }
  
  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/portfolio', label: 'Portfolio', icon: FiPieChart },
    { path: '/trading', label: 'Trading', icon: FiTrendingUp },
    { path: '/market', label: 'Market Data', icon: FiBarChart },
    { path: '/news', label: 'News', icon: FiBarChart },
    { path: '/watchlist', label: 'Watchlist', icon: FiBookmark },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <SidebarContainer>
      <LogoSection>
        <Logo>F</Logo>
        <LogoText>Trading</LogoText>
      </LogoSection>
      
      <NavSection>
        <NavTitle>Main Navigation</NavTitle>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavItem
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <Icon />
              {item.label}
            </NavItem>
          );
        })}
      </NavSection>
    </SidebarContainer>
  );
};

export default Sidebar;
