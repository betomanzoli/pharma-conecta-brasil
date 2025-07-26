
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
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import ChatPage from "./pages/ChatPage";
import KnowledgeLibrary from "./pages/KnowledgeLibrary";
import Forums from "./pages/Forums";
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
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/knowledge" element={<KnowledgeLibrary />} />
                  <Route path="/forum" element={<Forums />} />
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
