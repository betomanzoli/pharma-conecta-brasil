
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';

import OverviewCards from './OverviewCards';
import PerformanceChart from './PerformanceChart';
import ConnectionsChart from './ConnectionsChart';
import SectorChart from './SectorChart';
import DateRangePicker from './DateRangePicker';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  const { analyticsData, loading, exportData } = useAnalyticsData(dateRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1565C0]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Acompanhe o desempenho da sua atividade na plataforma</p>
        </div>
        <div className="flex items-center space-x-4">
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange}
          />
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <OverviewCards data={analyticsData.overview} />

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="connections">Conexões</TabsTrigger>
          <TabsTrigger value="sectors">Setores</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceChart data={analyticsData.performance} />
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <ConnectionsChart data={analyticsData.connections} />
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <SectorChart data={analyticsData.sectors} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
