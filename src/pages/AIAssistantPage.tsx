
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import AIAssistant from '@/components/ai/AIAssistant';
import { Bot } from 'lucide-react';

const AIAssistantPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Assistente de IA Especializado
                </h1>
                <p className="text-gray-600">
                  Sistema multi-agente para análise farmacêutica e regulatória
                </p>
              </div>
            </div>
          </div>
          
          <AIAssistant />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AIAssistantPage;
