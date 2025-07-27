
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Vote, 
  MessageSquare, 
  Shield, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { StrategicProject, GovernanceMetrics } from '@/types/strategic-plan';

interface Phase2GovernanceProps {
  projects: StrategicProject[];
  onProjectUpdate: (projects: StrategicProject[]) => void;
}

const Phase2Governance: React.FC<Phase2GovernanceProps> = ({ projects, onProjectUpdate }) => {
  const [governanceData, setGovernanceData] = useState<any[]>([]);
  const [collaborationMetrics, setCollaborationMetrics] = useState<GovernanceMetrics>({
    decisionMakingSpeed: 0,
    stakeholderEngagement: 0,
    conflictResolution: 0,
    transparencyScore: 0,
    complianceLevel: 0,
    collaborationIndex: 0
  });

  useEffect(() => {
    // Simular dados de governança
    const mockGovernanceData = [
      {
        id: '1',
        projectId: '1',
        projectName: 'Desenvolvimento de Biofármaco',
        stakeholders: [
          { name: 'BioTech Labs', role: 'Parceiro Principal', engagement: 9.2, influence: 8.5 },
          { name: 'PharmaCorp', role: 'Investor', engagement: 8.7, influence: 9.0 },
          { name: 'Regulatory Team', role: 'Compliance', engagement: 8.9, influence: 7.5 },
          { name: 'Clinical Team', role: 'Validação', engagement: 9.1, influence: 8.0 }
        ],
        decisions: [
          {
            id: 'd1',
            title: 'Aprovação Fase 2 Clinical',
            status: 'approved',
            votesFor: 8,
            votesAgainst: 1,
            abstentions: 1,
            decisionDate: new Date('2024-01-15'),
            impact: 'high'
          },
          {
            id: 'd2',
            title: 'Aumento de Budget',
            status: 'pending',
            votesFor: 6,
            votesAgainst: 2,
            abstentions: 2,
            decisionDate: new Date('2024-01-20'),
            impact: 'medium'
          }
        ],
        conflicts: [
          {
            id: 'c1',
            title: 'Divergência Timeline',
            status: 'resolved',
            severity: 'medium',
            resolvedDate: new Date('2024-01-10'),
            resolutionTime: 3
          }
        ],
        transparencyScore: 8.9,
        complianceLevel: 9.5
      }
    ];

    const mockMetrics: GovernanceMetrics = {
      decisionMakingSpeed: 8.5,
      stakeholderEngagement: 9.2,
      conflictResolution: 7.8,
      transparencyScore: 8.9,
      complianceLevel: 9.5,
      collaborationIndex: 8.7
    };

    setGovernanceData(mockGovernanceData);
    setCollaborationMetrics(mockMetrics);
  }, []);

  const getEngagementColor = (score: number) => {
    if (score >= 9) return 'text-green-600 bg-green-100';
    if (score >= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDecisionStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConflictStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'active': return 'text-red-600 bg-red-100';
      case 'escalated': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Users className="h-6 w-6 text-green-500" />
            <span>Fase 2: Governança Colaborativa Inteligente</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Sistema de governança distribuída e tomada de decisões colaborativas
          </p>
        </div>
      </div>

      {/* Métricas Gerais de Governança */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Velocidade Decisão</p>
                <p className="text-2xl font-bold">{collaborationMetrics.decisionMakingSpeed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Engajamento</p>
                <p className="text-2xl font-bold">{collaborationMetrics.stakeholderEngagement}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Resolução Conflitos</p>
                <p className="text-2xl font-bold">{collaborationMetrics.conflictResolution}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Transparência</p>
                <p className="text-2xl font-bold">{collaborationMetrics.transparencyScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Compliance</p>
                <p className="text-2xl font-bold">{collaborationMetrics.complianceLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-600">Índice Colaboração</p>
                <p className="text-2xl font-bold">{collaborationMetrics.collaborationIndex}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stakeholders" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
          <TabsTrigger value="decisions">Decisões</TabsTrigger>
          <TabsTrigger value="conflicts">Conflitos</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="stakeholders" className="mt-6">
          <div className="space-y-6">
            {governanceData.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{project.projectName}</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {project.stakeholders.length} Stakeholders
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.stakeholders.map((stakeholder: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{stakeholder.name}</h4>
                          <Badge variant="outline">{stakeholder.role}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Engajamento</span>
                            <Badge className={getEngagementColor(stakeholder.engagement)}>
                              {stakeholder.engagement}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Influência</span>
                            <span className="text-sm font-medium">{stakeholder.influence}</span>
                          </div>
                          <Progress value={stakeholder.engagement * 10} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="mt-6">
          <div className="space-y-6">
            {governanceData.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.projectName} - Decisões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.decisions.map((decision: any) => (
                      <div key={decision.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{decision.title}</h4>
                          <Badge className={getDecisionStatusColor(decision.status)}>
                            {decision.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{decision.votesFor}</div>
                            <div className="text-sm text-gray-600">A favor</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{decision.votesAgainst}</div>
                            <div className="text-sm text-gray-600">Contra</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">{decision.abstentions}</div>
                            <div className="text-sm text-gray-600">Abstenções</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Data: {decision.decisionDate.toLocaleDateString()}</span>
                          <Badge variant="outline">Impacto: {decision.impact}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conflicts" className="mt-6">
          <div className="space-y-6">
            {governanceData.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.projectName} - Gestão de Conflitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.conflicts.map((conflict: any) => (
                      <div key={conflict.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{conflict.title}</h4>
                          <Badge className={getConflictStatusColor(conflict.status)}>
                            {conflict.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Severidade</p>
                            <p className="font-medium">{conflict.severity}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Tempo Resolução</p>
                            <p className="font-medium">{conflict.resolutionTime} dias</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Resolvido em</p>
                            <p className="font-medium">{conflict.resolvedDate.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="space-y-6">
            {governanceData.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle>{project.projectName} - Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Score de Transparência</h4>
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold text-blue-600">
                          {project.transparencyScore}
                        </div>
                        <div className="flex-1">
                          <Progress value={project.transparencyScore * 10} className="h-3" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Nível de Compliance</h4>
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold text-green-600">
                          {project.complianceLevel}
                        </div>
                        <div className="flex-1">
                          <Progress value={project.complianceLevel * 10} className="h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Phase2Governance;
