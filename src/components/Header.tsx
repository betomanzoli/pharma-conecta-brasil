
import { Button } from "@/components/ui/button";
import { User, Network, Building2, Users, Calendar, FileText, Shield, GraduationCap, MessageCircle, BookOpen, Search, Target, FlaskConical, Briefcase, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userType, setUserType] = useState("professional"); // professional, company, laboratory, supplier
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
    { title: "Buscar Laboratórios", path: "/search/laboratories", action: true },
    { title: "Encontrar Consultores", path: "/search/consultants", action: true },
    { title: "Alertas ANVISA", path: "/anvisa-alerts", action: true },
    { title: "Oportunidades", path: "/opportunities", action: true },
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
              <span className="text-2xl font-bold text-primary">PharmaNexus</span>
            </Link>
          </div>

          {/* Main Navigation */}
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

          {/* Right side - Quick Access + User Controls */}
          <div className="flex items-center space-x-4">
            {/* Quick Access Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Search className="h-4 w-4 mr-2" />
                  Acesso Rápido
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {quickAccessItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="cursor-pointer">
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
                  <Button variant="outline" size="sm" className="hidden md:flex">
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
              <div className="flex items-center space-x-3">
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Perfil
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-gray-200 py-3">
          <div className="flex flex-wrap gap-2">
            {mainNavigationItems.slice(0, 4).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary-50"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-3 w-3" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
