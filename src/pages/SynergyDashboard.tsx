
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Activity, 
  TrendingUp, 
  Users, 
  FileText, 
  Workflow,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAIHandoffs } from '@/hooks/useAIHandoffs';
import { supabase } from '@/integrations/supabase/client';

interface AIModuleStatus {
  name: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  lastActivity: string;
  totalOutputs: number;
  avgProcessingTime: number;
  icon: React.ElementType;
}

const SynergyDashboard = () => {
  const [modules, setModules] = useState<AIModuleStatus[]>([
    {
      name: 'Estrategista IA',
      status: 'active',
      lastActivity: '2 min atrás',
      totalOutputs: 15,
      avgProcessingTime: 45,
      icon: TrendingUp
    },
    {
      name: 'Técnico-Regulatório IA',
      status: 'processing',
      lastActivity: '5 min atrás',
      totalOutputs: 8,
      avgProcessingTime: 120,
      icon: FileText
    },
    {
      name: 'Gerente de Projetos IA',
      status: 'idle',
      lastActivity: '1 hora atrás',
      totalOutputs: 12,
      avgProcessingTime: 60,
      icon: Users
    },
    {
      name: 'Assistente de Documentação',
      status: 'active',
      lastActivity: '10 min atrás',
      totalOutputs: 25,
      avgProcessingTime: 30,
      icon: FileText
    }
  ]);

  const [handoffStats, setHandoffStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0
  });

  const { runNext, runAll } = useAIHandoffs();

  useEffect(() => {
    fetchHandoffStats();
  }, []);

  const fetchHandoffStats = async () => {
    try {
      const { data } = await supabase
        .from('ai_handoff_jobs')
        .select('status');
      
      if (data) {
        const stats = data.reduce((acc, job) => {
          acc[job.status as keyof typeof acc] = (acc[job.status as keyof typeof acc] || 0) + 1;
          return acc;
        }, { pending: 0, processing: 0, completed: 0, failed: 0 });
        
        setHandoffStats(stats);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'idle': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'processing': return 'Processando';
      case 'idle': return 'Inativo';
      case 'error': return 'Erro';
      default: return status;
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                <Activity className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Dashboard de Sinergia</h1>
                <p className="text-muted-foreground">
                  Monitoramento integrado dos módulos de IA
                </p>
              </div>
            </div>
          </div>

          {/* KPIs Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Módulos Ativos</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {modules.filter(m => m.status === 'active').length}/{modules.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Módulos em operação
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Handoffs Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{handoffStats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando processamento
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outputs Totais</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {modules.reduce((acc, m) => acc + m.totalOutputs, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Resultados gerados hoje
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(modules.reduce((acc, m) => acc + m.avgProcessingTime, 0) / modules.length)}s
                </div>
                <p className="text-xs text-muted-foreground">
                  Processamento médio
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status dos Módulos */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Status dos Módulos IA</CardTitle>
              <CardDescription>
                Monitoramento em tempo real de cada módulo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Icon className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">{module.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Última atividade: {module.lastActivity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{module.totalOutputs} outputs</p>
                          <p className="text-xs text-muted-foreground">{module.avgProcessingTime}s médio</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(module.status)} text-white`}
                        >
                          {getStatusText(module.status)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Handoffs */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Orquestração de Handoffs</CardTitle>
              <CardDescription>
                Controle de tarefas entre módulos de IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Status dos Jobs</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Concluídos</span>
                      </span>
                      <span className="font-medium">{handoffStats.completed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>Pendentes</span>
                      </span>
                      <span className="font-medium">{handoffStats.pending}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-yellow-500" />
                        <span>Processando</span>
                      </span>
                      <span className="font-medium">{handoffStats.processing}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Falharam</span>
                      </span>
                      <span className="font-medium">{handoffStats.failed}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Controles</h4>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => runNext()} 
                      variant="outline" 
                      className="w-full"
                    >
                      <Workflow className="h-4 w-4 mr-2" />
                      Executar Próximo Job
                    </Button>
                    <Button 
                      onClick={() => runAll(10)} 
                      className="w-full"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Executar Até 10 Jobs
                    </Button>
                    <Button 
                      onClick={fetchHandoffStats} 
                      variant="outline" 
                      className="w-full"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Atualizar Status
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              <strong>Dashboard de Sinergia:</strong> Este painel monitora a integração 
              entre os módulos de IA, permitindo visualizar KPIs, status de processamento 
              e controlar a execução de handoffs entre agentes.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SynergyDashboard;
