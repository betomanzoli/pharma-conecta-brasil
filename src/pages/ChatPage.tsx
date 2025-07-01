
import React from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatList from '@/components/chat/ChatList';

const ChatPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat</h1>
            <p className="text-gray-600">Converse em tempo real com outros usuários da plataforma</p>
          </div>
          <ChatList />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChatPage;
