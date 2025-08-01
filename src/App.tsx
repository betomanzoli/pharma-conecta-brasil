import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import Dashboard from '@/pages/Dashboard';
import Companies from '@/pages/Companies';
import Laboratories from '@/pages/Laboratories';
import Consultants from '@/pages/Consultants';
import Projects from '@/pages/Projects';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Security from '@/pages/Security';
import Regulatory from '@/pages/Regulatory';
import Support from '@/pages/Support';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';
import AIInsights from '@/pages/AIInsights';
import ARVisualization from '@/pages/ARVisualization';
import StatusPage from '@/pages/Status';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <QueryClient>
      <Router>
        <Toaster />
        <ErrorBoundary>
          <AuthContextProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/laboratories" element={<Laboratories />} />
              <Route path="/consultants" element={<Consultants />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/security" element={<Security />} />
              <Route path="/regulatory" element={<Regulatory />} />
              <Route path="/support" element={<Support />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/ar-visualization" element={<ARVisualization />} />
              
              <Route path="/status" element={<StatusPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthContextProvider>
        </ErrorBoundary>
      </Router>
    </QueryClient>
  );
}

export default App;
