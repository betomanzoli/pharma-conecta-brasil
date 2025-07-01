
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  current?: boolean;
}

const Subscription = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Básico',
      price: 99,
      period: 'mês',
      description: 'Ideal para profissionais individuais',
      features: [
        'Até 10 conexões por mês',
        'Acesso ao marketplace',
        'Perfil profissional',
        'Suporte por email',
        'Alertas regulatórios básicos'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 299,
      period: 'mês',
      description: 'Perfeito para pequenas empresas',
      features: [
        'Conexões ilimitadas',
        'AI Matching avançado',
        'Analytics detalhado',
        'Suporte prioritário',
        'Compliance monitoring',
        'API access',
        'Custom branding'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 799,
      period: 'mês',
      description: 'Solução completa para grandes empresas',
      features: [
        'Tudo do Premium',
        'Gerente de conta dedicado',
        'Integrações customizadas',
        'Treinamento da equipe',
        'SLA garantido',
        'Relatórios executivos',
        'White-label option',
        'Multi-company dashboard'
      ]
    }
  ];

  useEffect(() => {
    checkCurrentSubscription();
  }, [profile]);

  const checkCurrentSubscription = async () => {
    if (!profile) return;

    try {
      const { data } = await supabase
        .from('subscribers')
        .select('subscription_tier, subscribed')
        .eq('user_id', profile.id)
        .single();

      if (data?.subscribed) {
        setCurrentPlan(data.subscription_tier?.toLowerCase() || 'basic');
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!profile) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Chamar edge function para criar checkout do Stripe
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          plan_id: planId,
          user_id: profile.id
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirecionar para o checkout do Stripe
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a assinatura. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: { user_id: profile.id }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao acessar portal do cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar o portal de gerenciamento.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Planos de Assinatura
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha o plano ideal para suas necessidades e acelere seus 
              negócios no setor farmacêutico
            </p>
          </div>

          {/* Current Plan Status */}
          {currentPlan && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Crown className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Plano Atual: {plans.find(p => p.id === currentPlan)?.name}
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Sua assinatura está ativa e funcionando perfeitamente
                    </p>
                  </div>
                </div>
                <Button onClick={handleManageSubscription} variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gerenciar Assinatura
                </Button>
              </div>
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative ${plan.popular ? 'ring-2 ring-primary-500 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      R$ {plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading || currentPlan === plan.id}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary-600 hover:bg-primary-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {currentPlan === plan.id ? (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Plano Atual
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        {loading ? 'Processando...' : 'Assinar Agora'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Posso cancelar minha assinatura a qualquer momento?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Sim, você pode cancelar sua assinatura a qualquer momento através 
                    do portal de gerenciamento. Não há taxas de cancelamento.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Há garantia de reembolso?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Oferecemos garantia de reembolso de 30 dias para todos os planos. 
                    Se não estiver satisfeito, reembolsamos integralmente.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Posso alterar meu plano depois?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer 
                    momento. As alterações são aplicadas no próximo ciclo de cobrança.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Que métodos de pagamento são aceitos?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Aceitamos cartões de crédito (Visa, Mastercard, American Express), 
                    PIX e boleto bancário para pagamentos mensais.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Subscription;
