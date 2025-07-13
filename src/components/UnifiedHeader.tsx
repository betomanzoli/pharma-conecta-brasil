
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  User, 
  Building2, 
  Users, 
  Calendar, 
  Shield, 
  GraduationCap, 
  MessageCircle, 
  BookOpen, 
  Search, 
  Target, 
  FlaskConical, 
  Briefcase, 
  Bell, 
  ChevronDown, 
  Menu, 
  Settings,
  LogOut,
  BarChart3,
  Network,
  ShoppingCart,
  FolderOpen,
  UserCheck,
  Globe,
  Plug,
  Zap
} from 'lucide-react';
import Logo from '@/components/ui/logo';
import NotificationBell from '@/components/notifications/NotificationBell';
import MobileNavigation from '@/components/mobile/MobileNavigation';

const UnifiedHeader = () => {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Navegação para usuários NÃO logados
  const publicNavigationItems = [
    { title: "Sobre", path: "/about", icon: BookOpen },
    { title: "Laboratórios", path: "/laboratories", icon: FlaskConical },
    { title: "Consultores", path: "/consultants", icon: GraduationCap },
    { title: "Fornecedores", path: "/suppliers", icon: Building2 },
    { title: "Regulatório", path: "/regulatory", icon: Shield },
    { title: "Carreiras", path: "/careers", icon: Users },
    { title: "Eventos", path: "/events", icon: Calendar },
    { title: "Contato", path: "/contact", icon: MessageCircle },
  ];

  // Navegação para usuários LOGADOS (baseada no tipo de usuário)
  const getPrivateNavigationItems = () => {
    const coreItems = [
      { title: "Dashboard", path: "/dashboard", icon: BarChart3 },
      { title: "AI Matching", path: "/ai", icon: Zap },
      { title: "Dashboard IA", path: "/ai-dashboard", icon: BarChart3 },
      { title: "Chat", path: "/chat", icon: MessageCircle },
    ];

    const businessItems = [
      { title: "Rede", path: "/network", icon: Network },
      { title: "Marketplace", path: "/marketplace", icon: ShoppingCart },
      { title: "Projetos", path: "/projects", icon: FolderOpen },
      { title: "Mentoria", path: "/mentorship", icon: UserCheck },
    ];

    const knowledgeItems = [
      { title: "Fóruns", path: "/forums", icon: MessageCircle },
      { title: "Conhecimento", path: "/knowledge", icon: BookOpen },
      { title: "ANVISA Legis", path: "/anvisa-legis", icon: Shield },
      { title: "APIs Globais", path: "/apis", icon: Globe },
    ];

    let allItems = [...coreItems, ...businessItems, ...knowledgeItems];

    // Adicionar funcionalidades especiais baseadas no tipo de usuário
    if (profile?.user_type === 'admin') {
      allItems.push({ title: "Integrações", path: "/integrations", icon: Plug });
    }

    return allItems;
  };

  const navigationItems = user ? getPrivateNavigationItems() : publicNavigationItems;

  const userTypes = [
    { id: "individual", label: "Profissional", icon: User },
    { id: "company", label: "Empresa", icon: Building2 },
    { id: "laboratory", label: "Laboratório", icon: FlaskConical },
    { id: "consultant", label: "Consultor", icon: GraduationCap },
    { id: "admin", label: "Administrador", icon: Shield },
  ];

  const currentUserType = userTypes.find(type => type.id === profile?.user_type) || userTypes[0];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center">
              <Logo size="md" />
            </Link>
          </div>

          {/* Desktop Navigation - Compact for Better Space */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.slice(0, 6).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-2 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary-50 border border-primary-200"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-3 w-3" />
                  <span className="hidden xl:inline">{item.title}</span>
                </Link>
              );
            })}
            
            {/* More Menu for Additional Items */}
            {user && navigationItems.length > 6 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    <ChevronDown className="h-3 w-3" />
                    <span className="hidden xl:inline ml-1">Mais</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {navigationItems.slice(6).map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} className="cursor-pointer flex items-center">
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Quick Search for logged users */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Busca Rápida
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/search/laboratories" className="cursor-pointer flex items-center">
                      <FlaskConical className="h-4 w-4 mr-2" />
                      Buscar Laboratórios
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/search/consultants" className="cursor-pointer flex items-center">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Encontrar Consultores
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/anvisa-alerts" className="cursor-pointer flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Alertas ANVISA
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/opportunities" className="cursor-pointer flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Oportunidades
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Notifications for logged users */}
            {user && <NotificationBell />}

            {/* User Controls */}
            {!user ? (
              /* Login/Register for non-logged users */
              <div className="hidden lg:flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary-50">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-primary hover:bg-primary-600">
                    Cadastrar Grátis
                  </Button>
                </Link>
              </div>
            ) : (
              /* User Profile Dropdown for logged users */
              <div className="hidden lg:flex items-center space-x-3">
                {/* User Type Indicator */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <currentUserType.icon className="h-4 w-4" />
                  <span>{currentUserType.label}</span>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {profile?.first_name || 'Usuário'}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/analytics" className="cursor-pointer flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/notifications" className="cursor-pointer flex items-center">
                        <Bell className="h-4 w-4 mr-2" />
                        Notificações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/reports" className="cursor-pointer flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Relatórios
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/subscription" className="cursor-pointer flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="p-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <MobileNavigation 
                    user={user}
                    profile={profile}
                    onNavigate={() => setMobileMenuOpen(false)}
                    onSignOut={handleSignOut}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Context Breadcrumb */}
      {user && location.pathname !== '/dashboard' && (
        <div className="bg-gray-50 border-t px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center py-2 text-sm text-gray-600">
              <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">
                {navigationItems.find(item => item.path === location.pathname)?.title || 'Página'}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default UnifiedHeader;
