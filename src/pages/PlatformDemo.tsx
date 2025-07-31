
import React from 'react';
import Navigation from '@/components/Navigation';
import DemoModeIndicator from '@/components/demo/DemoModeIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DemoAIMatchingEngine from '@/components/demo/DemoAIMatchingEngine';
import { TestTube, Users, Building2, FlaskConical, TrendingUp, MessageSquare, Calendar, FileText, Settings } from 'lucide-react';
import { demoData } from '@/utils/demoMode';

const PlatformDemo = () => {
  const metrics = demoData.metrics;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <TestTube className="h-8 w-8 text-blue-600" />
                <span>Demonstração da Plataforma</span>
                <DemoModeIndicator variant="badge" />
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Explore todas as funcionalidades com dados simulados
              </p>
            </div>
          </div>
          <DemoModeIndicator variant="alert" className="mt-4" />
        </div>

        {/* Métricas Demo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Empresas</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.activeCompanies}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FlaskConical className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Laboratórios</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.activeLaboratories}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.successfulMatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Funcionalidades */}
        <Tabs defaultValue="ai-matching" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-matching">AI Matching</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="network">Rede</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="ai-matching" className="mt-6">
            <DemoAIMatchingEngine />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <span>Projetos em Demonstração</span>
                  <DemoModeIndicator variant="badge" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demoData.projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <p className="text-sm text-gray-600">
                            Fase: {project.phase} • Timeline: {project.timeline}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-sm text-gray-600">Parceiros:</span>
                            {project.partners.map((partner, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {partner}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            R$ {project.budget.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">{project.progress}% completo</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Demo:</strong> Na versão real, os projetos são criados e gerenciados pelos usuários, 
                    com integração completa de workflow e comunicação entre as partes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-6 w-6 text-blue-600" />
                  <span>Rede de Contatos Demo</span>
                  <DemoModeIndicator variant="badge" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {demoData.companies.slice(0, 3).map((company) => (
                    <div key={company.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{company.name}</h3>
                          <p className="text-sm text-gray-600">{company.city}, {company.state}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{company.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {company.expertise_area.map((exp, idx) => (
                          <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {exp}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Conectar
                        </Button>
                        <Button size="sm" variant="outline">
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-green-800 text-sm">
                    <strong>Demo:</strong> A rede real permite conexões diretas, mensagens, 
                    agendamento de reuniões e colaboração em projetos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-6 w-6 text-blue-600" />
                  <span>Marketplace de Serviços Demo</span>
                  <DemoModeIndicator variant="badge" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {demoData.laboratories.slice(0, 4).map((lab) => (
                    <div key={lab.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <FlaskConical className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{lab.name}</h3>
                          <p className="text-sm text-gray-600">{lab.location}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{lab.description}</p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-600">Certificações:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {lab.certifications.map((cert, idx) => (
                              <span key={idx} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-600">Especializações:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {lab.specializations.map((spec, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Agendar
                        </Button>
                        <Button size="sm" variant="outline">
                          Solicitar Orçamento
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <p className="text-purple-800 text-sm">
                    <strong>Demo:</strong> O marketplace real inclui sistema de cotações, 
                    agendamento integrado, avaliações e gestão completa de contratos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Pronto para começar a usar a plataforma real?
          </h2>
          <p className="mb-6 text-blue-100">
            Cadastre-se agora e faça parte do maior ecossistema farmacêutico do Brasil
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => window.location.href = '/register'}
            >
              Criar Conta Gratuita
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.location.href = '/login'}
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformDemo;
