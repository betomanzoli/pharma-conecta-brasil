import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3,
  Database,
  TrendingUp,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface IntegrationMetrics {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error' | 'syncing';
  lastSync: string;
  dataCount: number;
  syncFrequency: number;
  responseTime: number;
  successRate: number;
  category: string;
}

const IntegrationDashboard = () => {
  const [metrics, setMetrics] = useState<IntegrationMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string[]>([]);
  const [realTimeMode, setRealTimeMode] = useState(false);

  useEffect(() => {
    loadMetrics();
    
    if (realTimeMode) {
      const interval = setInterval(loadMetrics, 30000); // Update every 30s
      return () => clearInterval(interval);
    }
  }, [realTimeMode]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      
      // Simulated data - in real implementation, fetch from Supabase
      const mockMetrics: IntegrationMetrics[] = [
        {
          id: 'anvisa',
          name: 'ANVISA',
          status: 'active',
          lastSync: new Date(Date.now() - 15 * 60000).toISOString(),
          dataCount: 1247,
          syncFrequency: 6,
          responseTime: 1200,
          successRate: 98.5,
          category: 'Regulatory'
        },
        {
          id: 'fda',
          name: 'FDA',
          status: 'active',
          lastSync: new Date(Date.now() - 30 * 60000).toISOString(),
          dataCount: 2156,
          syncFrequency: 12,
          responseTime: 2800,
          successRate: 97.2,
          category: 'Regulatory'
        },
        {
          id: 'finep',
          name: 'FINEP',
          status: 'active',
          lastSync: new Date(Date.now() - 45 * 60000).toISOString(),
          dataCount: 89,
          syncFrequency: 24,
          responseTime: 950,
          successRate: 99.1,
          category: 'Funding'
        },
        {
          id: 'stripe',
          name: 'Stripe',
          status: 'error',
          lastSync: new Date(Date.now() - 120 * 60000).toISOString(),
          dataCount: 0,
          syncFrequency: 1,
          responseTime: 0,
          successRate: 0,
          category: 'Financial'
        }
      ];

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast.error('Erro ao carregar métricas');
    } finally {
      setLoading(false);
    }
  };

  const triggerSync = async (integrationId: string) => {
    setSyncing(prev => [...prev, integrationId]);
    
    try {
      const { data, error } = await supabase.functions.invoke('real-integration-sync', {
        body: { integrationId }
      });

      if (error) throw error;

      toast.success('Sincronização iniciada com sucesso');
      
      // Update metrics after sync
      setTimeout(() => {
        loadMetrics();
        setSyncing(prev => prev.filter(id => id !== integrationId));
      }, 3000);
    } catch (error) {
      console.error('Error syncing:', error);
      toast.error('Erro na sincronização');
      setSyncing(prev => prev.filter(id => id !== integrationId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'syncing': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Wifi className="h-4 w-4 text-green-600" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error': return <WifiOff className="h-4 w-4 text-red-600" />;
      default: return <WifiOff className="h-4 w-4 text-gray-600" />;
    }
  };

  const calculateOverallHealth = () => {
    const activeCount = metrics.filter(m => m.status === 'active').length;
    return metrics.length > 0 ? (activeCount / metrics.length) * 100 : 0;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h atrás`;
    return `${Math.floor(diffMins / 1440)}d atrás`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Real-time Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard de Integrações</h2>
          <p className="text-muted-foreground">
            Monitoramento em tempo real das integrações ativas
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={realTimeMode ? "default" : "outline"}
            onClick={() => setRealTimeMode(!realTimeMode)}
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Tempo Real</span>
          </Button>
          <Button onClick={loadMetrics} variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saúde Geral</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateOverallHealth().toFixed(1)}%</div>
            <Progress value={calculateOverallHealth()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrações Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.filter(m => m.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {metrics.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dados Coletados</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.reduce((acc, m) => acc + m.dataCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              registros hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.reduce((acc, m) => acc + m.successRate, 0) / metrics.length || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              taxa de sucesso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status das Integrações</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Atividade Recente</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <div className="grid gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(syncing.includes(metric.id) ? 'syncing' : metric.status)}
                      <div>
                        <h3 className="font-semibold">{metric.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {metric.category} • Última sync: {formatTime(metric.lastSync)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {metric.dataCount.toLocaleString()} registros
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Sync a cada {metric.syncFrequency}h
                        </div>
                      </div>
                      
                      <Badge 
                        variant={metric.status === 'active' ? 'default' : 
                               metric.status === 'error' ? 'destructive' : 'secondary'}
                      >
                        {metric.status}
                      </Badge>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => triggerSync(metric.id)}
                        disabled={syncing.includes(metric.id)}
                      >
                        {syncing.includes(metric.id) ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          'Sync'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{metric.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
                      <div className="text-2xl font-bold text-green-600">
                        {metric.successRate}%
                      </div>
                      <Progress value={metric.successRate} className="mt-1" />
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Tempo de Resposta</div>
                      <div className="text-2xl font-bold">
                        {metric.responseTime}ms
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.responseTime < 1000 ? 'Excelente' : 
                         metric.responseTime < 3000 ? 'Bom' : 'Lento'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Dados Coletados</div>
                      <div className="text-2xl font-bold">
                        {metric.dataCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        registros
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Atividade em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    time: new Date(Date.now() - 2 * 60000),
                    source: 'ANVISA',
                    action: 'Coletados 15 novos alertas regulatórios',
                    type: 'success'
                  },
                  {
                    time: new Date(Date.now() - 5 * 60000),
                    source: 'FDA',
                    action: 'Sincronização de 45 regulamentações',
                    type: 'success'
                  },
                  {
                    time: new Date(Date.now() - 8 * 60000),
                    source: 'FINEP',
                    action: '3 novos editais disponíveis',
                    type: 'info'
                  },
                  {
                    time: new Date(Date.now() - 12 * 60000),
                    source: 'Stripe',
                    action: 'Falha na conexão - tentando reconectar',
                    type: 'error'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{activity.source}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(activity.time.toISOString())}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationDashboard;