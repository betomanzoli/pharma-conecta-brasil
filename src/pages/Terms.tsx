
import React from 'react';
import Navigation from '@/components/Navigation';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Termos de Uso
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Termos e condições para uso da plataforma PharmaConnect Brasil.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Terms;
