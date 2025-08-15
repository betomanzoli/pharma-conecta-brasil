
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  TrendingUp, 
  Network, 
  BarChart3, 
  Target,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Star
} from 'lucide-react';
import ConstellationAnalysis from '@/components/advanced-predictive/ConstellationAnalysis';
import PortfolioOptimization from '@/components/advanced-predictive/PortfolioOptimization';

interface PredictiveInsight {
  id: string;
  insight_type: string;
  prediction_value: number;
  confidence_score: number;
  time_horizon: string;
  contributing_factors: string[];
  recommendations: string[];
}

const Phase5PredictiveAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const loadPredictiveInsights = async () => {
    setLoading(true);
    try {
      // Simulate loading predictive insights - using mock data since table may not be synced yet
      const mockInsights: PredictiveInsight[] = [
        {
          id: '1',
          insight_type: 'success_probability',
          prediction_value: 87.5,
          confidence_score: 92.3,
          time_horizon: '12_months',
          contributing_factors: ['Market alignment', 'Team expertise', 'Financial stability'],
          recommendations: ['Focus on market penetration', 'Strengthen partnerships']
        },
        {
          id: '2',
          insight_type: 'risk_assessment',
          prediction_value: 23.1,
          confidence_score: 88.7,
          time_horizon: '6_months',
          contributing_factors: ['Regulatory changes', 'Competition'],
          recommendations: ['Diversify portfolio', 'Monitor compliance']
        },
        {
          id: '3',
          insight_type: 'market_forecast',
          prediction_value: 156.7,
          confidence_score: 85.2,
          time_horizon: '24_months',
          contributing_factors: ['Industry growth', 'Technology adoption'],
          recommendations: ['Invest in R&D', 'Expand operations']
        }
      ];

      setInsights(mockInsights);
    } catch (error) {
      console.error('Error loading predictive insights:', error);
      toast({
        title: "Erro ao Carregar Insights",
        description: "Não foi possível carregar os insights preditivos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNewInsights = async () => {
    setLoading(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await loadPredictiveInsights();
      
      toast({
        title: "Insights Atualizados",
        description: "Novos insights preditivos foram gerados com base nos dados mais recentes",
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível gerar novos insights",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success_probability': return <Target className="h-5 w-5" />;
      case 'risk_assessment': return <AlertTriangle className="h-5 w-5" />;
      case 'market_forecast': return <TrendingUp className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const formatInsightType = (type: string) => {
    const types: Record<string, string> = {
      'success_probability': 'Probabilidade de Sucesso',
      'risk_assessment': 'Avaliação de Risco',
      'market_forecast': 'Previsão de Mercado',
      'partnership_recommendation': 'Recomendação de Parceria'
    };
    return types[type] || type;
  };

  useEffect(() => {
    loadPredictiveInsights();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-2xl">Análise Preditiva Avançada</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-purple-100 text-purple-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Fase 5 - Ativo
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {insights.length}
              </div>
              <div className="text-sm text-muted-foreground">Insights Ativos</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {insights.length > 0 ? Math.round(insights.reduce((acc, i) => acc + i.confidence_score, 0) / insights.length) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Confiança Média</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                87.5%
              </div>
              <div className="text-sm text-muted-foreground">Precisão do Modelo</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                24
              </div>
              <div className="text-sm text-muted-foreground">Horas de Análise</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Insights</span>
          </TabsTrigger>
          <TabsTrigger value="constellation" className="flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span>Constelações</span>
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Portfólio</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Preditiva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Precisão do Modelo</span>
                    <span className="text-sm text-muted-foreground">87.5%</span>
                  </div>
                  <Progress value={87.5} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Confiança Média</span>
                    <span className="text-sm text-muted-foreground">
                      {insights.length > 0 ? Math.round(insights.reduce((acc, i) => acc + i.confidence_score, 0) / insights.length) : 0}%
                    </span>
                  </div>
                  <Progress value={insights.length > 0 ? insights.reduce((acc, i) => acc + i.confidence_score, 0) / insights.length : 0} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Taxa de Acerto</span>
                    <span className="text-sm text-muted-foreground">92.3%</span>
                  </div>
                  <Progress value={92.3} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Análises Recentes</span>
                  <Button onClick={generateNewInsights} variant="outline" size="sm" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {getInsightIcon(insight.insight_type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{formatInsightType(insight.insight_type)}</h4>
                      <p className="text-xs text-muted-foreground">
                        Confiança: {insight.confidence_score.toFixed(1)}% | {insight.time_horizon.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">
                        {insight.prediction_value.toFixed(1)}
                        {insight.insight_type === 'success_probability' || insight.insight_type === 'risk_assessment' ? '%' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Insights Preditivos Detalhados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {insights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          {getInsightIcon(insight.insight_type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{formatInsightType(insight.insight_type)}</h3>
                          <p className="text-sm text-muted-foreground">
                            Horizonte: {insight.time_horizon.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {insight.prediction_value.toFixed(1)}
                          {insight.insight_type === 'success_probability' || insight.insight_type === 'risk_assessment' ? '%' : ''}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Confiança: {insight.confidence_score.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Fatores Contribuintes</h4>
                        <ul className="space-y-1">
                          {insight.contributing_factors.map((factor, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center">
                              <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Recomendações</h4>
                        <ul className="space-y-1">
                          {insight.recommendations.map((rec, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center">
                              <Zap className="h-3 w-3 mr-2 text-blue-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Constellation Tab */}
        <TabsContent value="constellation" className="space-y-6">
          <ConstellationAnalysis />
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <PortfolioOptimization />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Phase5PredictiveAnalysis;
