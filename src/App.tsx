
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const AutomationPage = lazy(() => import("./pages/AutomationPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const PlatformDemo = lazy(() => import("./pages/PlatformDemo"));
const KnowledgeLibrary = lazy(() => import("./pages/KnowledgeLibrary"));

// User type specific dashboards
const DashboardGeneral = lazy(() => import("./pages/DashboardGeneral"));
const DashboardCompany = lazy(() => import("./pages/DashboardCompany"));
const DashboardLaboratory = lazy(() => import("./pages/DashboardLaboratory"));
const DashboardConsultant = lazy(() => import("./pages/DashboardConsultant"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/demo" element={<PlatformDemo />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/automation" element={<AutomationPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/knowledge" element={<KnowledgeLibrary />} />
              
              {/* Dashboard variants for different user types */}
              <Route path="/dashboard/general" element={<DashboardGeneral />} />
              <Route path="/dashboard/company" element={<DashboardCompany />} />
              <Route path="/dashboard/laboratory" element={<DashboardLaboratory />} />
              <Route path="/dashboard/consultant" element={<DashboardConsultant />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
