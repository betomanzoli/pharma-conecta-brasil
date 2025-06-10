
import { Button } from "@/components/ui/button";
import { User, Network, Building2, Users, Calendar, FileText, Shield, GraduationCap, MessageCircle, BookOpen, Search, Target } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userType, setUserType] = useState("professional"); // professional, company, laboratory, consultant, supplier, university, regulatory
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { title: "Dashboard", path: "/dashboard", icon: User },
      { title: "Marketplace", path: "/marketplace", icon: Building2 },
      { title: "Collaborate", path: "/projects", icon: Target },
      { title: "Compliance", path: "/regulatory", icon: Shield },
      { title: "Network", path: "/network", icon: Network },
      { title: "Knowledge", path: "/knowledge", icon: BookOpen },
    ];

    switch (userType) {
      case "company":
        return [
          { title: "Dashboard", path: "/dashboard", icon: User },
          { title: "Marketplace", path: "/marketplace", icon: Building2 },
          { title: "Find Services", path: "/projects", icon: Search },
          { title: "Compliance", path: "/regulatory", icon: Shield },
          { title: "Network", path: "/network", icon: Network },
          { title: "Knowledge", path: "/knowledge", icon: BookOpen },
        ];
      case "laboratory":
        return [
          { title: "Dashboard", path: "/dashboard", icon: User },
          { title: "Marketplace", path: "/marketplace", icon: Building2 },
          { title: "Capacity", path: "/projects", icon: Calendar },
          { title: "Compliance", path: "/regulatory", icon: Shield },
          { title: "Network", path: "/network", icon: Network },
          { title: "Knowledge", path: "/knowledge", icon: BookOpen },
        ];
      case "consultant":
        return [
          { title: "Dashboard", path: "/dashboard", icon: User },
          { title: "Marketplace", path: "/marketplace", icon: Building2 },
          { title: "Portfolio", path: "/projects", icon: FileText },
          { title: "Compliance", path: "/regulatory", icon: Shield },
          { title: "Network", path: "/network", icon: Network },
          { title: "Knowledge", path: "/knowledge", icon: BookOpen },
        ];
      default:
        return baseItems;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2">
              <Network className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">PharmaNexus</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {getNavigationItems().map((item) => {
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
            
            {/* Additional ecosystem features */}
            <Link
              to="/mentorship"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/mentorship"
                  ? "text-primary bg-primary-50"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Mentorship</span>
            </Link>
            
            <Link
              to="/forums"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/forums"
                  ? "text-primary bg-primary-50"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Forums</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
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
      </div>
    </header>
  );
};

export default Header;
