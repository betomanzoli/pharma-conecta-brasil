import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Menu, 
  User, 
  BarChart3, 
  Brain, 
  Heart, 
  Zap, 
  TrendingUp,
  Globe,
  Target,
  Settings,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  description?: string;
}

const EnhancedMobileMenu = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const mainNavigation: NavigationItem[] = [
    {
      title: 'Dashboard Personalizado',
      href: '/dashboard/personalized',
      icon: User,
      badge: 'NEW',
      description: 'Insights únicos baseados no seu comportamento'
    },
    {
      title: 'AI Matching',
      href: '/ai',
      icon: Brain,
      description: 'Sistema inteligente de compatibilidade'
    },
    {
      title: 'Analytics Avançados',
      href: '/analytics/business',
      icon: BarChart3,
      badge: 'PRO',
      description: 'Métricas de negócio e ROI'
    },
    {
      title: 'Marketplace',
      href: '/marketplace',
      icon: Globe,
      description: 'Encontre parceiros e oportunidades'
    },
    {
      title: 'Relatórios ROI',
      href: '/reports/roi',
      icon: TrendingUp,
      badge: 'NEW',
      description: 'Análise individualizada de retorno'
    }
  ];

  const advancedFeatures: NavigationItem[] = [
    {
      title: 'Análise de Sentimento',
      href: '/ai/sentiment',
      icon: Heart,
      description: 'IA para análise de comunicação'
    },
    {
      title: 'Otimizações Finais',
      href: '/ai/final-optimizations',
      icon: Zap,
      description: 'A/B testing e recomendações'
    },
    {
      title: 'Monitor de Integração',
      href: '/integration/monitor',
      icon: Target,
      description: 'Status de todas as APIs'
    }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-left">
            PharmaConnect Brasil
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* User Profile Section */}
          {profile && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile.user_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Principal
            </h3>
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} to={item.href}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <Separator />

          {/* Advanced Features */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Recursos Avançados
            </h3>
            {advancedFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} to={item.href}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <Separator />

          {/* Quick Actions */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Ações Rápidas
            </h3>
            
            <Link to="/profile">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-sm">Configurações</span>
              </div>
            </Link>

            <button 
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <LogOut className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-sm">Sair</span>
            </button>
          </div>

          {/* Status Indicators */}
          <div className="mt-6 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Sistema Online</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Todas as integrações funcionando normalmente
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EnhancedMobileMenu;