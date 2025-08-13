
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";

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
            <Route path="/dashboard" element={<Index />} />
            <Route path="/profile" element={<Index />} />
            <Route path="/projects" element={<Index />} />
            <Route path="/network" element={<Index />} />
            <Route path="/mentorship" element={<Index />} />
            <Route path="/library" element={<Index />} />
            <Route path="/forum" element={<Index />} />
            <Route path="/chat" element={<Index />} />
            <Route path="/ai" element={<Index />} />
            <Route path="/pricing" element={<Index />} />
            <Route path="/about" element={<Index />} />
            <Route path="/contact" element={<Index />} />
            <Route path="/help" element={<Index />} />
            <Route path="/privacy" element={<Index />} />
            <Route path="/terms" element={<Index />} />
            <Route path="/ethics" element={<Index />} />
            <Route path="/status" element={<Index />} />
            <Route path="/demo" element={<Index />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
