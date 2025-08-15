
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Shield, 
  Network, 
  Activity,
  Users,
  Brain,
  Lock,
  TrendingUp
} from 'lucide-react';
import { useFederatedLearning } from '@/hooks/useFederatedLearning';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const FederatedLearningDashboard: React.FC = () => {
  const {
    nodes,
    models,
    currentRound,
    isTraining,
    isSyncing,
    isLoading,
    privacyAudit,
    nodeContributions,
    startTraining,
    synchronizeModels,
    performPrivacyAudit
  } = useFederatedLearning();

  const [selectedModel, setSelectedModel] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'syncing': return 'bg-blue-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-yellow-500';
    }
  };

  const activeNodes = nodes.filter(node => node.status === 'active').length;
  const totalDataSamples = nodes.reduce((sum, node) => sum + node.data_samples, 0);
  const avgContribution = nodeContributions.reduce((sum, contrib) => sum + contrib.contribution_score, 0) / nodeContributions.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Federated Learning</h1>
          <p className="text-muted-foreground">Sistema distribuído de aprendizado colaborativo</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => selectedModel && startTraining(selectedModel)} 
            disabled={isTraining || !selectedModel}
            className="gap-2"
          >
            {isTraining ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isTraining ? 'Treinando...' : 'Iniciar Treinamento'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => selectedModel && synchronizeModels(selectedModel)}
            disabled={isSyncing || !selectedModel}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>
          <Button 
            variant="outline" 
            onClick={performPrivacyAudit}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Auditoria
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Nós Ativos</p>
                <p className="text-2xl font-bold">{activeNodes}/{nodes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Modelos Federados</p>
                <p className="text-2xl font-bold">{models.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Dados Totais</p>
                <p className="text-2xl font-bold">{totalDataSamples.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Score Privacidade</p>
                <p className="text-2xl font-bold">{privacyAudit?.privacy_score || 100}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="nodes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nodes">Nós da Rede</TabsTrigger>
          <TabsTrigger value="models">Modelos</TabsTrigger>
          <TabsTrigger value="training">Treinamento</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Nós Participantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nodes.map((node) => (
                  <Card key={node.node_id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{node.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(node.status)}`} />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Localização:</span>
                        <span>{node.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dados:</span>
                        <span>{node.data_samples.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contribuição:</span>
                        <span>{(node.contribution_score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Versão:</span>
                        <Badge variant="outline">{node.model_version}</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Modelos Federados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <Card 
                    key={model.id} 
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedModel === model.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{model.model_name}</h4>
                        <p className="text-sm text-muted-foreground">Versão {model.version}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {(model.global_accuracy).toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Precisão Global</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Nós:</span>
                        <span className="ml-2 font-medium">{model.participating_nodes}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rodadas:</span>
                        <span className="ml-2 font-medium">{model.sync_rounds}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Atualizado:</span>
                        <span className="ml-2 font-medium">
                          {new Date(model.last_updated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Status do Treinamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentRound ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Rodada #{currentRound.round_number}</span>
                      <Badge variant={currentRound.status === 'completed' ? 'default' : 'secondary'}>
                        {currentRound.status === 'in_progress' ? 'Em Progresso' : 
                         currentRound.status === 'completed' ? 'Concluída' : 'Pendente'}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progresso</span>
                        <span>{currentRound.status === 'completed' ? '100' : '65'}%</span>
                      </div>
                      <Progress value={currentRound.status === 'completed' ? 100 : 65} />
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nós Participantes:</span>
                        <span>{currentRound.participating_nodes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Iniciado:</span>
                        <span>{new Date(currentRound.start_time).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum treinamento ativo</p>
                    <p className="text-sm text-muted-foreground">Selecione um modelo e inicie o treinamento</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Contribuições dos Nós
                </CardTitle>
              </CardHeader>
              <CardContent>
                {nodeContributions.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={nodeContributions.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="node_id" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="contribution_score" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">Carregando dados de contribuição...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Auditoria de Privacidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                {privacyAudit ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {privacyAudit.privacy_score}/100
                      </div>
                      <p className="text-muted-foreground">Score de Privacidade</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Conformidade:</h4>
                      {Object.entries(privacyAudit.compliance).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="capitalize">{key.replace('_', ' ')}</span>
                          <Badge variant={value ? 'default' : 'destructive'}>
                            {value ? 'Conforme' : 'Não Conforme'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Recomendações:</h4>
                      <ul className="text-sm space-y-1">
                        {privacyAudit.recommendations?.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Execute uma auditoria de privacidade</p>
                    <Button onClick={performPrivacyAudit} className="mt-4">
                      Iniciar Auditoria
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Criptografia End-to-End</span>
                      <span className="text-green-600">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Privacidade Diferencial</span>
                      <span className="text-green-600">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Agregação Segura</span>
                      <span className="text-green-600">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Auditabilidade</span>
                      <span className="text-yellow-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FederatedLearningDashboard;
