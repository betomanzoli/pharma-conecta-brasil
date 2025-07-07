
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
                <Route path="/dashboard" element={<EnhancedDashboard />} />
                <Route path="/dashboard-legacy" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/network" element={<Network />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/mentorship" element={<MentorshipHub />} />
                <Route path="/forums" element={<Forums />} />
                <Route path="/forums/:topicId" element={<ForumTopic />} />
                <Route path="/knowledge" element={<KnowledgeLibrary />} />
                <Route path="/regulatory" element={<Regulatory />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/reports-legacy" element={<Reports />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/demo" element={<PlatformDemoPage />} />
                
                {/* Search Routes */}
                <Route path="/search/laboratories" element={<SearchLaboratories />} />
                <Route path="/search/consultants" element={<SearchConsultants />} />
                <Route path="/anvisa-alerts" element={<ANVISAAlerts />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/ai" element={<AIPage />} />
                <Route path="/admin" element={<AdminPage />} />
                
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
