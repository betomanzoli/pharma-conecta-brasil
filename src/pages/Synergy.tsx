
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NetworkIcon, Users, Target, TrendingUp, Zap, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Synergy = () => {
  const { toast } = useToast();
  const [selectedPartnership, setSelectedPartnership] = useState<string | null>(null);

  const partnerships = [
    {
      id: 'biotech-alliance',
      name: 'BioTech Alliance',
      type: 'Desenvolvimento Conjunto',
      status: 'Ativo',
      compatibility: 92,
      description: 'Parceria estratégica para desenvolvimento de biológicos',
      benefits: ['Acesso a tecnologia avançada', 'Redução de custos P&D', 'Expertise compartilhada']
    },
    {
      id: 'pharma-global',
      name: 'PharmaGlobal Inc.',
      type: 'Distribuição Internacional',
      status: 'Negociação',
      compatibility: 87,
      description: 'Expansão para mercados internacionais',
      benefits: ['Rede de distribuição global', 'Conhecimento regulatório', 'Marca estabelecida']
    },
    {
      id: 'research-uni',
      name: 'Universidade de Pesquisa',
      type: 'P&D Acadêmico',
      status: 'Proposta',
      compatibility: 95,
      description: 'Colaboração em pesquisa translacional',
      benefits: ['Acesso a talentos', 'Infraestrutura de pesquisa', 'Incentivos fiscais']
    }
  ];

  const opportunities = [
    {
      title: 'Inteligência Artificial em Drug Discovery',
      potential: 'Alto',
      timeframe: '6-12 meses',
      investment: 'R$ 2-5M',
      description: 'Parceria com startups de IA para acelerar descoberta de novos compostos'
    },
    {
      title: 'Telemedicina e Saúde Digital',
      potential: 'Médio',
      timeframe: '3-6 meses',
      investment: 'R$ 500K-2M',
      description: 'Desenvolvimento de soluções digitais para acompanhamento de pacientes'
    },
    {
      title: 'Sustentabilidade e Green Chemistry',
      potential: 'Alto',
      timeframe: '12-18 meses',
      investment: 'R$ 1-3M',
      description: 'Parcerias para desenvolvimento de processos farmacêuticos sustentáveis'
    }
  ];

  const handleExplorePartnership = (partnershipId: string) => {
    setSelectedPartnership(partnershipId);
    toast({
      title: 'Análise Iniciada',
      description: 'Iniciando análise detalhada da parceria selecionada...'
    });
  };

  const handleContactPartner = (partnerName: string) => {
    toast({
      title: 'Contato Iniciado',
      description: `Solicitação de contato enviada para ${partnerName}`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <NetworkIcon className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Synergy Hub</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra e desenvolva parcerias estratégicas que aceleram a inovação farmacêutica
          </p>
        </div>

        <Tabs defaultValue="partnerships" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="partnerships">Parcerias Atuais</TabsTrigger>
            <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="partnerships" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerships.map((partnership) => (
                <Card key={partnership.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{partnership.name}</CardTitle>
                      <Badge variant={partnership.status === 'Ativo' ? 'default' : 'secondary'}>
                        {partnership.status}
                      </Badge>
                    </div>
                    <CardDescription>{partnership.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Compatibilidade</span>
                          <span>{partnership.compatibility}%</span>
                        </div>
                        <Progress value={partnership.compatibility} className="h-2" />
                      </div>
                      
                      <p className="text-sm text-gray-600">{partnership.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Benefícios:</h4>
                        {partnership.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleExplorePartnership(partnership.id)}
                          className="flex-1"
                        >
                          Explorar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleContactPartner(partnership.name)}
                        >
                          Contatar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {opportunities.map((opportunity, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                      <Badge variant={opportunity.potential === 'Alto' ? 'default' : 'secondary'}>
                        {opportunity.potential} Potencial
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">{opportunity.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">Timeline:</span>
                          <p>{opportunity.timeframe}</p>
                        </div>
                        <div>
                          <span className="font-semibold">Investimento:</span>
                          <p>{opportunity.investment}</p>
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        <Zap className="h-4 w-4 mr-2" />
                        Explorar Oportunidade
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Parcerias Ativas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ROI Médio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">285%</div>
                  <p className="text-xs text-muted-foreground">+15% vs. último ano</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projetos Conjuntos</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">3 em desenvolvimento</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Score de Sinergia</CardTitle>
                  <NetworkIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">91%</div>
                  <p className="text-xs text-muted-foreground">Excelente compatibilidade</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Matriz de Sinergia</CardTitle>
                <CardDescription>
                  Análise de compatibilidade e potencial de colaboração
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <NetworkIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Matriz de sinergia em desenvolvimento</p>
                  <p className="text-sm">Integração com algoritmos de IA para análise preditiva</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Synergy;
