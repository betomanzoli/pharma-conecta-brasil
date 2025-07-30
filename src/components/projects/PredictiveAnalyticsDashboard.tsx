
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Calendar, 
  DollarSign, 
  Users,
  Brain,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PredictiveData {
  success_probability: number;
  completion_probability: number;
  budget_deviation_risk: number;
  timeline_risk: number;
  collaboration_health: number;
  risk_factors: Array<{
    type: string;
    probability: number;
    impact: number;
    mitigation: string;
  }>;
  recommendations: Array<{
    priority: string;
    action: string;
    impact: string;
  }>;
}

interface PredictiveAnalyticsDashboardProps {
  projectId?: string;
  projectData?: any;
}

const PredictiveAnalyticsDashboard: React.FC<PredictiveAnalyticsDashboardProps> = ({ 
  projectId, 
  projectData 
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [predictiveData, setPredictiveData] = useState<PredictiveData | null>(null);

  useEffect(() => {
    if (projectId || projectData) {
      fetchPredictiveAnalysis();
    }
  }, [projectId, projectData]);

  const fetchPredictiveAnalysis = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-predictive-analysis', {
        body: {
          action: 'analyze_project',
          project_id: projectId,
          project_data: projectData
        }
      });

      if (error) throw error;

      setPredictiveData(data.analysis);
    } catch (error) {
      console.error('Error fetching predictive analysis:', error);
      toast({
        title: "Erro na Análise Preditiva",
        description: "Não foi possível carregar a análise preditiva.",
        variant: "destructive"
      });
      
      // Mock data for demonstration
      setPredictiveData({
        success_probability: 78,
        completion_probability: 82,
        budget_deviation_risk: 25,
        timeline_risk: 30,
        collaboration_health: 85,
        risk_factors: [
          {
            type: "Risco Técnico",
            probability: 0.3,
            impact: 0.7,
            mitigation: "Revisão técnica semanal com especialistas"
          },
          {
            type: "Risco de Comunicação",
            probability: 0.2,
            impact: 0.5,
            mitigation: "Implementar reuniões diárias de alinhamento"
          }
        ],
        recommendations: [
          {
            priority: "Alta",
            action: "Intensificar comunicação entre parceiros",
            impact: "Redução de 15% no risco de atraso"
          },
          {
            priority: "Média",
            action: "Revisar alocação de recursos",
            impact: "Otimização de 10% no orçamento"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const riskColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Analisando dados com IA...</p>
        </CardContent>
      </Card>
    );
  }

  if (!predictiveData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Dados insuficientes para análise preditiva</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Prob. Sucesso</p>
                <p className={`text-2xl font-bold ${getHealthColor(predictiveData.success_probability)}`}>
                  {predictiveData.success_probability}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Conclusão</p>
                <p className={`text-2xl font-bold ${getHealthColor(predictiveData.completion_probability)}`}>
                  {predictiveData.completion_probability}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Risco Orçamento</p>
                <p className={`text-2xl font-bold ${predictiveData.budget_deviation_risk > 40 ? 'text-red-600' : 'text-orange-600'}`}>
                  {predictiveData.budget_deviation_risk}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Risco Prazo</p>
                <p className={`text-2xl font-bold ${predictiveData.timeline_risk > 40 ? 'text-red-600' : 'text-orange-600'}`}>
                  {predictiveData.timeline_risk}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Saúde Colab.</p>
                <p className={`text-2xl font-bold ${getHealthColor(predictiveData.collaboration_health)}`}>
                  {predictiveData.collaboration_health}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise Detalhada */}
      <Tabs defaultValue="risks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="risks">Fatores de Risco</TabsTrigger>
          <TabsTrigger value="predictions">Previsões</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Matriz de Riscos Identificados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveData.risk_factors.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{risk.type}</h4>
                      <Badge variant={risk.probability > 0.5 ? "destructive" : "secondary"}>
                        {risk.probability > 0.5 ? "Alto" : "Médio"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Probabilidade</p>
                        <Progress value={risk.probability * 100} className="mt-1" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Impacto</p>
                        <Progress value={risk.impact * 100} className="mt-1" />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm">
                        <strong>Mitigação:</strong> {risk.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendências de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={[
                    { month: 'Jan', success: 65, completion: 70, health: 75 },
                    { month: 'Feb', success: 70, completion: 75, health: 80 },
                    { month: 'Mar', success: 75, completion: 78, health: 82 },
                    { month: 'Abr', success: 78, completion: 82, health: 85 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="success" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="completion" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="health" stackId="3" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Riscos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Técnico', value: 30 },
                        { name: 'Comunicação', value: 20 },
                        { name: 'Orçamento', value: 25 },
                        { name: 'Prazo', value: 25 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      {riskColors.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <span>Recomendações da IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveData.recommendations.map((rec, index) => (
                  <Alert key={index} className="border-l-4 border-l-blue-500">
                    <BarChart3 className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={rec.priority === 'Alta' ? 'destructive' : 'secondary'}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="font-medium mb-1">{rec.action}</p>
                          <p className="text-sm text-gray-600">{rec.impact}</p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;
