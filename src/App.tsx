
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Dashboard from '@/pages/Dashboard';
import Companies from '@/pages/Companies';
import Laboratories from '@/pages/Laboratories';
import Consultants from '@/pages/Consultants';
import Projects from '@/pages/Projects';
import Profile from '@/pages/Profile';
import Security from '@/pages/Security';
import Regulatory from '@/pages/Regulatory';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import StatusPage from '@/pages/Status';
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster />
        <ErrorBoundary>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/laboratories" element={<Laboratories />} />
              <Route path="/consultants" element={<Consultants />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/security" element={<Security />} />
              <Route path="/regulatory" element={<Regulatory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
