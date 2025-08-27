import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';
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
import Options from './pages/Options';
import MarketData from './pages/MarketData';
import News from './pages/News';
import Strategies from './pages/Strategies';
import Watchlist from './pages/Watchlist';
import Screeners from './pages/Screeners';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import DarkTradingDemo from './components/DarkTradingDemo';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <DynamicContent children={children} />
      </div>
    </SidebarProvider>
  );
};

// Dynamic Content Component
const DynamicContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarWidth } = useSidebar();
  
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: sidebarWidth }}>
      <Navbar />
      <main style={{ flex: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
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
                
                <Route path="/options" element={
                  <ProtectedRoute>
                    <Layout>
                      <Options />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Layout>
                      <Orders />
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
                
                <Route path="/strategies" element={
                  <ProtectedRoute>
                    <Layout>
                      <Strategies />
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
                
                <Route path="/screener" element={
                  <ProtectedRoute>
                    <Layout>
                      <Screeners />
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
                
                {/* Temporary Demo Route */}
                <Route path="/demo-dark-trading" element={<DarkTradingDemo />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
                  </AuthProvider>
      </ErrorBoundary>
  );
}

export default App;
