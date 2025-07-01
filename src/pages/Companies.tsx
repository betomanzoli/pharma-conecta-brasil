
import React from 'react';
import Navigation from '@/components/Navigation';

const Companies = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Empresas Farmacêuticas
          </h1>
          <p className="text-gray-600 mt-2">
            Conecte-se com empresas farmacêuticas verificadas
          </p>
        </div>
        {/* Content will be implemented */}
      </main>
    </div>
  );
};

export default Companies;
