
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Network, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Zap,
  GitBranch,
  Shield,
  Star
} from 'lucide-react';

interface ConstellationNode {
  id: string;
  name: string;
  type: 'anchor' | 'partner' | 'supplier' | 'distributor' | 'client';
  strengthScore: number;
  valueContribution: number;
  riskLevel: 'low' | 'medium' | 'high';
  strategicImportance: number;
  networkDensity: number;
}

interface ConstellationRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  strength: number;
  trustLevel: number;
  communicationFrequency: string;
}

const ConstellationAnalysis = () => {
  const [nodes, setNodes] = useState<ConstellationNode[]>([]);
  const [relationships, setRelationships] = useState<ConstellationRelationship[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [analysisMetrics, setAnalysisMetrics] = useState({
    networkHealth: 0.87,
    diversificationIndex: 0.73,
    resilienceScore: 0.81,
    growthPotential: 0.92
  });

  useEffect(() => {
    // Mock constellation data
    const mockNodes: ConstellationNode[] = [
      {
        id: '1',
        name: 'BioPharma Central',
        type: 'anchor',
        strengthScore: 0.95,
        valueContribution: 0.88,
        riskLevel: 'low',
        strategicImportance: 0.97,
        networkDensity: 0.85
      },
      {
        id: '2',
        name: 'TechLab Solutions',
        type: 'partner',
        strengthScore: 0.82,
        valueContribution: 0.75,
        riskLevel: 'medium',
        strategicImportance: 0.78,
        networkDensity: 0.72
      },
      {
        id: '3',
        name: 'Global Distributors',
        type: 'distributor',
        strengthScore: 0.76,
        valueContribution: 0.84,
        riskLevel: 'low',
        strategicImportance: 0.81,
        networkDensity: 0.68
      },
      {
        id: '4',
        name: 'Chemical Suppliers Inc',
        type: 'supplier',
        strengthScore: 0.71,
        valueContribution: 0.67,
        riskLevel: 'high',
        strategicImportance: 0.69,
        networkDensity: 0.59
      },
      {
        id: '5',
        name: 'Healthcare Networks',
        type: 'client',
        strengthScore: 0.89,
        valueContribution: 0.91,
        riskLevel: 'low',
        strategicImportance: 0.86,
        networkDensity: 0.77
      }
    ];

    const mockRelationships: ConstellationRelationship[] = [
      {
        id: '1',
        sourceId: '1',
        targetId: '2',
        type: 'Strategic Partnership',
        strength: 0.85,
        trustLevel: 0.92,
        communicationFrequency: 'weekly'
      },
      {
        id: '2',
        sourceId: '1',
        targetId: '3',
        type: 'Distribution Agreement',
        strength: 0.78,
        trustLevel: 0.87,
        communicationFrequency: 'monthly'
      },
      {
        id: '3',
        sourceId: '2',
        targetId: '4',
        type: 'Supply Chain',
        strength: 0.65,
        trustLevel: 0.73,
        communicationFrequency: 'weekly'
      }
    ];

    setNodes(mockNodes);
    setRelationships(mockRelationships);
  }, []);

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'anchor': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'partner': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'supplier': return 'bg-green-100 text-green-800 border-green-300';
      case 'distributor': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'client': return 'bg-pink-100 text-pink-800 border-pink-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'anchor': return Target;
      case 'partner': return Users;
      case 'supplier': return GitBranch;
      case 'distributor': return Network;
      case 'client': return Star;
      default: return Network;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Saúde da Rede</p>
                <p className="text-2xl font-bold">{Math.round(analysisMetrics.networkHealth * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Diversificação</p>
                <p className="text-2xl font-bold">{Math.round(analysisMetrics.diversificationIndex * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Resiliência</p>
                <p className="text-2xl font-bold">{Math.round(analysisMetrics.resilienceScore * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Potencial</p>
                <p className="text-2xl font-bold">{Math.round(analysisMetrics.growthPotential * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Constellation Network */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Nodes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-blue-500" />
              <span>Nós da Constelação</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nodes.map((node) => {
                const NodeIcon = getNodeIcon(node.type);
                return (
                  <div 
                    key={node.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedNode === node.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <NodeIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{node.name}</h4>
                          <Badge className={getNodeTypeColor(node.type)}>
                            {node.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Força</div>
                        <div className="font-bold">{Math.round(node.strengthScore * 100)}%</div>
                      </div>
                    </div>

                    {selectedNode === node.id && (
                      <div className="space-y-3 mt-4 pt-4 border-t">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">Contribuição de Valor</div>
                            <Progress value={node.valueContribution * 100} className="h-2 mt-1" />
                            <div className="text-xs text-right">{Math.round(node.valueContribution * 100)}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Importância Estratégica</div>
                            <Progress value={node.strategicImportance * 100} className="h-2 mt-1" />
                            <div className="text-xs text-right">{Math.round(node.strategicImportance * 100)}%</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Nível de Risco:</span>
                          <span className={`font-medium ${getRiskColor(node.riskLevel)}`}>
                            {node.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Densidade da Rede:</span>
                          <span className="font-medium">{Math.round(node.networkDensity * 100)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Relationship Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-purple-500" />
              <span>Análise de Relacionamentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relationships.map((rel) => {
                const sourceNode = nodes.find(n => n.id === rel.sourceId);
                const targetNode = nodes.find(n => n.id === rel.targetId);
                
                return (
                  <div key={rel.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{rel.type}</span>
                      </div>
                      <Badge variant="outline">
                        {rel.communicationFrequency}
                      </Badge>
                    </div>
                    
                    <div className="text-sm mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{sourceNode?.name}</span>
                        <GitBranch className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-600">{targetNode?.name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-600">Força do Relacionamento</div>
                        <Progress value={rel.strength * 100} className="h-2 mt-1" />
                        <div className="text-xs text-right">{Math.round(rel.strength * 100)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Nível de Confiança</div>
                        <Progress value={rel.trustLevel * 100} className="h-2 mt-1" />
                        <div className="text-xs text-right">{Math.round(rel.trustLevel * 100)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <span>Recomendações Estratégicas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Oportunidades de Expansão</span>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Fortalecer parceria com TechLab Solutions (ROI: +15%)</li>
                <li>• Explorar novos canais de distribuição na América Latina</li>
                <li>• Implementar joint ventures em P&D</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Riscos Identificados</span>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Dependência excessiva do Chemical Suppliers Inc</li>
                <li>• Necessidade de diversificar fornecedores</li>
                <li>• Implementar planos de contingência</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Otimizações Sugeridas</span>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Aumentar frequência de comunicação com parceiros chave</li>
                <li>• Implementar sistema de monitoramento de saúde da rede</li>
                <li>• Desenvolver métricas de performance conjuntas</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">Próximos Passos</span>
              </div>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Agendar revisão trimestral da constelação</li>
                <li>• Implementar dashboard de monitoramento contínuo</li>
                <li>• Desenvolver plano de crescimento da rede</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstellationAnalysis;
