
import { Button } from "@/components/ui/button";
import { User, Network, Building2, Users, Calendar, FileText, Shield, GraduationCap, MessageCircle, BookOpen, Search, Target, FlaskConical, Briefcase, Bell, ChevronDown, Menu, X, Plus, Phone, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userType, setUserType] = useState("professional"); // professional, company, laboratory, supplier
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const mainNavigationItems = [
    { title: "Laboratórios", path: "/laboratories", icon: FlaskConical },
    { title: "Consultores", path: "/consultants", icon: GraduationCap },
    { title: "Fornecedores", path: "/suppliers", icon: Building2 },
    { title: "Regulatório", path: "/regulatory", icon: Shield },
    { title: "Carreiras", path: "/careers", icon: Users },
    { title: "Eventos", path: "/events", icon: Calendar },
  ];

  const quickAccessItems = [
    { title: "Buscar Laboratórios", path: "/search/laboratories", action: true, icon: FlaskConical },
    { title: "Encontrar Consultores", path: "/search/consultants", action: true, icon: GraduationCap },
    { title: "Alertas ANVISA", path: "/anvisa-alerts", action: true, icon: AlertTriangle },
    { title: "Oportunidades", path: "/opportunities", action: true, icon: Target },
  ];

  const mobileQuickActions = [
    { title: "Encontrar Lab", path: "/search/laboratories", icon: FlaskConical, color: "bg-blue-500" },
    { title: "Publicar Necessidade", path: "/post-need", icon: Plus, color: "bg-green-500" },
    { title: "Mensagens", path: "/messages", icon: MessageCircle, color: "bg-purple-500" },
    { title: "Alertas", path: "/anvisa-alerts", icon: Bell, color: "bg-red-500" },
  ];

  const userTypes = [
    { id: "professional", label: "Sou Profissional", icon: User },
    { id: "company", label: "Sou Empresa", icon: Building2 },
    { id: "laboratory", label: "Sou Laboratório", icon: FlaskConical },
    { id: "supplier", label: "Sou Fornecedor", icon: Briefcase },
  ];

  const currentUserType = userTypes.find(type => type.id === userType);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <Network className="h-8 w-8 text-primary" />
              <span className="text-xl md:text-2xl font-bold text-primary">PharmaConnect Brasil</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {mainNavigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary-50"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right side - Quick Access + User Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Quick Access Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Acesso Rápido
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {quickAccessItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="cursor-pointer flex items-center">
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* ANVISA Alerts Bell */}
            {isLoggedIn && (
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </Button>
            )}

            {/* User Type Switcher */}
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {currentUserType && <currentUserType.icon className="h-4 w-4 mr-2" />}
                    {currentUserType?.label}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {userTypes.map((type) => (
                    <DropdownMenuItem 
                      key={type.id} 
                      onClick={() => setUserType(type.id)}
                      className={`cursor-pointer ${userType === type.id ? 'bg-primary-50 text-primary' : ''}`}
                    >
                      <type.icon className="h-4 w-4 mr-2" />
                      {type.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Login/Profile */}
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary-50">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-primary hover:bg-primary-600">
                    Cadastrar
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger & Quick Actions */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile ANVISA Alerts */}
            {isLoggedIn && (
              <Button variant="outline" size="sm" className="relative p-2">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center text-[10px]">
                  3
                </span>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Network className="h-6 w-6 text-primary" />
                        <span className="text-lg font-bold text-primary">PharmaConnect Brasil</span>
                      </div>
                    </div>
                    
                    {/* User Type Selector */}
                    {isLoggedIn && currentUserType && (
                      <div className="flex items-center space-x-2 p-3 bg-primary-50 rounded-lg">
                        <currentUserType.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-primary">{currentUserType.label}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  {isLoggedIn && (
                    <div className="p-4 border-b">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Ações Rápidas</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {mobileQuickActions.map((action) => (
                          <Link
                            key={action.path}
                            to={action.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className={`p-2 rounded-full ${action.color} text-white`}>
                              <action.icon className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-medium text-center">{action.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex-1 p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Navegação</h3>
                    <nav className="space-y-2">
                      {mainNavigationItems.map((item) => {
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

                    {/* Quick Access in Mobile */}
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Acesso Rápido</h3>
                      <div className="space-y-2">
                        {quickAccessItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t">
                    {!isLoggedIn ? (
                      <div className="space-y-2">
                        <Link to="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full border-primary text-primary">
                            Entrar
                          </Button>
                        </Link>
                        <Link to="/register" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full bg-primary hover:bg-primary-600">
                            Cadastrar
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Link to="/profile" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Ver Perfil
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      {isLoggedIn && (
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Link to="/post-need">
            <Button size="lg" className="h-14 w-14 rounded-full bg-primary hover:bg-primary-600 shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
