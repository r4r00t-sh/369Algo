import React from 'react';
import BrokerConnection from '../components/common/BrokerConnection';

const Settings: React.FC = () => {
  const handleBrokerConnect = async (brokerData: any) => {
    try {
      // Call the backend API to connect broker
      const response = await fetch('/api/broker/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(brokerData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to connect broker');
      }
      
      // Show success message
      alert('Broker connected successfully!');
      
    } catch (error) {
      console.error('Error connecting broker:', error);
      alert('Failed to connect broker. Please try again.');
    }
  };

  const handleBrokerDisconnect = async (brokerId: number) => {
    try {
      // Call the backend API to disconnect broker
      const response = await fetch(`/api/broker/${brokerId}/disconnect`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to disconnect broker');
      }
      
      // Show success message
      alert('Broker disconnected successfully!');
      
    } catch (error) {
      console.error('Error disconnecting broker:', error);
      alert('Failed to disconnect broker. Please try again.');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
        Settings
      </h1>
      <p style={{ color: '#475569', fontSize: '14px', marginBottom: '32px' }}>
        Manage your account preferences and broker connections
      </p>
      
      <BrokerConnection />
    </div>
  );
};

export default Settings;
