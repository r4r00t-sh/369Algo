import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { FiUser, FiSettings, FiInfo, FiSave, FiEdit2, FiShield, FiBell, FiMonitor } from 'react-icons/fi';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

const SectionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  background: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.surfaceBorder : theme.colors.primary};
  color: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.text : theme.colors.white};

  &:hover {
    background: ${({ theme, variant }) =>
      variant === 'secondary' ? theme.colors.surfaceHover : theme.colors.primaryHover};
    transform: translateY(-1px);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
    transform: none;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const InfoItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
`;

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InfoValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-transform: uppercase;
  background: ${({ theme, status }) => {
    switch (status) {
      case 'enabled': return theme.colors.success;
      case 'disabled': return theme.colors.error;
      default: return theme.colors.info;
    }
  }};
  color: ${({ theme }) => theme.colors.white};
`;

const Message = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  
  background: ${({ theme, type }) => {
    switch (type) {
      case 'success': return `${theme.colors.success}20`;
      case 'error': return `${theme.colors.error}20`;
      default: return `${theme.colors.info}20`;
    }
  }};
  
  color: ${({ theme, type }) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      default: return theme.colors.info;
    }
  }};
  
  border: 1px solid ${({ theme, type }) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      default: return theme.colors.info;
    }
  }};
`;

interface UserProfile {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserPreferences {
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  trading: {
    default_order_type: string;
    confirm_orders: boolean;
    show_pnl: boolean;
  };
  display: {
    currency: string;
    timezone: string;
    date_format: string;
  };
}

interface SystemInfo {
  api_version: string;
  features: {
    multi_database: boolean;
    caching: boolean;
    time_series: boolean;
  };
  brokers: {
    zerodha: boolean;
    angel_one: boolean;
    upstox: boolean;
  };
  databases: {
    postgresql: string;
    redis: string;
    influxdb: string;
    clickhouse: string;
    mongodb: string;
  };
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  const [profileForm, setProfileForm] = useState({
    username: '',
    full_name: ''
  });

  const [preferencesForm, setPreferencesForm] = useState({
    theme: 'auto',
    email_notifications: true,
    push_notifications: false,
    sms_notifications: false,
    default_order_type: 'market',
    confirm_orders: true,
    show_pnl: true,
    currency: 'USD',
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      // Fetch profile
      const profileResponse = await api.get('/api/settings/profile');
      setProfile(profileResponse.data);
      setProfileForm({
        username: profileResponse.data.username,
        full_name: profileResponse.data.full_name
      });

      // Fetch preferences
      const preferencesResponse = await api.get('/api/settings/preferences');
      setPreferences(preferencesResponse.data);
      setPreferencesForm({
        theme: preferencesResponse.data.theme,
        email_notifications: preferencesResponse.data.notifications.email,
        push_notifications: preferencesResponse.data.notifications.push,
        sms_notifications: preferencesResponse.data.notifications.sms,
        default_order_type: preferencesResponse.data.trading.default_order_type,
        confirm_orders: preferencesResponse.data.trading.confirm_orders,
        show_pnl: preferencesResponse.data.trading.show_pnl,
        currency: preferencesResponse.data.display.currency,
        timezone: preferencesResponse.data.display.timezone,
        date_format: preferencesResponse.data.display.date_format
      });

      // Fetch system info
      const systemResponse = await api.get('/api/settings/system');
      setSystemInfo(systemResponse.data);
      
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const updateData = {
        username: profileForm.username,
        full_name: profileForm.full_name
      };

      await api.put('/api/settings/profile', updateData);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      fetchSettings(); // Refresh data
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const updateData = {
        theme: preferencesForm.theme,
        notifications: {
          email: preferencesForm.email_notifications,
          push: preferencesForm.push_notifications,
          sms: preferencesForm.sms_notifications
        },
        trading: {
          default_order_type: preferencesForm.default_order_type,
          confirm_orders: preferencesForm.confirm_orders,
          show_pnl: preferencesForm.show_pnl
        },
        display: {
          currency: preferencesForm.currency,
          timezone: preferencesForm.timezone,
          date_format: preferencesForm.date_format
        }
      };

      await api.put('/api/settings/preferences', updateData);
      
      setMessage({ type: 'success', text: 'Preferences updated successfully!' });
      fetchSettings(); // Refresh data
    } catch (error) {
      console.error('Failed to update preferences:', error);
      setMessage({ type: 'error', text: 'Failed to update preferences. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
          Loading settings...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Settings</Title>
        <Subtitle>Manage your account preferences and system configuration</Subtitle>
      </Header>

      {message && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}

      <SettingsGrid>
        {/* Profile Settings */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <FiUser />
            </SectionIcon>
            <SectionTitle>Profile Information</SectionTitle>
          </SectionHeader>

          <Form onSubmit={handleProfileUpdate}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                required
              />
            </FormGroup>

            <Button type="submit" disabled={isSaving}>
              <FiSave />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </Form>
        </Section>

        {/* Preferences Settings */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <FiSettings />
            </SectionIcon>
            <SectionTitle>Preferences</SectionTitle>
          </SectionHeader>

          <Form onSubmit={handlePreferencesUpdate}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="theme">Theme</Label>
                <Select
                  id="theme"
                  value={preferencesForm.theme}
                  onChange={(e) => setPreferencesForm({ ...preferencesForm, theme: e.target.value })}
                >
                  <option value="auto">Auto (System)</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  id="currency"
                  value={preferencesForm.currency}
                  onChange={(e) => setPreferencesForm({ ...preferencesForm, currency: e.target.value })}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  id="timezone"
                  value={preferencesForm.timezone}
                  onChange={(e) => setPreferencesForm({ ...preferencesForm, timezone: e.target.value })}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Asia/Kolkata">India Standard Time</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="date_format">Date Format</Label>
                <Select
                  id="date_format"
                  value={preferencesForm.date_format}
                  onChange={(e) => setPreferencesForm({ ...preferencesForm, date_format: e.target.value })}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label htmlFor="default_order_type">Default Order Type</Label>
                <Select
                  id="default_order_type"
                  value={preferencesForm.default_order_type}
                  onChange={(e) => setPreferencesForm({ ...preferencesForm, default_order_type: e.target.value })}
                >
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                  <option value="stop_loss">Stop Loss</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="currency">Trading Preferences</Label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <CheckboxGroup>
                    <Checkbox
                      id="confirm_orders"
                      type="checkbox"
                      checked={preferencesForm.confirm_orders}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, confirm_orders: e.target.checked })}
                    />
                    <Label htmlFor="confirm_orders">Confirm orders before execution</Label>
                  </CheckboxGroup>
                  <CheckboxGroup>
                    <Checkbox
                      id="show_pnl"
                      type="checkbox"
                      checked={preferencesForm.show_pnl}
                      onChange={(e) => setPreferencesForm({ ...preferencesForm, show_pnl: e.target.checked })}
                    />
                    <Label htmlFor="show_pnl">Show P&L in real-time</Label>
                  </CheckboxGroup>
                </div>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Notification Preferences</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <CheckboxGroup>
                  <Checkbox
                    id="email_notifications"
                    type="checkbox"
                    checked={preferencesForm.email_notifications}
                    onChange={(e) => setPreferencesForm({ ...preferencesForm, email_notifications: e.target.checked })}
                  />
                  <Label htmlFor="email_notifications">Email notifications</Label>
                </CheckboxGroup>
                <CheckboxGroup>
                  <Checkbox
                    id="push_notifications"
                    type="checkbox"
                    checked={preferencesForm.push_notifications}
                    onChange={(e) => setPreferencesForm({ ...preferencesForm, push_notifications: e.target.checked })}
                  />
                  <Label htmlFor="push_notifications">Push notifications</Label>
                </CheckboxGroup>
                <CheckboxGroup>
                  <Checkbox
                    id="sms_notifications"
                    type="checkbox"
                    checked={preferencesForm.sms_notifications}
                    onChange={(e) => setPreferencesForm({ ...preferencesForm, sms_notifications: e.target.checked })}
                  />
                  <Label htmlFor="sms_notifications">SMS notifications</Label>
                </CheckboxGroup>
              </div>
            </FormGroup>

            <Button type="submit" disabled={isSaving}>
              <FiSave />
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </Form>
        </Section>

        {/* System Information */}
        <Section>
          <SectionHeader>
            <SectionIcon>
              <FiInfo />
            </SectionIcon>
            <SectionTitle>System Information</SectionTitle>
          </SectionHeader>

          {systemInfo && (
            <div>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>API Version</InfoLabel>
                  <InfoValue>{systemInfo.api_version}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Multi-Database</InfoLabel>
                  <StatusBadge status={systemInfo.features.multi_database ? 'enabled' : 'disabled'}>
                    {systemInfo.features.multi_database ? 'Enabled' : 'Disabled'}
                  </StatusBadge>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Caching</InfoLabel>
                  <StatusBadge status={systemInfo.features.caching ? 'enabled' : 'disabled'}>
                    {systemInfo.features.caching ? 'Enabled' : 'Disabled'}
                  </StatusBadge>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Time Series</InfoLabel>
                  <StatusBadge status={systemInfo.features.time_series ? 'enabled' : 'disabled'}>
                    {systemInfo.features.time_series ? 'Enabled' : 'Disabled'}
                  </StatusBadge>
                </InfoItem>
              </InfoGrid>

              <div style={{ marginTop: '24px' }}>
                <h4 style={{ marginBottom: '16px', color: '#0f172a' }}>Broker Connections</h4>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>Zerodha</InfoLabel>
                    <StatusBadge status={systemInfo.brokers.zerodha ? 'enabled' : 'disabled'}>
                      {systemInfo.brokers.zerodha ? 'Connected' : 'Not Connected'}
                    </StatusBadge>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Angel One</InfoLabel>
                    <StatusBadge status={systemInfo.brokers.angel_one ? 'enabled' : 'disabled'}>
                      {systemInfo.brokers.angel_one ? 'Connected' : 'Not Connected'}
                    </StatusBadge>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Upstox</InfoLabel>
                    <StatusBadge status={systemInfo.brokers.upstox ? 'enabled' : 'disabled'}>
                      {systemInfo.brokers.upstox ? 'Connected' : 'Not Connected'}
                    </StatusBadge>
                  </InfoItem>
                </InfoGrid>
              </div>

              <div style={{ marginTop: '24px' }}>
                <h4 style={{ marginBottom: '16px', color: '#0f172a' }}>Database Status</h4>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>PostgreSQL</InfoLabel>
                    <InfoValue>{systemInfo.databases.postgresql}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Redis</InfoLabel>
                    <InfoValue>{systemInfo.databases.redis}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>InfluxDB</InfoLabel>
                    <InfoValue>{systemInfo.databases.influxdb}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>ClickHouse</InfoLabel>
                    <InfoValue>{systemInfo.databases.clickhouse}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>MongoDB</InfoLabel>
                    <InfoValue>{systemInfo.databases.mongodb}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </div>
            </div>
          )}
        </Section>
      </SettingsGrid>
    </Container>
  );
};

export default Settings;
