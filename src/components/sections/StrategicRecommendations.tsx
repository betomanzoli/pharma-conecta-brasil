
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Microscope, User, Users, TrendingUp, Target, BookOpen, MessageSquare, Bell, BarChart3, Network, Zap } from 'lucide-react';

export const StrategicRecommendations = () => {
  const recommendations = [
    {
      userType: 'Empresas Farmacêuticas',
      icon: Building,
      color: 'bg-blue-500',
      strategies: [
        {
          title: 'Monitoramento Regulatório 24/7',
          description: 'Configure alertas automáticos para ANVISA, FDA e EMA',
          action: 'Configurar Alertas',
          roi: 'Redução de 80% no tempo de compliance',
          priority: 'Alta'
        },
        {
          title: 'Rede de Parceiros Estratégicos',
          description: 'Conecte-se com laboratórios e consultores especializados',
          action: 'Expandir Rede',
          roi: 'Acesso a 500+ especialistas',
          priority: 'Média'
        },
        {
          title: 'Marketplace de Oportunidades',
          description: 'Publique projetos e encontre parceiros qualificados',
          action: 'Publicar Projeto',
          roi: 'Redução de 60% no tempo de contratação',
          priority: 'Alta'
        }
      ]
    },
    {
      userType: 'Laboratórios',
      icon: Microscope,
      color: 'bg-green-500',
      strategies: [
        {
          title: 'Visibilidade no Marketplace',
          description: 'Destaque seus serviços e capacidades técnicas',
          action: 'Criar Perfil',
          roi: 'Aumento de 150% em leads qualificados',
          priority: 'Alta'
        },
        {
          title: 'Networking com Empresas',
          description: 'Conecte-se diretamente com tomadores de decisão',
          action: 'Conectar',
          roi: 'Acesso a 300+ empresas farmacêuticas',
          priority: 'Média'
        },
        {
          title: 'Gestão de Capacidade',
          description: 'Otimize sua agenda e recursos laboratoriais',
          action: 'Gerenciar Agenda',
          roi: 'Aumento de 40% na utilização de recursos',
          priority: 'Média'
        }
      ]
    },
    {
      userType: 'Consultores',
      icon: User,
      color: 'bg-purple-500',
      strategies: [
        {
          title: 'Autoridade no Setor',
          description: 'Compartilhe conhecimento e construa reputação',
          action: 'Criar Conteúdo',
          roi: 'Aumento de 200% na visibilidade profissional',
          priority: 'Alta'
        },
        {
          title: 'Mentoria Especializada',
          description: 'Ofereça sessões de mentoria premium',
          action: 'Oferecer Mentoria',
          roi: 'Receita adicional de R$ 5.000+/mês',
          priority: 'Alta'
        },
        {
          title: 'Rede de Influência',
          description: 'Expanda sua rede profissional estrategicamente',
          action: 'Expandir Rede',
          roi: 'Acesso a 1000+ profissionais',
          priority: 'Média'
        }
      ]
    },
    {
      userType: 'Profissionais',
      icon: Users,
      color: 'bg-orange-500',
      strategies: [
        {
          title: 'Desenvolvimento Profissional',
          description: 'Acesse conteúdo exclusivo e certificações',
          action: 'Iniciar Aprendizado',
          roi: 'Aumento médio de 30% no salário',
          priority: 'Alta'
        },
        {
          title: 'Networking Estratégico',
          description: 'Conecte-se com líderes do setor',
          action: 'Conectar',
          roi: 'Acesso a oportunidades exclusivas',
          priority: 'Média'
        },
        {
          title: 'Visibilidade Profissional',
          description: 'Destaque-se no mercado farmacêutico',
          action: 'Otimizar Perfil',
          roi: 'Aumento de 100% em oportunidades',
          priority: 'Alta'
        }
      ]
    }
  ];

  const platformBenefits = [
    {
      title: 'ROI Comprovado',
      description: 'Clientes reportam retorno médio de 300% em 6 meses',
      icon: TrendingUp,
      stat: '300%'
    },
    {
      title: 'Tempo de Implementação',
      description: 'Resultados visíveis em até 30 dias',
      icon: Zap,
      stat: '30 dias'
    },
    {
      title: 'Rede Ativa',
      description: 'Mais de 10.000 profissionais conectados',
      icon: Network,
      stat: '10k+'
    },
    {
      title: 'Compliance Garantido',
      description: 'Monitoramento 24/7 de regulamentações',
      icon: Bell,
      stat: '24/7'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-500';
      case 'Média': return 'bg-yellow-500';
      case 'Baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Estratégias Personalizadas para <span className="text-blue-600">Cada Segmento</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra como maximizar o ROI da sua participação na plataforma com estratégias comprovadas
          </p>
        </div>

        {/* Benefícios da Plataforma */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {platformBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{benefit.stat}</div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recomendações por Segmento */}
        <div className="space-y-12">
          {recommendations.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg ${segment.color} mr-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{segment.userType}</h3>
                    <p className="text-muted-foreground">Estratégias personalizadas para maximizar resultados</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {segment.strategies.map((strategy, strategyIndex) => (
                    <Card key={strategyIndex} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-lg">{strategy.title}</CardTitle>
                          <Badge className={`${getPriorityColor(strategy.priority)} text-white`}>
                            {strategy.priority}
                          </Badge>
                        </div>
                        <CardDescription>{strategy.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="text-sm text-green-800 font-medium">ROI Esperado</div>
                            <div className="text-sm text-green-700">{strategy.roi}</div>
                          </div>
                          <Button className="w-full" variant="outline">
                            {strategy.action}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Fluxo de Implementação */}
        <div className="mt-16 bg-blue-600 text-white rounded-xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Implementação em 3 Passos</h3>
            <p className="text-blue-100">Processo simplificado para resultados rápidos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Cadastro Estratégico</h4>
              <p className="text-blue-100">Configure seu perfil com informações que maximizam oportunidades</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Conexões Inteligentes</h4>
              <p className="text-blue-100">Use nossa IA para encontrar parceiros e oportunidades relevantes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Resultados Mensuráveis</h4>
              <p className="text-blue-100">Monitore ROI e ajuste estratégias com nossos analytics</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="secondary" className="text-blue-600">
              Começar Agora - Grátis por 30 dias
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
