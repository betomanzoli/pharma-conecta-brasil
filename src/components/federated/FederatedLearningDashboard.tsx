
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFederatedLearning } from '@/hooks/useFederatedLearning';
import { 
  Brain, 
  Network, 
  Shield, 
  TrendingUp, 
  Globe, 
  RefreshCw,
  Settings,
  Activity,
  Lock,
  Users,
  BarChart3
} from 'lucide-react';

const FederatedLearningDashboard = () => {
  const {
    nodes,
    models,
    currentRound,
    isTraining,
    isSyncing,
    isLoading,
    error,
    privacyAudit,
    nodeContributions,
    startTraining,
    synchronizeModels,
    refreshData,
    performPrivacyAudit
  } = useFederatedLearning();

  const [activeTab, setActiveTab] = useState('overview');

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'syncing': return 'bg-blue-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const activeNodes = nodes.filter(node => node.status === 'active');
  const globalAccuracy = models.length > 0 ? 
    models.reduce((acc, model) => acc + model.global_accuracy, 0) / models.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Network className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-2xl">Sistema de Aprendizado Federado</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-green-500 text-white">
                  <Activity className="h-3 w-3 mr-1" />
                  {activeNodes.length}/{nodes.length} Nós Ativos
                </Badge>
                {isTraining && (
                  <Badge className="bg-blue-500 text-white">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Treinando
                  </Badge>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {activeNodes.length}
              </div>
              <div className="text-sm text-muted-foreground">Nós Ativos</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {models.length}
              </div>
              <div className="text-sm text-muted-foreground">Modelos Federados</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(globalAccuracy)}%
              </div>
              <div className="text-sm text-muted-foreground">Precisão Global</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {privacyAudit?.privacy_score || 95}
              </div>
              <div className="text-sm text-muted-foreground">Score Privacidade</div>
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
          <TabsTrigger value="nodes" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Nós</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Treinamento</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Privacidade</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status da Rede</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Conectividade</span>
                  <Badge variant="outline" className="text-green-600">
                    Estável
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {nodes.slice(0, 3).map((node) => (
                    <div key={node.node_id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getNodeStatusColor(node.status)}`} />
                        <span className="text-sm">{node.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(node.contribution_score * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modelos Ativos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {models.slice(0, 2).map((model) => (
                  <div key={model.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{model.model_name}</span>
                      <Badge variant="outline">{model.version}</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Precisão</span>
                        <span>{Math.round(model.global_accuracy)}%</span>
                      </div>
                      <Progress value={model.global_accuracy} className="h-1" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Controles de Treinamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => startTraining('model_1', true)} 
                  disabled={isTraining || isLoading}
                  className="w-full"
                >
                  {isTraining ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4 mr-2" />
                  )}
                  Iniciar Treinamento
                </Button>

                <Button 
                  onClick={() => synchronizeModels('model_1')} 
                  disabled={isSyncing || isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Network className="h-4 w-4 mr-2" />
                  )}
                  Sincronizar Modelos
                </Button>

                <Button 
                  onClick={refreshData} 
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar Dados
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Nodes Tab */}
        <TabsContent value="nodes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nós da Rede Federada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nodes.map((node) => (
                  <Card key={node.node_id} className="relative">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm">{node.name}</h4>
                        <div className={`w-3 h-3 rounded-full ${getNodeStatusColor(node.status)}`} />
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Localização:</span>
                          <span>{node.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amostras:</span>
                          <span>{node.data_samples.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contribuição:</span>
                          <span>{Math.round(node.contribution_score * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Versão:</span>
                          <span>{node.model_version}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Progress 
                          value={node.contribution_score * 100} 
                          className="h-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso do Treinamento</CardTitle>
            </CardHeader>
            <CardContent>
              {currentRound ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Rodada #{currentRound.round_number}</span>
                    <Badge 
                      variant={currentRound.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {currentRound.status === 'in_progress' ? 'Em Andamento' : 
                       currentRound.status === 'completed' ? 'Concluída' : 'Pendente'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Nós Participantes:</span>
                      <span>{currentRound.participating_nodes.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Iniciado em:</span>
                      <span>{new Date(currentRound.start_time).toLocaleString()}</span>
                    </div>
                    {currentRound.end_time && (
                      <div className="flex justify-between text-sm">
                        <span>Concluído em:</span>
                        <span>{new Date(currentRound.end_time).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma rodada de treinamento ativa</p>
                </div>
              )}
            </CardContent>
          </Card>

          {nodeContributions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Contribuições dos Nós</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nodeContributions.slice(0, 5).map((contribution) => {
                    const node = nodes.find(n => n.node_id === contribution.node_id);
                    return (
                      <div key={contribution.node_id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{node?.name || contribution.node_id}</h4>
                          <div className="flex space-x-4 text-xs text-muted-foreground">
                            <span>Qualidade: {Math.round(contribution.data_quality * 100)}%</span>
                            <span>Melhoria: {Math.round(contribution.model_improvement * 100)}%</span>
                            <span>Confiabilidade: {Math.round(contribution.reliability * 100)}%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {Math.round(contribution.contribution_score * 100)}
                          </div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Auditoria de Privacidade</span>
                <Button onClick={performPrivacyAudit} variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Executar Auditoria
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {privacyAudit ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {privacyAudit.privacy_score}
                    </div>
                    <div className="text-muted-foreground">Score de Privacidade</div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Conformidade</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(privacyAudit.compliance).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm capitalize">
                            {key.replace('_', ' ')}
                          </span>
                          <Badge variant={value ? "default" : "destructive"}>
                            {value ? 'Conforme' : 'Não Conforme'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {privacyAudit.recommendations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Recomendações</h4>
                      <div className="space-y-2">
                        {privacyAudit.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                            <Lock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Execute uma auditoria para ver os resultados de privacidade</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FederatedLearningDashboard;
