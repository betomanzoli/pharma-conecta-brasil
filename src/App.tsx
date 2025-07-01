
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Regulatory from '@/pages/Regulatory';
import { Toaster } from "@/components/ui/toaster"
import NotificationContainer from '@/components/notifications/NotificationContainer';
import { NotificationProvider } from '@/contexts/NotificationContext';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Toaster />
          <NotificationContainer />
          <Suspense fallback={<div>Loading...</div>}>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/regulatory" element={<Regulatory />} />
              </Routes>
            </Router>
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
