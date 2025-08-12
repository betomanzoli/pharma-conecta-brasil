
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedMasterChatbot from '@/components/ai/EnhancedMasterChatbot';

const Chat = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Assistente AI Master</h1>
              <p className="text-gray-600 mt-2">
                Converse com nosso assistente especializado em farmacêutica, regulatório e gestão de projetos
              </p>
            </div>
            
            <EnhancedMasterChatbot />
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Chat;
