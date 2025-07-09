import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  MessageSquare, 
  Bell, 
  User,
  BarChart3,
  Building2,
  BookOpen,
  Settings,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();

  const navigationItems = [
    {
      icon: Home,
      label: 'Início',
      path: '/',
      color: 'text-blue-600'
    },
    {
      icon: Search,
      label: 'Busca',
      path: '/search',
      color: 'text-green-600'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/analytics',
      color: 'text-purple-600'
    },
    {
      icon: MessageSquare,
      label: 'Chat',
      path: '/chat',
      color: 'text-orange-600'
    },
    {
      icon: Bell,
      label: 'Alertas',
      path: '/notifications',
      color: 'text-red-600',
      badge: unreadCount > 0 ? unreadCount : undefined
    }
  ];

  const quickAccessItems = [
    {
      icon: Building2,
      label: 'Empresas',
      path: '/companies',
      color: 'text-indigo-600'
    },
    {
      icon: BookOpen,
      label: 'Conhecimento',
      path: '/knowledge',
      color: 'text-teal-600'
    },
    {
      icon: Briefcase,
      label: 'Marketplace',
      path: '/marketplace',
      color: 'text-amber-600'
    },
    {
      icon: User,
      label: 'Perfil',
      path: '/profile',
      color: 'text-gray-600'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {/* Bottom Navigation - Main Items */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border/40 md:hidden">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors relative",
                  active 
                    ? "text-primary bg-primary/5" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    "h-5 w-5 transition-all",
                    active && "scale-110"
                  )} />
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </Badge>
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  active && "text-primary"
                )}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Access Floating Button */}
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
        <div className="relative">
          <button
            onClick={() => {
              const quickAccess = document.getElementById('quick-access');
              if (quickAccess) {
                quickAccess.style.display = quickAccess.style.display === 'none' ? 'block' : 'none';
              }
            }}
            className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
          >
            <Settings className="h-6 w-6" />
          </button>
          
          <div
            id="quick-access"
            className="absolute bottom-14 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 rounded-lg border border-border/40 p-2 shadow-lg min-w-[120px]"
            style={{ display: 'none' }}
          >
            {quickAccessItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    handleNavigation(item.path);
                    const quickAccess = document.getElementById('quick-access');
                    if (quickAccess) quickAccess.style.display = 'none';
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-md transition-colors text-left",
                    active 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default MobileNavigation;