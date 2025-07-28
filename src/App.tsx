
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Marketplace from "./pages/Marketplace";
import Network from "./pages/Network";
import Forums from "./pages/Forums";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import AdvancedAnalyticsPage from "./pages/AdvancedAnalyticsPage";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import AIDashboardPage from "./pages/AIDashboardPage";
import Security from "./pages/Security";
import StrategicPlan from "./pages/StrategicPlan";

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
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/network" element={<Network />} />
            <Route path="/forums" element={<Forums />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
            <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
            <Route path="/analytics-page" element={<AnalyticsPage />} />
            <Route path="/ai-dashboard" element={<AIDashboardPage />} />
            <Route path="/security" element={<Security />} />
            <Route path="/strategic-plan" element={<StrategicPlan />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
