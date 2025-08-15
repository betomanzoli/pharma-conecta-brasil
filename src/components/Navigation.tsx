
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/components/UserProfile';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  FlaskConical, 
  MessageCircle, 
  Users, 
  BarChart3, 
  User, 
  FolderOpen, 
  MessageSquare, 
  BookOpen, 
  ShoppingCart, 
  Handshake,
  Target,
  Zap,
  Brain,
  Menu,
  X
} from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Projetos', href: '/projects', icon: FolderOpen },
    { name: 'Empresas', href: '/company', icon: Building2 },
    { name: 'Laboratórios', href: '/laboratory', icon: FlaskConical },
    { name: 'Mentoria', href: '/mentorship', icon: Users },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Fórum', href: '/forum', icon: MessageSquare },
    { name: 'Conhecimento', href: '/knowledge', icon: BookOpen },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
    { name: 'Parcerias', href: '/partnerships', icon: Handshake },
    { 
      name: 'Plano Estratégico', 
      href: '/strategic-plan', 
      icon: Target,
      badge: 'Concluído'
    },
    { 
      name: 'Automação', 
      href: '/automation', 
      icon: Zap,
      badge: 'Novo'
    },
    { 
      name: 'AI Hub', 
      href: '/ai', 
      icon: Brain,
      badge: 'Beta'
    },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PharmaConnect Brasil</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:ml-6 lg:flex lg:space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`ml-2 text-xs ${
                        item.badge === 'Novo' ? 'bg-green-100 text-green-800' :
                        item.badge === 'Beta' ? 'bg-purple-100 text-purple-800' :
                        item.badge === 'Concluído' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <UserProfile />
                <Button 
                  variant="ghost" 
                  onClick={signOut}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sair
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Cadastrar</Link>
                </Button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`ml-auto text-xs ${
                        item.badge === 'Novo' ? 'bg-green-100 text-green-800' :
                        item.badge === 'Beta' ? 'bg-purple-100 text-purple-800' :
                        item.badge === 'Concluído' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
