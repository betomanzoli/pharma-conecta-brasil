
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Profile } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  User as UserIcon,
  Building2,
  FlaskConical,
  GraduationCap,
  Shield,
  BarChart3,
  MessageCircle,
  Network,
  ShoppingCart,
  FolderOpen,
  BookOpen,
  Calendar,
  Users,
  Target,
  Bell,
  Settings,
  LogOut,
  Zap
} from 'lucide-react';
import Logo from '@/components/ui/logo';

interface MobileNavigationProps {
  user: User | null;
  profile: any; // Using any to match the existing profile type
  onNavigate: () => void;
  onSignOut: () => Promise<void>;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  user,
  profile,
  onNavigate,
  onSignOut
}) => {
  const location = useLocation();

  // Navigation items for logged users
  const navigationItems = [
    { title: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { title: "AI Matching", path: "/ai", icon: Zap },
    { title: "Dashboard IA", path: "/ai-dashboard", icon: BarChart3 },
    { title: "Chat", path: "/chat", icon: MessageCircle },
    { title: "Rede", path: "/network", icon: Network },
    { title: "Marketplace", path: "/marketplace", icon: ShoppingCart },
    { title: "Projetos", path: "/projects", icon: FolderOpen },
    { title: "Mentoria", path: "/mentorship", icon: UserIcon },
    { title: "Fóruns", path: "/forums", icon: MessageCircle },
    { title: "Conhecimento", path: "/knowledge", icon: BookOpen },
    { title: "ANVISA Legis", path: "/anvisa-legis", icon: Shield },
    { title: "Eventos", path: "/events", icon: Calendar },
    { title: "Oportunidades", path: "/opportunities", icon: Target },
  ];

  const userTypes = [
    { id: "individual", label: "Profissional", icon: UserIcon },
    { id: "company", label: "Empresa", icon: Building2 },
    { id: "laboratory", label: "Laboratório", icon: FlaskConical },
    { id: "consultant", label: "Consultor", icon: GraduationCap },
    { id: "admin", label: "Administrador", icon: Shield },
  ];

  const currentUserType = userTypes.find(type => type.id === profile?.user_type) || userTypes[0];

  const handleSignOut = async () => {
    try {
      await onSignOut();
      onNavigate();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center mb-8">
          <Logo size="md" />
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <UserIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Faça seu login</h3>
          <p className="text-muted-foreground mb-6">
            Acesse sua conta para navegar pela plataforma
          </p>
          
          <div className="space-y-3 w-full max-w-xs">
            <Link to="/auth" onClick={onNavigate}>
              <Button className="w-full">
                Entrar
              </Button>
            </Link>
            <Link to="/auth" onClick={onNavigate}>
              <Button variant="outline" className="w-full">
                Criar conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* User Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3 mb-4">
          <Logo size="sm" />
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <currentUserType.icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {profile?.first_name || 'Usuário'} {profile?.last_name || ''}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {profile?.organization_name || profile?.email}
            </p>
            <Badge variant="secondary" className="text-xs mt-1">
              {currentUserType.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      {/* User Actions */}
      <div className="p-4 border-t">
        <div className="space-y-2">
          <Link to="/notifications" onClick={onNavigate}>
            <Button variant="ghost" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-3" />
              Notificações
            </Button>
          </Link>
          
          <Link to="/profile" onClick={onNavigate}>
            <Button variant="ghost" className="w-full justify-start">
              <UserIcon className="h-4 w-4 mr-3" />
              Meu Perfil
            </Button>
          </Link>
          
          <Link to="/subscription" onClick={onNavigate}>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-3" />
              Configurações
            </Button>
          </Link>
          
          <Separator className="my-2" />
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
