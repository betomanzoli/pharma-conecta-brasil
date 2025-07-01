
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

const NotFound = () => {
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
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Página não encontrada
          </h2>
          <p className="text-gray-600 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
          <Link 
            to="/" 
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Voltar para o início
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
