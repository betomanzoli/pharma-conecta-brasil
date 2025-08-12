
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectRequest from "./pages/ProjectRequest";
import Matching from "./pages/Matching";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import CompanyProfile from "./pages/CompanyProfile";
import LaboratoryProfile from "./pages/LaboratoryProfile";
import ConsultantProfile from "./pages/ConsultantProfile";
import ProjectsPage from "./pages/ProjectsPage";
import CompaniesPage from "./pages/CompaniesPage";
import LaboratoriesPage from "./pages/LaboratoriesPage";
import ConsultantsPage from "./pages/ConsultantsPage";
import Analytics from "./pages/Analytics";
import Equipment from "./pages/Equipment";
import MentorshipPage from "./pages/MentorshipPage";
import KnowledgeLibrary from "./pages/KnowledgeLibrary";
import Forum from "./pages/Forum";
import ProjectAnalyst from "./pages/ProjectAnalyst";
import BusinessStrategist from "./pages/BusinessStrategist";
import TechnicalRegulatory from "./pages/TechnicalRegulatory";
import DocumentationAssistant from "./pages/DocumentationAssistant";
import Coordination from "./pages/Coordination";
import ANVISAAlerts from "./pages/ANVISAAlerts";
import FederalLearning from "./pages/FederalLearning";
import AutomationPage from "./pages/AutomationPage";
import AIMatchingDashboard from "./pages/AIMatchingDashboard";
import BusinessMetricsDashboard from "./pages/BusinessMetricsDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project-request" element={<ProjectRequest />} />
            <Route path="/matching" element={<Matching />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/company-profile" element={<CompanyProfile />} />
            <Route path="/laboratory-profile" element={<LaboratoryProfile />} />
            <Route path="/consultant-profile" element={<ConsultantProfile />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/laboratories" element={<LaboratoriesPage />} />
            <Route path="/consultants" element={<ConsultantsPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/mentorship" element={<MentorshipPage />} />
            <Route path="/knowledge" element={<KnowledgeLibrary />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/ai/analista-projetos" element={<ProjectAnalyst />} />
            <Route path="/ai/estrategista" element={<BusinessStrategist />} />
            <Route path="/ai/tecnico-regulatorio" element={<TechnicalRegulatory />} />
            <Route path="/ai/documentacao" element={<DocumentationAssistant />} />
            <Route path="/ai/coordenacao" element={<Coordination />} />
            <Route path="/regulatory/alerts" element={<ANVISAAlerts />} />
            <Route path="/ai/federal" element={<FederalLearning />} />
            <Route path="/automation" element={<AutomationPage />} />
            <Route path="/ai/matching-dashboard" element={<AIMatchingDashboard />} />
            <Route path="/ai/business-metrics" element={<BusinessMetricsDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
