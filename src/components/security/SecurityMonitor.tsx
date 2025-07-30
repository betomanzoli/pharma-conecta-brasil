
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, Zap } from 'lucide-react';

interface SecurityMetric {
  name: string;
  value: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface SecurityEvent {
  id: string;
  event_type: string;
  event_description: string;
  created_at: string;
  ip_address?: string;
  severity: 'low' | 'medium' | 'high';
}

const SecurityMonitor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    if (user) {
      loadSecurityData();
      startRealTimeMonitoring();
    }
  }, [user]);

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Carregar métricas de segurança
      const { data: securityReport } = await supabase.rpc('generate_security_report', {
        p_user_id: user?.id,
        p_days: 7
      });

      if (securityReport) {
        const newMetrics: SecurityMetric[] = [
          {
            name: 'Login Failures',
            value: securityReport.failed_logins || 0,
            status: (securityReport.failed_logins || 0) > 5 ? 'critical' : 
                   (securityReport.failed_logins || 0) > 2 ? 'warning' : 'good',
            description: 'Tentativas de login falhadas nos últimos 7 dias'
          },
          {
            name: 'Suspicious Activities',
            value: securityReport.suspicious_activities || 0,
            status: (securityReport.suspicious_activities || 0) > 0 ? 'critical' : 'good',
            description: 'Atividades suspeitas detectadas'
          },
          {
            name: 'Unique IPs',
            value: securityReport.unique_ips || 0,
            status: (securityReport.unique_ips || 0) > 5 ? 'warning' : 'good',
            description: 'Diferentes IPs utilizados para acesso'
          },
          {
            name: 'Security Score',
            value: securityReport.security_score === 'alto' ? 100 : 
                   securityReport.security_score === 'médio' ? 75 : 50,
            status: securityReport.security_score === 'alto' ? 'good' : 
                   securityReport.security_score === 'médio' ? 'warning' : 'critical',
            description: 'Pontuação geral de segurança'
          }
        ];
        setMetrics(newMetrics);
      }

      // Carregar eventos recentes de segurança
      const { data: recentEvents } = await supabase
        .from('security_audit_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentEvents) {
        const formattedEvents: SecurityEvent[] = recentEvents.map(event => ({
          id: event.id,
          event_type: event.event_type,
          event_description: event.event_description,
          created_at: event.created_at,
          ip_address: event.ip_address,
          severity: getSeverity(event.event_type)
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error loading security data:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados de segurança",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverity = (eventType: string): 'low' | 'medium' | 'high' => {
    switch (eventType) {
      case 'suspicious_activity':
      case 'account_locked':
      case 'password_changed':
        return 'high';
      case 'failed_login':
      case 'two_factor_enabled':
        return 'medium';
      default:
        return 'low';
    }
  };

  const startRealTimeMonitoring = () => {
    setMonitoring(true);
    
    // Configurar canal de tempo real para eventos de segurança
    const securityChannel = supabase
      .channel('security-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_audit_logs',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          const newEvent: SecurityEvent = {
            id: payload.new.id,
            event_type: payload.new.event_type,
            event_description: payload.new.event_description,
            created_at: payload.new.created_at,
            ip_address: payload.new.ip_address,
            severity: getSeverity(payload.new.event_type)
          };

          setEvents(prev => [newEvent, ...prev.slice(0, 9)]);

          // Mostrar toast para eventos críticos
          if (newEvent.severity === 'high') {
            toast({
              title: "🚨 Alerta de Segurança",
              description: newEvent.event_description,
              variant: "destructive"
            });
          }
        }
      )
      .subscribe();

    return () => {
      securityChannel.unsubscribe();
      setMonitoring(false);
    };
  };

  const runSecurityScan = async () => {
    try {
      toast({
        title: "🔍 Iniciando Scan de Segurança",
        description: "Analisando sua conta...",
      });

      // Executar função de detecção de atividade suspeita
      const { data: result } = await supabase.rpc('detect_suspicious_activity', {
        p_user_id: user?.id,
        p_ip_address: 'manual_scan',
        p_user_agent: navigator.userAgent
      });

      // Recarregar dados após o scan
      await loadSecurityData();

      toast({
        title: result ? "⚠️ Atividade Suspeita Detectada" : "✅ Scan Completo",
        description: result ? 
          "Foram detectadas atividades suspeitas em sua conta" :
          "Nenhuma atividade suspeita encontrada",
        variant: result ? "destructive" : "default"
      });
    } catch (error) {
      console.error('Error running security scan:', error);
      toast({
        title: "Erro",
        description: "Falha ao executar scan de segurança",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Status de Monitoramento */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <span>Monitor de Segurança</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Badge className={monitoring ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {monitoring ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Monitorando
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Offline
                  </>
                )}
              </Badge>
              <Button onClick={runSecurityScan} size="sm" variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Scan de Segurança
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas de Segurança */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.name}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </p>
                </div>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status === 'good' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {metric.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {metric.status === 'critical' && <Lock className="h-3 w-3 mr-1" />}
                  {metric.status.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Eventos de Segurança Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos de Segurança Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum evento de segurança recente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{event.event_type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {event.event_description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>{new Date(event.created_at).toLocaleString('pt-BR')}</span>
                      {event.ip_address && <span>IP: {event.ip_address}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitor;
