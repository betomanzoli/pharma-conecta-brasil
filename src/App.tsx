
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import CompanyProfile from '@/pages/CompanyProfile';
import Laboratory from '@/pages/Laboratory';
import MentorshipPage from '@/pages/MentorshipPage';
import ChatPage from '@/pages/ChatPage';
import VideoSessionPage from '@/pages/VideoSessionPage';
import DashboardPage from '@/pages/DashboardPage';
import PerformancePage from '@/pages/PerformancePage';
import ProfilePage from '@/pages/ProfilePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ForumPage from '@/pages/ForumPage';
import KnowledgePage from '@/pages/KnowledgePage';
import MarketplacePage from '@/pages/MarketplacePage';
import PartnershipPage from '@/pages/PartnershipPage';
import StrategicPlan from '@/pages/StrategicPlan';
import AutomationPage from '@/pages/AutomationPage';
import AIHubPage from '@/pages/AIHubPage';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except for 408, 429
        if (error?.status >= 400 && error?.status < 500 && ![408, 429].includes(error?.status)) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  console.log('App starting - QueryClient initialized');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/company" element={<CompanyProfile />} />
              <Route path="/laboratory" element={<Laboratory />} />
              <Route path="/mentorship" element={<MentorshipPage />} />
              <Route path="/chat/:recipientId?" element={<ChatPage />} />
              <Route path="/video/:sessionId" element={<VideoSessionPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/knowledge" element={<KnowledgePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/partnerships" element={<PartnershipPage />} />
              <Route path="/strategic-plan" element={<StrategicPlan />} />
              <Route path="/automation" element={<AutomationPage />} />
              <Route path="/ai/*" element={<AIHubPage />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
