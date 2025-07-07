import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  Download, 
  Target, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  BarChart3,
  PieChart,
  Calendar,
  Settings,
  Plus,
  Star,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'compliance' | 'financial' | 'network' | 'market';
  icon: React.ElementType;
  metrics: string[];
  isPremium: boolean;
  estimatedTime: string;
  popularity: number;
  lastUpdated: string;
}

const ReportTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [customization, setCustomization] = useState({
    name: '',
    dateRange: '30d',
    format: 'pdf',
    metrics: [] as string[],
    filters: {}
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const templates: ReportTemplate[] = [
    {
      id: 'ai-matching-performance',
      name: 'Performance de IA Matching',
      description: 'Análise completa da eficácia do sistema de matching baseado em IA',
      category: 'performance',
      icon: Target,
      metrics: ['match_accuracy', 'conversion_rate', 'partnership_success', 'roi_impact', 'algorithm_efficiency'],
      isPremium: true,
      estimatedTime: '3-5 min',
      popularity: 95,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'regulatory-compliance',
      name: 'Compliance Regulatório ANVISA',
      description: 'Status detalhado de conformidade com regulamentações da ANVISA',
      category: 'compliance',
      icon: AlertTriangle,
      metrics: ['compliance_score', 'pending_issues', 'risk_assessment', 'deadline_tracking', 'audit_readiness'],
      isPremium: false,
      estimatedTime: '2-3 min',
      popularity: 88,
      lastUpdated: '2024-01-12'
    },
    {
      id: 'financial-dashboard',
      name: 'Dashboard Financeiro',
      description: 'Visão completa das métricas financeiras e ROI de parcerias',
      category: 'financial',
      icon: TrendingUp,
      metrics: ['revenue_analysis', 'cost_breakdown', 'profit_margins', 'partnership_roi', 'cash_flow'],
      isPremium: true,
      estimatedTime: '4-6 min',
      popularity: 92,
      lastUpdated: '2024-01-10'
    },
    {
      id: 'network-analysis',
      name: 'Análise de Rede',
      description: 'Insights sobre crescimento da rede e qualidade das conexões',
      category: 'network',
      icon: Users,
      metrics: ['network_growth', 'connection_quality', 'engagement_rates', 'referral_analysis', 'influence_mapping'],
      isPremium: false,
      estimatedTime: '2-4 min',
      popularity: 85,
      lastUpdated: '2024-01-08'
    },
    {
      id: 'market-intelligence',
      name: 'Inteligência de Mercado',
      description: 'Análise de tendências do setor farmacêutico e posicionamento competitivo',
      category: 'market',
      icon: BarChart3,
      metrics: ['market_share', 'competitive_analysis', 'trend_identification', 'opportunity_mapping', 'risk_factors'],
      isPremium: true,
      estimatedTime: '5-8 min',
      popularity: 78,
      lastUpdated: '2024-01-05'
    },
    {
      id: 'operational-efficiency',
      name: 'Eficiência Operacional',
      description: 'Métricas de produtividade e otimização de processos',
      category: 'performance',
      icon: PieChart,
      metrics: ['process_efficiency', 'time_optimization', 'resource_utilization', 'bottleneck_analysis', 'automation_impact'],
      isPremium: false,
      estimatedTime: '3-4 min',
      popularity: 73,
      lastUpdated: '2024-01-03'
    }
  ];

  const categoryColors = {
    performance: 'bg-blue-100 text-blue-800',
    compliance: 'bg-red-100 text-red-800',
    financial: 'bg-green-100 text-green-800',
    network: 'bg-purple-100 text-purple-800',
    market: 'bg-orange-100 text-orange-800'
  };

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setCustomization({
      name: template.name,
      dateRange: '30d',
      format: 'pdf',
      metrics: template.metrics,
      filters: {}
    });
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    
    try {
      // Simular geração do relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        template: selectedTemplate,
        customization,
        generatedAt: new Date().toISOString(),
        data: generateMockData(selectedTemplate)
      };

      // Simular download
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const fileName = `${customization.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', fileName);
      linkElement.click();

      toast.success('Relatório gerado com sucesso!');
      setSelectedTemplate(null);
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockData = (template: ReportTemplate) => {
    const baseData = {
      summary: {
        totalMetrics: template.metrics.length,
        dataPoints: Math.floor(Math.random() * 1000) + 500,
        timeRange: customization.dateRange,
        generatedAt: new Date().toISOString()
      }
    };

    // Gerar dados específicos por categoria
    switch (template.category) {
      case 'performance':
        return {
          ...baseData,
          performance: {
            overallScore: Math.floor(Math.random() * 30) + 70,
            improvementRate: (Math.random() * 0.2 + 0.05).toFixed(2),
            keyMetrics: template.metrics.map(metric => ({
              name: metric,
              value: Math.floor(Math.random() * 100),
              trend: Math.random() > 0.5 ? 'up' : 'down'
            }))
          }
        };
      
      case 'compliance':
        return {
          ...baseData,
          compliance: {
            overallScore: Math.floor(Math.random() * 20) + 80,
            criticalIssues: Math.floor(Math.random() * 5),
            pendingActions: Math.floor(Math.random() * 10) + 2,
            riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
          }
        };
      
      case 'financial':
        return {
          ...baseData,
          financial: {
            totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
            profitMargin: (Math.random() * 0.3 + 0.1).toFixed(2),
            growthRate: (Math.random() * 0.2 + 0.05).toFixed(2),
            roi: (Math.random() * 0.5 + 0.2).toFixed(2)
          }
        };
      
      default:
        return baseData;
    }
  };

  const handleMetricToggle = (metric: string) => {
    setCustomization(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Templates de Relatórios</h2>
          <p className="text-muted-foreground">
            Escolha um template pré-configurado ou crie seu próprio relatório personalizado
          </p>
        </div>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Criar Template Personalizado
        </Button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow relative">
              {template.isPremium && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="outline" className={categoryColors[template.category]}>
                    {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{template.estimatedTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Métricas ({template.metrics.length}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.metrics.slice(0, 3).map((metric) => (
                      <Badge key={metric} variant="secondary" className="text-xs">
                        {metric.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                    {template.metrics.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.metrics.length - 3} mais
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            i < Math.floor(template.popularity / 20) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">{template.popularity}%</span>
                  </div>
                  <span className="text-muted-foreground">
                    Atualizado: {new Date(template.lastUpdated).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Usar Template
                    </Button>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Icon className="h-5 w-5" />
                        <span>Personalizar Relatório</span>
                      </DialogTitle>
                    </DialogHeader>
                    
                    {selectedTemplate && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="reportName">Nome do Relatório</Label>
                            <Input
                              id="reportName"
                              value={customization.name}
                              onChange={(e) => setCustomization(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="dateRange">Período</Label>
                            <Select
                              value={customization.dateRange}
                              onValueChange={(value) => setCustomization(prev => ({ ...prev, dateRange: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                                <SelectItem value="1y">Último ano</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Formato de Saída</Label>
                          <Select
                            value={customization.format}
                            onValueChange={(value) => setCustomization(prev => ({ ...prev, format: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="excel">Excel</SelectItem>
                              <SelectItem value="csv">CSV</SelectItem>
                              <SelectItem value="json">JSON</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label>Métricas a Incluir</Label>
                          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                            {selectedTemplate.metrics.map((metric) => (
                              <div key={metric} className="flex items-center space-x-2">
                                <Checkbox
                                  id={metric}
                                  checked={customization.metrics.includes(metric)}
                                  onCheckedChange={() => handleMetricToggle(metric)}
                                />
                                <Label htmlFor={metric} className="text-sm">
                                  {metric.replace(/_/g, ' ').charAt(0).toUpperCase() + metric.replace(/_/g, ' ').slice(1)}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleGenerateReport}
                            disabled={isGenerating || customization.metrics.length === 0}
                          >
                            {isGenerating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Gerando...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Gerar Relatório
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ReportTemplates;