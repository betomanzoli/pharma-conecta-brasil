
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  FlaskConical, 
  Users, 
  Bot, 
  BarChart3, 
  MessageSquare,
  User,
  LogOut,
  Shield,
  Scale,
  University,
  Factory,
  FileText,
  Heart,
  Home,
  Settings,
  Search,
  BookOpen,
  Briefcase,
  Network,
  ShoppingCart,
  Calendar,
  FileBarChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  // Navegação baseada no tipo de usuário
  const getNavigationItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: Home, label: 'Dashboard' },
      { path: '/profile', icon: User, label: 'Perfil' },
    ];

    const userTypeItems = {
      professional: [
        { path: '/network', icon: Network, label: 'Rede Profissional' },
        { path: '/mentorship', icon: Calendar, label: 'Mentorias' },
        { path: '/marketplace', icon: ShoppingCart, label: 'Oportunidades' },
      ],
      company: [
        { path: '/laboratories', icon: FlaskConical, label: 'Buscar Laboratórios' },
        { path: '/consultants', icon: Users, label: 'Buscar Consultores' },
        { path: '/marketplace', icon: ShoppingCart, label: 'Marketplace' },
        { path: '/projects', icon: Briefcase, label: 'Projetos' },
      ],
      laboratory: [
        { path: '/companies', icon: Building2, label: 'Empresas Cliente' },
        { path: '/marketplace', icon: ShoppingCart, label: 'Serviços' },
        { path: '/projects', icon: Briefcase, label: 'Projetos' },
      ],
      consultant: [
        { path: '/companies', icon: Building2, label: 'Empresas Cliente' },
        { path: '/marketplace', icon: ShoppingCart, label: 'Projetos' },
        { path: '/network', icon: Network, label: 'Network' },
      ],
      regulatory_body: [
        { path: '/companies', icon: Building2, label: 'Empresas' },
        { path: '/laboratories', icon: FlaskConical, label: 'Laboratórios' },
        { path: '/regulatory', icon: Shield, label: 'Regulatório' },
      ],
      sector_entity: [
        { path: '/network', icon: Network, label: 'Membros' },
        { path: '/companies', icon: Building2, label: 'Empresas' },
        { path: '/regulatory', icon: Shield, label: 'Regulatório' },
      ],
      research_institution: [
        { path: '/companies', icon: Building2, label: 'Parcerias' },
        { path: '/projects', icon: Briefcase, label: 'P&D' },
        { path: '/network', icon: Network, label: 'Pesquisadores' },
      ],
      supplier: [
        { path: '/companies', icon: Building2, label: 'Clientes' },
        { path: '/marketplace', icon: ShoppingCart, label: 'Produtos' },
        { path: '/laboratories', icon: FlaskConical, label: 'Laboratórios' },
      ],
      funding_agency: [
        { path: '/projects', icon: Briefcase, label: 'Projetos' },
        { path: '/companies', icon: Building2, label: 'Beneficiários' },
        { path: '/research_institution', icon: University, label: 'Instituições' },
      ],
      healthcare_provider: [
        { path: '/companies', icon: Building2, label: 'Fornecedores' },
        { path: '/marketplace', icon: ShoppingCart, label: 'Aquisições' },
        { path: '/regulatory', icon: Shield, label: 'Protocolos' },
      ]
    };

    const commonItems = [
      { path: '/ai', icon: Bot, label: 'AI Hub' },
      { path: '/chat', icon: MessageSquare, label: 'Chat IA' },
      { path: '/analytics', icon: BarChart3, label: 'Analytics' },
      { path: '/reports', icon: FileBarChart, label: 'Relatórios' }
    ];

    const userType = profile?.user_type as keyof typeof userTypeItems;
    const specificItems = userTypeItems[userType] || [];

    return [...baseItems, ...specificItems, ...commonItems];
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-[#1565C0]" />
              <span className="text-xl font-bold text-gray-900">PharmaConnect</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-[#1565C0] text-white'
                        : 'text-gray-600 hover:text-[#1565C0] hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/demo">
              <Button variant="outline" size="sm">
                Demo
              </Button>
            </Link>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {profile?.organization_name || profile?.first_name || 'Usuário'}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
