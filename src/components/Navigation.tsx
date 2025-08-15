
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  MessageSquare, 
  BarChart3, 
  Target, 
  Settings,
  Sparkles,
  Shield,
  LogOut,
  User,
  Bot,
  Activity,
  Zap,
  Menu,
  X,
  Building2,
  BookOpen,
  Users,
  Briefcase
} from 'lucide-react';
import ModeToggle from '@/components/layout/ModeToggle';
import { isDemoMode } from '@/utils/demoMode';

const Navigation = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDemo = isDemoMode();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/ai-assistant', label: 'AI Assistant', icon: Bot },
    { path: '/master-chat', label: 'Master AI', icon: Sparkles },
    { path: '/performance', label: 'Performance', icon: BarChart3 },
    { path: '/strategic-plan', label: 'Plano Estratégico', icon: Target },
    { path: '/consolidation', label: 'Consolidação', icon: Shield },
    { path: '/automation', label: 'Automação', icon: Settings },
    { path: '/generative-ai', label: 'IA Generativa', icon: Zap },
    { path: '/optimization', label: 'Otimização', icon: Activity },
    { path: '/marketplace', label: 'Marketplace', icon: Building2 },
    { path: '/knowledge', label: 'Biblioteca', icon: BookOpen },
    { path: '/network', label: 'Rede', icon: Users },
    { path: '/projects', label: 'Projetos', icon: Briefcase }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop and Mobile Header */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PC</span>
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PharmaConnect
                </span>
              </Link>

              {/* Mode Toggle - Always Visible */}
              <ModeToggle variant="badge" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.slice(0, 6).map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button 
                      variant={isActive(item.path) ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Right Side - User Info and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Desktop User Info */}
              {profile && (
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {profile.first_name} {profile.last_name}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button 
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className="w-full justify-start"
                      size="sm"
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              
              {/* Mobile User Actions */}
              {profile && (
                <>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2 mb-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {profile.first_name} {profile.last_name}
                        </span>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
