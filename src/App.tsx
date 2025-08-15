import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import MatchingPage from './pages/MatchingPage';
import StrategicPlanningPage from './pages/StrategicPlanningPage';
import KnowledgeLibrary from './pages/KnowledgeLibrary';
import AIPage from './pages/AIPage';
import ChatPage from './pages/ChatPage';
import FederalLearningSystem from './components/ai/FederalLearningSystem';
import MasterAIHub from './pages/MasterAIHub';
import AgentDashboard from './pages/ai/AgentDashboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/matching",
    element: <MatchingPage />,
  },
  {
    path: "/strategic-planning",
    element: <StrategicPlanningPage />,
  },
  {
    path: "/knowledge-library",
    element: <KnowledgeLibrary />,
  },
  {
    path: "/ai",
    element: <AIPage />,
  },
  {
    path: "/ai/federal",
    element: <FederalLearningSystem />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "/ai/hub",
    element: <MasterAIHub />,
  },
  {
    path: "/ai/estrategista",
    element: <MasterAIHub />,
  },
  {
    path: "/ai/tecnico-regulatorio",
    element: <MasterAIHub />,
  },
  {
    path: "/ai/analista-projetos",
    element: <MasterAIHub />,
  },
  {
    path: "/ai/documentacao",
    element: <MasterAIHub />,
  },
  {
    path: "/ai/coordenacao",
    element: <MasterAIHub />,
  },
  {
    path: "/ai/sinergia",
    element: <MasterAIHub />,
  },
  {
    path: "/ai/prompts",
    element: <MasterAIHub />,
  },
  {
    path: "/ai/matching-dashboard",
    element: <MasterAIHub />,
  },
  {
    path: "/ai/business-metrics",
    element: <MasterAIHub />,
  },
  {
    path: "/ai/agentes",
    element: <AgentDashboard />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
