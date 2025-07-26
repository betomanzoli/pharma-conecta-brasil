
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Settings, 
  Activity,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ModelWeights {
  location_weight: number;
  expertise_weight: number;
  compliance_weight: number;
  size_weight: number;
  rating_weight: number;
  accuracy: number;
}

interface MLModelWeights {
  id: string;
  model_version: string;
  weights: ModelWeights;
  training_data_size: number;
  accuracy_score: number;
  trained_at: string;
  is_active: boolean;
}

interface PerformanceMetric {
  date: string;
  accuracy: number;
  matches: number;
  acceptance_rate: number;
}

// Função helper para converter JSON para ModelWeights
const parseModelWeights = (weights: any): ModelWeights => {
  if (!weights || typeof weights !== 'object') {
    return {
      location_weight: 0.2,
      expertise_weight: 0.3,
      compliance_weight: 0.25,
      size_weight: 0.15,
      rating_weight: 0.1,
      accuracy: 0
    };
  }

  return {
    location_weight: Number(weights.location_weight) || 0.2,
    expertise_weight: Number(weights.expertise_weight) || 0.3,
    compliance_weight: Number(weights.compliance_weight) || 0.25,
    size_weight: Number(weights.size_weight) || 0.15,
    rating_weight: Number(weights.rating_weight) || 0.1,
    accuracy: Number(weights.accuracy) || 0
  };
};

const MLModelWeights = () => {
  const [models, setModels] = useState<MLModelWeights[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadModels();
    loadPerformanceData();
  }, []);

  const loadModels = async () => {
    try {
      const { data, error } = await supabase
        .from('ml_model_weights')
        .select('*')
        .order('trained_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedModels = (data || []).map(item => ({
        id: item.id,
        model_version: item.model_version,
        weights: parseModelWeights(item.weights),
        training_data_size: item.training_data_size,
        accuracy_score: item.accuracy_score,
        trained_at: item.trained_at,
        is_active: item.is_active
      }));
      
      setModels(transformedModels);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const loadPerformanceData = async () => {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('metric_name', 'ai_matching_performance')
        .gte('measured_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('measured_at', { ascending: true });

      if (error) throw error;

      const formatted = (data || []).map(item => {
        const tags = item.tags as any || {};
        return {
          date: new Date(item.measured_at).toLocaleDateString(),
          accuracy: Number(tags.accuracy) || 0,
          matches: item.metric_value,
          acceptance_rate: Number(tags.acceptance_rate) || 0
        };
      });

      setPerformanceData(formatted);
    } catch (error) {
      console.error('Error loading performance data:', error);
    }
  };

  const triggerRetraining = async () => {
    setRetraining(true);
    try {
      const { data, error } = await supabase.functions.invoke('ml-feedback-loop', {
        body: { action: 'retrain' }
      });

      if (error) throw error;

      toast({
        title: "🚀 Retreinamento Iniciado",
        description: `Novo modelo v${data.result.model_version} sendo treinado com ${data.result.training_samples} amostras`,
      });

      // Recarregar dados após 5 segundos
      setTimeout(() => {
        loadModels();
        loadPerformanceData();
      }, 5000);

    } catch (error) {
      console.error('Error triggering retraining:', error);
      toast({
        title: "Erro no Retreinamento",
        description: "Falha ao iniciar retreinamento do modelo",
        variant: "destructive"
      });
    } finally {
      setRetraining(false);
    }
  };

  const updateWeights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ml-feedback-loop', {
        body: { action: 'update_weights' }
      });

      if (error) throw error;

      toast({
        title: "⚖️ Pesos Atualizados",
        description: `Modelo otimizado com base em performance recente`,
      });

      loadModels();
    } catch (error) {
      console.error('Error updating weights:', error);
      toast({
        title: "Erro na Atualização",
        description: "Falha ao atualizar pesos do modelo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const activeModel = models.find(m => m.is_active);

  return (
    <div className="space-y-6">
      {/* Header com Status */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl">Sistema de ML Avançado</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ativo
                </Badge>
                <Badge variant="outline">
                  v{activeModel?.model_version || 'N/A'}
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {activeModel?.accuracy_score ? `${Math.round(activeModel.accuracy_score * 100)}%` : '0%'}
              </div>
              <div className="text-sm text-muted-foreground">Precisão do Modelo</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {activeModel?.training_data_size || 0}
              </div>
              <div className="text-sm text-muted-foreground">Amostras de Treinamento</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {performanceData.length > 0 ? 
                  Math.round(performanceData[performanceData.length - 1]?.acceptance_rate * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Aceitação</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles de ML */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Controles do Modelo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={triggerRetraining} 
                disabled={retraining}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {retraining ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Retreinando...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Retreinar Modelo
                  </>
                )}
              </Button>
              
              <Button 
                onClick={updateWeights} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Otimizar Pesos
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Pesos Atuais</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeModel?.weights && (
              <div className="space-y-3">
                {Object.entries(activeModel.weights).map(([key, value]) => (
                  key !== 'accuracy' && (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">
                          {key.replace('_weight', '').replace('_', ' ')}
                        </span>
                        <span className="font-medium">{Math.round(Number(value) * 100)}%</span>
                      </div>
                      <Progress value={Number(value) * 100} className="h-2" />
                    </div>
                  )
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance do Modelo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Precisão"
                />
                <Line 
                  type="monotone" 
                  dataKey="acceptance_rate" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Taxa Aceitação"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Volume de Matches</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="matches" fill="#8b5cf6" name="Matches Gerados" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Modelos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Modelos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {models.map((model) => (
              <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">v{model.model_version}</span>
                    {model.is_active && (
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Treinado em {new Date(model.trained_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {Math.round(model.accuracy_score * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Precisão</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {model.training_data_size.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Amostras</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MLModelWeights;
