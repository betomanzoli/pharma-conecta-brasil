
import React from 'react';
import Navigation from '@/components/Navigation';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Sobre a PharmaConnect Brasil
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Conectando o futuro da indústria farmacêutica brasileira através de tecnologia e inovação.
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;
