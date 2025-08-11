
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  PieChart,
  Users,
  Target,
  Filter,
  Settings,
  Eye
} from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useReportSystem } from '@/hooks/useReportSystem';
interface ReportConfig {
  id: string;
  name: string;
  type: 'matching' | 'regulatory' | 'partnerships' | 'analytics';
  filters: {
    dateRange: string;
    companies: string[];
    sectors: string[];
    regions: string[];
  };
  metrics: string[];
  format: 'pdf' | 'excel' | 'csv';
}

const CustomReportBuilder = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState<ReportConfig | null>(null);
  const { profile } = useAuth();
  const { toast } = useToast();
  const { generateReport: generateReportAction, downloadJSON } = useReportSystem();
  const reportTemplates = [
    {
      id: 'matching-performance',
      name: 'Performance de Matching',
      description: 'Análise detalhada dos matches gerados pela IA',
      icon: Target,
      type: 'matching',
      metrics: ['match_score', 'conversion_rate', 'partnership_success', 'roi_generated']
    },
    {
      id: 'regulatory-compliance',
      name: 'Compliance Regulatório',
      description: 'Status de compliance e alertas por região',
      icon: FileText,
      type: 'regulatory',
      metrics: ['alerts_count', 'compliance_score', 'risk_level', 'time_to_resolution']
    },
    {
      id: 'partnership-analysis',
      name: 'Análise de Parcerias',
      description: 'Métricas de parcerias e oportunidades',
      icon: Users,
      type: 'partnerships',
      metrics: ['active_partnerships', 'revenue_generated', 'success_rate', 'avg_duration']
    },
    {
      id: 'market-analytics',
      name: 'Analytics de Mercado',
      description: 'Tendências e insights do setor farmacêutico',
      icon: TrendingUp,
      type: 'analytics',
      metrics: ['market_share', 'growth_rate', 'competitor_analysis', 'opportunity_score']
    }
  ];

  const generateReport = async (template: any) => {
    setLoading(true);
    try {
      const typeMap: Record<string, any> = {
        matching: 'comprehensive',
        regulatory: 'regulatory_summary',
        partnerships: 'business_growth',
        analytics: 'user_analytics',
      };

      const res = await generateReportAction({
        reportType: typeMap[template.type] || 'comprehensive',
        timeRange: '30d',
        format: 'json',
        filters: { metrics: template.metrics, templateId: template.id },
      });

      toast({
        title: 'Relatório Gerado!',
        description: `${template.name} foi gerado com sucesso`,
      });

      const filename = `${template.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
      downloadJSON(res?.report ?? res, filename);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o relatório',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReportData = async (template: any, company: any) => {
    // Simular geração de dados baseados no template
    const mockData = {
      matching: {
        total_matches: Math.floor(Math.random() * 100) + 50,
        successful_matches: Math.floor(Math.random() * 30) + 20,
        conversion_rate: (Math.random() * 0.4 + 0.1).toFixed(2),
        avg_compatibility_score: (Math.random() * 0.3 + 0.7).toFixed(2),
        top_partners: ['BioLab S.A.', 'FarmaTech Ltda', 'Química Nacional']
      },
      regulatory: {
        total_alerts: Math.floor(Math.random() * 20) + 10,
        high_priority: Math.floor(Math.random() * 5) + 2,
        compliance_score: Math.floor(Math.random() * 20) + 80,
        pending_actions: Math.floor(Math.random() * 8) + 2,
        recent_changes: ['RDC 844/2023', 'Portaria 1234/2023']
      },
      partnerships: {
        active_partnerships: Math.floor(Math.random() * 15) + 5,
        total_revenue: Math.floor(Math.random() * 1000000) + 500000,
        avg_deal_size: Math.floor(Math.random() * 50000) + 25000,
        success_rate: (Math.random() * 0.3 + 0.6).toFixed(2),
        pipeline_value: Math.floor(Math.random() * 2000000) + 1000000
      },
      analytics: {
        market_position: Math.floor(Math.random() * 10) + 1,
        growth_rate: (Math.random() * 0.2 + 0.05).toFixed(2),
        market_share: (Math.random() * 0.05 + 0.01).toFixed(3),
        opportunity_score: Math.floor(Math.random() * 30) + 70,
        competitive_index: (Math.random() * 0.4 + 0.6).toFixed(2)
      }
    };

    return mockData[template.type] || {};
  };

  const downloadReport = (reportConfig: any) => {
    // Simular download de relatório em formato JSON
    const dataStr = JSON.stringify(reportConfig, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${reportConfig.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios Personalizados</h2>
          <p className="text-gray-600">Gere relatórios detalhados para análise estratégica</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <Eye className="h-3 w-3 mr-1" />
          Premium Feature
        </Badge>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Métricas Incluídas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.metrics.map((metric, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {metric.replace(/_/g, ' ').toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => generateReport(template)}
                      disabled={loading}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {loading ? 'Gerando...' : 'Gerar Relatório'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Estatísticas Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-900">247</p>
              <p className="text-sm text-blue-600">Relatórios Gerados</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-900">89%</p>
              <p className="text-sm text-green-600">Precisão dos Dados</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-900">4.8s</p>
              <p className="text-sm text-purple-600">Tempo Médio</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-900">12</p>
              <p className="text-sm text-orange-600">Formatos Disponíveis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Relatórios Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Performance de Matching - Dezembro', date: '2023-12-15', type: 'matching', status: 'completed' },
              { name: 'Compliance Regulatório - Q4', date: '2023-12-10', type: 'regulatory', status: 'completed' },
              { name: 'Análise de Parcerias - Mensal', date: '2023-12-08', type: 'partnerships', status: 'processing' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-600">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                    {report.status === 'completed' ? 'Concluído' : 'Processando'}
                  </Badge>
                  {report.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomReportBuilder;
