import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

const MentorshipHub = () => {
  const { profile } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Hub de Mentoria
            </h1>
            <p className="text-gray-600 mt-2">
              Encontre mentores e compartilhe conhecimento
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default MentorshipHub;
