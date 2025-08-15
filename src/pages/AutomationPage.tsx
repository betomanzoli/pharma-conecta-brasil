
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Bot,
  Workflow,
  BarChart3
} from 'lucide-react';

const AutomationPage = () => {
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: 'Auto-geração de Business Cases',
      description: 'Gera automaticamente business cases baseados em templates predefinidos',
      status: 'active',
      lastRun: '2024-01-15 10:30',
      success_rate: 95,
      enabled: true
    },
    {
      id: 2,
      name: 'Monitoramento ANVISA',
      description: 'Monitora atualizações regulatórias e notifica sobre mudanças relevantes',
      status: 'active',
      lastRun: '2024-01-15 09:15',
      success_rate: 87,
      enabled: true
    },
    {
      id: 3,
      name: 'Sincronização de Documentos',
      description: 'Sincroniza documentos entre diferentes sistemas automaticamente',
      status: 'paused',
      lastRun: '2024-01-14 16:45',
      success_rate: 92,
      enabled: false
    },
    {
      id: 4,
      name: 'Relatórios Periódicos',
      description: 'Gera relatórios de performance e métricas semanalmente',
      status: 'active',
      lastRun: '2024-01-15 08:00',
      success_rate: 98,
      enabled: true
    }
  ]);

  const [insights] = useState([
    {
      title: 'Eficiência Aumentada',
      description: 'Automações reduziram tempo de processamento em 45%',
      trend: 'up',
      value: '45%'
    },
    {
      title: 'Redução de Erros',
      description: 'Diminuição de 67% em erros manuais de documentação',
      trend: 'up',
      value: '67%'
    },
    {
      title: 'Economia de Tempo',
      description: 'Liberação de 32 horas/semana para atividades estratégicas',
      trend: 'up',
      value: '32h'
    }
  ]);

  const toggleAutomation = (id: number) => {
    setAutomations(prev =>
      prev.map(auto =>
        auto.id === id
          ? { ...auto, enabled: !auto.enabled, status: !auto.enabled ? 'active' : 'paused' }
          : auto
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'paused': return 'Pausado';
      case 'error': return 'Erro';
      default: return 'Desconhecido';
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <Zap className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Automações</h1>
                <p className="text-muted-foreground">
                  Gerencie e monitore processos automatizados
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Automações Ativas</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {automations.filter(a => a.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">de {automations.length} total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">93%</div>
                <p className="text-xs text-muted-foreground">média geral</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Processos Hoje</CardTitle>
                <Workflow className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">execuções</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Poupado</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.2h</div>
                <p className="text-xs text-muted-foreground">hoje</p>
              </CardContent>
            </Card>
          </div>

          {/* Insights Preditivos */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Insights Preditivos</span>
              </CardTitle>
              <CardDescription>
                Análise do impacto das automações nos processos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insights.map((insight, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {insight.value}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Automations List */}
          <Card>
            <CardHeader>
              <CardTitle>Automações Configuradas</CardTitle>
              <CardDescription>
                Gerencie suas automações e monitore o desempenho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {automations.map((automation) => (
                  <div key={automation.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{automation.name}</h3>
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(automation.status)}`}></div>
                            <span>{getStatusText(automation.status)}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {automation.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Última execução: {automation.lastRun}</span>
                          <span>Taxa de sucesso: {automation.success_rate}%</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={automation.enabled}
                          onCheckedChange={() => toggleAutomation(automation.id)}
                        />
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Performance</span>
                        <span>{automation.success_rate}%</span>
                      </div>
                      <Progress value={automation.success_rate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AutomationPage;
