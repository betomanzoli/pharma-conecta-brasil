
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Workflow, 
  Users, 
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAIHandoffs } from '@/hooks/useAIHandoffs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SynergyDashboard = () => {
  const [handoffStats, setHandoffStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0
  });
  const [recentOutputs, setRecentOutputs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { runNext, runAll } = useAIHandoffs();
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load handoff jobs stats
      const { data: handoffs } = await supabase
        .from('ai_handoff_jobs')
        .select('status')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      const stats = {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0
      };

      handoffs?.forEach(job => {
        stats[job.status as keyof typeof stats]++;
      });

      setHandoffStats(stats);

      // Load recent agent outputs
      const { data: outputs } = await supabase
        .from('ai_agent_outputs')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentOutputs(outputs || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeHandoff = async (type: 'next' | 'all') => {
    try {
      if (type === 'next') {
        await runNext();
      } else {
        await runAll(10);
      }
      await loadDashboardData(); // Refresh data
    } catch (error) {
      toast({
        title: 'Erro na execução',
        description: 'Falha ao executar handoffs',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const totalJobs = Object.values(handoffStats).reduce((sum, count) => sum + count, 0);
  const completionRate = totalJobs > 0 ? (handoffStats.completed / totalJobs) * 100 : 0;

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                <Workflow className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Dashboard de Sinergia</h1>
                <p className="text-muted-foreground">
                  Orquestração e monitoramento dos agentes de IA
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">{handoffStats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Processando</p>
                    <p className="text-2xl font-bold text-blue-600">{handoffStats.processing}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Concluídos</p>
                    <p className="text-2xl font-bold text-green-600">{handoffStats.completed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa Sucesso</p>
                    <p className="text-2xl font-bold text-purple-600">{Math.round(completionRate)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Controles de Orquestração</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Button 
                  onClick={() => executeHandoff('next')}
                  disabled={handoffStats.pending === 0}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Executar Próximo
                </Button>
                <Button 
                  onClick={() => executeHandoff('all')}
                  disabled={handoffStats.pending === 0}
                  variant="outline"
                >
                  <Workflow className="h-4 w-4 mr-2" />
                  Executar Todos (máx 10)
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso Geral</span>
                  <span>{Math.round(completionRate)}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Agent Outputs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>Outputs Recentes dos Agentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOutputs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum output de agente encontrado</p>
                  <p className="text-sm">Execute algum agente para ver os resultados aqui</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOutputs.map((output: any) => (
                    <div key={output.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{output.agent_type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(output.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <Badge 
                          className={
                            output.status === 'completed' ? 'bg-green-100 text-green-800' :
                            output.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {output.status}
                        </Badge>
                      </div>
                      <p className="text-sm line-clamp-2">
                        {output.output_md?.substring(0, 200)}...
                      </p>
                      {output.handoff_to && output.handoff_to.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground">Handoffs para: </span>
                          {output.handoff_to.map((agent: string) => (
                            <Badge key={agent} variant="secondary" className="text-xs mr-1">
                              {agent}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Alert className="mt-6">
            <Workflow className="h-4 w-4" />
            <AlertDescription>
              <strong>Dashboard de Sinergia:</strong> Este painel mostra o status da orquestração 
              entre os agentes de IA. Use os controles para executar handoffs pendentes e 
              monitorar o progresso dos workflows integrados.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SynergyDashboard;
