
import React, { useState, useEffect } from 'react';
import MetricsKPICards from './MetricsKPICards';
import MetricsCharts from './MetricsCharts';
import MetricsSectorDistribution from './MetricsSectorDistribution';
import MetricsPerformance from './MetricsPerformance';
import MetricsAlerts from './MetricsAlerts';

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de métricas em tempo real
    const fetchMetrics = () => {
      const mockMetrics = {
        overview: {
          total_matches: 1247,
          successful_partnerships: 89,
          revenue_generated: 2580000,
          active_companies: 456,
          growth_rate: 23.5,
          conversion_rate: 7.1
        },
        trends: {
          matches: [
            { month: 'Jan', value: 45 },
            { month: 'Fev', value: 52 },
            { month: 'Mar', value: 78 },
            { month: 'Abr', value: 91 },
            { month: 'Mai', value: 67 },
            { month: 'Jun', value: 103 },
            { month: 'Jul', value: 125 },
          ],
          revenue: [
            { month: 'Jan', value: 180000 },
            { month: 'Fev', value: 220000 },
            { month: 'Mar', value: 285000 },
            { month: 'Abr', value: 350000 },
            { month: 'Mai', value: 290000 },
            { month: 'Jun', value: 420000 },
            { month: 'Jul', value: 580000 },
          ]
        },
        sectors: [
          { name: 'Genéricos', value: 35, color: '#0088FE' },
          { name: 'Biotecnologia', value: 28, color: '#00C49F' },
          { name: 'Medicamentos', value: 22, color: '#FFBB28' },
          { name: 'Equipamentos', value: 15, color: '#FF8042' }
        ],
        alerts: [
          { type: 'success', message: 'Sistema operando normalmente', count: 1 },
          { type: 'warning', message: 'Alertas regulatórios pendentes', count: 3 },
          { type: 'info', message: 'Novos matches disponíveis', count: 12 }
        ]
      };
      
      setMetrics(mockMetrics);
      setLoading(false);
    };

    fetchMetrics();
    
    // Atualizar métricas a cada 30 segundos (simulando real-time)
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
