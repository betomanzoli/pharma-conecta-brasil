
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  BarChart3,
  Database
} from 'lucide-react';
import { useDataMonitoring } from '@/hooks/useDataMonitoring';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';

interface DataHealthMetric {
  id: string;
  source: string;
  metric_name: string;
  current_value: number;
  threshold_min: number;
  threshold_max: number;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  last_updated: string;
}

interface DataQualityScore {
  source: string;
  overall_score: number;
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  issues: string[];
}

interface DataTrend {
  timestamp: string;
  value: number;
  source: string;
  metric: string;
  anomalies?: boolean;
}

interface MonitoringAlert {
  id: string;
  type: 'data_quality' | 'performance' | 'availability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  message: string;
  details: Record<string, any>;
  triggered_at: string;
  resolved_at?: string;
  auto_resolved: boolean;
}

const DataHealthDashboard: React.FC = () => {
  const {
    healthMetrics,
    qualityScores,
    trends,
    activeAlerts,
    isLoading,
    error,
    refreshData,
    analyzeTrends,
    assessQuality,
    startMonitoring,
    stopMonitoring
  } = useDataMonitoring();

  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    startMonitoring(60000); // Monitor every minute
    return () => stopMonitoring();
  }, [startMonitoring, stopMonitoring]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'critical': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Erro ao carregar dados de monitoramento: {error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Saúde dos Dados</h1>
          <p className="text-muted-foreground">
            Monitoramento em tempo real da qualidade e performance dos dados
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fontes Saudáveis</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {healthMetrics.filter(m => m.status === 'healthy').length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {healthMetrics.length} fontes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {activeAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeAlerts.filter(a => a.severity === 'critical').length} críticos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualidade Média</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {qualityScores.length > 0 
                ? Math.round(qualityScores.reduce((acc, q) => acc + q.overall_score, 0) / qualityScores.length * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              baseado em {qualityScores.length} fontes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <p className="text-xs text-muted-foreground">
              últimas 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Métricas de Saúde</TabsTrigger>
          <TabsTrigger value="quality">Qualidade dos Dados</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Saúde por Fonte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        <span className="font-medium">{metric.source}</span>
                      </div>
                      <Badge variant="secondary" className={getStatusColor(metric.status)}>
                        {metric.metric_name}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {getTrendIcon(metric.trend)}
                      <div className="text-right">
                        <div className="font-medium">{metric.current_value}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(metric.last_updated).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualityScores.map((score, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    {score.source}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Score Geral</span>
                      <span className="font-medium">{Math.round(score.overall_score * 100)}%</span>
                    </div>
                    <Progress value={score.overall_score * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Completude</span>
                      <div className="font-medium">{Math.round(score.completeness * 100)}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Precisão</span>
                      <div className="font-medium">{Math.round(score.accuracy * 100)}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Consistência</span>
                      <div className="font-medium">{Math.round(score.consistency * 100)}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Atualidade</span>
                      <div className="font-medium">{Math.round(score.timeliness * 100)}%</div>
                    </div>
                  </div>

                  {score.issues && score.issues.length > 0 && (
                    <div className="pt-2 border-t">
                      <span className="text-sm font-medium text-red-600">Problemas Detectados:</span>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        {score.issues.map((issue, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-yellow-600" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {trends.some(t => t.anomalies) && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Anomalias Detectadas</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    {trends.filter(t => t.anomalies).length} pontos de dados anômalos identificados
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Ativos</CardTitle>
              <p className="text-sm text-muted-foreground">
                {activeAlerts.length} alertas ativos
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    <AlertTriangle 
                      className={`w-5 h-5 mt-0.5 ${
                        alert.severity === 'critical' ? 'text-red-600' : 
                        alert.severity === 'high' ? 'text-orange-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} 
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{alert.message}</span>
                        <Badge 
                          variant="secondary" 
                          className={getSeverityColor(alert.severity)}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Fonte: {alert.source}</span>
                        <span>Tipo: {alert.type}</span>
                        <span>
                          {new Date(alert.triggered_at).toLocaleString()}
                        </span>
                      </div>

                      {alert.details && Object.keys(alert.details).length > 0 && (
                        <div className="text-sm">
                          <details className="mt-2">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              Ver detalhes
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(alert.details, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {activeAlerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
                    <p>Nenhum alerta ativo no momento</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataHealthDashboard;
