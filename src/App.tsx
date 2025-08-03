import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useAuth } from './contexts/AuthContext';
import Account from './pages/Account';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Demo from './pages/Demo';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import SecurityDashboard from './components/security/SecurityDashboard';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import UserTypeSelection from './pages/UserTypeSelection';
import Verification from "@/pages/Verification";

function App() {
  const { session, loading, supabase } = useAuth();

  useEffect(() => {
    document.title = 'PharmaConnect Brasil';
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Autenticação</h1>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'github']}
                redirectTo="https://lovable.dev/dashboard"
              />
            </div>
          </div>
        } />
        <Route path="/select-user-type" element={<ProtectedRoute><UserTypeSelection /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><SecurityDashboard /></ProtectedRoute>} />
        <Route path="/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
