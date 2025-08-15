
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import EnhancedChatSystem from '@/components/chat/EnhancedChatSystem';

const ChatPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <EnhancedChatSystem />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ChatPage;
