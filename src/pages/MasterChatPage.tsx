
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import MasterChatbot from '@/components/ai/MasterChatbot';
import { Sparkles } from 'lucide-react';

const MasterChatPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Master AI Assistant
                </h1>
                <p className="text-gray-600">
                  Assistente de IA avançado com contexto especializado
                </p>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <MasterChatbot />
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MasterChatPage;
