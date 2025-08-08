import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/LoadingSpinner";
import Analytics from "./pages/Analytics";
import Verification from "./pages/Verification";

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

// Additional pages that were referenced but missing
const MasterAIHub = lazy(() => import("./pages/MasterAIHub"));
const Forums = lazy(() => import("./pages/Forums"));
const Network = lazy(() => import("./pages/Network"));
const MentorshipHub = lazy(() => import("./pages/MentorshipHub"));
const Projects = lazy(() => import("./pages/Projects"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const Marketplace = lazy(() => import("./pages/Marketplace"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes - sem MainLayout */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/demo" element={<PlatformDemo />} />
                
                {/* Protected Routes - com MainLayout integrado */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/automation" element={<AutomationPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/knowledge" element={<KnowledgeLibrary />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/verification" element={<Verification />} />
                
                {/* Dashboard variants for different user types */}
                <Route path="/dashboard/general" element={<DashboardGeneral />} />
                <Route path="/dashboard/company" element={<DashboardCompany />} />
                <Route path="/dashboard/laboratory" element={<DashboardLaboratory />} />
                <Route path="/dashboard/consultant" element={<DashboardConsultant />} />
                
                {/* Additional functional pages */}
                <Route path="/master-ai" element={<MasterAIHub />} />
                <Route path="/forums" element={<Forums />} />
                <Route path="/network" element={<Network />} />
                <Route path="/mentorship" element={<MentorshipHub />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/marketplace" element={<Marketplace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
