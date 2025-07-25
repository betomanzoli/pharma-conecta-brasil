import React from 'react';
import Navigation from '@/components/Navigation';

const Careers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Carreiras
          </h1>
          <p className="text-gray-600 mt-2">
            Oportunidades de carreira no setor farmacêutico
          </p>
        </div>
      </main>
    </div>
  );
};

export default Careers;
