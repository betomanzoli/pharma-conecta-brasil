
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageCircle, 
  FileText, 
  BarChart3,
  Shield,
  Settings,
  Sparkles,
  Brain,
  Zap,
  Database,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserProfile from './navigation/UserProfile';
import NotificationBell from './notifications/NotificationBell';
import { isDemoMode } from '@/utils/demoMode';

const Navigation = () => {
  const location = useLocation();
  const isDemo = isDemoMode();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/matching', label: 'AI Matching', icon: Brain },
    { path: '/marketplace', label: 'Marketplace', icon: Users },
    { path: '/chat', label: 'Chat & AI', icon: MessageCircle },
    { path: '/projects', label: 'Projetos', icon: FileText },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const aiItems = [
    { path: '/ai-assistant', label: 'AI Assistant', icon: Sparkles },
    { path: '/agents-dashboard', label: 'Agents Dashboard', icon: Bot },
    { path: '/knowledge-hub', label: 'Knowledge Hub', icon: Database },
    { path: '/generative-ai', label: 'Generative AI', icon: Zap },
    { path: '/ai-health', label: 'AI Health Check', icon: Activity },
  ];

  const systemItems = [
    { path: '/reports', label: 'Relatórios', icon: FileText },
    { path: '/security', label: 'Segurança', icon: Shield },
    { path: '/subscription', label: 'Assinatura', icon: Settings },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center px-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PC</span>
                </div>
                <span className="font-bold text-xl text-gray-900">PharmaConnect</span>
                {isDemo && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Demo
                  </span>
                )}
              </div>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActivePath(item.path)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}

              {/* AI Dropdown */}
              <div className="relative group">
                <Button variant="ghost" className="inline-flex items-center px-3 py-2">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Tools
                </Button>
                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    {aiItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center px-4 py-2 text-sm transition-colors ${
                            isActivePath(item.path)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* System Dropdown */}
              <div className="relative group">
                <Button variant="ghost" className="inline-flex items-center px-3 py-2">
                  <Settings className="h-4 w-4 mr-2" />
                  Sistema
                </Button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    {systemItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center px-4 py-2 text-sm transition-colors ${
                            isActivePath(item.path)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
