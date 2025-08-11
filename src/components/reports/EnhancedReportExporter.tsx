import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Share2, 
  Settings,
  FileText,
  FileSpreadsheet,
  FileImage,
  Mail,
  Calendar,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Clock,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useReportSystem } from '@/hooks/useReportSystem';

interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv' | 'powerpoint' | 'json';
  quality: 'standard' | 'high' | 'premium';
  includeCharts: boolean;
  includeData: boolean;
  includeAnalysis: boolean;
  watermark: boolean;
  template: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  lastRun?: string;
  nextRun: string;
  status: 'active' | 'paused' | 'error';
  config: ExportConfig;
}

const EnhancedReportExporter = () => {
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    format: 'pdf',
    quality: 'high',
    includeCharts: true,
    includeData: true,
    includeAnalysis: true,
    watermark: false,
    template: 'professional'
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { exportData, scheduleReport: scheduleReportAction, downloadJSON } = useReportSystem();
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Relatório Mensal de Performance',
      frequency: 'monthly',
      recipients: ['admin@empresa.com', 'diretor@empresa.com'],
      lastRun: '2024-01-15T10:00:00Z',
      nextRun: '2024-02-15T10:00:00Z',
      status: 'active',
      config: {
        format: 'pdf',
        quality: 'premium',
        includeCharts: true,
        includeData: true,
        includeAnalysis: true,
        watermark: true,
        template: 'executive'
      }
    },
    {
      id: '2',
      name: 'Relatório Semanal de Integrações',
      frequency: 'weekly',
      recipients: ['tech@empresa.com'],
      nextRun: '2024-01-22T09:00:00Z',
      status: 'active',
      config: {
        format: 'excel',
        quality: 'standard',
        includeCharts: false,
        includeData: true,
        includeAnalysis: false,
        watermark: false,
        template: 'technical'
      }
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatIcons = {
    pdf: FileText,
    excel: FileSpreadsheet,
    csv: FileSpreadsheet,
    powerpoint: FileImage,
    json: FileText
  };

  const templates = [
    { id: 'professional', name: 'Profissional', description: 'Layout limpo para uso corporativo' },
    { id: 'executive', name: 'Executivo', description: 'Design premium para apresentações' },
    { id: 'technical', name: 'Técnico', description: 'Foco em dados e métricas' },
    { id: 'marketing', name: 'Marketing', description: 'Visual atrativo e colorido' }
  ];

  const exportReport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    try {
      const mappedFormat = ['pdf','excel'].includes(exportConfig.format) ? exportConfig.format : 'json';
      const res = await exportData({ format: mappedFormat as any, filters: { template: exportConfig.template } });
      downloadJSON(res, `relatorio-${Date.now()}`);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao exportar relatório');
    } finally {
      setIsExporting(false);
      setExportProgress(100);
      setTimeout(() => setExportProgress(0), 400);
    }
  };

  const shareReport = async (method: 'email' | 'link' | 'slack') => {
    toast.info(`Compartilhando relatório via ${method}...`);
    
    // Simulate sharing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (method) {
      case 'email':
        toast.success('Relatório enviado por email');
        break;
      case 'link':
        navigator.clipboard.writeText('https://app.empresa.com/reports/share/abc123');
        toast.success('Link copiado para a área de transferência');
        break;
      case 'slack':
        toast.success('Relatório compartilhado no Slack');
        break;
    }
  };

  const scheduleReport = async (config: Partial<ScheduledReport>) => {
    const newReport: ScheduledReport = {
      id: Date.now().toString(),
      name: config.name || 'Novo Relatório Agendado',
      frequency: config.frequency || 'weekly',
      recipients: config.recipients || [],
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      config: exportConfig
    };

    setScheduledReports(prev => [...prev, newReport]);
    toast.success('Relatório agendado com sucesso!');
  };

  const toggleReportStatus = (reportId: string) => {
    setScheduledReports(prev =>
      prev.map(report =>
        report.id === reportId
          ? { ...report, status: report.status === 'active' ? 'paused' : 'active' as const }
          : report
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="h-4 w-4 text-green-500" />;
      case 'paused': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'error': return <X className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Exportação e Compartilhamento</h2>
        <p className="text-muted-foreground">
          Configure e exporte relatórios personalizados com agendamento automático
        </p>
      </div>

      <Tabs defaultValue="export" className="space-y-4">
        <TabsList>
          <TabsTrigger value="export">Exportar</TabsTrigger>
          <TabsTrigger value="schedule">Agendar</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="export">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Exportação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Format Selection */}
                <div className="space-y-3">
                  <Label>Formato do Arquivo</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(formatIcons) as Array<keyof typeof formatIcons>).map((format) => {
                      const Icon = formatIcons[format];
                      return (
                        <Button
                          key={format}
                          variant={exportConfig.format === format ? "default" : "outline"}
                          className="flex flex-col items-center p-4 h-auto"
                          onClick={() => setExportConfig(prev => ({ ...prev, format }))}
                        >
                          <Icon className="h-6 w-6 mb-2" />
                          <span className="text-xs uppercase">{format}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Quality Settings */}
                <div className="space-y-3">
                  <Label>Qualidade</Label>
                  <Select 
                    value={exportConfig.quality} 
                    onValueChange={(value: any) => setExportConfig(prev => ({ ...prev, quality: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Padrão (rápido)</SelectItem>
                      <SelectItem value="high">Alta (recomendado)</SelectItem>
                      <SelectItem value="premium">Premium (lento)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Options */}
                <div className="space-y-3">
                  <Label>Conteúdo Incluído</Label>
                  <div className="space-y-2">
                    {[
                      { key: 'includeCharts', label: 'Gráficos e visualizações' },
                      { key: 'includeData', label: 'Tabelas de dados' },
                      { key: 'includeAnalysis', label: 'Análises e insights' },
                      { key: 'watermark', label: 'Marca d\'água da empresa' }
                    ].map((option) => (
                      <div key={option.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.key}
                          checked={exportConfig[option.key as keyof ExportConfig] as boolean}
                          onCheckedChange={(checked) =>
                            setExportConfig(prev => ({ ...prev, [option.key]: checked }))
                          }
                        />
                        <Label htmlFor={option.key} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Template Selection */}
                <div className="space-y-3">
                  <Label>Template</Label>
                  <Select 
                    value={exportConfig.template} 
                    onValueChange={(value) => setExportConfig(prev => ({ ...prev, template: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Export Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações de Exportação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Export Progress */}
                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Progresso da Exportação</Label>
                      <span className="text-sm text-muted-foreground">{exportProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={exportProgress} />
                  </div>
                )}

                {/* Export Button */}
                <Button 
                  onClick={exportReport} 
                  disabled={isExporting}
                  className="w-full"
                  size="lg"
                >
                  {isExporting ? (
                    <>Exportando...</>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Relatório
                    </>
                  )}
                </Button>

                <Separator />

                {/* Share Options */}
                <div className="space-y-3">
                  <Label>Compartilhamento Rápido</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => shareReport('email')}
                      className="flex flex-col p-4 h-auto"
                    >
                      <Mail className="h-5 w-5 mb-1" />
                      <span className="text-xs">Email</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => shareReport('link')}
                      className="flex flex-col p-4 h-auto"
                    >
                      <Share2 className="h-5 w-5 mb-1" />
                      <span className="text-xs">Link</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => shareReport('slack')}
                      className="flex flex-col p-4 h-auto"
                    >
                      <Users className="h-5 w-5 mb-1" />
                      <span className="text-xs">Slack</span>
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Prévia da Configuração</h4>
                  <div className="text-sm space-y-1">
                    <div>Formato: <Badge variant="outline">{exportConfig.format.toUpperCase()}</Badge></div>
                    <div>Qualidade: <Badge variant="outline">{exportConfig.quality}</Badge></div>
                    <div>Template: <Badge variant="outline">{templates.find(t => t.id === exportConfig.template)?.name}</Badge></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Schedule New Report */}
            <Card>
              <CardHeader>
                <CardTitle>Agendar Novo Relatório</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Relatório</Label>
                  <Input placeholder="Ex: Relatório Mensal de Vendas" />
                </div>
                
                <div className="space-y-2">
                  <Label>Frequência</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Destinatários (emails separados por vírgula)</Label>
                  <Input placeholder="admin@empresa.com, diretor@empresa.com" />
                </div>

                <Button 
                  onClick={() => scheduleReport({ name: 'Novo Relatório' })}
                  className="w-full"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Relatório
                </Button>
              </CardContent>
            </Card>

            {/* Scheduled Reports List */}
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Agendados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.frequency} • {report.recipients.length} destinatário(s)
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(report.status)}
                        <Badge 
                          variant={report.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      {report.lastRun && (
                        <div>Última execução: {formatDate(report.lastRun)}</div>
                      )}
                      <div>Próxima execução: {formatDate(report.nextRun)}</div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleReportStatus(report.id)}
                      >
                        {report.status === 'active' ? 'Pausar' : 'Ativar'}
                      </Button>
                      <Button size="sm" variant="ghost">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  
                  {/* Template Preview */}
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Prévia do Template</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant={exportConfig.template === template.id ? "default" : "outline"}
                      onClick={() => setExportConfig(prev => ({ ...prev, template: template.id }))}
                      size="sm"
                      className="flex-1"
                    >
                      {exportConfig.template === template.id ? 'Selecionado' : 'Selecionar'}
                    </Button>
                    <Button variant="ghost" size="sm">
                      Prévia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Exportações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Relatório de Performance - Janeiro 2024',
                    date: '2024-01-20T14:30:00Z',
                    format: 'PDF',
                    size: '2.4 MB',
                    downloads: 5
                  },
                  {
                    name: 'Análise de Integrações - Semana 3',
                    date: '2024-01-18T09:15:00Z',
                    format: 'Excel',
                    size: '1.1 MB',
                    downloads: 12
                  },
                  {
                    name: 'Dashboard Executivo - Q4 2023',
                    date: '2024-01-15T16:45:00Z',
                    format: 'PowerPoint',
                    size: '8.7 MB',
                    downloads: 3
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(item.date)} • {item.format} • {item.size}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-muted-foreground">
                        {item.downloads} downloads
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedReportExporter;