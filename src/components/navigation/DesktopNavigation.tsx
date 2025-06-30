
import React from 'react';
import { Link } from 'react-router-dom';

const DesktopNavigation = () => {
  return (
    <div className="hidden md:ml-6 md:flex md:space-x-8">
      <Link to="/network" className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900">
        Rede
      </Link>
      <Link to="/marketplace" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        Marketplace
      </Link>
      <Link to="/projects" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        Projetos
      </Link>
      <Link to="/regulatory" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        Regulatório
      </Link>
      <Link to="/mentorship" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        Mentoria
      </Link>
      <Link to="/forums" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        Fóruns
      </Link>
      <Link to="/knowledge" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        Conhecimento
      </Link>
      <Link to="/integrations" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
        Integrações
      </Link>
    </div>
  );
};

export default DesktopNavigation;
