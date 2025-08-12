
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import EnhancedChat from "./pages/EnhancedChat";
import BusinessStrategistAI from "./pages/BusinessStrategistAI";
import TechnicalRegulatoryAI from "./pages/TechnicalRegulatoryAI";
import ProjectManagerAI from "./pages/ProjectManagerAI";
import DocumentationAssistantAI from "./pages/DocumentationAssistantAI";
import SynergyDashboard from "./pages/SynergyDashboard";
import PromptsLibrary from "./pages/PromptsLibrary";
import MasterAIHub from "./pages/MasterAIHub";
import FederalLearningSystem from "./components/ai/FederalLearningSystem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/chat" element={<EnhancedChat />} />
            <Route path="/ai" element={<MasterAIHub />} />
            <Route path="/ai/estrategista" element={<BusinessStrategistAI />} />
            <Route path="/ai/regulatorio" element={<TechnicalRegulatoryAI />} />
            <Route path="/ai/gerente-projetos" element={<ProjectManagerAI />} />
            <Route path="/ai/documentacao" element={<DocumentationAssistantAI />} />
            <Route path="/ai/sinergia" element={<SynergyDashboard />} />
            <Route path="/ai/prompts" element={<PromptsLibrary />} />
            <Route path="/ai/federal" element={<FederalLearningSystem />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
