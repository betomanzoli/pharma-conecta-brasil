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
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import KnowledgeLibrary from "./pages/KnowledgeLibrary";
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
import MasterAIHub from "./pages/MasterAIHub";
import PromptsLibrary from "./pages/PromptsLibrary";
import SynergyDashboard from "./pages/SynergyDashboard";

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
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/knowledge" element={<KnowledgeLibrary />} />
            <Route path="/ai/hub" element={<MasterAIHub />} />
            <Route path="/master-ai" element={<MasterAIHub />} />
            <Route path="/ai/analista-projetos" element={<ProjectAnalyst />} />
            <Route path="/ai/estrategista" element={<BusinessStrategist />} />
            <Route path="/ai/tecnico-regulatorio" element={<TechnicalRegulatory />} />
            <Route path="/ai/documentacao" element={<DocumentationAssistant />} />
            <Route path="/ai/coordenacao" element={<Coordination />} />
            <Route path="/ai/prompts" element={<PromptsLibrary />} />
            <Route path="/ai/sinergia" element={<SynergyDashboard />} />
            <Route path="/regulatory/alerts" element={<ANVISAAlerts />} />
            <Route path="/ai/federal" element={<FederalLearning />} />
            <Route path="/automation" element={<AutomationPage />} />
            <Route path="/ai/matching-dashboard" element={<AIMatchingDashboard />} />
            <Route path="/ai/business-metrics" element={<BusinessMetricsDashboard />} />
            
            {/* Rotas em falta adicionadas */}
            <Route path="/about" element={<Index />} />
            <Route path="/contact" element={<Index />} />
            <Route path="/careers" element={<Index />} />
            <Route path="/privacy" element={<Index />} />
            <Route path="/terms" element={<Index />} />
            <Route path="/ethics" element={<Index />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/status" element={<Index />} />
            <Route path="/verification" element={<Profile />} />
            <Route path="/demo" element={<Index />} />
            
            {/* Rotas protegidas que estavam em falta */}
            <Route path="/network" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/mentorship" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/apis" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
