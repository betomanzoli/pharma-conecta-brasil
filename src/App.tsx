
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import AnalyticsPage from "./pages/AnalyticsPage";
import Analytics from "./pages/Analytics";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import AdvancedAnalyticsPage from "./pages/AdvancedAnalyticsPage";
import AIPage from "./pages/AIPage";
import AIDashboardPage from "./pages/AIDashboardPage";
import ChatPage from "./pages/ChatPage";
import Verification from "./pages/Verification";
import MasterAIHub from "./pages/MasterAIHub";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<EnhancedDashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/analytics-page" element={<AnalyticsPage />} />
            <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
            <Route path="/ai" element={<AIPage />} />
            <Route path="/ai-dashboard" element={<AIDashboardPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/master-ai" element={<MasterAIHub />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
