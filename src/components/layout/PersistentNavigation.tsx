
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  MessageSquare, 
  Workflow, 
  Bell, 
  BookOpen,
  Users,
  Briefcase,
  BarChart3,
  Building2,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  FlaskConical
} from 'lucide-react';
import { useState } from 'react';
import { isDemoMode } from '@/utils/demoMode';
import ModeToggle from './ModeToggle';

const PersistentNavigation = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDemo = isDemoMode();

  // Itens de navegação diferentes para Demo vs Real
  const getDemoNavigationItems = () => [
    { path: '/dashboard', icon: Home, label: 'Dashboard', status: 'active' },
    { path: '/chat', icon: MessageSquare, label: 'AI Assistant', status: 'active' },
    { path: '/network', icon: Users, label: 'Rede', status: 'active' },
    { path: '/forums', icon: MessageSquare, label: 'Fóruns', status: 'active' },
    { path: '/mentorship', icon: User, label: 'Mentoria', status: 'active' },
    { path: '/marketplace', icon: Building2, label: 'Marketplace', status: 'active' },
    { path: '/projects', icon: Briefcase, label: 'Projetos', status: 'active' },
    { path: '/automation', icon: Workflow, label: 'Automações', status: 'beta' },
    { path: '/knowledge', icon: BookOpen, label: 'Biblioteca', status: 'active' },
    { path: '/reports', icon: BarChart3, label: 'Relatórios', status: 'active' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', status: 'beta' },
    { path: '/notifications', icon: Bell, label: 'Notificações', status: 'active' },
  ];

  const getRealNavigationItems = () => [
    { path: '/dashboard', icon: Home, label: 'Dashboard', status: 'active' },
    { path: '/chat', icon: MessageSquare, label: 'AI Assistant', status: 'active' },
    { path: '/network', icon: Users, label: 'Rede', status: 'development' },
    { path: '/marketplace', icon: Building2, label: 'Marketplace', status: 'development' },
    { path: '/projects', icon: Briefcase, label: 'Projetos', status: 'development' },
    { path: '/knowledge', icon: BookOpen, label: 'Biblioteca', status: 'active' },
    { path: '/notifications', icon: Bell, label: 'Notificações', status: 'active' },
    { path: '/settings', icon: Settings, label: 'Configurações', status: 'active' },
  ];

  const navigationItems = isDemo ? getDemoNavigationItems() : getRealNavigationItems();

  const handleSignOut = async () => {
    await signOut();
  };

  const getStatusBadge = (status: string) => {
    if (status === 'beta') return '🟡';
    if (status === 'development') return '🔴';
    return '🟢';
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white shadow-sm border-b border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-xl font-bold text-primary">
              PharmaConnect
            </Link>
            <ModeToggle variant="badge" />
          </div>
          
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isDisabled = item.status === 'development' && !isDemo;
              
              return (
                <div key={item.path} className="relative">
                  <Link to={isDisabled ? '#' : item.path}>
                    <Button 
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`flex items-center space-x-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isDisabled}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                      {isDemo && (
                        <span className="text-xs">{getStatusBadge(item.status)}</span>
                      )}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <ModeToggle variant="button" showLabel={false} />
            
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
                <span className="ml-2 hidden lg:inline">
                  {profile?.first_name || 'Perfil'}
                </span>
              </Button>
            </Link>
            
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="text-lg font-bold text-primary">
              PharmaConnect
            </Link>
            <ModeToggle variant="badge" />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isDisabled = item.status === 'development' && !isDemo;
                
                return (
                  <Link 
                    key={item.path} 
                    to={isDisabled ? '#' : item.path}
                    onClick={() => !isDisabled && setIsMobileMenuOpen(false)}
                  >
                    <Button 
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start ${isDisabled ? 'opacity-50' : ''}`}
                      size="sm"
                      disabled={isDisabled}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                      {isDemo && (
                        <span className="ml-auto text-xs">{getStatusBadge(item.status)}</span>
                      )}
                    </Button>
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2">
                  <ModeToggle variant="toggle" />
                </div>
                
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Meu Perfil
                  </Button>
                </Link>
                
                <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Button>
                </Link>
                
                <Button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default PersistentNavigation;
