
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/ui/logo';
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
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
  };

  const getUserTypeIcon = (userType?: string) => {
    switch (userType) {
      case 'regulatory_body': return <Building2 className="h-4 w-4" />;
      case 'sector_entity': return <Users className="h-4 w-4" />;
      case 'company': return <Package className="h-4 w-4" />;
      case 'consultant': return <UserCheck className="h-4 w-4" />;
      case 'professional': return <UserCheck className="h-4 w-4" />;
      case 'research_institution': return <GraduationCap className="h-4 w-4" />;
      case 'supplier': return <Package className="h-4 w-4" />;
      case 'funding_agency': return <DollarSign className="h-4 w-4" />;
      case 'healthcare_provider': return <Hospital className="h-4 w-4" />;
      case 'laboratory': return <FlaskConical className="h-4 w-4" />;
      case 'individual': return <User className="h-4 w-4" />;
      case 'admin': return <Settings className="h-4 w-4" />;
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

    const userTypeItems = [];
    
    switch (profile?.user_type) {
      case 'company':
        userTypeItems.push(
          { path: '/projects', icon: Briefcase, label: 'Projetos' },
          { path: '/marketplace', icon: Users, label: 'Marketplace' }
        );
        break;
        
      case 'laboratory':
        userTypeItems.push(
          { path: '/reports', icon: BarChart3, label: 'Relatórios' },
          { path: '/projects', icon: Briefcase, label: 'Projetos' }
        );
        break;
        
      case 'regulatory_body':
        userTypeItems.push(
          { path: '/reports', icon: BarChart3, label: 'Compliance' },
          { path: '/projects', icon: Building2, label: 'Regulamentações' }
        );
        break;
        
      case 'research_institution':
        userTypeItems.push(
          { path: '/projects', icon: GraduationCap, label: 'Projetos' },
          { path: '/reports', icon: BookOpen, label: 'Publicações' }
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
            <Link to="/" className="flex items-center">
              <Logo size="lg" />
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/demo">
                <Button variant="ghost">Demo</Button>
              </Link>
              <Link to="/auth#login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth#register">
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
          <Link to="/dashboard" className="flex items-center">
            <Logo size="lg" />
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
