
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import ChatPage from '@/pages/ChatPage';
import PerformancePage from '@/pages/PerformancePage';
import StrategicPlan from '@/pages/StrategicPlan';
import AutomationPage from '@/pages/AutomationPage';
import GenerativeAIPage from '@/pages/GenerativeAIPage';
import ConsolidationPage from '@/pages/ConsolidationPage';
import AIAssistantPage from '@/pages/AIAssistantPage';
import MasterChatPage from '@/pages/MasterChatPage';
import EnhancedChat from '@/pages/EnhancedChat';
import OptimizationPage from '@/pages/OptimizationPage';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except for 408, 429
        if (error?.status >= 400 && error?.status < 500 && ![408, 429].includes(error?.status)) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  console.log('App starting - QueryClient initialized');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat/:recipientId?" element={<ChatPage />} />
              <Route path="/enhanced-chat" element={<EnhancedChat />} />
              <Route path="/master-chat" element={<MasterChatPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/strategic-plan" element={<StrategicPlan />} />
              <Route path="/automation" element={<AutomationPage />} />
              <Route path="/generative-ai" element={<GenerativeAIPage />} />
              <Route path="/consolidation" element={<ConsolidationPage />} />
              <Route path="/optimization" element={<OptimizationPage />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
