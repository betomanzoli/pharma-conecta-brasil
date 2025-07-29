
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ToastProvider } from "./contexts/ToastContext";
import GlobalHelpSystem from "./components/layout/GlobalHelpSystem";
import PWAInstallPrompt from "./components/pwa/PWAInstallPrompt";
import UpdatePrompt from "./components/pwa/UpdatePrompt";
import OfflineIndicator from "./components/pwa/OfflineIndicator";
import PWAManager from "./components/pwa/PWAManager";
import AutoOnboarding from "./components/onboarding/AutoOnboarding";
import RealTimeMonitor from "./components/monitoring/RealTimeMonitor";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Network from "./pages/Network";
import Projects from "./pages/Projects";
import Marketplace from "./pages/Marketplace";
import Analytics from "./pages/Analytics";
import Security from "./pages/Security";
import StrategicPlan from "./pages/StrategicPlan";
import Reports from "./pages/Reports";
import NotificationsPage from "./pages/NotificationsPage";
import PerformancePage from "./pages/PerformancePage";
import AdminPage from "./pages/AdminPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <Toaster />
            <Sonner />
            <OfflineIndicator />
            <PWAInstallPrompt />
            <UpdatePrompt />
            <PWAManager />
            <AutoOnboarding />
            <RealTimeMonitor />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/network" element={<Network />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/security" element={<Security />} />
                <Route path="/strategic-plan" element={<StrategicPlan />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <GlobalHelpSystem />
            </BrowserRouter>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
