
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  DollarSign,
  AlertTriangle,
  Target,
  TrendingUp,
  Shield
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  phase: 'initiation' | 'planning' | 'execution' | 'monitoring' | 'closure';
  progress: number;
  budget: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  partners: ProjectPartner[];
  milestones: Milestone[];
  risks: Risk[];
  kpis: KPI[];
  contracts: Contract[];
}

interface ProjectPartner {
  id: string;
  name: string;
  role: string;
  contribution: number;
  accessLevel: 'full' | 'restricted' | 'view_only';
  responsibilities: string[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  dependencies: string[];
  deliverables: string[];
}

interface Risk {
  id: string;
  title: string;
  description: string;
  probability: number;
  impact: number;
  mitigation: string;
  status: 'open' | 'mitigated' | 'closed';
}

interface KPI {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface Contract {
  id: string;
  title: string;
  parties: string[];
  status: 'draft' | 'under_review' | 'signed' | 'expired';
  signedDate?: Date;
  expiryDate: Date;
  terms: string[];
}

const IntegratedProjectManagement = () => {
  const [selectedProject, setSelectedProject] = useState<Project>({
    id: '1',
    name: 'Desenvolvimento de Biofármaco Avançado',
    description: 'Projeto de desenvolvimento de novo medicamento para tratamento de câncer',
    phase: 'execution',
    progress: 68,
    budget: 2500000,
    spent: 1700000,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-12-15'),
    partners: [
      {
        id: '1',
        name: 'BioTech Labs',
        role: 'Pesquisa e Desenvolvimento',
        contribution: 40,
        accessLevel: 'full',
        responsibilities: ['Síntese química', 'Testes in vitro', 'Documentação regulatória']
      },
      {
        id: '2',
        name: 'PharmaCorp',
        role: 'Testes Clínicos',
        contribution: 35,
        accessLevel: 'restricted',
        responsibilities: ['Ensaios clínicos', 'Análise estatística', 'Relatórios médicos']
      },
      {
        id: '3',
        name: 'RegConsult',
        role: 'Consultoria Regulatória',
        contribution: 25,
        accessLevel: 'view_only',
        responsibilities: ['Conformidade ANVISA', 'Documentação regulatória', 'Aprovações']
      }
    ],
    milestones: [
      {
        id: '1',
        title: 'Síntese do Composto',
        description: 'Completar síntese química do princípio ativo',
        dueDate: new Date('2024-03-15'),
        status: 'completed',
        dependencies: [],
        deliverables: ['Composto purificado', 'Análise de pureza', 'Relatório de síntese']
      },
      {
        id: '2',
        title: 'Testes de Segurança',
        description: 'Realizar testes de toxicidade em modelos animais',
        dueDate: new Date('2024-06-15'),
        status: 'in_progress',
        dependencies: ['1'],
        deliverables: ['Relatório de toxicidade', 'Dados de segurança', 'Protocolo de dosagem']
      },
      {
        id: '3',
        title: 'Ensaios Clínicos Fase I',
        description: 'Iniciar ensaios clínicos em humanos',
        dueDate: new Date('2024-09-15'),
        status: 'pending',
        dependencies: ['2'],
        deliverables: ['Protocolo clínico', 'Consentimento informado', 'Dados preliminares']
      }
    ],
    risks: [
      {
        id: '1',
        title: 'Atraso na Aprovação Regulatória',
        description: 'Possível atraso na aprovação da ANVISA para ensaios clínicos',
        probability: 0.3,
        impact: 0.8,
        mitigation: 'Preparar documentação com antecedência e manter comunicação constante',
        status: 'open'
      },
      {
        id: '2',
        title: 'Problemas de Segurança',
        description: 'Descoberta de efeitos adversos durante testes',
        probability: 0.2,
        impact: 0.9,
        mitigation: 'Protocolos rigorosos de segurança e monitoramento contínuo',
        status: 'mitigated'
      }
    ],
    kpis: [
      {
        id: '1',
        name: 'Progresso Geral',
        target: 100,
        current: 68,
        unit: '%',
        trend: 'up'
      },
      {
        id: '2',
        name: 'Orçamento Utilizado',
        target: 70,
        current: 68,
        unit: '%',
        trend: 'stable'
      },
      {
        id: '3',
        name: 'Milestones Completados',
        target: 100,
        current: 33,
        unit: '%',
        trend: 'up'
      }
    ],
    contracts: [
      {
        id: '1',
        title: 'Acordo de Desenvolvimento Conjunto',
        parties: ['BioTech Labs', 'PharmaCorp'],
        status: 'signed',
        signedDate: new Date('2024-01-10'),
        expiryDate: new Date('2024-12-31'),
        terms: ['Compartilhamento de IP', 'Divisão de custos 60/40', 'Confidencialidade total']
      },
      {
        id: '2',
        title: 'Contrato de Consultoria Regulatória',
        parties: ['RegConsult'],
        status: 'signed',
        signedDate: new Date('2024-01-12'),
        expiryDate: new Date('2024-12-31'),
        terms: ['Consultoria especializada', 'Pagamento por milestone', 'Garantia de resultados']
      }
    ]
  });

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'initiation': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'execution': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-purple-100 text-purple-800';
      case 'closure': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevel = (probability: number, impact: number) => {
    const riskScore = probability * impact;
    if (riskScore >= 0.7) return { level: 'Alto', color: 'bg-red-100 text-red-800' };
    if (riskScore >= 0.4) return { level: 'Médio', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Baixo', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <span>Gestão Integrada de Projetos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Cabeçalho do Projeto */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedProject.name}</h2>
                <p className="text-gray-600">{selectedProject.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPhaseColor(selectedProject.phase)}>
                  {selectedProject.phase}
                </Badge>
                <Badge variant="outline">
                  {selectedProject.progress}% completo
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedProject.progress}%</div>
                <div className="text-sm text-gray-600">Progresso</div>
                <Progress value={selectedProject.progress} className="mt-1" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  R$ {(selectedProject.budget - selectedProject.spent).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Orçamento Restante</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{selectedProject.partners.length}</div>
                <div className="text-sm text-gray-600">Parceiros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.ceil((selectedProject.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-gray-600">Dias Restantes</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="partners">Parceiros</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="risks">Riscos</TabsTrigger>
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
              <TabsTrigger value="contracts">Contratos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cronograma</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Início</span>
                        <span className="font-medium">
                          {selectedProject.startDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Fim Planejado</span>
                        <span className="font-medium">
                          {selectedProject.endDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Duração</span>
                        <span className="font-medium">
                          {Math.ceil((selectedProject.endDate.getTime() - selectedProject.startDate.getTime()) / (1000 * 60 * 60 * 24))} dias
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Orçamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Total</span>
                        <span className="font-medium">
                          R$ {selectedProject.budget.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Gasto</span>
                        <span className="font-medium text-red-600">
                          R$ {selectedProject.spent.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Restante</span>
                        <span className="font-medium text-green-600">
                          R$ {(selectedProject.budget - selectedProject.spent).toLocaleString()}
                        </span>
                      </div>
                      <Progress 
                        value={(selectedProject.spent / selectedProject.budget) * 100} 
                        className="mt-2" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="partners" className="space-y-4">
              <div className="space-y-4">
                {selectedProject.partners.map((partner) => (
                  <Card key={partner.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{partner.name}</h3>
                          <p className="text-sm text-gray-600">{partner.role}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{partner.contribution}% contribuição</Badge>
                          <Badge className={
                            partner.accessLevel === 'full' ? 'bg-green-100 text-green-800' :
                            partner.accessLevel === 'restricted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {partner.accessLevel}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Responsabilidades:</p>
                        <div className="flex flex-wrap gap-2">
                          {partner.responsibilities.map((resp, index) => (
                            <Badge key={index} variant="secondary">
                              {resp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4">
              <div className="space-y-4">
                {selectedProject.milestones.map((milestone) => (
                  <Card key={milestone.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{milestone.title}</h3>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {milestone.dueDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Entregáveis:</p>
                        <div className="flex flex-wrap gap-2">
                          {milestone.deliverables.map((deliverable, index) => (
                            <Badge key={index} variant="outline">
                              {deliverable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="risks" className="space-y-4">
              <div className="space-y-4">
                {selectedProject.risks.map((risk) => {
                  const riskLevel = getRiskLevel(risk.probability, risk.impact);
                  return (
                    <Card key={risk.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{risk.title}</h3>
                            <p className="text-sm text-gray-600">{risk.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={riskLevel.color}>
                              {riskLevel.level}
                            </Badge>
                            <Badge variant="outline">
                              {risk.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Probabilidade: {Math.round(risk.probability * 100)}%</p>
                            <Progress value={risk.probability * 100} className="mt-1" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Impacto: {Math.round(risk.impact * 100)}%</p>
                            <Progress value={risk.impact * 100} className="mt-1" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-1">Mitigação:</p>
                          <p className="text-sm text-gray-600">{risk.mitigation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="kpis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedProject.kpis.map((kpi) => (
                  <Card key={kpi.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{kpi.name}</h3>
                        <TrendingUp className={`h-4 w-4 ${
                          kpi.trend === 'up' ? 'text-green-500' :
                          kpi.trend === 'down' ? 'text-red-500' :
                          'text-gray-500'
                        }`} />
                      </div>
                      <div className="text-center mb-3">
                        <div className="text-2xl font-bold text-blue-600">
                          {kpi.current}{kpi.unit}
                        </div>
                        <div className="text-sm text-gray-600">
                          Meta: {kpi.target}{kpi.unit}
                        </div>
                      </div>
                      <Progress value={(kpi.current / kpi.target) * 100} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4">
              <div className="space-y-4">
                {selectedProject.contracts.map((contract) => (
                  <Card key={contract.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{contract.title}</h3>
                          <p className="text-sm text-gray-600">
                            Partes: {contract.parties.join(', ')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={
                            contract.status === 'signed' ? 'bg-green-100 text-green-800' :
                            contract.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                            contract.status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {contract.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {contract.signedDate && (
                          <div className="flex items-center justify-between text-sm">
                            <span>Assinado em:</span>
                            <span>{contract.signedDate.toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span>Expira em:</span>
                          <span>{contract.expiryDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Termos Principais:</p>
                        <div className="flex flex-wrap gap-2">
                          {contract.terms.map((term, index) => (
                            <Badge key={index} variant="outline">
                              {term}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedProjectManagement;
