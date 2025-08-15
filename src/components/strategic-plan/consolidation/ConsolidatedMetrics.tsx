
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  Target,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

const ConsolidatedMetrics = () => {
  const globalMetrics = [
    {
      category: 'Eficiência Operacional',
      metrics: [
        { label: 'Taxa de Sucesso Geral', value: '98.7%', change: '+2.3%', trend: 'up' },
        { label: 'Tempo de Resposta Médio', value: '1.2s', change: '-0.8s', trend: 'up' },
        { label: 'Disponibilidade Sistema', value: '99.9%', change: '+0.2%', trend: 'up' },
        { label: 'Throughput de Operações', value: '12.5k/h', change: '+3.2k', trend: 'up' }
      ],
      icon: Zap,
      color: 'bg-blue-500'
    },
    {
      category: 'Engajamento de Usuários',
      metrics: [
        { label: 'Usuários Ativos Diários', value: '8.7k', change: '+1.2k', trend: 'up' },
        { label: 'Sessões por Usuário', value: '4.3', change: '+0.8', trend: 'up' },
        { label: 'Taxa de Retenção', value: '87%', change: '+12%', trend: 'up' },
        { label: 'Satisfação NPS', value: '72', change: '+18', trend: 'up' }
      ],
      icon: Users,
      color: 'bg-green-500'
    },
    {
      category: 'Inteligência Artificial',
      metrics: [
        { label: 'Precisão do Matching', value: '97.8%', change: '+5.2%', trend: 'up' },
        { label: 'Predições Corretas', value: '94.7%', change: '+3.1%', trend: 'up' },
        { label: 'Automações Executadas', value: '45.2k', change: '+12.8k', trend: 'up' },
        { label: 'Eficiência IA', value: '91%', change: '+7%', trend: 'up' }
      ],
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      category: 'Segurança & Compliance',
      metrics: [
        { label: 'Score de Segurança', value: '99.2%', change: '+1.8%', trend: 'up' },
        { label: 'Conformidade ANVISA', value: '100%', change: '+2%', trend: 'up' },
        { label: 'Auditorias Aprovadas', value: '32/32', change: '+4', trend: 'up' },
        { label: 'Incidentes Resolvidos', value: '100%', change: '0%', trend: 'stable' }
      ],
      icon: Shield,
      color: 'bg-orange-500'
    }
  ];

  const phaseHealthStatus = [
    { phase: 'Fase 1: AI Matching', health: 98, status: 'excellent' },
    { phase: 'Fase 2: Collaborative Governance', health: 96, status: 'excellent' },
    { phase: 'Fase 3: Advanced Shared Value', health: 94, status: 'excellent' },
    { phase: 'Fase 4: Compliance Tracker', health: 99, status: 'excellent' },
    { phase: 'Fase 5: Predictive Analysis', health: 97, status: 'excellent' },
    { phase: 'Fase 6: Automation Ecosystem', health: 95, status: 'excellent' },
    { phase: 'Fase 7: Generative AI', health: 93, status: 'excellent' }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />;
    return <BarChart3 className="h-3 w-3 text-blue-500" />;
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-500';
    if (health >= 85) return 'text-blue-500';
    if (health >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Métricas por Categoria */}
      {globalMetrics.map((category) => {
        const IconComponent = category.icon;
        return (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${category.color} text-white`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.metrics.map((metric, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-sm ${metric.trend === 'up' ? 'text-green-500' : 'text-blue-500'}`}>
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Saúde das Fases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Saúde Individual das Fases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phaseHealthStatus.map((phase, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Fase {index + 1}
                  </Badge>
                  <span className="font-medium">{phase.phase}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <Progress value={phase.health} className="h-2" />
                  </div>
                  <div className={`text-lg font-bold ${getHealthColor(phase.health)}`}>
                    {phase.health}%
                  </div>
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Excelente
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo Executivo */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle>Resumo Executivo da Consolidação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">96.4%</div>
              <div className="text-sm text-muted-foreground">Saúde Média do Sistema</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">7/7</div>
              <div className="text-sm text-muted-foreground">Fases Operacionais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">450%</div>
              <div className="text-sm text-muted-foreground">ROI Consolidado</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsolidatedMetrics;
