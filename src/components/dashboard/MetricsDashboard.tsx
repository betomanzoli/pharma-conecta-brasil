
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
          total_matches: 47,
          successful_partnerships: 8,
          revenue_generated: 125000,
          active_companies: 23,
          growth_rate: 15.2,
          conversion_rate: 17.0
        },
        trends: {
          matches: [
            { month: 'Jan', value: 12 },
            { month: 'Fev', value: 8 },
            { month: 'Mar', value: 15 },
            { month: 'Abr', value: 7 },
            { month: 'Mai', value: 3 },
            { month: 'Jun', value: 2 },
            { month: 'Jul', value: 0 },
          ],
          revenue: [
            { month: 'Jan', value: 25000 },
            { month: 'Fev', value: 18000 },
            { month: 'Mar', value: 32000 },
            { month: 'Abr', value: 15000 },
            { month: 'Mai', value: 22000 },
            { month: 'Jun', value: 13000 },
            { month: 'Jul', value: 0 },
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
          { type: 'warning', message: 'Métricas de transparência ativas', count: 1 },
          { type: 'info', message: 'Dados reais sendo coletados', count: 1 }
        ]
      };
      
      setMetrics(mockMetrics);
      setLoading(false);
    };

    fetchMetrics();
    
    // Atualizar métricas a cada 30 segundos
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
