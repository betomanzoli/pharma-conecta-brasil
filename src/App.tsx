import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient } from 'react-query';
import NotificationProvider from './components/notifications/NotificationContainer';
import { ToastProvider } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import Network from './pages/Network';
import Marketplace from './pages/Marketplace';
import Projects from './pages/Projects';
import Regulatory from './pages/Regulatory';
import Mentorship from './pages/Mentorship';
import Forums from './pages/Forums';
import Knowledge from './pages/Knowledge';
import Integrations from './pages/Integrations';
import SubscriptionPage from './pages/SubscriptionPage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatPage from './pages/ChatPage';
import EnhancedDashboard from './pages/EnhancedDashboard';
import Analytics from './pages/Analytics';
import RatingsPage from './pages/RatingsPage';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              <ErrorBoundary>
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/edit-profile" element={<EditProfilePage />} />
                    <Route path="/network" element={<Network />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/regulatory" element={<Regulatory />} />
                    <Route path="/mentorship" element={<Mentorship />} />
                    <Route path="/forums" element={<Forums />} />
                    <Route path="/knowledge" element={<Knowledge />} />
                    <Route path="/integrations" element={<Integrations />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/ratings" element={<RatingsPage />} />
                  </Routes>
                </div>
              </ErrorBoundary>
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
