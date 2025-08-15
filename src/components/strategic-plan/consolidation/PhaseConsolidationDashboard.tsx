
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Database,
  Settings,
  FileText
} from 'lucide-react';
import ConsolidatedMetrics from './ConsolidatedMetrics';
import SystemHealthMonitor from './SystemHealthMonitor';
import PerformanceAnalytics from './PerformanceAnalytics';
import IntegrationStatus from './IntegrationStatus';

const PhaseConsolidationDashboard = () => {
  const [consolidationProgress, setConsolidationProgress] = useState(0);
  const [systemHealth, setSystemHealth] = useState<'excellent' | 'good' | 'warning' | 'critical'>('excellent');

  useEffect(() => {
    // Simular cálculo de progresso de consolidação
    const calculateProgress = () => {
      const phases = [
        { name: 'AI Matching', health: 98, integration: 100 },
        { name: 'Collaborative Governance', health: 96, integration: 100 },
        { name: 'Advanced Shared Value', health: 94, integration: 100 },
        { name: 'Compliance Tracker', health: 99, integration: 100 },
        { name: 'Predictive Analysis', health: 97, integration: 100 },
        { name: 'Automation Ecosystem', health: 95, integration: 100 },
        { name: 'Generative AI', health: 93, integration: 100 }
      ];

      const avgHealth = phases.reduce((acc, phase) => acc + phase.health, 0) / phases.length;
      setConsolidationProgress(Math.round(avgHealth));
      
      if (avgHealth >= 95) setSystemHealth('excellent');
      else if (avgHealth >= 85) setSystemHealth('good');
      else if (avgHealth >= 70) setSystemHealth('warning');
      else setSystemHealth('critical');
    };

    calculateProgress();
  }, []);

  const consolidationAreas = [
    {
      id: 'performance',
      name: 'Performance & Otimização',
      status: 'in-progress',
      progress: 78,
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      id: 'integration',
      name: 'Integração Backend',
      status: 'completed',
      progress: 100,
      icon: Database,
      color: 'bg-green-500'
    },
    {
      id: 'security',
      name: 'Segurança & Compliance',
      status: 'in-progress',
      progress: 85,
      icon: Shield,
      color: 'bg-purple-500'
    },
    {
      id: 'monitoring',
      name: 'Monitoramento',
      status: 'completed',
      progress: 100,
      icon: Activity,
      color: 'bg-orange-500'
    },
    {
      id: 'documentation',
      name: 'Documentação',
      status: 'pending',
      progress: 45,
      icon: FileText,
      color: 'bg-indigo-500'
    },
    {
      id: 'testing',
      name: 'Testes & Validação',
      status: 'in-progress',
      progress: 67,
      icon: Settings,
      color: 'bg-cyan-500'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in-progress': return 'text-blue-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Concluído</Badge>;
      case 'in-progress': return <Badge className="bg-blue-500"><Activity className="h-3 w-3 mr-1" />Em Progresso</Badge>;
      case 'pending': return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" />Pendente</Badge>;
      default: return <Badge variant="outline">Aguardando</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header de Consolidação */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Consolidação das Fases 1-7
            </h1>
            <p className="text-muted-foreground">Fortalecimento e otimização do sistema base</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Badge variant="default" className={`${systemHealth === 'excellent' ? 'bg-green-500' : 'bg-blue-500'}`}>
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Sistema {systemHealth === 'excellent' ? 'Excelente' : 'Operacional'}
          </Badge>
          <Badge variant="outline">
            <Activity className="h-3 w-3 mr-1" />
            {consolidationProgress}% Consolidado
          </Badge>
        </div>
      </div>

      {/* Progresso Geral */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progresso da Consolidação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Consolidação Geral das 7 Fases</span>
              <span className="text-lg font-bold text-blue-500">{consolidationProgress}%</span>
            </div>
            <Progress value={consolidationProgress} className="h-4" />
            <div className="text-sm text-muted-foreground">
              Sistema operando com alta eficiência. Todas as fases base implementadas e funcionais.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Áreas de Consolidação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consolidationAreas.map((area) => {
          const IconComponent = area.icon;
          return (
            <Card key={area.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${area.color} text-white`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm">{area.name}</CardTitle>
                  </div>
                  {getStatusBadge(area.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span className={`font-bold ${getStatusColor(area.status)}`}>
                      {area.progress}%
                    </span>
                  </div>
                  <Progress value={area.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dashboard Detalhado */}
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="health">Saúde do Sistema</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="integration">Integração</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <ConsolidatedMetrics />
        </TabsContent>

        <TabsContent value="health">
          <SystemHealthMonitor />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceAnalytics />
        </TabsContent>

        <TabsContent value="integration">
          <IntegrationStatus />
        </TabsContent>
      </Tabs>

      {/* Ações de Consolidação */}
      <Card>
        <CardHeader>
          <CardTitle>Ações de Consolidação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Executar Testes
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Otimizar Database
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Auditoria Segurança
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhaseConsolidationDashboard;
