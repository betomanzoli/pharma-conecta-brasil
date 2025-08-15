
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Target, 
  BarChart3,
  Activity,
  Gauge
} from 'lucide-react';

const PerformanceAnalytics = () => {
  const performanceMetrics = [
    {
      category: 'Tempo de Resposta',
      current: '1.2s',
      target: '<2s',
      improvement: '+35%',
      status: 'excellent',
      details: [
        { metric: 'Frontend Load', value: '0.8s', target: '<1s' },
        { metric: 'API Response', value: '0.3s', target: '<0.5s' },
        { metric: 'Database Query', value: '0.1s', target: '<0.2s' }
      ]
    },
    {
      category: 'Throughput',
      current: '12.5k req/h',
      target: '>10k req/h',
      improvement: '+68%',
      status: 'excellent',
      details: [
        { metric: 'Concurrent Users', value: '2.3k', target: '>2k' },
        { metric: 'Transactions/sec', value: '145', target: '>100' },
        { metric: 'Data Processing', value: '8.7GB/h', target: '>5GB/h' }
      ]
    },
    {
      category: 'Eficiência de Recursos',
      current: '78%',
      target: '>70%',
      improvement: '+23%',
      status: 'good',
      details: [
        { metric: 'CPU Utilization', value: '34%', target: '<80%' },
        { metric: 'Memory Usage', value: '52%', target: '<70%' },
        { metric: 'Cache Hit Rate', value: '94%', target: '>90%' }
      ]
    }
  ];

  const phasePerformance = [
    { phase: 'AI Matching', responseTime: '0.9s', throughput: '3.2k/h', efficiency: 97 },
    { phase: 'Collaborative Governance', responseTime: '1.1s', throughput: '1.8k/h', efficiency: 94 },
    { phase: 'Advanced Shared Value', responseTime: '1.3s', throughput: '2.1k/h', efficiency: 92 },
    { phase: 'Compliance Tracker', responseTime: '0.7s', throughput: '2.8k/h', efficiency: 98 },
    { phase: 'Predictive Analysis', responseTime: '2.1s', throughput: '1.2k/h', efficiency: 89 },
    { phase: 'Automation Ecosystem', responseTime: '0.8s', throughput: '4.1k/h', efficiency: 96 },
    { phase: 'Generative AI', responseTime: '1.8s', throughput: '0.9k/h', efficiency: 91 }
  ];

  const optimizations = [
    {
      area: 'Code Splitting',
      impact: 'Alto',
      status: 'implemented',
      improvement: '+40% carregamento'
    },
    {
      area: 'Lazy Loading',
      impact: 'Médio',
      status: 'implemented',
      improvement: '+25% performance inicial'
    },
    {
      area: 'Database Indexing',
      impact: 'Alto',
      status: 'implemented',
      improvement: '+60% query speed'
    },
    {
      area: 'CDN Implementation',
      impact: 'Alto',
      status: 'implemented',
      improvement: '+45% assets loading'
    },
    {
      area: 'Memory Optimization',
      impact: 'Médio',
      status: 'in-progress',
      improvement: '+30% efficiency'
    },
    {
      area: 'Cache Strategy',
      impact: 'Alto',
      status: 'implemented',
      improvement: '+55% response time'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-500';
    if (efficiency >= 85) return 'text-blue-500';
    if (efficiency >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getOptimizationBadge = (status: string) => {
    switch (status) {
      case 'implemented': 
        return <Badge className="bg-green-500">Implementado</Badge>;
      case 'in-progress': 
        return <Badge className="bg-blue-500">Em Progresso</Badge>;
      case 'planned': 
        return <Badge className="bg-yellow-500">Planejado</Badge>;
      default: 
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                {metric.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{metric.current}</div>
                    <div className="text-sm text-muted-foreground">Meta: {metric.target}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getStatusColor(metric.status)}`}>
                      {metric.improvement}
                    </div>
                    <div className="text-sm text-muted-foreground">melhoria</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {metric.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span>{detail.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{detail.value}</span>
                        <span className="text-muted-foreground">({detail.target})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance por Fase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Individual das Fases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phasePerformance.map((phase, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Fase {index + 1}
                  </Badge>
                  <span className="font-medium">{phase.phase}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm font-semibold">{phase.responseTime}</div>
                    <div className="text-xs text-muted-foreground">Resposta</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold">{phase.throughput}</div>
                    <div className="text-xs text-muted-foreground">Throughput</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16">
                      <Progress value={phase.efficiency} className="h-2" />
                    </div>
                    <div className={`text-sm font-bold ${getEfficiencyColor(phase.efficiency)}`}>
                      {phase.efficiency}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Otimizações Implementadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Otimizações de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optimizations.map((opt, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium">{opt.area}</div>
                  <div className="text-sm text-muted-foreground">
                    Impacto {opt.impact} • {opt.improvement}
                  </div>
                </div>
                {getOptimizationBadge(opt.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Performance */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resumo de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">93.8%</div>
              <div className="text-sm text-muted-foreground">Performance Geral</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">+42%</div>
              <div className="text-sm text-muted-foreground">Melhoria Média</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">6/6</div>
              <div className="text-sm text-muted-foreground">Otimizações Aplicadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">1.2s</div>
              <div className="text-sm text-muted-foreground">Tempo Resposta Médio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceAnalytics;
