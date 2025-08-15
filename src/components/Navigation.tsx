
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isDemoMode } from '@/utils/demoMode';
import ModeToggle from '@/components/layout/ModeToggle';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Bot,
  Sparkles,
  Activity,
  Bell
} from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isDemo = isDemoMode();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Projetos', path: '/projects', icon: FileText },
    { name: 'Consultores', path: '/consultants', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'IA Especializada', path: '/ai-assistant', icon: Bot },
    { name: 'Master AI', path: '/chat', icon: Sparkles },
    { name: 'Agentes IA', path: '/ai/dashboard', icon: Activity },
    { name: 'Notificações', path: '/notifications', icon: Bell }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PharmaConnect</span>
            </Link>
            <ModeToggle variant="badge" showLabel={false} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user || isDemo ? (
              <>
                <span className="text-sm text-gray-600">
                  {isDemo ? 'Modo Demo' : `Olá, ${user?.email?.split('@')[0]}`}
                </span>
                {!isDemo && (
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Entrar</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              <div className="border-t pt-4 mt-4">
                {user || isDemo ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-600">
                      {isDemo ? 'Modo Demo Ativo' : `Conectado como: ${user?.email}`}
                    </div>
                    {!isDemo && (
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        size="sm"
                        className="mx-3 mt-2 w-full justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="px-3 space-y-2">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Entrar
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="w-full">
                        Cadastrar
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
