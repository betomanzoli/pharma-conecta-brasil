
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import NotificationProvider from './components/notifications/NotificationContainer';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Network from './pages/Network';
import Marketplace from './pages/Marketplace';
import Projects from './pages/Projects';
import Regulatory from './pages/Regulatory';
import Forums from './pages/Forums';
import SubscriptionPage from './pages/SubscriptionPage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatPage from './pages/ChatPage';
import EnhancedDashboard from './pages/EnhancedDashboard';
import Analytics from './pages/Analytics';
import RatingsPage from './pages/RatingsPage';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <ErrorBoundary>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/register" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/network" element={<Network />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/regulatory" element={<Regulatory />} />
                  <Route path="/forums" element={<Forums />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/ratings" element={<RatingsPage />} />
                </Routes>
              </div>
              <Toaster />
            </ErrorBoundary>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
