import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient } from 'react-query';
import LandingPage from '@/pages/LandingPage';
import SignUp from '@/pages/SignUp';
import SignIn from '@/pages/SignIn';
import Dashboard from '@/pages/Dashboard';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProfilePage from '@/pages/ProfilePage';
import RegulatoryAlertsPage from '@/pages/RegulatoryAlertsPage';
import { Toaster } from "@/components/ui/toaster"
import NotificationContainer from '@/components/notifications/NotificationContainer';
import { NotificationProvider } from '@/contexts/NotificationContext';

function App() {
  return (
    <QueryClient>
      <AuthProvider>
        <NotificationProvider>
          <Toaster />
          <NotificationContainer />
          <Suspense fallback={<div>Loading...</div>}>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/regulatory-alerts" element={<RegulatoryAlertsPage />} />
              </Routes>
            </Router>
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </QueryClient>
  );
}

export default App;
