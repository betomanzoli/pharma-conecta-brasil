
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMLPrioritization } from '@/hooks/useMLPrioritization';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Activity,
  Database
} from 'lucide-react';

const MLPrioritizationDashboard = () => {
  const {
    loading,
    model,
    prioritizedSources,
    performanceMetrics,
    retrainModel,
    refreshMetrics
  } = useMLPrioritization();

  const [activeTab, setActiveTab] = useState('overview');

  const getModelStatus = () => {
    if (!model) return { status: 'No Model', color: 'bg-gray-500', icon: AlertCircle };
    if (performanceMetrics?.accuracy > 0.9) return { status: 'Excellent', color: 'bg-green-500', icon: CheckCircle };
    if (performanceMetrics?.accuracy > 0.8) return { status: 'Good', color: 'bg-blue-500', icon: Activity };
    return { status: 'Needs Training', color: 'bg-orange-500', icon: AlertCircle };
  };

  const modelStatus = getModelStatus();
  const StatusIcon = modelStatus.icon;

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
              <span className="text-2xl">Sistema de Priorização ML</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`${modelStatus.color} text-white`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {modelStatus.status}
                </Badge>
                {model && (
                  <Badge variant="outline">
                    {model.version}
                  </Badge>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {performanceMetrics ? Math.round(performanceMetrics.accuracy * 100) : 85}%
              </div>
              <div className="text-sm text-muted-foreground">Precisão do Modelo</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {prioritizedSources.length}
              </div>
              <div className="text-sm text-muted-foreground">Fontes Priorizadas</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {performanceMetrics ? Math.round(performanceMetrics.f1_score * 100) : 80}%
              </div>
              <div className="text-sm text-muted-foreground">F1-Score</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {model?.training_samples || 0}
              </div>
              <div className="text-sm text-muted-foreground">Dados de Treino</div>
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
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Fontes</span>
          </TabsTrigger>
          <TabsTrigger value="model" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Modelo</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Precisão</span>
                    <span className="text-sm text-muted-foreground">
                      {performanceMetrics ? Math.round(performanceMetrics.accuracy * 100) : 85}%
                    </span>
                  </div>
                  <Progress value={performanceMetrics ? performanceMetrics.accuracy * 100 : 85} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Recall</span>
                    <span className="text-sm text-muted-foreground">
                      {performanceMetrics ? Math.round(performanceMetrics.recall * 100) : 78}%
                    </span>
                  </div>
                  <Progress value={performanceMetrics ? performanceMetrics.recall * 100 : 78} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">F1-Score</span>
                    <span className="text-sm text-muted-foreground">
                      {performanceMetrics ? Math.round(performanceMetrics.f1_score * 100) : 80}%
                    </span>
                  </div>
                  <Progress value={performanceMetrics ? performanceMetrics.f1_score * 100 : 80} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Confiança Média</span>
                    <span className="text-sm text-muted-foreground">
                      {performanceMetrics ? Math.round(performanceMetrics.confidence_avg * 100) : 75}%
                    </span>
                  </div>
                  <Progress value={performanceMetrics ? performanceMetrics.confidence_avg * 100 : 75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pesos do Modelo Atual</CardTitle>
              </CardHeader>
              <CardContent>
                {model?.weights ? (
                  <div className="space-y-4">
                    {Object.entries(model.weights).map(([weight, value]) => (
                      <div key={weight} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">
                            {weight.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((value as number) * 100)}%
                          </span>
                        </div>
                        <Progress value={(value as number) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum modelo ativo encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Análise de Performance</span>
                <Button onClick={refreshMetrics} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800">Alta Precisão</h3>
                  <p className="text-sm text-green-600">
                    {performanceMetrics ? Math.round(performanceMetrics.precision * 100) : 82}% de precisão
                  </p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800">Melhoria Contínua</h3>
                  <p className="text-sm text-blue-600">
                    Aprendizado com feedback de usuários
                  </p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-purple-800">Resposta Rápida</h3>
                  <p className="text-sm text-purple-600">
                    Priorização em tempo real
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sources Tab */}
        <TabsContent value="sources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fontes Priorizadas</CardTitle>
            </CardHeader>
            <CardContent>
              {prioritizedSources.length > 0 ? (
                <div className="space-y-4">
                  {prioritizedSources.slice(0, 10).map((source, index) => (
                    <div key={source.source_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">#{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{source.source_type.toUpperCase()}</h4>
                          <p className="text-sm text-muted-foreground">
                            Score: {source.priority_score.toFixed(2)} | Confiança: {source.confidence.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={source.priority_score > 80 ? "default" : source.priority_score > 60 ? "secondary" : "outline"}
                        >
                          {source.priority_score > 80 ? 'Alta' : source.priority_score > 60 ? 'Média' : 'Baixa'}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {source.reasoning.slice(0, 2).join(' • ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma fonte priorizada ainda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Model Tab */}
        <TabsContent value="model" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento do Modelo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Retreinar Modelo</h4>
                  <p className="text-sm text-muted-foreground">
                    Atualizar o modelo com novos dados de feedback
                  </p>
                </div>
                <Button onClick={() => retrainModel()} disabled={loading}>
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  Retreinar
                </Button>
              </div>

              {model && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Informações do Modelo</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nome:</span>
                      <span className="ml-2 font-medium">{model.model_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Versão:</span>
                      <span className="ml-2 font-medium">{model.version}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Treinado em:</span>
                      <span className="ml-2 font-medium">
                        {new Date(model.last_trained).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Dados:</span>
                      <span className="ml-2 font-medium">{model.training_samples} amostras</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MLPrioritizationDashboard;
