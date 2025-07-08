import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Crown, 
  Star, 
  Zap, 
  Shield, 
  CheckCircle, 
  XCircle,
  Calendar,
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  recommended?: boolean;
  icon: React.ReactNode;
  description: string;
}

const SubscriptionManager = () => {
  const { user } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null
  });

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Básico',
      price: 99,
      currency: 'BRL',
      interval: 'mês',
      icon: <Users className="h-6 w-6" />,
      description: 'Ideal para profissionais iniciantes',
      features: [
        'Acesso ao marketplace básico',
        'Até 5 conexões por mês',
        'Suporte por email',
        'Conteúdo brasileiro básico',
        '1 projeto ativo'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 299,
      currency: 'BRL',
      interval: 'mês',
      recommended: true,
      icon: <Crown className="h-6 w-6" />,
      description: 'Para empresas e consultores ativos',
      features: [
        'Acesso completo ao marketplace',
        'Conexões ilimitadas',
        'Suporte prioritário',
        'IA avançada e analytics',
        'Projetos ilimitados',
        'Alertas regulatórios em tempo real',
        'Relatórios personalizados'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 799,
      currency: 'BRL',
      interval: 'mês',
      icon: <Sparkles className="h-6 w-6" />,
      description: 'Soluções corporativas completas',
      features: [
        'Todas as funcionalidades Premium',
        'API personalizada',
        'Integrações dedicadas',
        'Suporte 24/7',
        'Treinamento especializado',
        'Compliance automático',
        'Dashboard executivo',
        'Multi-usuários'
      ]
    }
  ];

  // Verificar status da assinatura
  const checkSubscriptionStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Erro ao verificar assinatura:', error);
        return;
      }

      setSubscriptionStatus({
        subscribed: data.subscribed || false,
        subscription_tier: data.subscription_tier,
        subscription_end: data.subscription_end
      });
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
    }
  };

  // Iniciar checkout
  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para assinar um plano');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          plan_id: planId,
          user_id: user.id
        }
      });

      if (error) {
        console.error('Erro ao criar checkout:', error);
        toast.error('Erro ao processar pagamento. Verifique se a chave Stripe está configurada.');
        return;
      }

      if (data.url) {
        // Abrir Stripe Checkout em nova aba
        window.open(data.url, '_blank');
        toast.success('Redirecionando para o pagamento...');
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast.error('Erro ao processar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  // Gerenciar assinatura
  const handleManageSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Erro ao acessar portal:', error);
        toast.error('Erro ao acessar portal do cliente');
        return;
      }

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao acessar portal:', error);
      toast.error('Erro ao acessar portal do cliente');
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  // Atualizar status automaticamente
  useEffect(() => {
    const interval = setInterval(checkSubscriptionStatus, 10000); // A cada 10 segundos
    return () => clearInterval(interval);
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getCurrentPlan = () => {
    return plans.find(plan => plan.id === subscriptionStatus.subscription_tier);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Gerenciar Assinatura
          </h3>
          <p className="text-muted-foreground">
            Escolha o plano ideal para suas necessidades
          </p>
        </div>
        {subscriptionStatus.subscribed && (
          <Button onClick={handleManageSubscription} variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Gerenciar Assinatura
          </Button>
        )}
      </div>

      {/* Status atual da assinatura */}
      {subscriptionStatus.subscribed && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Assinatura Ativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Plano {getCurrentPlan()?.name || subscriptionStatus.subscription_tier}
                </p>
                {subscriptionStatus.subscription_end && (
                  <p className="text-sm text-muted-foreground">
                    Renova em: {new Date(subscriptionStatus.subscription_end).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="gap-1">
                <Crown className="h-3 w-3" />
                Ativo
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="billing">Faturamento</TabsTrigger>
          <TabsTrigger value="usage">Uso</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.recommended ? 'border-primary shadow-lg' : ''} ${
                  subscriptionStatus.subscription_tier === plan.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Recomendado
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-2">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold">
                    {formatCurrency(plan.price)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {subscriptionStatus.subscription_tier === plan.id ? (
                    <Button className="w-full" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Plano Atual
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isLoading}
                      variant={plan.recommended ? 'default' : 'outline'}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processando...
                        </>
                      ) : (
                        <>
                          {subscriptionStatus.subscribed ? 'Alterar Plano' : 'Assinar Agora'}
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Pagamento Seguro:</strong> Todos os pagamentos são processados com segurança pelo Stripe. 
              Você pode cancelar sua assinatura a qualquer momento.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Histórico de Faturamento
              </CardTitle>
              <CardDescription>
                Visualize suas faturas e histórico de pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma fatura encontrada</p>
                <p className="text-sm">As faturas aparecerão aqui após a primeira cobrança</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Uso Mensal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Conexões</span>
                    <span>12 / {subscriptionStatus.subscription_tier === 'basic' ? '5' : '∞'}</span>
                  </div>
                  <Progress value={subscriptionStatus.subscription_tier === 'basic' ? 240 : 24} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Projetos Ativos</span>
                    <span>3 / {subscriptionStatus.subscription_tier === 'basic' ? '1' : '∞'}</span>
                  </div>
                  <Progress value={subscriptionStatus.subscription_tier === 'basic' ? 300 : 15} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Benefícios Utilizados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Alertas ANVISA</span>
                  <Badge variant="secondary">15 este mês</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Relatórios IA</span>
                  <Badge variant="secondary">8 gerados</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Suporte</span>
                  <Badge variant="secondary">2 tickets</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {!subscriptionStatus.subscribed && (
        <Alert>
          <Star className="h-4 w-4" />
          <AlertDescription>
            <strong>Teste Gratuito:</strong> Experimente nossos recursos premium por 14 dias gratuitamente. 
            Sem compromisso, cancele quando quiser.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SubscriptionManager;