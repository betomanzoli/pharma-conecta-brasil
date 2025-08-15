
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import AutomationControls from './AutomationControls';
import PredictiveInsights from '../analytics/PredictiveInsights';
import { 
  Bot, 
  Zap, 
  Users, 
  FileSearch, 
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { isDemoMode, demoData } from '@/utils/demoMode';
import { useToast } from '@/hooks/use-toast';

const AutomationDashboard = () => {
  const [automations, setAutomations] = useState<any[]>([]);
  const { toast } = useToast();
  const isDemo = isDemoMode();

  const demoAutomations = [
    {
      id: 'ai-matching',
      name: 'AI Matching Automático',
      description: 'Busca automática de parceiros compatíveis usando IA',
      isActive: true,
      lastRun: '2024-01-10T08:30:00Z',
      successRate: 87,
      matches: 12,
      type: 'matching',
      frequency: 'daily'
    },
    {
      id: 'regulatory-alerts',
      name: 'Alertas Regulatórios',
      description: 'Monitoramento de mudanças regulatórias ANVISA/FDA',
      isActive: true,
      lastRun: '2024-01-10T06:00:00Z',
      successRate: 95,
      alerts: 3,
      type: 'regulatory',
      frequency: 'hourly'
    },
    {
      id: 'market-analysis',
      name: 'Análise de Mercado',
      description: 'Análise preditiva de tendências do setor farmacêutico',
      isActive: false,
      lastRun: '2024-01-09T14:20:00Z',
      successRate: 78,
      insights: 8,
      type: 'analysis',
      frequency: 'weekly'
    },
    {
      id: 'compliance-check',
      name: 'Verificação de Compliance',
      description: 'Auditoria automática de conformidade de parceiros',
      isActive: true,
      lastRun: '2024-01-10T09:15:00Z',
      successRate: 92,
      checks: 45,
      type: 'compliance',
      frequency: 'daily'
    }
  ];

  useEffect(() => {
    if (isDemo) {
      setAutomations(demoAutomations);
    } else {
      setAutomations([]);
    }
  }, [isDemo]);

  const handleToggleAutomation = (id: string, active: boolean) => {
    setAutomations(prev => 
      prev.map(automation => 
        automation.id === id ? { ...automation, isActive: active } : automation
      )
    );
  };

  const handleExecuteAutomation = (id: string) => {
    const automation = automations.find(a => a.id === id);
    if (automation) {
      toast({
        title: "Automação executada",
        description: `${automation.name} foi executada com sucesso.`,
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'matching': return <Users className="h-5 w-5" />;
      case 'regulatory': return <FileSearch className="h-5 w-5" />;
      case 'analysis': return <TrendingUp className="h-5 w-5" />;
      case 'compliance': return <CheckCircle className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  const getStatusColor = (isActive: boolean, successRate: number) => {
    if (!isActive) return 'bg-gray-100 text-gray-800';
    if (successRate >= 90) return 'bg-green-100 text-green-800';
    if (successRate >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!isDemo && automations.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <span>Central de Automações</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Automações em Desenvolvimento
              </h3>
              <p className="text-muted-foreground">
                As automações inteligentes estarão disponíveis em breve para otimizar seus processos.
              </p>
            </div>
          </CardContent>
        </Card>

        <PredictiveInsights />
      </div>
    );
  }

  const activeAutomations = automations.filter(a => a.isActive).length;
  const totalExecutions = automations.reduce((sum, a) => sum + (a.matches || a.alerts || a.insights || a.checks || 0), 0);
  const avgSuccessRate = automations.reduce((sum, a) => sum + a.successRate, 0) / automations.length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">{activeAutomations}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{automations.length}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Execuções</p>
                <p className="text-2xl font-bold">{totalExecutions}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Sucesso</p>
                <p className="text-2xl font-bold">{Math.round(avgSuccessRate)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automations List */}
      <Card>
        <CardHeader>
          <CardTitle>Automações Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map((automation) => (
              <div key={automation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    {getTypeIcon(automation.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold">{automation.name}</h4>
                      <Badge className={getStatusColor(automation.isActive, automation.successRate)}>
                        {automation.isActive ? 'Ativa' : 'Pausada'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {automation.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Taxa de sucesso: {automation.successRate}%</span>
                      <span>Última execução: {new Date(automation.lastRun).toLocaleString('pt-BR')}</span>
                    </div>
                    <Progress value={automation.successRate} className="mt-2 h-1" />
                  </div>
                </div>
                
                <AutomationControls
                  automationId={automation.id}
                  name={automation.name}
                  isActive={automation.isActive}
                  onToggle={handleToggleAutomation}
                  onExecute={handleExecuteAutomation}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <PredictiveInsights />
    </div>
  );
};

export default AutomationDashboard;
