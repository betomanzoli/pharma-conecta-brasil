
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Check, 
  Star, 
  TrendingUp, 
  Users, 
  Zap,
  Shield,
  BarChart3,
  Target,
  Rocket
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  limits: {
    matches_per_month: number;
    reports_per_month: number;
    partnerships: number;
    ai_requests: number;
  };
  popular?: boolean;
  enterprise?: boolean;
}

const SubscriptionManager = () => {
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const { profile } = useAuth();
  const { toast } = useToast();

  const plans: SubscriptionPlan[] = [
    {
      id: 'freemium',
      name: 'Freemium',
      price: 0,
      period: 'Gratuito',
      features: [
        'Perfil básico da empresa',
        '5 matches por mês',
        'Alertas regulatórios básicos',
        'Acesso ao marketplace',
        'Fóruns da comunidade'
      ],
      limits: {
        matches_per_month: 5,
        reports_per_month: 1,
        partnerships: 2,
        ai_requests: 10
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 297,
      period: 'por mês',
      features: [
        'Tudo do Freemium',
        'Matches ilimitados com IA',
        'Relatórios personalizados',
        'Calculadora ROI avançada',
        'Alertas regulatórios em tempo real',
        'Suporte prioritário',
        'Analytics avançados'
      ],
      limits: {
        matches_per_month: -1, // ilimitado
        reports_per_month: 10,
        partnerships: 20,
        ai_requests: 500
      },
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 897,
      period: 'por mês',
      features: [
        'Tudo do Professional',
        'API customizada',
        'Integração com ERP/CRM',
        'Relatórios white-label',
        'Consultoria dedicada',
        'SLA garantido',
        'Treinamento da equipe',
        'Compliance personalizado'
      ],
      limits: {
        matches_per_month: -1,
        reports_per_month: -1,
        partnerships: -1,
        ai_requests: -1
      },
      enterprise: true
    }
  ];

  useEffect(() => {
    fetchCurrentPlan();
  }, [profile]);

  const fetchCurrentPlan = async () => {
    if (!profile) return;

    try {
      // Buscar empresa do usuário
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('profile_id', profile.id)
        .single();

      if (company) {
        // Buscar plano atual
        const { data: subscription } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('company_id', company.id)
          .eq('status', 'active')
          .single();

        setCurrentPlan(subscription);
      }
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (!profile) return;

    setUpgrading(true);
    try {
      // Buscar empresa do usuário
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('profile_id', profile.id)
        .single();

      if (company) {
        // Atualizar plano (em produção, integraria com Stripe/PagSeguro)
        const { error } = await supabase
          .from('subscription_plans')
          .upsert({
            company_id: company.id,
            plan_type: planId,
            status: 'active',
            started_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
            features: plans.find(p => p.id === planId)?.features || []
          });

        if (error) throw error;

        toast({
          title: "Plano atualizado!",
          description: `Seu plano foi atualizado para ${plans.find(p => p.id === planId)?.name}`,
        });

        fetchCurrentPlan();
      }
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o plano",
        variant: "destructive"
      });
    } finally {
      setUpgrading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'freemium': return <Users className="h-6 w-6" />;
      case 'professional': return <Crown className="h-6 w-6" />;
      case 'enterprise': return <Rocket className="h-6 w-6" />;
      default: return <Star className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'freemium': return 'border-gray-200 bg-gray-50';
      case 'professional': return 'border-blue-200 bg-blue-50';
      case 'enterprise': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Plan Status */}
      {currentPlan && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <Crown className="h-5 w-5" />
              <span>Plano Atual: {currentPlan.plan_type}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-900">
                  {currentPlan.plan_type === 'freemium' ? '5' : '∞'}
                </p>
                <p className="text-sm text-blue-600">Matches/mês</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-900">97%</p>
                <p className="text-sm text-green-600">Uptime</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-900">
                  {currentPlan.features?.length || 0}
                </p>
                <p className="text-sm text-purple-600">Recursos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-900">24/7</p>
                <p className="text-sm text-orange-600">Suporte</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${getPlanColor(plan.id)} ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  Mais Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {getPlanIcon(plan.id)}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                {plan.price === 0 ? 'Gratuito' : `R$ ${plan.price}`}
                {plan.price > 0 && (
                  <span className="text-sm font-normal text-gray-600">/{plan.period}</span>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="space-y-2 mb-6 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Matches/mês:</span>
                  <span>{plan.limits.matches_per_month === -1 ? 'Ilimitado' : plan.limits.matches_per_month}</span>
                </div>
                <div className="flex justify-between">
                  <span>Relatórios/mês:</span>
                  <span>{plan.limits.reports_per_month === -1 ? 'Ilimitado' : plan.limits.reports_per_month}</span>
                </div>
                <div className="flex justify-between">
                  <span>Parcerias ativas:</span>
                  <span>{plan.limits.partnerships === -1 ? 'Ilimitado' : plan.limits.partnerships}</span>
                </div>
              </div>
              
              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={upgrading || currentPlan?.plan_type === plan.id}
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                {upgrading ? 'Processando...' : 
                 currentPlan?.plan_type === plan.id ? 'Plano Atual' : 
                 plan.price === 0 ? 'Manter Gratuito' : 'Fazer Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enterprise Benefits */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-900">
            <Shield className="h-5 w-5" />
            <span>Benefícios Enterprise</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Analytics Avançados</span>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Matching Personalizado</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Automação de Processos</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Compliance Dedicado</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Gerente de Conta</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="font-medium">ROI Personalizado</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;
