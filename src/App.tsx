
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import UnifiedHeader from "@/components/UnifiedHeader";
import ComplianceFooter from "@/components/ComplianceFooter";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CompanyProfile from "./pages/CompanyProfile";
import LabProfile from "./pages/LabProfile";
import ConsultantProfile from "./pages/ConsultantProfile";
import Marketplace from "./pages/Marketplace";
import ChatPage from "./pages/ChatPage";
import KnowledgeBase from "./pages/KnowledgeBase";
import Forum from "./pages/Forum";
import MentorshipHub from "./pages/MentorshipHub";
import EquipmentMarketplace from "./pages/EquipmentMarketplace";
import VideoMeeting from "./pages/VideoMeeting";
import Gamification from "./pages/Gamification";
import OnboardingWizard from "./pages/OnboardingWizard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-background">
              <PWAInstallPrompt />
              <UnifiedHeader />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/company-profile" element={<CompanyProfile />} />
                  <Route path="/lab-profile" element={<LabProfile />} />
                  <Route path="/consultant-profile" element={<ConsultantProfile />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/knowledge" element={<KnowledgeBase />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/mentorship" element={<MentorshipHub />} />
                  <Route path="/equipment" element={<EquipmentMarketplace />} />
                  <Route path="/video" element={<VideoMeeting />} />
                  <Route path="/gamification" element={<Gamification />} />
                  <Route path="/onboarding" element={<OnboardingWizard />} />
                </Routes>
              </main>
              
              <ComplianceFooter />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
