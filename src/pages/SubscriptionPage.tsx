import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Shield, Zap, Globe, Award } from 'lucide-react';

const SubscriptionPage = () => {
  const { profile } = useAuth();

  const plans = [
    {
      name: 'Básico Brasil',
      price: 'R$ 299',
      period: '/mês',
      description: 'Para empresas iniciantes no mercado farmacêutico brasileiro',
      features: [
        'Matching básico com IA',
        'Até 50 conexões por mês',
        'Suporte ANVISA básico',
        'Conformidade LGPD',
        'Dashboard de analytics',
        'Suporte por email'
      ],
      highlighted: false
    },
    {
      name: 'Profissional Brasil',
      price: 'R$ 899',
      period: '/mês',
      description: 'Para empresas estabelecidas com operações nacionais',
      features: [
        'AI Matching avançado',
        'Conexões ilimitadas',
        'Compliance ANVISA completo',
        'Aprendizado federado',
        'Analytics regionais',
        'API de integração',
        'Suporte prioritário',
        'Treinamentos mensais'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise Brasil',
      price: 'R$ 2.499',
      period: '/mês',
      description: 'Para grandes corporações farmacêuticas',
      features: [
        'AI Matching personalizado',
        'Rede de parceiros dedicada',
        'Consultoria ANVISA',
        'Blockchain para governança',
        'Analytics preditivos',
        'Integração completa',
        'Gerente de conta dedicado',
        'SLA 99.9%',
        'Customizações especiais'
      ],
      highlighted: false
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Planos PharmaConnect Brasil
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha o plano ideal para sua empresa farmacêutica no mercado brasileiro. 
              Todos os planos incluem conformidade ANVISA e LGPD.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.highlighted ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    Começar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefícios Exclusivos */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Benefícios Exclusivos PharmaConnect Brasil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Conformidade ANVISA</h3>
                  <p className="text-sm text-gray-600">
                    Garantia de conformidade com todas as regulamentações da ANVISA
                  </p>
                </div>
                
                <div className="text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">IA Nacional</h3>
                  <p className="text-sm text-gray-600">
                    Algoritmos otimizados para o mercado farmacêutico brasileiro
                  </p>
                </div>
                
                <div className="text-center">
                  <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Rede Nacional</h3>
                  <p className="text-sm text-gray-600">
                    Acesso a toda rede de parceiros farmacêuticos do Brasil
                  </p>
                </div>
                
                <div className="text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Certificação</h3>
                  <p className="text-sm text-gray-600">
                    Certificado PharmaConnect para credibilidade no mercado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pronto para transformar sua empresa farmacêutica?
            </h2>
            <p className="text-gray-600 mb-6">
              Junte-se a centenas de empresas que já confiam na PharmaConnect Brasil
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Começar Teste Gratuito de 30 Dias
            </Button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default SubscriptionPage;