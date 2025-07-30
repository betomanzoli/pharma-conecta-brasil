
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, BarChart3, Users, Plus, FileText } from 'lucide-react';
import IntelligentProjectWizard from './IntelligentProjectWizard';
import PredictiveAnalyticsDashboard from './PredictiveAnalyticsDashboard';
import AIProjectTemplates from './AIProjectTemplates';

const EnhancedProjectsPage: React.FC = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);

  const mockProjects = [
    {
      id: '1',
      title: 'Desenvolvimento de Formulação Oral',
      description: 'Projeto colaborativo para desenvolvimento de comprimido',
      ai_generated: true,
      success_probability: 85,
      status: 'in_progress',
      created_at: '2024-01-15'
    },
    {
      id: '2',  
      title: 'Análise Regulatória FDA',
      description: 'Submissão de documentação regulatória',
      ai_generated: true,
      success_probability: 92,
      status: 'active',
      created_at: '2024-01-20'
    }
  ];

  const handleProjectCreated = (project: any) => {
    console.log('New intelligent project created:', project);
    // Refresh projects list
  };

  const handleSelectTemplate = (template: any) => {
    console.log('Template selected:', template);
    setIsWizardOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestão de Projetos Inteligente
          </h1>
          <p className="text-gray-600 mt-2">
            Projetos otimizados com IA para máxima eficiência e sucesso
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsWizardOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Criar Projeto Inteligente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Projetos IA</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-green-600">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Colaborações</p>
                <p className="text-2xl font-bold">34</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Templates IA</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="projects">Meus Projetos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Preditivo</TabsTrigger>
          <TabsTrigger value="templates">Templates IA</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span>Projetos Recentes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockProjects.slice(0, 3).map((project) => (
                    <div key={project.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{project.title}</h4>
                        {project.ai_generated && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Brain className="h-3 w-3 mr-1" />
                            IA
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-gray-500">Sucesso: </span>
                          <span className="font-semibold text-green-600">
                            {project.success_probability}%
                          </span>
                        </div>
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <span>Performance IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Precisão das Previsões</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Otimização de Cronograma</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Redução de Riscos</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        {project.ai_generated && (
                          <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
                            <Sparkles className="h-3 w-3 mr-1" />
                            IA Assistido
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600">{project.description}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="text-sm">
                          <span className="text-gray-500">Probabilidade de Sucesso: </span>
                          <span className="font-semibold text-green-600">
                            {project.success_probability}%
                          </span>
                        </div>
                        <Badge variant="outline">{project.status}</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProject(project)}
                      >
                        Ver Analytics
                      </Button>
                      <Button size="sm">
                        Abrir Projeto
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <PredictiveAnalyticsDashboard 
            projectId={selectedProject?.id}
            projectData={selectedProject}
          />
        </TabsContent>

        <TabsContent value="templates">
          <AIProjectTemplates onSelectTemplate={handleSelectTemplate} />
        </TabsContent>
      </Tabs>

      {/* Intelligent Project Wizard */}
      <IntelligentProjectWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default EnhancedProjectsPage;
