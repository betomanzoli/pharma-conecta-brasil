import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface AnalyticsData {
  overview: {
    totalConnections: number;
    profileViews: number;
    projectsCompleted: number;
    responseRate: number;
  };
  connections: Array<{
    date: string;
    count: number;
  }>;
  sectors: Array<{
    name: string;
    value: number;
  }>;
  performance: Array<{
    month: string;
    projects: number;
    revenue: number;
    rating: number;
  }>;
}

interface DateRange {
  from: Date;
  to: Date;
}

export const useAnalyticsData = (dateRange: DateRange) => {
  const { profile } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    overview: {
      totalConnections: 0,
      profileViews: 0,
      projectsCompleted: 0,
      responseRate: 0
    },
    connections: [],
    sectors: [],
    performance: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      
      // Simulando dados analíticos - em um cenário real, estes viriam de consultas específicas
      const mockData: AnalyticsData = {
        overview: {
          totalConnections: 47,
          profileViews: 1250,
          projectsCompleted: 23,
          responseRate: 85.2
        },
        connections: [
          { date: '2024-01-01', count: 12 },
          { date: '2024-01-02', count: 19 },
          { date: '2024-01-03', count: 8 },
          { date: '2024-01-04', count: 27 },
          { date: '2024-01-05', count: 15 },
          { date: '2024-01-06', count: 22 },
          { date: '2024-01-07', count: 18 }
        ],
        sectors: [
          { name: 'Farmacêutica', value: 35 },
          { name: 'Biotecnologia', value: 25 },
          { name: 'Cosméticos', value: 20 },
          { name: 'Suplementos', value: 15 },
          { name: 'Outros', value: 5 }
        ],
        performance: [
          { month: 'Jan', projects: 4, revenue: 15000, rating: 4.8 },
          { month: 'Fev', projects: 6, revenue: 22000, rating: 4.9 },
          { month: 'Mar', projects: 3, revenue: 12000, rating: 4.7 },
          { month: 'Abr', projects: 8, revenue: 35000, rating: 4.9 },
          { month: 'Mai', projects: 5, revenue: 18000, rating: 4.8 },
          { month: 'Jun', projects: 7, revenue: 28000, rating: 5.0 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Erro ao buscar dados analíticos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [profile, dateRange]);

  const exportData = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    analyticsData,
    loading,
    exportData,
    refetch: fetchAnalyticsData
  };
};
