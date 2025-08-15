
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Cog, Workflow, CheckCircle2, Activity, Bot } from 'lucide-react';

const Phase6AutomationEcosystem = () => {
  const automationKPIs = [
    { label: 'Processos Automatizados', value: '287', change: '+187' },
    { label: 'Eficiência Operacional', value: '94.8%', change: '+44.8%' },
    { label: 'Tempo Economizado/Dia', value: '147h', change: '+132h' },
    { label: 'Workflows Ativos', value: '52', change: '+45' }
  ];

  const automationModules = [
    'Automação de processos regulatórios',
    'Workflow builder visual',
    'Integração com sistemas externos',
    'Monitoramento em tempo real',
    'Otimização automática de recursos'
  ];

  const activeWorkflows = [
    { name: 'Processamento ANVISA', status: 'running', efficiency: '96%' },
    { name: 'Análise de Documentos', status: 'running', efficiency: '94%' },
    { name: 'Matching Automático', status: 'running', efficiency: '98%' },
    { name: 'Relatórios Compliance', status: 'running', efficiency: '92%' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-cyan-500 text-white">
            <Zap className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Fase 6: Intelligent Automation Ecosystem</h2>
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              100% Implementado
            </Badge>
          </div>
        </div>
        <Progress value={100} className="w-full max-w-md mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {automationKPIs.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-cyan-500">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.label}</div>
              <div className="text-xs text-green-500">{kpi.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cog className="h-5 w-5" />
              Módulos de Automação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {automationModules.map((module, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{module}</span>
                  <Badge variant="outline" className="ml-auto">
                    <Bot className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Workflows em Execução
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeWorkflows.map((workflow, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">{workflow.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-500">{workflow.efficiency}</span>
                    <Badge variant="outline" className="text-green-500">
                      <Activity className="h-3 w-3 mr-1" />
                      Rodando
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automação em Números</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-500">98.7%</div>
              <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">2.1s</div>
              <div className="text-sm text-muted-foreground">Tempo Médio Execução</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">24/7</div>
              <div className="text-sm text-muted-foreground">Disponibilidade</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase6AutomationEcosystem;
