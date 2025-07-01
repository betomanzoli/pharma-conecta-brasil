import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  FileText, 
  Beaker, 
  DollarSign,
  CheckCircle,
  Building,
  GraduationCap,
  Briefcase,
  ExternalLink,
  RefreshCw,
  Bell
} from 'lucide-react';

const CompletePlatformDemo = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Dados simulados para demonstração
  const demoData = {
    alerts: [
      {
        title: 'Nova RDC 429 - Medicamentos Genéricos',
        source: 'ANVISA',
        severity: 'high',
        date: '2024-01-15',
        description: 'Resolução estabelece novos critérios para registro de medicamentos genéricos'
      },
      {
        title: 'Recall Lote XYZ123 - Antibiótico',
        source: 'ANVISA',
        severity: 'critical',
        date: '2024-01-14',
        description: 'Recall obrigatório devido à contaminação detectada em análise'
      },
      {
        title: 'FDA Approves New Oncology Drug',
        source: 'FDA',
        severity: 'medium',
        date: '2024-01-13',
        description: 'Nova aprovação para tratamento de câncer de pulmão'
      }
    ],
    opportunities: [
      {
        title: 'Edital FINEP - Inovação em Biotecnologia',
        agency: 'FINEP',
        value: 'R$ 5.000.000',
        deadline: '2024-03-30',
        match: 95
      },
      {
        title: 'Linha de Crédito BNDES Pharma',
        agency: 'BNDES',
        value: 'R$ 50.000.000',
        deadline: '2024-04-15',
        match: 88
      },
      {
        title: 'Programa SEBRAE - Farmácias',
        agency: 'SEBRAE',
        value: 'R$ 200.000',
        deadline: '2024-02-28',
        match: 76
      }
    ],
    companies: [
      {
        name: 'BioFarma Inovação',
        type: 'Farmacêutica',
        compatibility: 94,
        expertise: ['Biotecnologia', 'Oncologia', 'P&D'],
        location: 'São Paulo, SP'
      },
      {
        name: 'LabTech Solutions',
        type: 'Laboratório',
        compatibility: 89,
        expertise: ['Análises Clínicas', 'Controle Qualidade', 'Bioequivalência'],
        location: 'Rio de Janeiro, RJ'
      },
      {
        name: 'PharmaConsult Pro',
        type: 'Consultoria',
        compatibility: 85,
        expertise: ['Regulatório', 'Registro ANVISA', 'Compliance'],
        location: 'Brasília, DF'
      }
    ],
    research: [
      {
        title: 'Novos Antivirais para Tratamento de COVID-19',
        institution: 'FIOCRUZ',
        phase: 'Fase III',
        area: 'Virologia',
        impact: 'Alto'
      },
      {
        title: 'Desenvolvimento de Vacina contra Dengue',
        institution: 'Instituto Butantan',
        phase: 'Fase II',
        area: 'Imunologia',
        impact: 'Muito Alto'
      },
      {
        title: 'Terapia Gênica para Doenças Raras',
        institution: 'EMBRAPII',
        phase: 'Pré-clínico',
        area: 'Genética',
        impact: 'Alto'
      }
    ],
    metrics: {
      totalConnections: 1247,
      activeProjects: 89,
      completedDeals: 156,
      platformGrowth: 23.5,
      userSatisfaction: 4.8,
      avgResponseTime: '2.3h'
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getCompanyIcon = (type: string) => {
    switch (type) {
      case 'Farmacêutica': return <Building className="h-4 w-4" />;
      case 'Laboratório': return <Beaker className="h-4 w-4" />;
      case 'Consultoria': return <Briefcase className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PharmaConnect - Demonstração Completa</h1>
            <p className="text-gray-600 mt-2">
              Explore todas as funcionalidades da plataforma com dados simulados em tempo real
            </p>
          </div>
          <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
            DEMO INTERATIVA
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="matching">AI Matching</TabsTrigger>
          <TabsTrigger value="research">Pesquisa</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Conexões Ativas</p>
                    <p className="text-2xl font-bold">{demoData.metrics.totalConnections}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
                    <p className="text-2xl font-bold">{demoData.metrics.activeProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Negócios Fechados</p>
                    <p className="text-2xl font-bold">{demoData.metrics.completedDeals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Crescimento</p>
                    <p className="text-2xl font-bold">{demoData.metrics.platformGrowth}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Alertas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoData.alerts.slice(0, 3).map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-gray-500">{alert.source} • {alert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Oportunidades em Destaque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoData.opportunities.slice(0, 3).map((opp, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{opp.title}</p>
                        <p className="text-xs text-gray-500">{opp.agency} • {opp.value}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Compatibilidade</span>
                            <span>{opp.match}%</span>
                          </div>
                          <Progress value={opp.match} className="h-1 mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Alertas Regulatórios em Tempo Real</h2>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar
            </Button>
          </div>

          <div className="space-y-4">
            {demoData.alerts.map((alert, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{alert.source}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Publicado em: {alert.date}</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <h2 className="text-xl font-semibold">Oportunidades de Financiamento</h2>
          
          <div className="space-y-4">
            {demoData.opportunities.map((opp, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{opp.title}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">{opp.value}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Órgão: {opp.agency}</span>
                      <span className="text-gray-600">Prazo: {opp.deadline}</span>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium">Compatibilidade com seu perfil</span>
                        <span className="font-bold text-green-600">{opp.match}%</span>
                      </div>
                      <Progress value={opp.match} className="h-2" />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm">Candidatar-se</Button>
                      <Button variant="outline" size="sm">Mais Informações</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matching" className="space-y-4">
          <h2 className="text-xl font-semibold">AI Matching - Parceiros Recomendados</h2>
          
          <div className="space-y-4">
            {demoData.companies.map((company, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getCompanyIcon(company.type)}
                      <div>
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <p className="text-sm text-gray-600">{company.type} • {company.location}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {company.compatibility}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Áreas de Expertise:</p>
                      <div className="flex flex-wrap gap-2">
                        {company.expertise.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-medium">Compatibilidade</span>
                        <span className="font-bold text-blue-600">{company.compatibility}%</span>
                      </div>
                      <Progress value={company.compatibility} className="h-2" />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm">Conectar</Button>
                      <Button variant="outline" size="sm">Ver Perfil</Button>
                      <Button variant="ghost" size="sm">Enviar Mensagem</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          <h2 className="text-xl font-semibold">Pesquisas e Inovações</h2>
          
          <div className="space-y-4">
            {demoData.research.map((research, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      <div>
                        <CardTitle className="text-lg">{research.title}</CardTitle>
                        <p className="text-sm text-gray-600">{research.institution}</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      {research.phase}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Área:</span>
                        <span className="ml-2 text-gray-600">{research.area}</span>
                      </div>
                      <div>
                        <span className="font-medium">Impacto:</span>
                        <span className="ml-2 text-gray-600">{research.impact}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm">Acompanhar</Button>
                      <Button variant="outline" size="sm">Detalhes</Button>
                      <Button variant="ghost" size="sm">Contatar Pesquisadores</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-xl font-semibold">Analytics da Plataforma</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Satisfação dos Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {demoData.metrics.userSatisfaction}/5.0
                </div>
                <p className="text-sm text-gray-600">⭐⭐⭐⭐⭐</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {demoData.metrics.avgResponseTime}
                </div>
                <p className="text-sm text-gray-600">Muito abaixo da média do setor</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Crescimento Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  +{demoData.metrics.platformGrowth}%
                </div>
                <p className="text-sm text-gray-600">Novos usuários este mês</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Usuários por Segmento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Empresas Farmacêuticas</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Laboratórios</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <Progress value={28} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Consultores</span>
                  <span className="text-sm font-medium">18%</span>
                </div>
                <Progress value={18} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pesquisadores</span>
                  <span className="text-sm font-medium">9%</span>
                </div>
                <Progress value={9} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompletePlatformDemo;
