
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Network, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  Shield,
  Lightbulb,
  BarChart3,
  Star,
  AlertCircle,
  CheckCircle,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConstellationNode {
  id: string;
  name: string;
  type: 'anchor' | 'partner' | 'supplier' | 'distributor';
  strength: number;
  value_contribution: number;
  risk_level: 'low' | 'medium' | 'high';
  strategic_importance: number;
}

interface ConstellationAnalysisProps {
  projectId?: string;
  partnerships?: any[];
  onAnalysisComplete?: (analysis: any) => void;
}

const ConstellationAnalysis: React.FC<ConstellationAnalysisProps> = ({
  projectId,
  partnerships = [],
  onAnalysisComplete
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [constellationData, setConstellationData] = useState<ConstellationNode[]>([]);
  const [networkMetrics, setNetworkMetrics] = useState<any>(null);

  useEffect(() => {
    generateConstellationAnalysis();
  }, [partnerships]);

  const generateConstellationAnalysis = async () => {
    setLoading(true);
    try {
      // Mock constellation analysis based on Gomes-Casseres theory
      const mockConstellation: ConstellationNode[] = [
        {
          id: '1',
          name: 'Empresa Principal (Você)',
          type: 'anchor',
          strength: 95,
          value_contribution: 40,
          risk_level: 'low',
          strategic_importance: 100
        },
        {
          id: '2',
          name: 'Laboratório Parceiro A',
          type: 'partner',
          strength: 85,
          value_contribution: 25,
          risk_level: 'medium',
          strategic_importance: 80
        },
        {
          id: '3',
          name: 'Fornecedor Especializado',
          type: 'supplier',
          strength: 70,
          value_contribution: 20,
          risk_level: 'medium',
          strategic_importance: 65
        },
        {
          id: '4',
          name: 'Distribuidor Regional',
          type: 'distributor',
          strength: 75,
          value_contribution: 15,
          risk_level: 'high',
          strategic_importance: 70
        }
      ];

      setConstellationData(mockConstellation);
      
      const metrics = {
        network_density: 0.78,
        value_alignment: 0.85,
        governance_score: 0.92,
        stability_index: 0.88,
        competitive_advantage: 0.83
      };
      
      setNetworkMetrics(metrics);

      if (onAnalysisComplete) {
        onAnalysisComplete({ constellation: mockConstellation, metrics });
      }

      toast({
        title: "Análise de Constelação Concluída",
        description: "Mapeamento estratégico das alianças realizado com sucesso."
      });
    } catch (error) {
      console.error('Error in constellation analysis:', error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível completar a análise de constelação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'anchor': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'partner': return <Users className="h-4 w-4 text-blue-500" />;
      case 'supplier': return <Shield className="h-4 w-4 text-green-500" />;
      case 'distributor': return <Globe className="h-4 w-4 text-purple-500" />;
      default: return <Network className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Analisando constelação de alianças...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
          <Network className="h-6 w-6 text-blue-500" />
          <span>Análise de Constelação de Alianças</span>
        </h2>
        <p className="text-gray-600">
          Baseada na teoria de Benjamin Gomes-Casseres sobre parcerias estratégicas
        </p>
      </div>

      {/* Network Metrics */}
      {networkMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <span>Métricas da Rede de Alianças</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(networkMetrics.network_density * 100)}%
                </div>
                <div className="text-sm text-gray-600">Densidade da Rede</div>
                <Progress value={networkMetrics.network_density * 100} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(networkMetrics.value_alignment * 100)}%
                </div>
                <div className="text-sm text-gray-600">Alinhamento de Valor</div>
                <Progress value={networkMetrics.value_alignment * 100} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(networkMetrics.governance_score * 100)}%
                </div>
                <div className="text-sm text-gray-600">Score Governança</div>
                <Progress value={networkMetrics.governance_score * 100} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(networkMetrics.stability_index * 100)}%
                </div>
                <div className="text-sm text-gray-600">Índice Estabilidade</div>
                <Progress value={networkMetrics.stability_index * 100} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Math.round(networkMetrics.competitive_advantage * 100)}%
                </div>
                <div className="text-sm text-gray-600">Vantagem Competitiva</div>
                <Progress value={networkMetrics.competitive_advantage * 100} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Constellation Nodes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5 text-blue-500" />
            <span>Mapeamento da Constelação</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {constellationData.map((node) => (
              <Card key={node.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(node.type)}
                      <h4 className="font-semibold">{node.name}</h4>
                    </div>
                    <Badge className={getRiskColor(node.risk_level)}>
                      {node.risk_level.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Força da Parceria</span>
                        <span>{node.strength}%</span>
                      </div>
                      <Progress value={node.strength} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Contribuição de Valor</span>
                        <span>{node.value_contribution}%</span>
                      </div>
                      <Progress value={node.value_contribution} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Importância Estratégica</span>
                        <span>{node.strategic_importance}%</span>
                      </div>
                      <Progress value={node.strategic_importance} />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Badge variant="outline" className="text-xs">
                      {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                    </Badge>
                    {node.strength > 80 && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <CheckCircle className="h-2 w-2 mr-1" />
                        Estável
                      </Badge>
                    )}
                    {node.risk_level === 'high' && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        <AlertCircle className="h-2 w-2 mr-1" />
                        Atenção
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>Recomendações Estratégicas Gomes-Casseres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2">1ª Lei - Configuração da Constelação</h5>
              <p className="text-sm text-blue-700">
                Sua constelação está bem equilibrada com densidade de 78%. Considere fortalecer 
                a parceria com o Distribuidor Regional para reduzir riscos.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2">2ª Lei - Coordenação Interna</h5>
              <p className="text-sm text-green-700">
                Score de governança excelente (92%). Mantenha os processos de comunicação 
                estruturados e implemente reuniões de alinhamento quinzenais.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold text-purple-800 mb-2">3ª Lei - Competição entre Constelações</h5>
              <p className="text-sm text-purple-700">
                Vantagem competitiva de 83% indica posição forte no mercado. Foque em 
                inovação colaborativa para manter liderança.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Button onClick={generateConstellationAnalysis} disabled={loading} className="w-full">
              <Network className="h-4 w-4 mr-2" />
              Atualizar Análise da Constelação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstellationAnalysis;
