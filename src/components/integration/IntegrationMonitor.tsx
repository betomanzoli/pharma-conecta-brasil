import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Info, 
  XCircle,
  Filter,
  Download,
  RefreshCw,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: any;
  duration?: number;
  endpoint?: string;
}

interface Alert {
  id: string;
  type: 'sync_failure' | 'rate_limit' | 'timeout' | 'data_anomaly';
  source: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

const IntegrationMonitor = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLogs();
    loadAlerts();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadLogs();
        loadAlerts();
      }, 10000); // Update every 10s
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedSource, selectedLevel]);

  const loadLogs = async () => {
    try {
      // Simulate real-time logs
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          source: 'ANVISA',
          level: 'success',
          message: 'Sincronização completada com sucesso',
          details: { recordsProcessed: 23, newAlerts: 3 },
          duration: 1200,
          endpoint: '/api/anvisa/alerts'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 30000).toISOString(),
          source: 'FDA',
          level: 'info',
          message: 'Iniciando coleta de dados regulatórios',
          endpoint: '/api/fda/regulations'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          source: 'Stripe',
          level: 'error',
          message: 'Falha na autenticação - verificar API key',
          details: { error: 'Invalid API key', status: 401 },
          endpoint: '/api/stripe/customers'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 90000).toISOString(),
          source: 'FINEP',
          level: 'warning',
          message: 'Taxa de requisições próxima do limite',
          details: { current: 950, limit: 1000 },
          duration: 2800
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          source: 'INPI',
          level: 'success',
          message: 'Dados de patentes atualizados',
          details: { patents: 45, trademarks: 12 },
          duration: 850
        }
      ];

      // Filter logs based on selection
      let filteredLogs = mockLogs;
      if (selectedSource !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.source === selectedSource);
      }
      if (selectedLevel !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.level === selectedLevel);
      }

      setLogs(filteredLogs);
      
      // Auto-scroll to bottom for new logs
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const loadAlerts = async () => {
    try {
      const mockAlerts: Alert[] = [
        {
          id: '1',
          type: 'sync_failure',
          source: 'Stripe',
          message: 'Falha na sincronização de dados de pagamento por mais de 2 horas',
          timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
          severity: 'high',
          resolved: false
        },
        {
          id: '2',
          type: 'rate_limit',
          source: 'FDA',
          message: 'Limite de taxa de requisições atingido',
          timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
          severity: 'medium',
          resolved: true
        },
        {
          id: '3',
          type: 'data_anomaly',
          source: 'ANVISA',
          message: 'Anomalia detectada nos dados coletados - 300% mais alertas que o normal',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          severity: 'medium',
          resolved: false
        }
      ];

      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const resolveAlert = async (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true }
          : alert
      )
    );
    toast.success('Alerta resolvido');
  };

  const exportLogs = () => {
    const logsText = logs.map(log => 
      `[${log.timestamp}] ${log.source} (${log.level}): ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integration-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Monitor de Integrações</h2>
          <p className="text-muted-foreground">
            Acompanhe logs e alertas das integrações em tempo real
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Zap className="h-4 w-4 mr-2" />
            Auto-refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.filter(a => !a.resolved).length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Alertas Ativos ({alerts.filter(a => !a.resolved).length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.filter(a => !a.resolved).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <span className="text-sm font-medium">{alert.source}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => resolveAlert(alert.id)}
                >
                  Resolver
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Filters and Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Fonte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as fontes</SelectItem>
              <SelectItem value="ANVISA">ANVISA</SelectItem>
              <SelectItem value="FDA">FDA</SelectItem>
              <SelectItem value="FINEP">FINEP</SelectItem>
              <SelectItem value="Stripe">Stripe</SelectItem>
              <SelectItem value="INPI">INPI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os níveis</SelectItem>
            <SelectItem value="success">Sucesso</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Aviso</SelectItem>
            <SelectItem value="error">Erro</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={loadLogs}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Real-time Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Logs em Tempo Real</span>
            {autoRefresh && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                LIVE
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96" ref={scrollRef}>
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors">
                  <div className="mt-0.5">
                    {getLevelIcon(log.level)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{log.source}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(log.timestamp)}
                      </span>
                      {log.duration && (
                        <Badge variant="outline" className="text-xs">
                          {log.duration}ms
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-foreground">{log.message}</p>
                    
                    {log.endpoint && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        {log.endpoint}
                      </p>
                    )}
                    
                    {log.details && (
                      <div className="mt-2 p-2 bg-background rounded text-xs font-mono">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Historical Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  alert.resolved ? 'bg-muted/30' : 'bg-background'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <span className="text-sm font-medium">{alert.source}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(alert.timestamp)}
                    </span>
                    {alert.resolved && (
                      <Badge variant="outline" className="text-green-600">
                        Resolvido
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationMonitor;