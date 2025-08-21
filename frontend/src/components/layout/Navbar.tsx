import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiSearch, 
  FiBell, 
  FiUser, 
  FiSettings,
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const NavbarContainer = styled.nav`
  height: 64px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 0;
  z-index: 99;
  margin-left: 240px; // Account for sidebar width
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ theme }) => theme.colors.background};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  width: 16px;
  height: 16px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const UserRole = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.large};
  min-width: 200px;
  z-index: 1000;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const DropdownItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
  
  &:first-child {
    border-radius: ${({ theme }) => theme.borderRadius.medium} ${({ theme }) => theme.borderRadius.medium} 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 ${({ theme }) => theme.borderRadius.medium} ${({ theme }) => theme.borderRadius.medium};
    border-top: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <NavbarContainer>
      <LeftSection>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search stocks, indices, or news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </LeftSection>
      
      <RightSection>
        <ThemeToggle />
        
        <IconButton>
          <FiBell />
          <NotificationBadge />
        </IconButton>
        
        <div style={{ position: 'relative' }}>
          <UserSection onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <UserAvatar>
              {user?.full_name?.charAt(0) || 'U'}
            </UserAvatar>
            <UserInfo>
              <UserName>{user?.full_name || 'User'}</UserName>
              <UserRole>Trader</UserRole>
            </UserInfo>
            <FiChevronDown style={{ marginLeft: '4px' }} />
          </UserSection>
          
          <DropdownMenu isOpen={isDropdownOpen}>
            <DropdownItem onClick={() => setIsDropdownOpen(false)}>
              <FiUser />
              Profile
            </DropdownItem>
            <DropdownItem onClick={() => setIsDropdownOpen(false)}>
              <FiSettings />
              Settings
            </DropdownItem>
            <DropdownItem onClick={handleLogout}>
              <FiLogOut />
              Logout
            </DropdownItem>
          </DropdownMenu>
        </div>
      </RightSection>
    </NavbarContainer>
  );
};

export default Navbar;
