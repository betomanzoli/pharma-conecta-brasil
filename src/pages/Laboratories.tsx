import React from 'react';
import Navigation from '@/components/Navigation';

const Laboratories = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Laboratórios
          </h1>
          <p className="text-gray-600 mt-2">
            Encontre laboratórios especializados e certificados
          </p>
        </div>
      </main>
    </div>
  );
};

export default Laboratories;
