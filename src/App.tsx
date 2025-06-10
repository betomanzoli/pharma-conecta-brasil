
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Network from "./pages/Network";
import Marketplace from "./pages/Marketplace";
import Projects from "./pages/Projects";
import Regulatory from "./pages/Regulatory";
import MentorshipHub from "./pages/MentorshipHub";
import Forums from "./pages/Forums";
import KnowledgeLibrary from "./pages/KnowledgeLibrary";
import Laboratories from "./pages/Laboratories";
import Consultants from "./pages/Consultants";
import Suppliers from "./pages/Suppliers";
import Careers from "./pages/Careers";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";

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
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/network" element={<Network />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/regulatory" element={<Regulatory />} />
            <Route path="/mentorship" element={<MentorshipHub />} />
            <Route path="/forums" element={<Forums />} />
            <Route path="/knowledge" element={<KnowledgeLibrary />} />
            <Route path="/laboratories" element={<Laboratories />} />
            <Route path="/consultants" element={<Consultants />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/events" element={<Events />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
