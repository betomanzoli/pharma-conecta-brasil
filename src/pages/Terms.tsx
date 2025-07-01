
import React from 'react';
import Logo from '@/components/ui/logo';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <Logo size="md" />
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-primary-600 hover:bg-primary-700">
                  Cadastrar-se
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

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
