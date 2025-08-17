import React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiPieChart, 
  FiTrendingUp, 
  FiBarChart3, 
  FiStar, 
  FiSettings 
} from 'react-icons/fi';

const SidebarContainer = styled.aside`
  width: 250px;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  height: 100vh;
  position: sticky;
  top: 0;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  border-right: 3px solid transparent;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border-right-color: ${({ theme }) => theme.colors.primaryHover};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const NavText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, text: 'Dashboard' },
    { path: '/portfolio', icon: FiPieChart, text: 'Portfolio' },
    { path: '/trading', icon: FiTrendingUp, text: 'Trading' },
    { path: '/market', icon: FiBarChart3, text: 'Market Data' },
    { path: '/watchlist', icon: FiStar, text: 'Watchlist' },
    { path: '/settings', icon: FiSettings, text: 'Settings' },
  ];

  return (
    <SidebarContainer>
      <NavList>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavItem
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <Icon />
              <NavText>{item.text}</NavText>
            </NavItem>
          );
        })}
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;
