
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import EnhancedChatSystem from '@/components/chat/EnhancedChatSystem';

const EnhancedChat = () => {
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

export default EnhancedChat;
