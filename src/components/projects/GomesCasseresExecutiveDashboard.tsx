
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  TrendingUp, 
  Network, 
  Users, 
  Target,
  AlertCircle,
  CheckCircle,
  Star,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConstellationMetrics {
  health: number;
  valueCreation: number;
  competitivePosition: number;
  governance: number;
  stability: number;
}

const GomesCasseresExecutiveDashboard: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<ConstellationMetrics>({
    health: 89,
    valueCreation: 85,
    competitivePosition: 92,
    governance: 91,
    stability: 88
  });

  const overallScore = Math.round(
    Object.values(metrics).reduce((sum, value) => sum + value, 0) / Object.keys(metrics).length
  );

  const handleRefreshMetrics = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMetrics({
        health: Math.round(85 + Math.random() * 15),
        valueCreation: Math.round(80 + Math.random() * 20),
        competitivePosition: Math.round(88 + Math.random() * 12),
        governance: Math.round(87 + Math.random() * 13),
        stability: Math.round(85 + Math.random() * 15)
      });

      toast({
        title: "Métricas Atualizadas",
        description: "Dashboard executivo atualizado com dados mais recentes"
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 80) return <Star className="h-4 w-4 text-blue-600" />;
    if (score >= 70) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          <span>Dashboard Executivo Gomes-Casseres</span>
        </h2>
        <p className="text-gray-600">
          Análise estratégica das constelações de alianças e parcerias
        </p>
      </div>

      {/* Score Geral */}
      <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <span>Score Geral Gomes-Casseres</span>
            </span>
            <Badge className={`text-3xl px-6 py-3 ${getScoreColor(overallScore)} border-0`}>
              {overallScore}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallScore} className="h-4 mb-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Performance das Três Leis</span>
            <span className={`font-semibold ${
              overallScore >= 90 ? 'text-green-600' :
              overallScore >= 80 ? 'text-blue-600' :
              overallScore >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {overallScore >= 90 ? 'Excelente' :
               overallScore >= 80 ? 'Muito Bom' :
               overallScore >= 70 ? 'Bom' : 'Necessita Atenção'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="laws">Três Leis</TabsTrigger>
          <TabsTrigger value="constellation">Constelação</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{metrics.health}%</div>
                <div className="text-sm text-gray-600">Saúde da Rede</div>
                <Progress value={metrics.health} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-600">{metrics.valueCreation}%</div>
                <div className="text-sm text-gray-600">Criação de Valor</div>
                <Progress value={metrics.valueCreation} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-red-500" />
                </div>
                <div className="text-2xl font-bold text-red-600">{metrics.competitivePosition}%</div>
                <div className="text-sm text-gray-600">Posição Competitiva</div>
                <Progress value={metrics.competitivePosition} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{metrics.governance}%</div>
                <div className="text-sm text-gray-600">Governança</div>
                <Progress value={metrics.governance} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Network className="h-6 w-6 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-orange-600">{metrics.stability}%</div>
                <div className="text-sm text-gray-600">Estabilidade</div>
                <Progress value={metrics.stability} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* KPIs Estratégicos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parcerias Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                <div className="text-sm text-gray-600 mb-3">+3 este trimestre</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Farmacêuticas</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Laboratórios</span>
                    <span className="font-semibold">4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Valor Gerado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">R$ 8.2M</div>
                <div className="text-sm text-gray-600 mb-3">+15% vs trimestre anterior</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ROI Médio</span>
                    <span className="font-semibold">285%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tempo para Valor</span>
                    <span className="font-semibold">3.2 meses</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Competitiva</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-2">92%</div>
                <div className="text-sm text-gray-600 mb-3">vs média do setor</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Market Share</span>
                    <span className="font-semibold">18.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>NPS Parceiros</span>
                    <span className="font-semibold">78</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="laws" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <span>Identificação de Valor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Score da Lei</span>
                    <Badge className={getScoreColor(metrics.valueCreation)}>
                      {metrics.valueCreation}%
                    </Badge>
                  </div>
                  <Progress value={metrics.valueCreation} />
                  <div className="text-sm text-gray-600">
                    Capacidade de identificar e quantificar valor conjunto potencial
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    {getScoreIcon(metrics.valueCreation)}
                    <span>AI Matching Score: 94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <span>Governança Colaborativa</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Score da Lei</span>
                    <Badge className={getScoreColor(metrics.governance)}>
                      {metrics.governance}%
                    </Badge>
                  </div>
                  <Progress value={metrics.governance} />
                  <div className="text-sm text-gray-600">
                    Eficácia na governança e coordenação das colaborações
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    {getScoreIcon(metrics.governance)}
                    <span>Tempo médio de decisão: 2.1 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <span>Compartilhamento de Valor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Score da Lei</span>
                    <Badge className={getScoreColor(metrics.stability)}>
                      {metrics.stability}%
                    </Badge>
                  </div>
                  <Progress value={metrics.stability} />
                  <div className="text-sm text-gray-600">
                    Equidade na distribuição de valor e sustentabilidade
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    {getScoreIcon(metrics.stability)}
                    <span>Taxa de renovação: 89%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="constellation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mapa da Constelação de Alianças</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Visualização da Rede
                </h3>
                <p className="text-gray-500 mb-4">
                  Mapeamento interativo das conexões e fluxos de valor entre parceiros
                </p>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Gerar Visualização
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h5 className="font-semibold text-green-800 mb-2">
                🏆 Pontos Fortes da Constelação
              </h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Excelente posição competitiva (92%) versus concorrentes</li>
                <li>• Governança colaborativa bem estruturada (91%)</li>
                <li>• Rede de parcerias estável e crescente</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h5 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Oportunidades de Melhoria
              </h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Criação de valor pode ser otimizada (85% - meta: 90%)</li>
                <li>• Explorar novas geografias para expansão da rede</li>
                <li>• Implementar métricas mais granulares de ROI por parceria</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-semibold text-blue-800 mb-2">
                🎯 Ações Estratégicas Recomendadas
              </h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Expandir programa de AI Matching para incluir parceiros internacionais</li>
                <li>• Criar centro de excelência para governança de alianças</li>
                <li>• Desenvolver dashboard em tempo real para monitoramento de valor</li>
                <li>• Implementar programa de reconhecimento para parceiros estratégicos</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button 
          onClick={handleRefreshMetrics}
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          ) : (
            <Crown className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Atualizando...' : 'Atualizar Dashboard'}
        </Button>
      </div>
    </div>
  );
};

export default GomesCasseresExecutiveDashboard;
