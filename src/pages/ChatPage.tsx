
import React from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatSystem from '@/components/chat/ChatSystem';

const ChatPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Chat</h1>
            <p className="text-muted-foreground">Converse em tempo real com outros usuários da plataforma</p>
          </div>
          <ChatSystem />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChatPage;
