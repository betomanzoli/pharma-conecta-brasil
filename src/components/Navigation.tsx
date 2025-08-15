
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import { 
  Home, 
  MessageCircle, 
  BarChart3, 
  Target, 
  Zap, 
  Sparkles,
  User,
  Settings,
  LogOut,
  Trophy
} from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/chat', label: 'Chat IA', icon: MessageCircle },
    { path: '/performance', label: 'Performance', icon: BarChart3 },
    { path: '/strategic-plan', label: 'Plano Estratégico', icon: Target, badge: 'Completo' },
    { path: '/automation', label: 'Automação', icon: Zap, badge: 'Ativo' },
    { path: '/generative-ai', label: 'IA Generativa', icon: Sparkles, badge: 'Novo' }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PC</span>
          </div>
          <span className="font-bold text-xl text-gray-900">PharmaConnect</span>
          <Badge variant="outline" className="bg-gradient-to-r from-gold-500 to-yellow-500 text-white border-gold-500">
            <Trophy className="h-3 w-3 mr-1" />
            Completo
          </Badge>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <IconComponent className="h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs ml-1">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1">
                  <ProfileAvatar user={user} size="sm" />
                  <span className="hidden md:block text-sm font-medium">
                    {user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="outline" size="sm">Entrar</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mt-3">
        <div className="flex items-center space-x-1 overflow-x-auto pb-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
