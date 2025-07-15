
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const EnhancedDashboard = lazy(() => import('@/pages/EnhancedDashboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const Regulatory = lazy(() => import('@/pages/Regulatory'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const Network = lazy(() => import('@/pages/Network'));
const Marketplace = lazy(() => import('@/pages/Marketplace'));
const Projects = lazy(() => import('@/pages/Projects'));
const MentorshipHub = lazy(() => import('@/pages/MentorshipHub'));
const Forums = lazy(() => import('@/pages/Forums'));
const ForumTopic = lazy(() => import('@/pages/ForumTopic'));
const KnowledgeLibrary = lazy(() => import('@/pages/KnowledgeLibrary'));
const IntegrationsPage = lazy(() => import('@/pages/IntegrationsPage'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Reports = lazy(() => import('@/pages/Reports'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const Subscription = lazy(() => import('@/pages/Subscription'));
const Companies = lazy(() => import('@/pages/Companies'));
const Laboratories = lazy(() => import('@/pages/Laboratories'));
const Consultants = lazy(() => import('@/pages/Consultants'));
const Suppliers = lazy(() => import('@/pages/Suppliers'));
const Careers = lazy(() => import('@/pages/Careers'));
const Events = lazy(() => import('@/pages/Events'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const PaymentsPage = lazy(() => import('@/pages/PaymentsPage'));
const AdvancedAnalyticsPage = lazy(() => import('@/pages/AdvancedAnalyticsPage'));
const PlatformDemoPage = lazy(() => import('@/pages/PlatformDemo'));
const SearchLaboratories = lazy(() => import('@/pages/SearchLaboratories'));
const SearchConsultants = lazy(() => import('@/pages/SearchConsultants'));
const ANVISAAlerts = lazy(() => import('@/pages/ANVISAAlerts'));
const Opportunities = lazy(() => import('@/pages/Opportunities'));
const AIPage = lazy(() => import('@/pages/AIPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const AIDashboardPage = lazy(() => import('@/pages/AIDashboardPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const DashboardCompany = lazy(() => import('@/pages/DashboardCompany'));
const DashboardConsultant = lazy(() => import('@/pages/DashboardConsultant'));
const DashboardLaboratory = lazy(() => import('@/pages/DashboardLaboratory'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const SubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'));
const ConhecimentoBrasileiro = lazy(() => import('@/pages/ConhecimentoBrasileiro'));
const AnvisaLegis = lazy(() => import('@/pages/AnvisaLegis'));
const AllApisDashboard = lazy(() => import('@/pages/AllApisDashboard'));
const PerformancePage = lazy(() => import('@/pages/PerformancePage'));
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from "@/components/ui/toaster"
import NotificationContainer from '@/components/notifications/NotificationContainer';
import PushNotificationPrompt from '@/components/notifications/PushNotificationPrompt';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';
import OfflineIndicator from '@/components/pwa/OfflineIndicator';
import UpdatePrompt from '@/components/pwa/UpdatePrompt';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ToastProvider } from '@/contexts/ToastContext';

// Create optimized QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos por padrão
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests up to 3 times
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus only if data is stale
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: 'always',
      // Background refetch interval
      refetchInterval: false,
      // Enable network mode to handle offline scenarios
      networkMode: 'online'
    },
    mutations: {
      // Retry mutations on network error
      retry: 1,
      // Show loading state for mutations
      onMutate: () => {
        // Global loading state can be handled here
      },
      onError: (error) => {
        console.error('Mutation error:', error);
      },
      onSuccess: () => {
        // Global success handling
      }
    }
  }
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              <Toaster />
              <NotificationContainer />
              <PushNotificationPrompt />
              <PWAInstallPrompt />
              <OfflineIndicator />
              <UpdatePrompt />
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-primary/20 rounded-full mb-4"></div>
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              </div>
            }>
              <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/laboratories" element={<Laboratories />} />
                <Route path="/consultants" element={<Consultants />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/events" element={<Events />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><EnhancedDashboard /></ProtectedRoute>} />
                <Route path="/dashboard-legacy" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
                <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                <Route path="/mentorship" element={<ProtectedRoute><MentorshipHub /></ProtectedRoute>} />
                <Route path="/forums" element={<ProtectedRoute><Forums /></ProtectedRoute>} />
                <Route path="/forums/:topicId" element={<ProtectedRoute><ForumTopic /></ProtectedRoute>} />
                <Route path="/knowledge" element={<ProtectedRoute><KnowledgeLibrary /></ProtectedRoute>} />
                <Route path="/regulatory" element={<ProtectedRoute><Regulatory /></ProtectedRoute>} />
                <Route path="/integrations" element={<ProtectedRoute adminOnly><IntegrationsPage /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/advanced-analytics" element={<ProtectedRoute><AdvancedAnalyticsPage /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                <Route path="/reports-legacy" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
                <Route path="/demo" element={<ProtectedRoute><PlatformDemoPage /></ProtectedRoute>} />
                
                {/* Search Routes */}
                <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                <Route path="/search/laboratories" element={<ProtectedRoute><SearchLaboratories /></ProtectedRoute>} />
                <Route path="/search/consultants" element={<ProtectedRoute><SearchConsultants /></ProtectedRoute>} />
                <Route path="/anvisa-alerts" element={<ProtectedRoute><ANVISAAlerts /></ProtectedRoute>} />
                <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
                <Route path="/ai" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
                <Route path="/ai-dashboard" element={<ProtectedRoute><AIDashboardPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
                
                {/* Brazilian Specific Routes */}
                <Route path="/dashboard/company" element={<ProtectedRoute allowedUserTypes={['company']}><DashboardCompany /></ProtectedRoute>} />
                <Route path="/dashboard/consultant" element={<ProtectedRoute allowedUserTypes={['consultant']}><DashboardConsultant /></ProtectedRoute>} />
                <Route path="/dashboard/laboratory" element={<ProtectedRoute allowedUserTypes={['laboratory']}><DashboardLaboratory /></ProtectedRoute>} />
                <Route path="/analytics/brazilian" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                <Route path="/subscription/brazilian" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
                <Route path="/conhecimento-brasileiro" element={<ProtectedRoute><ConhecimentoBrasileiro /></ProtectedRoute>} />
                
                {/* API Integration Routes */}
                <Route path="/anvisa-legis" element={<ProtectedRoute><AnvisaLegis /></ProtectedRoute>} />
                <Route path="/apis" element={<ProtectedRoute><AllApisDashboard /></ProtectedRoute>} />
                <Route path="/performance" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Router>
            </Suspense>
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
