
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
  Plug
} from 'lucide-react';
import Logo from '@/components/ui/logo';
import NotificationBell from '@/components/notifications/NotificationBell';

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
    const baseItems = [
      { title: "Dashboard", path: "/dashboard", icon: BarChart3 },
      { title: "Rede", path: "/network", icon: Network },
      { title: "Chat", path: "/chat", icon: MessageCircle },
      { title: "Marketplace", path: "/marketplace", icon: ShoppingCart },
      { title: "Projetos", path: "/projects", icon: FolderOpen },
      { title: "Mentoria", path: "/mentorship", icon: UserCheck },
      { title: "Fóruns", path: "/forums", icon: MessageCircle },
      { title: "Conhecimento", path: "/knowledge", icon: BookOpen },
    ];

    // Adicionar Integrações apenas para administradores
    if (profile?.user_type === 'admin') {
      baseItems.push({ title: "Integrações", path: "/integrations", icon: Plug });
    }

    return baseItems;
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary-50 border border-primary-200"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
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
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between mb-4">
                        <Logo size="sm" />
                        {user && (
                          <Badge variant="outline" className="text-xs">
                            <currentUserType.icon className="h-3 w-3 mr-1" />
                            {currentUserType.label}
                          </Badge>
                        )}
                      </div>
                      {user && profile && (
                        <div className="text-sm text-gray-600">
                          Olá, {profile.first_name}!
                        </div>
                      )}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex-1 p-4">
                      <nav className="space-y-2">
                        {navigationItems.map((item) => {
                          const isActive = location.pathname === item.path;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                  ? "text-primary bg-primary-50"
                                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
                              }`}
                            >
                              <item.icon className="h-5 w-5" />
                              <span>{item.title}</span>
                            </Link>
                          );
                        })}
                      </nav>
                    </div>

                    {/* Mobile Footer */}
                    <div className="p-4 border-t">
                      {!user ? (
                        <div className="space-y-2">
                          <Link to="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full border-primary text-primary">
                              Entrar
                            </Button>
                          </Link>
                          <Link to="/auth" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-primary hover:bg-primary-600">
                              Cadastrar Grátis
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Link to="/profile" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full">
                              <User className="h-4 w-4 mr-2" />
                              Meu Perfil
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              handleSignOut();
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
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
