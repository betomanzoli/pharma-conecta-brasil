
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, Target, Plus, AlertCircle, CheckCircle, Clock } from "lucide-react";
import Header from "@/components/Header";

const Projects = () => {
  const activeProjects = [
    {
      id: 1,
      title: "Desenvolvimento de Formulação Oral",
      description: "Projeto colaborativo para desenvolvimento de comprimido de liberação prolongada",
      status: "Em Andamento",
      progress: 65,
      participants: [
        { name: "FarmaTech", type: "company", role: "Patrocinador" },
        { name: "LabAnalítica SP", type: "laboratory", role: "Análises" },
        { name: "Dr. Carlos Mendes", type: "consultant", role: "Regulatório" },
        { name: "UNICAMP", type: "university", role: "Pesquisa" }
      ],
      deadline: "2024-12-15",
      budget: "R$ 250.000",
      priority: "Alta"
    },
    {
      id: 2,
      title: "Estudo de Estabilidade Acelerado",
      description: "Validação de condições de armazenamento para nova linha de produtos",
      status: "Planejamento",
      progress: 25,
      participants: [
        { name: "BioNova S.A.", type: "company", role: "Patrocinador" },
        { name: "BioTest Laboratórios", type: "laboratory", role: "Execução" }
      ],
      deadline: "2024-11-30",
      budget: "R$ 85.000",
      priority: "Média"
    }
  ];

  const opportunityProjects = [
    {
      id: 3,
      title: "Desenvolvimento de Biossimilar",
      description: "Busca-se parceiros para desenvolvimento completo de produto biossimilar",
      stakeholdersNeeded: ["Laboratório Analítico", "Consultor Regulatório", "Centro de Pesquisa"],
      budget: "R$ 500.000 - R$ 1.000.000",
      timeline: "18 meses",
      sponsor: "BioPharma Internacional",
      requirements: ["Certificação ISO 17025", "Experiência com biológicos", "Capacidade para estudos clínicos"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento":
        return "bg-blue-100 text-blue-800";
      case "Planejamento":
        return "bg-yellow-100 text-yellow-800";
      case "Concluído":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Média":
        return "bg-yellow-100 text-yellow-800";
      case "Baixa":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em Andamento":
        return <Clock className="h-4 w-4" />;
      case "Planejamento":
        return <AlertCircle className="h-4 w-4" />;
      case "Concluído":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projetos Colaborativos</h1>
            <p className="text-gray-600">Gerencie projetos multi-stakeholder e descubra oportunidades</p>
          </div>
          <Button className="bg-primary hover:bg-primary-600">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Projetos Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Colaboradores</p>
                  <p className="text-2xl font-bold text-gray-900">48</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Concluídos</p>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Oportunidades</p>
                  <p className="text-2xl font-bold text-gray-900">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
          </TabsList>

          {/* Active Projects */}
          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {activeProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-primary mb-2">{project.title}</CardTitle>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{project.status}</span>
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Progress and Details */}
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Progresso</span>
                            <span className="text-sm text-gray-600">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Target className="h-4 w-4 mr-2" />
                            Orçamento: {project.budget}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Participantes:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {project.participants.map((participant, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm font-medium">{participant.name}</span>
                                <Badge variant="outline" className="text-xs">{participant.role}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="space-y-3">
                        <Button className="w-full">Ver Detalhes</Button>
                        <Button variant="outline" className="w-full">Atualizar Status</Button>
                        <Button variant="outline" className="w-full">
                          <Users className="h-4 w-4 mr-2" />
                          Gerenciar Equipe
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Opportunity Projects */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {opportunityProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow border-green-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-primary mb-2">{project.title}</CardTitle>
                        <p className="text-gray-600 mb-2">{project.description}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Patrocinador:</span>
                          <span className="ml-2">{project.sponsor}</span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Nova Oportunidade
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Stakeholders Necessários:</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.stakeholdersNeeded.map((stakeholder, index) => (
                              <Badge key={index} variant="secondary">{stakeholder}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Requisitos:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {project.requirements.map((req, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Orçamento:</span>
                            <p className="text-green-600 font-medium">{project.budget}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Prazo:</span>
                            <p className="text-gray-600">{project.timeline}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            Manifestar Interesse
                          </Button>
                          <Button variant="outline" className="w-full">
                            Saber Mais
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Completed Projects placeholder */}
          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Projetos Concluídos</h3>
                <p className="text-gray-600">Histórico de projetos finalizados aparecerá aqui</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Projects;
