
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  User, 
  Settings, 
  MessageSquare, 
  LogOut,
  Bell,
  Workflow,
  BookOpen,
  BarChart3,
  Users,
  Building2,
  FlaskConical,
  UserCheck,
  Briefcase,
  GraduationCap,
  Package,
  DollarSign,
  Hospital
} from 'lucide-react';

const Navigation = () => {
  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getUserTypeIcon = (userType?: string) => {
    switch (userType) {
      case 'regulator': return <Building2 className="h-4 w-4" />;
      case 'sector_entity': return <Users className="h-4 w-4" />;
      case 'pharmaceutical_company': return <Package className="h-4 w-4" />;
      case 'service_provider': return <Briefcase className="h-4 w-4" />;
      case 'professional': return <UserCheck className="h-4 w-4" />;
      case 'research_institution': return <GraduationCap className="h-4 w-4" />;
      case 'supplier': return <Package className="h-4 w-4" />;
      case 'funding_agency': return <DollarSign className="h-4 w-4" />;
      case 'healthcare_provider': return <Hospital className="h-4 w-4" />;
      case 'laboratory': return <FlaskConical className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getNavigationItems = () => {
    const commonItems = [
      { path: '/dashboard', icon: Home, label: 'Dashboard' },
      { path: '/chat', icon: MessageSquare, label: 'AI Assistant' },
      { path: '/automation', icon: Workflow, label: 'Automações' },
      { path: '/notifications', icon: Bell, label: 'Notificações' },
      { path: '/knowledge', icon: BookOpen, label: 'Biblioteca' },
    ];

    // Adicionar itens específicos baseados no tipo de usuário
    const userTypeItems = [];
    
    switch (profile?.user_type) {
      case 'pharmaceutical_company':
      case 'company':
        userTypeItems.push(
          { path: '/products', icon: Package, label: 'Produtos' },
          { path: '/partnerships', icon: Users, label: 'Parcerias' }
        );
        break;
        
      case 'laboratory':
        userTypeItems.push(
          { path: '/capacity', icon: BarChart3, label: 'Capacidade' },
          { path: '/certifications', icon: UserCheck, label: 'Certificações' }
        );
        break;
        
      case 'regulator':
        userTypeItems.push(
          { path: '/compliance', icon: UserCheck, label: 'Compliance' },
          { path: '/regulations', icon: Building2, label: 'Regulamentações' }
        );
        break;
        
      case 'research_institution':
        userTypeItems.push(
          { path: '/projects', icon: GraduationCap, label: 'Projetos' },
          { path: '/publications', icon: BookOpen, label: 'Publicações' }
        );
        break;
    }

    return [...commonItems, ...userTypeItems];
  };

  if (!user) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-primary">
              PharmaConnect
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/demo">
                <Button variant="ghost">Demo</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const navigationItems = getNavigationItems();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="text-2xl font-bold text-primary">
            PharmaConnect
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getUserTypeIcon(profile?.user_type)}
              <span className="text-sm text-gray-600">
                {profile?.first_name} {profile?.last_name}
              </span>
            </div>
            
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
