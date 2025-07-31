
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Network, 
  PieChart, 
  TrendingUp, 
  Shield, 
  Target,
  Star,
  BarChart3,
  Zap,
  Users,
  Award,
  Lightbulb
} from 'lucide-react';
import ConstellationAnalysis from './ConstellationAnalysis';
import SharedValueSystem from './SharedValueSystem';
import { Progress } from '@/components/ui/progress';

interface ExecutiveSummary {
  constellation_health: number;
  value_creation_index: number;
  competitive_position: number;
  governance_effectiveness: number;
  strategic_alignment: number;
  overall_performance: number;
}

interface GomesCasseresExecutiveDashboardProps {
  projectId?: string;
  isExecutiveView?: boolean;
}

const GomesCasseresExecutiveDashboard: React.FC<GomesCasseresExecutiveDashboardProps> = ({
  projectId,
  isExecutiveView = true
}) => {
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    generateExecutiveSummary();
  }, []);

  const generateExecutiveSummary = async () => {
    setLoading(true);
    try {
      // Mock executive summary based on Gomes-Casseres methodology
      const mockSummary: ExecutiveSummary = {
        constellation_health: 89,
        value_creation_index: 85,
        competitive_position: 92,
        governance_effectiveness: 91,
        strategic_alignment: 87,
        overall_performance: 89
      };

      setExecutiveSummary(mockSummary);
    } catch (error) {
      console.error('Error generating executive summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 80) return 'bg-blue-50 border-blue-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando dashboard executivo...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center space-x-3">
          <Crown className="h-8 w-8 text-yellow-500" />
          <span>Dashboard Executivo Gomes-Casseres</span>
        </h1>
        <p className="text-gray-600">
          Visão estratégica completa das alianças e parcerias baseada na metodologia Gomes-Casseres
        </p>
      </div>

      {/* Executive Summary Cards */}
      {executiveSummary && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className={`border-2 ${getScoreBg(executiveSummary.constellation_health)}`}>
            <CardContent className="p-4 text-center">
              <Network className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className={`text-2xl font-bold ${getScoreColor(executiveSummary.constellation_health)}`}>
                {executiveSummary.constellation_health}%
              </div>
              <div className="text-sm text-gray-600">Saúde da Constelação</div>
              <Progress value={executiveSummary.constellation_health} className="mt-2" />
            </CardContent>
          </Card>

          <Card className={`border-2 ${getScoreBg(executiveSummary.value_creation_index)}`}>
            <CardContent className="p-4 text-center">
              <PieChart className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className={`text-2xl font-bold ${getScoreColor(executiveSummary.value_creation_index)}`}>
                {executiveSummary.value_creation_index}%
              </div>
              <div className="text-sm text-gray-600">Criação de Valor</div>
              <Progress value={executiveSummary.value_creation_index} className="mt-2" />
            </CardContent>
          </Card>

          <Card className={`border-2 ${getScoreBg(executiveSummary.competitive_position)}`}>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className={`text-2xl font-bold ${getScoreColor(executiveSummary.competitive_position)}`}>
                {executiveSummary.competitive_position}%
              </div>
              <div className="text-sm text-gray-600">Posição Competitiva</div>
              <Progress value={executiveSummary.competitive_position} className="mt-2" />
            </CardContent>
          </Card>

          <Card className={`border-2 ${getScoreBg(executiveSummary.governance_effectiveness)}`}>
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <div className={`text-2xl font-bold ${getScoreColor(executiveSummary.governance_effectiveness)}`}>
                {executiveSummary.governance_effectiveness}%
              </div>
              <div className="text-sm text-gray-600">Efetividade Governança</div>
              <Progress value={executiveSummary.governance_effectiveness} className="mt-2" />
            </CardContent>
          </Card>

          <Card className={`border-2 ${getScoreBg(executiveSummary.strategic_alignment)}`}>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <div className={`text-2xl font-bold ${getScoreColor(executiveSummary.strategic_alignment)}`}>
                {executiveSummary.strategic_alignment}%
              </div>
              <div className="text-sm text-gray-600">Alinhamento Estratégico</div>
              <Progress value={executiveSummary.strategic_alignment} className="mt-2" />
            </CardContent>
          </Card>

          <Card className={`border-2 ${getScoreBg(executiveSummary.overall_performance)}`}>
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className={`text-2xl font-bold ${getScoreColor(executiveSummary.overall_performance)}`}>
                {executiveSummary.overall_performance}%
              </div>
              <div className="text-sm text-gray-600">Performance Geral</div>
              <Progress value={executiveSummary.overall_performance} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Strategic Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>Insights Estratégicos Executivos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800 mb-2">🎯 Posição Competitiva Forte</h4>
              <p className="text-sm text-green-700">
                Sua constelação de alianças está posicionada 15% acima da média do setor, 
                com vantagem competitiva sustentável.
              </p>
              <Badge className="mt-2 bg-green-100 text-green-800">Excelente</Badge>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-800 mb-2">📈 Criação de Valor Eficiente</h4>
              <p className="text-sm text-blue-700">
                Índice de criação de valor 25% superior ao benchmark, com ROI de 
                parcerias em 3.2x o investimento inicial.
              </p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">Acima da Meta</Badge>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Área de Atenção</h4>
              <p className="text-sm text-yellow-700">
                Alinhamento estratégico pode ser otimizado através de reuniões 
                de sincronização mais frequentes.
              </p>
              <Badge className="mt-2 bg-yellow-100 text-yellow-800">Monitorar</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="constellation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="constellation" className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span>1ª Lei - Constelação</span>
          </TabsTrigger>
          <TabsTrigger value="governance" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>2ª Lei - Coordenação</span>
          </TabsTrigger>
          <TabsTrigger value="competition" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>3ª Lei - Competição</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="constellation">
          <ConstellationAnalysis />
        </TabsContent>

        <TabsContent value="governance">
          <SharedValueSystem />
        </TabsContent>

        <TabsContent value="competition">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-red-500" />
                <span>Análise Competitiva - 3ª Lei de Gomes-Casseres</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Vantagens Competitivas Identificadas</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          <Zap className="h-3 w-3 mr-1" />
                          Tecnológica
                        </Badge>
                        <span className="text-sm">Inovação colaborativa 40% mais rápida</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          <Users className="h-3 w-3 mr-1" />
                          Rede
                        </Badge>
                        <span className="text-sm">Densidade de parceiros 25% superior</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Escala
                        </Badge>
                        <span className="text-sm">Economia de escala 30% maior</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Posicionamento vs. Concorrentes</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Força da Constelação</span>
                          <span className="text-sm font-semibold">1º Lugar</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Velocidade de Inovação</span>
                          <span className="text-sm font-semibold">1º Lugar</span>
                        </div>
                        <Progress value={88} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Eficiência Operacional</span>
                          <span className="text-sm font-semibold">2º Lugar</span>
                        </div>
                        <Progress value={82} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">
                    Estratégias de Competição entre Constelações
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Estratégias Ofensivas</h5>
                      <ul className="space-y-1 text-sm">
                        <li>• Acelerar ciclos de inovação colaborativa</li>
                        <li>• Expandir rede de parceiros estratégicos</li>
                        <li>• Diversificar capacidades da constelação</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Estratégias Defensivas</h5>
                      <ul className="space-y-1 text-sm">
                        <li>• Fortalecer vínculos com parceiros-chave</li>
                        <li>• Criar barreiras de entrada competitivas</li>
                        <li>• Monitorar movimentos de constelações rivais</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Executive Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span>Ações Estratégicas Recomendadas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <Badge className="bg-red-100 text-red-800 mb-2">Alta Prioridade</Badge>
              <h5 className="font-semibold mb-2">Otimizar Alinhamento Estratégico</h5>
              <p className="text-sm text-gray-700">
                Implementar reuniões estratégicas trimestrais com todos os parceiros 
                para melhorar o alinhamento de objetivos.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <Badge className="bg-yellow-100 text-yellow-800 mb-2">Média Prioridade</Badge>
              <h5 className="font-semibold mb-2">Ampliar Base de Parceiros</h5>
              <p className="text-sm text-gray-700">
                Identificar 2-3 novos parceiros estratégicos para fortalecer 
                posições competitivas em mercados emergentes.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <Badge className="bg-green-100 text-green-800 mb-2">Baixa Prioridade</Badge>
              <h5 className="font-semibold mb-2">Otimização Contínua</h5>
              <p className="text-sm text-gray-700">
                Continuar refinando processos de governança e 
                métricas de performance da constelação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GomesCasseresExecutiveDashboard;
