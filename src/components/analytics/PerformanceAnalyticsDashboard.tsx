
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Target,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Download
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { performanceAnalyticsService, ROIMetric, SystemPerformance, BusinessImpact } from '@/services/performanceAnalyticsService';

const PerformanceAnalyticsDashboard: React.FC = () => {
  const [roiMetrics, setRoiMetrics] = useState<ROIMetric[]>([]);
  const [systemPerformance, setSystemPerformance] = useState<SystemPerformance | null>(null);
  const [businessImpact, setBusinessImpact] = useState<BusinessImpact | null>(null);
  const [performanceReport, setPerformanceReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [roi, performance, impact, report] = await Promise.all([
        performanceAnalyticsService.getROIMetrics(),
        performanceAnalyticsService.getSystemPerformance(),
        performanceAnalyticsService.getBusinessImpact(),
        performanceAnalyticsService.generatePerformanceReport()
      ]);

      setRoiMetrics(roi);
      setSystemPerformance(performance);
      setBusinessImpact(impact);
      setPerformanceReport(report);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMetricIcon = (category: string) => {
    switch (category) {
      case 'cost': return DollarSign;
      case 'time': return Clock;
      case 'accuracy': return Target;
      default: return BarChart3;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'critical': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <p className="text-muted-foreground">Análise de ROI e impacto nos negócios</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* ROI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roiMetrics.map((metric) => {
          const IconComponent = getMetricIcon(metric.impact_category);
          return (
            <Card key={metric.metric_name}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{metric.metric_name}</p>
                      <p className="text-2xl font-bold">
                        {metric.impact_category === 'cost' 
                          ? formatCurrency(metric.current_value)
                          : metric.current_value.toFixed(metric.impact_category === 'time' ? 0 : 1)
                        }
                        {metric.impact_category === 'time' && 'ms'}
                        {metric.impact_category === 'accuracy' && '%'}
                        {metric.impact_category === 'efficiency' && '%'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center ${metric.change_percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change_percentage > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-sm font-medium ml-1">
                        {formatPercentage(metric.change_percentage)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance do Sistema</TabsTrigger>
          <TabsTrigger value="business">Impacto nos Negócios</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Time Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tempo de Resposta
                </CardTitle>
              </CardHeader>
              <CardContent>
                {systemPerformance && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{systemPerformance.response_time.avg}ms</p>
                        <p className="text-sm text-muted-foreground">Média</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{systemPerformance.response_time.p95}ms</p>
                        <p className="text-sm text-muted-foreground">P95</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{systemPerformance.response_time.p99}ms</p>
                        <p className="text-sm text-muted-foreground">P99</p>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={systemPerformance.response_time.trend.map((value, index) => ({ time: index, value }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Accuracy by Source */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Precisão por Fonte
                </CardTitle>
              </CardHeader>
              <CardContent>
                {systemPerformance && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{systemPerformance.accuracy.overall}%</p>
                      <p className="text-sm text-muted-foreground">Precisão Geral</p>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(systemPerformance.accuracy.by_source).map(([source, accuracy]) => (
                        <div key={source} className="flex justify-between items-center">
                          <span className="capitalize">{source}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${accuracy}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{accuracy}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Throughput */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Throughput
                </CardTitle>
              </CardHeader>
              <CardContent>
                {systemPerformance && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{systemPerformance.throughput.requests_per_second}</p>
                        <p className="text-sm text-muted-foreground">RPS Média</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{systemPerformance.throughput.peak_rps}</p>
                        <p className="text-sm text-muted-foreground">Pico RPS</p>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={systemPerformance.throughput.trend.map((value, index) => ({ time: index, value }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Eficiência de Custos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {systemPerformance && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{systemPerformance.cost_efficiency.roi_percentage}%</p>
                      <p className="text-sm text-muted-foreground">ROI</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Custo por Consulta:</span>
                        <span className="font-medium">{formatCurrency(systemPerformance.cost_efficiency.cost_per_query)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Redução de Custos:</span>
                        <span className="font-medium text-green-600">
                          {systemPerformance.cost_efficiency.cost_reduction}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time Savings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Economia de Tempo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {businessImpact && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{businessImpact.time_saved.hours_per_week}h</p>
                      <p className="text-sm text-muted-foreground">Horas Economizadas/Semana</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(businessImpact.time_saved.monetary_value)}
                      </p>
                      <p className="text-sm text-muted-foreground">Valor Monetário/Semana</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Accuracy Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Melhoria na Precisão
                </CardTitle>
              </CardHeader>
              <CardContent>
                {businessImpact && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">+{businessImpact.accuracy_improvement.percentage}%</p>
                      <p className="text-sm text-muted-foreground">Melhoria na Precisão</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {businessImpact.accuracy_improvement.decisions_improved}
                      </p>
                      <p className="text-sm text-muted-foreground">Decisões Melhoradas</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Reduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Redução de Custos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {businessImpact && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Economia Operacional:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(businessImpact.cost_reduction.operational_savings)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ganhos de Eficiência:</span>
                        <span className="font-medium">
                          +{businessImpact.cost_reduction.efficiency_gains}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Satisfaction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Satisfação do Usuário
                </CardTitle>
              </CardHeader>
              <CardContent>
                {businessImpact && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-600">{businessImpact.user_satisfaction.rating}/5</p>
                      <p className="text-sm text-muted-foreground">Rating Médio</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa de Adoção:</span>
                        <span className="font-medium">{businessImpact.user_satisfaction.adoption_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa de Retenção:</span>
                        <span className="font-medium">{businessImpact.user_satisfaction.retention_rate}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {performanceReport && (
            <>
              {/* Executive Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Executivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{performanceReport.summary}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {performanceReport.kpis.map((kpi: any, index: number) => {
                      const StatusIcon = getStatusIcon(kpi.status);
                      return (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{kpi.name}</span>
                            <StatusIcon className={`h-4 w-4 ${getStatusColor(kpi.status)}`} />
                          </div>
                          <p className="text-xl font-bold">{kpi.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recomendações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceReport.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trends Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Tendências</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceReport.trends.map((trend: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{trend.metric}</span>
                        <div className="flex items-center gap-2">
                          {trend.direction === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : trend.direction === 'down' ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : (
                            <div className="w-4 h-4 bg-gray-400 rounded-full" />
                          )}
                          <Badge variant={trend.direction === 'up' ? 'default' : trend.direction === 'down' ? 'destructive' : 'secondary'}>
                            {trend.significance}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalyticsDashboard;
