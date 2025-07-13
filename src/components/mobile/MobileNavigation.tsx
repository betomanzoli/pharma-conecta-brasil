import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  User, 
  Building2, 
  FlaskConical, 
  GraduationCap, 
  Shield,
  BarChart3,
  MessageCircle,
  BookOpen,
  Network,
  ShoppingCart,
  FolderOpen,
  UserCheck,
  Globe,
  Zap,
  LogOut
} from 'lucide-react';

interface NavigationItem {
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  category?: string;
}

interface MobileNavigationProps {
  user: any;
  profile: any;
  onNavigate: () => void;
  onSignOut: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  user,
  profile,
  onNavigate,
  onSignOut
}) => {
  const location = useLocation();

  const userTypes = [
    { id: "individual", label: "Profissional", icon: User },
    { id: "company", label: "Empresa", icon: Building2 },
    { id: "laboratory", label: "Laboratório", icon: FlaskConical },
    { id: "consultant", label: "Consultor", icon: GraduationCap },
    { id: "admin", label: "Administrador", icon: Shield },
  ];

  const currentUserType = userTypes.find(type => type.id === profile?.user_type) || userTypes[0];

  const getNavigationItems = (): NavigationItem[] => {
    if (!user) {
      return [
        { title: "Sobre", path: "/about", icon: BookOpen, category: "info" },
        { title: "Laboratórios", path: "/laboratories", icon: FlaskConical, category: "directory" },
        { title: "Consultores", path: "/consultants", icon: GraduationCap, category: "directory" },
        { title: "Regulatório", path: "/regulatory", icon: Shield, category: "regulatory" },
        { title: "Contato", path: "/contact", icon: MessageCircle, category: "info" },
      ];
    }

    return [
      { title: "Dashboard", path: "/dashboard", icon: BarChart3, category: "core" },
      { title: "AI Matching", path: "/ai", icon: Zap, category: "core" },
      { title: "Dashboard IA", path: "/ai-dashboard", icon: BarChart3, category: "core" },
      { title: "Chat", path: "/chat", icon: MessageCircle, category: "communication" },
      { title: "Rede", path: "/network", icon: Network, category: "business" },
      { title: "Marketplace", path: "/marketplace", icon: ShoppingCart, category: "business" },
      { title: "Projetos", path: "/projects", icon: FolderOpen, category: "business" },
      { title: "Mentoria", path: "/mentorship", icon: UserCheck, category: "business" },
      { title: "Fóruns", path: "/forums", icon: MessageCircle, category: "knowledge" },
      { title: "Conhecimento", path: "/knowledge", icon: BookOpen, category: "knowledge" },
      { title: "ANVISA Legis", path: "/anvisa-legis", icon: Shield, category: "regulatory" },
      { title: "APIs Globais", path: "/apis", icon: Globe, category: "integration" },
    ];
  };

  const navigationItems = getNavigationItems();
  const categories = Array.from(new Set(navigationItems.map(item => item.category).filter(Boolean)));

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'core': return 'Principal';
      case 'business': return 'Negócios';
      case 'knowledge': return 'Conhecimento';
      case 'regulatory': return 'Regulatório';
      case 'integration': return 'Integrações';
      case 'directory': return 'Diretório';
      case 'info': return 'Informações';
      case 'communication': return 'Comunicação';
      default: return 'Outros';
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary-50 to-blue-50">
        {user && profile && (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                Olá, {profile.first_name}!
              </h3>
              <p className="text-sm text-gray-600">{profile.email}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              <currentUserType.icon className="h-3 w-3 mr-1" />
              {currentUserType.label}
            </Badge>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {user ? (
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {getCategoryTitle(category)}
                </h4>
                <nav className="space-y-1">
                  {navigationItems
                    .filter(item => item.category === category)
                    .map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive(item.path)
                            ? "text-primary bg-primary-50 border border-primary-200 shadow-sm"
                            : "text-gray-700 hover:text-primary hover:bg-gray-50"
                        )}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                </nav>
              </div>
            ))}
          </div>
        ) : (
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "text-primary bg-primary-50"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        {!user ? (
          <div className="space-y-2">
            <Link to="/auth" className="w-full" onClick={onNavigate}>
              <Button variant="outline" className="w-full border-primary text-primary">
                Entrar
              </Button>
            </Link>
            <Link to="/auth" className="w-full" onClick={onNavigate}>
              <Button className="w-full bg-primary hover:bg-primary-600">
                Cadastrar Grátis
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            <Link to="/profile" className="w-full" onClick={onNavigate}>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Meu Perfil
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                onNavigate();
                onSignOut();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;