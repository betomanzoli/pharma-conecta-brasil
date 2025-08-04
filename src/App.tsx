
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import Analytics from "./pages/Analytics";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import AdvancedAnalyticsPage from "./pages/AdvancedAnalyticsPage";
import AIPage from "./pages/AIPage";
import AIDashboardPage from "./pages/AIDashboardPage";
import ChatPage from "./pages/ChatPage";
import Verification from "./pages/Verification";
import MasterAIHub from "./pages/MasterAIHub";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <NotificationProvider>
          <ErrorBoundary>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/analytics-page" element={<AnalyticsPage />} />
                <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
                <Route path="/ai" element={<AIPage />} />
                <Route path="/ai-dashboard" element={<AIDashboardPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/master-ai" element={<MasterAIHub />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </NotificationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
