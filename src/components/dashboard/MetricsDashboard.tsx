
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import MetricsKPICards from './MetricsKPICards';
import MetricsCharts from './MetricsCharts';
import MetricsSectorDistribution from './MetricsSectorDistribution';
import MetricsPerformance from './MetricsPerformance';
import MetricsAlerts from './MetricsAlerts';

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode] = useState(true); // TODO: Implementar toggle real

  useEffect(() => {
    // Simular carregamento de métricas
    const fetchMetrics = () => {
      const mockMetrics = {
        overview: {
          total_matches: isDemoMode ? 47 : 0,
          successful_partnerships: isDemoMode ? 8 : 0,
          revenue_generated: isDemoMode ? 125000 : 0,
          active_companies: isDemoMode ? 23 : 0,
          growth_rate: isDemoMode ? 15.2 : 0,
          conversion_rate: isDemoMode ? 17.0 : 0
        },
        trends: {
          matches: isDemoMode ? [
            { month: 'Jan', value: 12 },
            { month: 'Fev', value: 8 },
            { month: 'Mar', value: 15 },
            { month: 'Abr', value: 7 },
            { month: 'Mai', value: 3 },
            { month: 'Jun', value: 2 },
            { month: 'Jul', value: 0 },
          ] : Array(7).fill(0).map((_, i) => ({ month: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'][i], value: 0 })),
          revenue: isDemoMode ? [
            { month: 'Jan', value: 25000 },
            { month: 'Fev', value: 18000 },
            { month: 'Mar', value: 32000 },
            { month: 'Abr', value: 15000 },
            { month: 'Mai', value: 22000 },
            { month: 'Jun', value: 13000 },
            { month: 'Jul', value: 0 },
          ] : Array(7).fill(0).map((_, i) => ({ month: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'][i], value: 0 }))
        },
        sectors: isDemoMode ? [
          { name: 'Genéricos', value: 35, color: '#0088FE' },
          { name: 'Biotecnologia', value: 28, color: '#00C49F' },
          { name: 'Medicamentos', value: 22, color: '#FFBB28' },
          { name: 'Equipamentos', value: 15, color: '#FF8042' }
        ] : [],
        alerts: isDemoMode ? [
          { type: 'info', message: 'Modo demonstração ativo - dados simulados', count: 1 },
          { type: 'success', message: 'Sistema operando normalmente', count: 1 },
          { type: 'warning', message: 'Configure dados reais para métricas precisas', count: 1 }
        ] : [
          { type: 'info', message: 'Configurando métricas reais...', count: 1 },
          { type: 'warning', message: 'Dados insuficientes para análise', count: 1 }
        ]
      };
      
      setMetrics(mockMetrics);
      setLoading(false);
    };

    fetchMetrics();
    
    // Atualizar métricas a cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [isDemoMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isDemoMode && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Dashboard em <strong>modo demonstração</strong> - dados simulados para visualização</span>
            <Badge variant="secondary">DEMO</Badge>
          </AlertDescription>
        </Alert>
      )}

      <MetricsKPICards overview={metrics.overview} />
      <MetricsCharts trends={metrics.trends} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricsSectorDistribution sectors={metrics.sectors} />
        <MetricsPerformance />
        <MetricsAlerts alerts={metrics.alerts} />
      </div>
    </div>
  );
};

export default MetricsDashboard;
