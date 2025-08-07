
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import MasterChatbot from '@/components/ai/MasterChatbot';

const ChatPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              AI Assistant
            </h1>
            <p className="text-muted-foreground">
              Assistente especializado no setor farmacêutico brasileiro
            </p>
          </div>
          
          <MasterChatbot />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ChatPage;
