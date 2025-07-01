
import React from 'react';
import Navigation from '@/components/Navigation';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Contato
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Entre em contato conosco para mais informações sobre a PharmaConnect Brasil.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Contact;
