
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import KnowledgeLibrary from "./pages/KnowledgeLibrary";
import EnhancedChat from "./pages/EnhancedChat";
import MasterAIHub from "./pages/MasterAIHub";
import ProjectManagerAI from "./pages/ProjectManagerAI";
import BusinessStrategistAI from "./pages/BusinessStrategistAI";
import TechnicalRegulatoryAI from "./pages/TechnicalRegulatoryAI";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/knowledge" element={<KnowledgeLibrary />} />
            <Route path="/chat" element={<EnhancedChat />} />
            <Route path="/ai" element={<MasterAIHub />} />
            <Route path="/ai/gerente-projetos" element={<ProjectManagerAI />} />
            <Route path="/ai/estrategista" element={<BusinessStrategistAI />} />
            <Route path="/ai/regulatorio" element={<TechnicalRegulatoryAI />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
