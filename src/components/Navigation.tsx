
import React from 'react';
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
  Zap
} from 'lucide-react';

const Navigation = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

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
    { path: '/optimization', label: 'Otimização', icon: Activity }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PharmaConnect
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button 
                      variant={isActive(item.path) ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {profile && (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {profile.first_name} {profile.last_name}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => signOut()}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
