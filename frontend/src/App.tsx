import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { useTheme } from './hooks/useTheme';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Trading from './pages/Trading';
import MarketData from './pages/MarketData';
import News from './pages/News';
import Watchlist from './pages/Watchlist';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '240px' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const { theme } = useTheme();

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/portfolio" element={
                  <ProtectedRoute>
                    <Layout>
                      <Portfolio />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/trading" element={
                  <ProtectedRoute>
                    <Layout>
                      <Trading />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/market" element={
                  <ProtectedRoute>
                    <Layout>
                      <MarketData />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/news" element={
                  <ProtectedRoute>
                    <Layout>
                      <News />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/watchlist" element={
                  <ProtectedRoute>
                    <Layout>
                      <Watchlist />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
