
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from './navigation/UserProfile';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Brain,
  Zap,
  Star,
  Menu,
  X
} from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: Home 
    },
    { 
      path: '/analytics', 
      label: 'Analytics', 
      icon: BarChart3 
    },
    { 
      path: '/ai-dashboard', 
      label: 'AI Matching', 
      icon: Users 
    },
    { 
      path: '/chat', 
      label: 'Chat IA', 
      icon: MessageSquare 
    },
    { 
      path: '/ai', 
      label: 'Admin AI', 
      icon: Brain 
    },
    { 
      path: '/master-ai', 
      label: 'Master AI Hub', 
      icon: Zap,
      special: true
    }
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PharmaConnect Brasil</h1>
              <div className="flex items-center space-x-1">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Master AI
                </Badge>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user && navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActivePath(item.path)
                      ? item.special
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                      : item.special
                        ? 'text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <IconComponent className={`h-4 w-4 ${item.special && !isActivePath(item.path) ? 'text-purple-600' : ''}`} />
                  <span>{item.label}</span>
                  {item.special && (
                    <Badge className="bg-yellow-400 text-yellow-900 text-xs ml-1">
                      NEW
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Profile & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {user && <UserProfile />}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium
                      ${isActivePath(item.path)
                        ? item.special
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-blue-50 text-blue-700'
                        : item.special
                          ? 'text-purple-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.special && (
                      <Badge className="bg-yellow-400 text-yellow-900 text-xs">
                        NEW
                      </Badge>
                    )}
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <Button
                  onClick={signOut}
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Sair
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
