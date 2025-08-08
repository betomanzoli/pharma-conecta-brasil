
import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import ReportBuilder from '@/components/reports/ReportBuilder';
import CustomReportBuilder from '@/components/reports/CustomReportBuilder';
import ReportTemplates from '@/components/reports/ReportTemplates';
import ReportInsights from '@/components/reports/ReportInsights';
import EnhancedReportExporter from '@/components/reports/EnhancedReportExporter';
import AIReportInsights from '@/components/reports/AIReportInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import UniversalDemoBanner from '@/components/layout/UniversalDemoBanner';
import { FileText, BarChart, Layout, Lightbulb, Settings, Download, Brain } from 'lucide-react';
import { isDemoMode } from '@/utils/demoMode';

const ReportsPage = () => {
  const isDemo = isDemoMode();

  useEffect(() => {
    const title = 'Relatórios e Analytics | Plataforma';
    document.title = title;

    const desc = isDemo 
      ? 'Relatórios e analytics com dados demonstrativos.' 
      : 'Relatórios personalizados, insights de IA e analytics em uma única página.';
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, [isDemo]);

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <UniversalDemoBanner variant="minimal" className="mb-6" />
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Relatórios e Analytics
            </h1>
            <p className="text-muted-foreground">
              {isDemo 
                ? 'Sistema completo de relatórios com dados demonstrativos'
                : 'Sistema completo de relatórios com templates, insights de IA e análises personalizadas'
              }
            </p>
          </div>

          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="templates" className="flex items-center space-x-2">
                <Layout className="h-4 w-4" />
                <span>Templates</span>
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Personalizado</span>
              </TabsTrigger>
              <TabsTrigger value="builder" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Builder</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </TabsTrigger>
              <TabsTrigger value="ai-insights" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>IA Insights</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates">
              <ReportTemplates />
            </TabsContent>

            <TabsContent value="custom">
              <CustomReportBuilder />
            </TabsContent>

            <TabsContent value="builder">
              <ReportBuilder />
            </TabsContent>

            <TabsContent value="export">
              <EnhancedReportExporter />
            </TabsContent>

            <TabsContent value="ai-insights">
              <AIReportInsights />
            </TabsContent>

            <TabsContent value="insights">
              <ReportInsights />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ReportsPage;
