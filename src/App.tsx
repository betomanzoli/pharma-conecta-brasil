import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PWAManager } from "@/components/pwa/PWAManager";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import EnhancedDashboard from "@/pages/EnhancedDashboard";
import Security from "@/pages/Security";
import Marketplace from "@/pages/Marketplace";
import EnhancedMarketplace from "@/pages/EnhancedMarketplace";
import ProjectsPage from "@/pages/ProjectsPage";
import EnhancedProjectsPage from "@/components/projects/EnhancedProjectsPage";
import OptimizationPage from "@/pages/OptimizationPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <PWAManager />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
                <Route path="/security" element={<Security />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/enhanced-marketplace" element={<EnhancedMarketplace />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/enhanced-projects" element={<EnhancedProjectsPage />} />
                <Route path="/optimization" element={<OptimizationPage />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
