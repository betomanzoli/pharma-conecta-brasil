
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/ui/logo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Logo size="lg" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-[#1565C0] transition-colors">
              Recursos
            </a>
            <a href="#benefits" className="text-gray-700 hover:text-[#1565C0] transition-colors">
              Benefícios
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-[#1565C0] transition-colors">
              Planos
            </a>
            <a href="#contact" className="text-gray-700 hover:text-[#1565C0] transition-colors">
              Contato
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth#login">
              <Button variant="ghost" className="text-[#1565C0]">
                Entrar
              </Button>
            </Link>
            <Link to="/auth#register">
              <Button className="bg-[#1565C0] hover:bg-[#1565C0]/90">
                Cadastrar
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <a
                href="#features"
                className="block px-3 py-2 text-gray-700 hover:text-[#1565C0] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Recursos
              </a>
              <a
                href="#benefits"
                className="block px-3 py-2 text-gray-700 hover:text-[#1565C0] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Benefícios
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-gray-700 hover:text-[#1565C0] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Planos
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 text-gray-700 hover:text-[#1565C0] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </a>
              
              <div className="pt-4 space-y-2">
                <Link to="/auth#login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-[#1565C0]">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth#register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
