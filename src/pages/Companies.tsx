
import React from 'react';
import Navigation from '@/components/Navigation';
import BrazilianCompanyProfile from '@/components/brazilian/BrazilianCompanyProfile';
import { useAuth } from '@/contexts/AuthContext';

const Companies = () => {
  const { profile } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Empresas Farmacêuticas Brasileiras
          </h1>
          <p className="text-gray-600 mt-2">
            Conecte-se com empresas farmacêuticas verificadas pela ANVISA
          </p>
        </div>
        
        {profile?.user_type === 'company' ? (
          <BrazilianCompanyProfile />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Esta seção é destinada a empresas farmacêuticas cadastradas.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Companies;
