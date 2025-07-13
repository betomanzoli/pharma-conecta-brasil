
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import EnhancedDashboard from '@/pages/EnhancedDashboard';
import Profile from '@/pages/Profile';
import Regulatory from '@/pages/Regulatory';
import NotificationsPage from '@/pages/NotificationsPage';
import Network from '@/pages/Network';
import Marketplace from '@/pages/Marketplace';
import Projects from '@/pages/Projects';
import MentorshipHub from '@/pages/MentorshipHub';
import Forums from '@/pages/Forums';
import ForumTopic from '@/pages/ForumTopic';
import KnowledgeLibrary from '@/pages/KnowledgeLibrary';
import IntegrationsPage from '@/pages/IntegrationsPage';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import ReportsPage from '@/pages/ReportsPage';
import Subscription from '@/pages/Subscription';
import Companies from '@/pages/Companies';
import Laboratories from '@/pages/Laboratories';
import Consultants from '@/pages/Consultants';
import Suppliers from '@/pages/Suppliers';
import Careers from '@/pages/Careers';
import Events from '@/pages/Events';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import ChatPage from '@/pages/ChatPage';
import PaymentsPage from '@/pages/PaymentsPage';
import AdvancedAnalyticsPage from '@/pages/AdvancedAnalyticsPage';
import PlatformDemoPage from '@/pages/PlatformDemo';
import SearchLaboratories from '@/pages/SearchLaboratories';
import SearchConsultants from '@/pages/SearchConsultants';
import ANVISAAlerts from '@/pages/ANVISAAlerts';
import Opportunities from '@/pages/Opportunities';
import AIPage from '@/pages/AIPage';
import AdminPage from '@/pages/AdminPage';
import AIDashboardPage from '@/pages/AIDashboardPage';
import SearchPage from '@/pages/SearchPage';
import DashboardCompany from '@/pages/DashboardCompany';
import DashboardConsultant from '@/pages/DashboardConsultant';
import DashboardLaboratory from '@/pages/DashboardLaboratory';
import AnalyticsPage from '@/pages/AnalyticsPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import ConhecimentoBrasileiro from '@/pages/ConhecimentoBrasileiro';
import AnvisaLegis from '@/pages/AnvisaLegis';
import AllApisDashboard from '@/pages/AllApisDashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from "@/components/ui/toaster"
import NotificationContainer from '@/components/notifications/NotificationContainer';
import PushNotificationPrompt from '@/components/notifications/PushNotificationPrompt';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';
import OfflineIndicator from '@/components/pwa/OfflineIndicator';
import UpdatePrompt from '@/components/pwa/UpdatePrompt';
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
          <PushNotificationPrompt />
          <PWAInstallPrompt />
          <OfflineIndicator />
          <UpdatePrompt />
          <Suspense fallback={<div>Loading...</div>}>
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
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
