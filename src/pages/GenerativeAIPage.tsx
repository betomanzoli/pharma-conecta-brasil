
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import GenerativeAIHub from '@/components/generative-ai/GenerativeAIHub';

const GenerativeAIPage = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <GenerativeAIHub />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default GenerativeAIPage;
