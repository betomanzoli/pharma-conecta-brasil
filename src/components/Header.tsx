
import { Button } from "@/components/ui/button";
import { User, Network } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Network className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">PharmaNexus</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">
              Rede Profissional
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">
              Desenvolvimento
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">
              Insights
            </a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">
              Eventos
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary-50">
                  Entrar
                </Button>
                <Button className="bg-primary hover:bg-primary-600">
                  Cadastrar
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Perfil
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
