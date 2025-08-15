
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AIMatchingPage from './pages/AIMatchingPage';
import MarketplacePage from './pages/MarketplacePage';
import ProjectsPage from './pages/ProjectsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import VerificationPage from './pages/VerificationPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ReportsPage from './pages/ReportsPage';
import SecurityDashboard from './components/security/SecurityDashboard';
import PhaseConsolidationDashboard from './components/strategic-plan/consolidation/PhaseConsolidationDashboard';
import EnhancedChatSystem from './components/chat/EnhancedChatSystem';
import AIAssistantPage from './pages/AIAssistantPage';
import GenerativeAIHubPage from './pages/GenerativeAIHubPage';
import AgentsDashboardPage from './pages/AgentsDashboardPage';
import KnowledgeHubPage from './pages/KnowledgeHubPage';
import StartHerePage from './pages/StartHerePage';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AIHealthCheckPage from './pages/AIHealthCheckPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Onboarding */}
            <Route path="/start-here" element={<StartHerePage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Navigation />
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/matching" element={
              <ProtectedRoute>
                <Navigation />
                <AIMatchingPage />
              </ProtectedRoute>
            } />
            
            <Route path="/marketplace" element={
              <ProtectedRoute>
                <Navigation />
                <MarketplacePage />
              </ProtectedRoute>
            } />
            
            <Route path="/chat" element={
              <ProtectedRoute>
                <Navigation />
                <EnhancedChatSystem />
              </ProtectedRoute>
            } />
            
            <Route path="/projects" element={
              <ProtectedRoute>
                <Navigation />
                <ProjectsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Navigation />
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            
            {/* AI Tools */}
            <Route path="/ai-assistant" element={
              <ProtectedRoute>
                <Navigation />
                <AIAssistantPage />
              </ProtectedRoute>
            } />
            
            <Route path="/agents-dashboard" element={
              <ProtectedRoute>
                <Navigation />
                <AgentsDashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/knowledge-hub" element={
              <ProtectedRoute>
                <Navigation />
                <KnowledgeHubPage />
              </ProtectedRoute>
            } />
            
            <Route path="/generative-ai" element={
              <ProtectedRoute>
                <Navigation />
                <GenerativeAIHubPage />
              </ProtectedRoute>
            } />
            
            <Route path="/ai-health" element={
              <ProtectedRoute>
                <Navigation />
                <AIHealthCheckPage />
              </ProtectedRoute>
            } />
            
            {/* System */}
            <Route path="/reports" element={
              <ProtectedRoute>
                <Navigation />
                <ReportsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/security" element={
              <ProtectedRoute>
                <Navigation />
                <SecurityDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/subscription" element={
              <ProtectedRoute>
                <Navigation />
                <SubscriptionPage />
              </ProtectedRoute>
            } />
            
            {/* Legacy routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Navigation />
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/verification" element={
              <ProtectedRoute>
                <Navigation />
                <VerificationPage />
              </ProtectedRoute>
            } />
            
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Navigation />
                <NotificationsPage />
              </ProtectedRoute>
            } />
            
            {/* Strategic Plan Routes */}
            <Route path="/strategic-consolidation" element={
              <ProtectedRoute>
                <Navigation />
                <PhaseConsolidationDashboard />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <Navigation />
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
