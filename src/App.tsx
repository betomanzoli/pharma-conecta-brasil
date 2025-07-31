
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import PWAManager from "./components/pwa/PWAManager";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Companies from "./pages/Companies";
import Laboratories from "./pages/Laboratories";
import Consultants from "./pages/Consultants";
import Marketplace from "./pages/Marketplace";
import Projects from "./pages/Projects";
import Network from "./pages/Network";
import Forums from "./pages/Forums";
import ForumTopic from "./pages/ForumTopic";
import KnowledgeLibrary from "./pages/KnowledgeLibrary";
import Reports from "./pages/Reports";
import Opportunities from "./pages/Opportunities";
import Regulatory from "./pages/Regulatory";
import ANVISAAlerts from "./pages/ANVISAAlerts";
import AnvisaLegis from "./pages/AnvisaLegis";
import ConhecimentoBrasileiro from "./pages/ConhecimentoBrasileiro";
import MentorshipHub from "./pages/MentorshipHub";
import VideoMeeting from "./pages/VideoMeeting";
import ChatPage from "./pages/ChatPage";
import Suppliers from "./pages/Suppliers";
import SearchLaboratories from "./pages/SearchLaboratories";
import SearchConsultants from "./pages/SearchConsultants";
import SearchPage from "./pages/SearchPage";
import Events from "./pages/Events";
import Careers from "./pages/Careers";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Ethics from "./pages/Ethics";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";
import PlatformDemo from "./pages/PlatformDemo";
import DashboardCompany from "./pages/DashboardCompany";
import DashboardLaboratory from "./pages/DashboardLaboratory";
import DashboardConsultant from "./pages/DashboardConsultant";
import DashboardGeneral from "./pages/DashboardGeneral";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import Analytics from "./pages/Analytics";
import AnalyticsPage from "./pages/AnalyticsPage";
import AdvancedAnalyticsPage from "./pages/AdvancedAnalyticsPage";
import PerformancePage from "./pages/PerformancePage";
import ReportsPage from "./pages/ReportsPage";
import AIPage from "./pages/AIPage";
import AIDashboardPage from "./pages/AIDashboardPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import AllApisDashboard from "./pages/AllApisDashboard";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentsPage from "./pages/PaymentsPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import Subscription from "./pages/Subscription";
import RatingsPage from "./pages/RatingsPage";
import Gamification from "./pages/Gamification";
import StrategicPlan from "./pages/StrategicPlan";
import EquipmentMarketplace from "./pages/EquipmentMarketplace";
import OnboardingWizard from "./pages/OnboardingWizard";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <PWAManager />
            <div className="min-h-screen bg-background font-sans antialiased">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard-company" element={<DashboardCompany />} />
                <Route path="/dashboard-laboratory" element={<DashboardLaboratory />} />
                <Route path="/dashboard-consultant" element={<DashboardConsultant />} />
                <Route path="/dashboard-general" element={<DashboardGeneral />} />
                <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/laboratories" element={<Laboratories />} />
                <Route path="/consultants" element={<Consultants />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/equipment-marketplace" element={<EquipmentMarketplace />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/strategic-plan" element={<StrategicPlan />} />
                <Route path="/network" element={<Network />} />
                <Route path="/forums" element={<Forums />} />
                <Route path="/forum/:id" element={<ForumTopic />} />
                <Route path="/knowledge" element={<KnowledgeLibrary />} />
                <Route path="/conhecimento-brasileiro" element={<ConhecimentoBrasileiro />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/reports-page" element={<ReportsPage />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/regulatory" element={<Regulatory />} />
                <Route path="/anvisa-alerts" element={<ANVISAAlerts />} />
                <Route path="/anvisa-legis" element={<AnvisaLegis />} />
                <Route path="/mentorship" element={<MentorshipHub />} />
                <Route path="/video-meeting" element={<VideoMeeting />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/search-laboratories" element={<SearchLaboratories />} />
                <Route path="/search-consultants" element={<SearchConsultants />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/events" element={<Events />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/ethics" element={<Ethics />} />
                <Route path="/security" element={<Security />} />
                <Route path="/demo" element={<PlatformDemo />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/analytics-page" element={<AnalyticsPage />} />
                <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/ai" element={<AIPage />} />
                <Route path="/ai-dashboard" element={<AIDashboardPage />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/all-apis" element={<AllApisDashboard />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/subscription-page" element={<SubscriptionPage />} />
                <Route path="/ratings" element={<RatingsPage />} />
                <Route path="/gamification" element={<Gamification />} />
                <Route path="/onboarding" element={<OnboardingWizard />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
            <Sonner />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
