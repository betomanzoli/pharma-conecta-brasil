
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, MessageSquare, Calendar, Upload, Download, Eye } from "lucide-react";

const ProjectBoard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const projectData = {
    title: "Desenvolvimento de Formulação Oral - Projeto Alpha",
    description: "Desenvolvimento colaborativo de comprimido de liberação prolongada",
    progress: 68,
    stakeholders: [
      { name: "FarmaTech", role: "Patrocinador", type: "company", status: "active" },
      { name: "LabAnalítica SP", role: "Análises", type: "laboratory", status: "active" },
      { name: "Dr. Carlos Mendes", role: "Regulatório", type: "consultant", status: "active" },
      { name: "UNICAMP", role: "Pesquisa", type: "university", status: "pending" }
    ],
    milestones: [
      { name: "Formulação Inicial", status: "completed", date: "2024-01-10" },
      { name: "Testes de Estabilidade", status: "in-progress", date: "2024-01-25" },
      { name: "Análises Finais", status: "pending", date: "2024-02-15" },
      { name: "Submissão Regulatória", status: "pending", date: "2024-03-01" }
    ],
    documents: [
      { name: "Protocolo_Estabilidade_v2.pdf", version: "2.0", date: "2024-01-20", author: "LabAnalítica SP" },
      { name: "Especificação_Produto_v1.pdf", version: "1.0", date: "2024-01-15", author: "FarmaTech" },
      { name: "Plano_Regulatório_v3.pdf", version: "3.0", date: "2024-01-22", author: "Dr. Carlos Mendes" }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="max-w-6xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{projectData.title}</CardTitle>
            <p className="text-gray-600">{projectData.description}</p>
          </div>
          <div className="flex space-x-2">
            <Button size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat Seguro
            </Button>
            <Button size="sm" variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-sm text-gray-600">{projectData.progress}%</span>
          </div>
          <Progress value={projectData.progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="milestones">Marcos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Dr. Carlos Mendes enviou novo documento</span>
                      <span className="text-gray-500">2h atrás</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Milestone "Formulação Inicial" concluído</span>
                      <span className="text-gray-500">1 dia atrás</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>LabAnalítica SP solicitou revisão</span>
                      <span className="text-gray-500">3 dias atrás</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Próximas Entregas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Relatório de Estabilidade</span>
                      <span className="text-gray-500">Em 3 dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reunião de Revisão</span>
                      <span className="text-gray-500">Em 1 semana</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Análises Finais</span>
                      <span className="text-gray-500">Em 3 semanas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="stakeholders" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projectData.stakeholders.map((stakeholder, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{stakeholder.name}</h4>
                        <p className="text-sm text-gray-600">{stakeholder.role}</p>
                      </div>
                      <Badge className={getStatusColor(stakeholder.status)}>
                        {stakeholder.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Mensagem
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Perfil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <div className="space-y-3">
              {projectData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <p className="text-sm text-gray-600">
                        v{doc.version} • {doc.author} • {new Date(doc.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="milestones" className="space-y-4">
            <div className="space-y-4">
              {projectData.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className={`w-4 h-4 rounded-full ${
                    milestone.status === 'completed' ? 'bg-green-500' : 
                    milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium">{milestone.name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(milestone.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(milestone.status)}>
                    {milestone.status}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectBoard;
