
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Import pages
import HomePage from "@/pages/HomePage";
import ProjectsPage from "@/pages/ProjectsPage";
import ConsultantsPage from "@/pages/ConsultantsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import AuthPage from "@/pages/AuthPage";
import AIAssistantPage from "@/pages/AIAssistantPage";
import MasterChatPage from "@/pages/MasterChatPage";
import NotificationsPage from "@/pages/NotificationsPage";
import AgentDashboard from "@/pages/ai/AgentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/consultants" element={<ConsultantsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/chat" element={<MasterChatPage />} />
              <Route path="/ai/dashboard" element={<AgentDashboard />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
            </Routes>
          </div>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
