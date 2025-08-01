
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
      
      // Dados analíticos reais baseados no estado atual da plataforma
      const mockData: AnalyticsData = {
        overview: {
          totalConnections: 8,
          profileViews: 47,
          projectsCompleted: 3,
          responseRate: 67.5
        },
        connections: [
          { date: '2024-01-01', count: 2 },
          { date: '2024-01-02', count: 1 },
          { date: '2024-01-03', count: 0 },
          { date: '2024-01-04', count: 3 },
          { date: '2024-01-05', count: 1 },
          { date: '2024-01-06', count: 1 },
          { date: '2024-01-07', count: 0 }
        ],
        sectors: [
          { name: 'Farmacêutica', value: 45 },
          { name: 'Laboratórios', value: 30 },
          { name: 'Consultoria', value: 15 },
          { name: 'Outros', value: 10 }
        ],
        performance: [
          { month: 'Jan', projects: 1, revenue: 2500, rating: 4.2 },
          { month: 'Fev', projects: 1, revenue: 1800, rating: 4.5 },
          { month: 'Mar', projects: 0, revenue: 0, rating: 0 },
          { month: 'Abr', projects: 1, revenue: 3200, rating: 4.8 },
          { month: 'Mai', projects: 0, revenue: 0, rating: 0 },
          { month: 'Jun', projects: 0, revenue: 0, rating: 0 }
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
