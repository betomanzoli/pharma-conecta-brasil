
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Target, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { StrategicProject } from '@/types/strategic-plan';

interface Phase1AIMatchingProps {
  projects: StrategicProject[];
  onProjectUpdate: (projects: StrategicProject[]) => void;
}

const Phase1AIMatching: React.FC<Phase1AIMatchingProps> = ({ projects, onProjectUpdate }) => {
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [projectIntegrations, setProjectIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simular dados de AI Matching
    const mockAiMatches = [
      {
        id: '1',
        projectName: 'Desenvolvimento de Biofármaco',
        matchScore: 0.94,
        partners: ['BioTech Labs', 'PharmaCorp'],
        capabilities: ['Análise Molecular', 'Síntese Química', 'Validação Clínica'],
        timeline: '6 meses',
        budget: 280000,
        riskLevel: 'low',
        expectedROI: 3.2,
        aiRecommendations: [
          'Priorizar parceria com BioTech Labs devido à expertise em análise molecular',
          'Considerar aceleração do timeline em 15% com recursos adicionais',
          'Implementar checkpoint de validação na semana 8'
        ]
      },
      {
        id: '2',
        projectName: 'Plataforma de Telemedicina',
        matchScore: 0.87,
        partners: ['TechHealth', 'MedSoft'],
        capabilities: ['Desenvolvimento Web', 'Compliance LGPD', 'Integração ANVISA'],
        timeline: '4 meses',
        budget: 150000,
        riskLevel: 'medium',
        expectedROI: 2.8,
        aiRecommendations: [
          'Validar compliance LGPD antes do desenvolvimento',
          'Implementar testes de segurança incrementais',
          'Considerar MVP para reduzir time-to-market'
        ]
      }
    ];

    const mockIntegrations = [
      {
        id: '1',
        name: 'Sistema de Gestão de Projetos Integrado',
        description: 'Integração AI Matching com PM tools',
        progress: 85,
        components: ['AI Engine', 'Project Dashboard', 'Resource Allocation', 'Risk Monitor'],
        status: 'active',
        lastUpdate: new Date(),
        metrics: {
          matchingAccuracy: 0.92,
          timeReduction: 45,
          resourceOptimization: 38,
          stakeholderSatisfaction: 8.7
        }
      },
      {
        id: '2',
        name: 'Plataforma de Colaboração Inteligente',
        description: 'AI-powered collaboration tools',
        progress: 65,
        components: ['Smart Scheduling', 'Conflict Resolution', 'Communication Hub', 'Performance Analytics'],
        status: 'active',
        lastUpdate: new Date(),
        metrics: {
          collaborationIndex: 8.4,
          decisionSpeed: 52,
          conflictReduction: 67,
          teamSatisfaction: 9.1
        }
      }
    ];

    setAiMatches(mockAiMatches);
    setProjectIntegrations(mockIntegrations);
  }, []);

  const executeAIMatching = async () => {
    setLoading(true);
    // Simular processamento de AI Matching
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Atualizar scores e recomendações
    const updatedMatches = aiMatches.map(match => ({
      ...match,
      matchScore: Math.min(0.98, match.matchScore + 0.02),
      lastUpdated: new Date()
    }));
    
    setAiMatches(updatedMatches);
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100';
    if (score >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-500" />
            <span>Fase 1: Integração AI Matching com Gestão de Projetos</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Sistema inteligente de matching e gestão integrada de projetos estratégicos
          </p>
        </div>
        <Button 
          onClick={executeAIMatching}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Zap className="h-4 w-4 mr-2" />
          {loading ? 'Processando...' : 'Executar AI Matching'}
        </Button>
      </div>

      <Tabs defaultValue="matching" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matching">AI Matching</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="matching" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{match.projectName}</CardTitle>
                    <Badge className={getScoreColor(match.matchScore)}>
                      {Math.round(match.matchScore * 100)}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Timeline</p>
                      <p className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {match.timeline}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-medium">R$ {match.budget.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Parceiros Recomendados</p>
                    <div className="flex flex-wrap gap-2">
                      {match.partners.map((partner: string, index: number) => (
                        <Badge key={index} variant="outline">{partner}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Capacidades Necessárias</p>
                    <div className="flex flex-wrap gap-2">
                      {match.capabilities.map((capability: string, index: number) => (
                        <Badge key={index} variant="secondary">{capability}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="h-4 w-4" />
                        <Badge className={getRiskColor(match.riskLevel)}>
                          {match.riskLevel} risk
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">{match.expectedROI}x ROI</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-2">Recomendações IA:</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {match.aiRecommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <div className="space-y-6">
            {projectIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{integration.name}</CardTitle>
                    <Badge className={integration.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{integration.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progresso</span>
                    <span className="text-sm font-medium">{integration.progress}%</span>
                  </div>
                  <Progress value={integration.progress} className="h-2" />

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Componentes</p>
                    <div className="flex flex-wrap gap-2">
                      {integration.components.map((component: string, index: number) => (
                        <Badge key={index} variant="outline">{component}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {(integration.metrics.matchingAccuracy * 100).toFixed(0)}%
                      </p>
                      <p className="text-sm text-gray-600">Precisão Matching</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {integration.metrics.timeReduction}%
                      </p>
                      <p className="text-sm text-gray-600">Redução Tempo</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {integration.metrics.resourceOptimization}%
                      </p>
                      <p className="text-sm text-gray-600">Otimização Recursos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {integration.metrics.stakeholderSatisfaction}
                      </p>
                      <p className="text-sm text-gray-600">Satisfação</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span>Precisão do Matching</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">94.2%</div>
                <p className="text-sm text-gray-600">+2.3% vs mês anterior</p>
                <Progress value={94.2} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <span>Tempo de Setup</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">3.2 dias</div>
                <p className="text-sm text-gray-600">-45% vs processo manual</p>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span>Satisfação Usuários</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">8.7/10</div>
                <p className="text-sm text-gray-600">+0.4 vs versão anterior</p>
                <Progress value={87} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Phase1AIMatching;
