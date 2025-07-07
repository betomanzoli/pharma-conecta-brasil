
import React from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ReportBuilder from '@/components/reports/ReportBuilder';
import CustomReportBuilder from '@/components/reports/CustomReportBuilder';
import ReportTemplates from '@/components/reports/ReportTemplates';
import ReportInsights from '@/components/reports/ReportInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { FileText, BarChart, Layout, Lightbulb, Settings } from 'lucide-react';

const ReportsPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Relatórios e Analytics</h1>
            <p className="text-muted-foreground">
              Sistema completo de relatórios com templates, insights de IA e análises personalizadas
            </p>
          </div>

          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
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

            <TabsContent value="insights">
              <ReportInsights />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ReportsPage;
