
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import { ComplianceFooter } from "@/components/ComplianceFooter";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardGeneral from "./pages/DashboardGeneral";
import DashboardCompany from "./pages/DashboardCompany";
import DashboardConsultant from "./pages/DashboardConsultant";
import DashboardLaboratory from "./pages/DashboardLaboratory";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import Profile from "./pages/Profile";
import Companies from "./pages/Companies";
import Consultants from "./pages/Consultants";
import Laboratories from "./pages/Laboratories";
import SearchConsultants from "./pages/SearchConsultants";
import SearchLaboratories from "./pages/SearchLaboratories";
import SearchPage from "./pages/SearchPage";
import Suppliers from "./pages/Suppliers";
import Network from "./pages/Network";
import Marketplace from "./pages/Marketplace";
import Projects from "./pages/Projects";
import Opportunities from "./pages/Opportunities";
import KnowledgeLibrary from "./pages/KnowledgeLibrary";
import MentorshipHub from "./pages/MentorshipHub";
import Forums from "./pages/Forums";
import ForumTopic from "./pages/ForumTopic";
import ChatPage from "./pages/ChatPage";
import Events from "./pages/Events";
import Regulatory from "./pages/Regulatory";
import ANVISAAlerts from "./pages/ANVISAAlerts";
import AnvisaLegis from "./pages/AnvisaLegis";
import ConhecimentoBrasileiro from "./pages/ConhecimentoBrasileiro";
import Analytics from "./pages/Analytics";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdvancedAnalyticsPage from "./pages/AdvancedAnalyticsPage";
import PerformancePage from "./pages/PerformancePage";
import Reports from "./pages/Reports";
import ReportsPage from "./pages/ReportsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import AllApisDashboard from "./pages/AllApisDashboard";
import NotificationsPage from "./pages/NotificationsPage";
import RatingsPage from "./pages/RatingsPage";
import Subscription from "./pages/Subscription";
import SubscriptionPage from "./pages/SubscriptionPage";
import PaymentsPage from "./pages/PaymentsPage";
import AdminPage from "./pages/AdminPage";
import AIPage from "./pages/AIPage";
import AIDashboardPage from "./pages/AIDashboardPage";
import PlatformDemo from "./pages/PlatformDemo";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Ethics from "./pages/Ethics";
import NotFound from "./pages/NotFound";
import EquipmentMarketplace from "./pages/EquipmentMarketplace";
import VideoMeeting from "./pages/VideoMeeting";
import Gamification from "./pages/Gamification";
import OnboardingWizard from "./pages/OnboardingWizard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastProvider>
          <AuthProvider>
            <NotificationProvider>
              <ErrorBoundary>
                <BrowserRouter>
                  <div className="min-h-screen bg-background">
                    <PWAInstallPrompt />
                    <UpdatePrompt />
                    <OfflineIndicator />
                    <UnifiedHeader />
                    <main className="flex-1">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/ethics" element={<Ethics />} />
                        <Route path="/demo" element={<PlatformDemo />} />
                        
                        <Route path="/onboarding" element={<ProtectedRoute><OnboardingWizard /></ProtectedRoute>} />
                        
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/dashboard/general" element={<ProtectedRoute><DashboardGeneral /></ProtectedRoute>} />
                        <Route path="/dashboard/company" element={<ProtectedRoute><DashboardCompany /></ProtectedRoute>} />
                        <Route path="/dashboard/consultant" element={<ProtectedRoute><DashboardConsultant /></ProtectedRoute>} />
                        <Route path="/dashboard/laboratory" element={<ProtectedRoute><DashboardLaboratory /></ProtectedRoute>} />
                        <Route path="/dashboard/enhanced" element={<ProtectedRoute><EnhancedDashboard /></ProtectedRoute>} />
                        
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/companies" element={<Companies />} />
                        <Route path="/consultants" element={<Consultants />} />
                        <Route path="/laboratories" element={<Laboratories />} />
                        <Route path="/search/consultants" element={<SearchConsultants />} />
                        <Route path="/search/laboratories" element={<SearchLaboratories />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/suppliers" element={<Suppliers />} />
                        
                        <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
                        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                        <Route path="/equipment" element={<ProtectedRoute><EquipmentMarketplace /></ProtectedRoute>} />
                        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
                        <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
                        
                        <Route path="/knowledge" element={<ProtectedRoute><KnowledgeLibrary /></ProtectedRoute>} />
                        <Route path="/mentorship" element={<ProtectedRoute><MentorshipHub /></ProtectedRoute>} />
                        <Route path="/video/:roomId" element={<ProtectedRoute><VideoMeeting /></ProtectedRoute>} />
                        <Route path="/forums" element={<ProtectedRoute><Forums /></ProtectedRoute>} />
                        <Route path="/forums/:id" element={<ProtectedRoute><ForumTopic /></ProtectedRoute>} />
                        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                        <Route path="/gamification" element={<ProtectedRoute><Gamification /></ProtectedRoute>} />
                        
                        <Route path="/regulatory" element={<ProtectedRoute><Regulatory /></ProtectedRoute>} />
                        <Route path="/anvisa-alerts" element={<ProtectedRoute><ANVISAAlerts /></ProtectedRoute>} />
                        <Route path="/anvisa-legis" element={<ProtectedRoute><AnvisaLegis /></ProtectedRoute>} />
                        <Route path="/conhecimento-brasileiro" element={<ProtectedRoute><ConhecimentoBrasileiro /></ProtectedRoute>} />
                        
                        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                        <Route path="/analytics/basic" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                        <Route path="/analytics/advanced" element={<ProtectedRoute><AdvancedAnalyticsPage /></ProtectedRoute>} />
                        <Route path="/performance" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
                        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                        <Route path="/reports/detailed" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                        
                        <Route path="/integrations" element={<ProtectedRoute><IntegrationsPage /></ProtectedRoute>} />
                        <Route path="/integrations/all-apis" element={<ProtectedRoute><AllApisDashboard /></ProtectedRoute>} />
                        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                        <Route path="/ratings" element={<ProtectedRoute><RatingsPage /></ProtectedRoute>} />
                        
                        <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                        <Route path="/subscription/manage" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
                        <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
                        
                        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                        <Route path="/ai" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
                        <Route path="/ai/dashboard" element={<ProtectedRoute><AIDashboardPage /></ProtectedRoute>} />
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <ComplianceFooter />
                  </div>
                  <Toaster />
                </BrowserRouter>
              </ErrorBoundary>
            </NotificationProvider>
          </AuthProvider>
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
