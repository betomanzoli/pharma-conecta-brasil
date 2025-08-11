
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Calendar as CalendarIcon, Filter, Download, 
  Plus, X, Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { useReportSystem } from '@/hooks/useReportSystem';

interface ReportConfig {
  name: string;
  description: string;
  type: 'performance' | 'financial' | 'network' | 'activity';
  dateRange: {
    from: Date;
    to: Date;
  };
  metrics: string[];
  filters: Record<string, any>;
  format: 'pdf' | 'excel' | 'csv';
}

const ReportBuilder = () => {
  const { generateReport: generateReportAction, downloadJSON } = useReportSystem();
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    type: 'performance',
    dateRange: {
      from: new Date(),
      to: new Date()
    },
    metrics: [],
    filters: {},
    format: 'pdf'
  });

  const [savedReports, setSavedReports] = useState([
    {
      id: '1',
      name: 'Relatório Mensal de Performance',
      type: 'performance',
      lastGenerated: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Análise de Conexões por Setor',
      type: 'network',
      lastGenerated: '2024-01-10',
      status: 'active'
    }
  ]);

  const availableMetrics = {
    performance: [
      'Visualizações do perfil',
      'Taxa de resposta',
      'Projetos concluídos',
      'Avaliação média',
      'Tempo de resposta médio'
    ],
    financial: [
      'Receita total',
      'Receita por projeto',
      'Margem de lucro',
      'Pagamentos pendentes',
      'Crescimento de receita'
    ],
    network: [
      'Novas conexões',
      'Crescimento da rede',
      'Conexões por setor',
      'Taxa de aceitação',
      'Interações por conexão'
    ],
    activity: [
      'Logins por dia',
      'Tempo na plataforma',
      'Páginas mais visitadas',
      'Ações realizadas',
      'Engajamento por recurso'
    ]
  };

  const handleMetricToggle = (metric: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }));
  };

  const handleSaveReport = () => {
    const newReport = {
      id: Date.now().toString(),
      name: reportConfig.name,
      type: reportConfig.type,
      lastGenerated: format(new Date(), 'yyyy-MM-dd'),
      status: 'active' as const
    };
    
    setSavedReports(prev => [...prev, newReport]);
    
    // Reset form
    setReportConfig({
      name: '',
      description: '',
      type: 'performance',
      dateRange: {
        from: new Date(),
        to: new Date()
      },
      metrics: [],
      filters: {},
      format: 'pdf'
    });
  };

  const handleGenerateReport = async () => {
    // Map UI type to backend report type
    const typeMap: Record<string, any> = {
      performance: 'api_performance',
      financial: 'business_growth',
      network: 'user_analytics',
      activity: 'comprehensive',
    };

    // Approximate timeRange from date difference
    const diffDays = Math.max(1, Math.round((reportConfig.dateRange.to.getTime() - reportConfig.dateRange.from.getTime()) / (1000*60*60*24)));
    const timeRange = diffDays <= 7 ? '7d' : diffDays <= 30 ? '30d' : diffDays <= 90 ? '90d' : '1y';
    const fmt = reportConfig.format === 'csv' ? 'json' : reportConfig.format;

    const res = await generateReportAction({
      reportType: typeMap[reportConfig.type] || 'comprehensive',
      timeRange: timeRange as any,
      format: fmt as any,
      filters: { metrics: reportConfig.metrics, ...reportConfig.filters },
    });

    downloadJSON(res?.report ?? res, `${reportConfig.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Construtor de Relatórios</h2>
        <p className="text-gray-600">Crie relatórios personalizados com as métricas que importam para você</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Configuração */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Configuração do Relatório
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Relatório</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Relatório Mensal"
                    value={reportConfig.name}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Relatório</Label>
                  <Select
                    value={reportConfig.type}
                    onValueChange={(value: any) => setReportConfig(prev => ({ ...prev, type: value, metrics: [] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="financial">Financeiro</SelectItem>
                      <SelectItem value="network">Rede/Conexões</SelectItem>
                      <SelectItem value="activity">Atividade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o objetivo deste relatório..."
                  value={reportConfig.description}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Período</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {reportConfig.dateRange.from ? (
                          reportConfig.dateRange.to ? (
                            <>
                              {format(reportConfig.dateRange.from, "dd/MM/yyyy")} -{" "}
                              {format(reportConfig.dateRange.to, "dd/MM/yyyy")}
                            </>
                          ) : (
                            format(reportConfig.dateRange.from, "dd/MM/yyyy")
                          )
                        ) : (
                          <span>Selecionar período</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={reportConfig.dateRange.from}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">Formato de Saída</Label>
                  <Select
                    value={reportConfig.format}
                    onValueChange={(value: any) => setReportConfig(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Métricas Incluídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableMetrics[reportConfig.type].map((metric) => (
                  <div key={metric} className="flex items-center space-x-2">
                    <Checkbox
                      id={metric}
                      checked={reportConfig.metrics.includes(metric)}
                      onCheckedChange={() => handleMetricToggle(metric)}
                    />
                    <Label htmlFor={metric} className="text-sm font-normal">
                      {metric}
                    </Label>
                  </div>
                ))}
              </div>
              {reportConfig.metrics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {reportConfig.metrics.map((metric) => (
                    <Badge key={metric} variant="secondary" className="flex items-center gap-1">
                      {metric}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleMetricToggle(metric)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleSaveReport} disabled={!reportConfig.name}>
              Salvar Configuração
            </Button>
            <Button onClick={handleGenerateReport} disabled={!reportConfig.name || reportConfig.metrics.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </div>

        {/* Relatórios Salvos */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Relatórios Salvos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{report.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {report.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      Último: {format(new Date(report.lastGenerated), 'dd/MM/yyyy')}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Editar
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Gerar
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
