
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  Users, 
  Bell, 
  User,
  Briefcase,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const MobileNavigation = () => {
  const location = useLocation();
  const { profile } = useAuth();

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/chat', icon: MessageSquare, label: 'AI Chat' },
    { path: '/projects', icon: Briefcase, label: 'Projetos' },
    { path: '/knowledge', icon: BookOpen, label: 'Biblioteca' },
    { path: '/reports', icon: BarChart3, label: 'Relatórios' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
        
        <Link
          to="/profile"
          className={`flex flex-col items-center py-2 px-3 transition-colors ${
            location.pathname === '/profile'
              ? 'text-primary' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-xs">Perfil</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;
