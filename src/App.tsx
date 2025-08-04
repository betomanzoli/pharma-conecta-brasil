
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy load components
const Index = lazy(() => import('@/pages/Index'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const AIPage = lazy(() => import('@/pages/AIPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const MasterAIHub = lazy(() => import('@/pages/MasterAIHub'));
const PlatformDemo = lazy(() => import('@/pages/PlatformDemo'));
const Verification = lazy(() => import('@/pages/Verification'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Additional pages
const Companies = lazy(() => import('@/pages/Companies'));
const Laboratories = lazy(() => import('@/pages/Laboratories'));
const Consultants = lazy(() => import('@/pages/Consultants'));
const Network = lazy(() => import('@/pages/Network'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));
const Projects = lazy(() => import('@/pages/Projects'));
const MentorshipHub = lazy(() => import('@/pages/MentorshipHub'));
const Regulatory = lazy(() => import('@/pages/Regulatory'));
const Reports = lazy(() => import('@/pages/Reports'));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <NotificationProvider>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/demo" element={<PlatformDemo />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    } />
                    <Route path="/ai" element={
                      <ProtectedRoute>
                        <AIPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat" element={
                      <ProtectedRoute>
                        <ChatPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/master-ai" element={
                      <ProtectedRoute>
                        <MasterAIHub />
                      </ProtectedRoute>
                    } />
                    <Route path="/verification" element={
                      <ProtectedRoute>
                        <Verification />
                      </ProtectedRoute>
                    } />
                    
                    {/* Entity-specific routes */}
                    <Route path="/companies" element={
                      <ProtectedRoute>
                        <Companies />
                      </ProtectedRoute>
                    } />
                    <Route path="/laboratories" element={
                      <ProtectedRoute>
                        <Laboratories />
                      </ProtectedRoute>
                    } />
                    <Route path="/consultants" element={
                      <ProtectedRoute>
                        <Consultants />
                      </ProtectedRoute>
                    } />
                    <Route path="/network" element={
                      <ProtectedRoute>
                        <Network />
                      </ProtectedRoute>
                    } />
                    <Route path="/marketplace" element={
                      <ProtectedRoute>
                        <Marketplace />
                      </ProtectedRoute>
                    } />
                    <Route path="/projects" element={
                      <ProtectedRoute>
                        <Projects />
                      </ProtectedRoute>
                    } />
                    <Route path="/mentorship" element={
                      <ProtectedRoute>
                        <MentorshipHub />
                      </ProtectedRoute>
                    } />
                    <Route path="/regulatory" element={
                      <ProtectedRoute>
                        <Regulatory />
                      </ProtectedRoute>
                    } />
                    <Route path="/reports" element={
                      <ProtectedRoute>
                        <Reports />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <AdminRoute>
                        <AdminPage />
                      </AdminRoute>
                    } />
                    
                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster />
                <Sonner />
              </NotificationProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
