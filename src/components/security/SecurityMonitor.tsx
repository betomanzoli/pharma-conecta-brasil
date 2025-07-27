
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Lock,
  TrendingUp,
  Clock,
  MapPin,
  Smartphone
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  event_type: string;
  event_description: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  metadata: any;
}

interface SecurityMetrics {
  failed_logins: number;
  suspicious_activities: number;
  blocked_ips: number;
  successful_2fa: number;
  total_events: number;
}

const SecurityMonitor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    failed_logins: 0,
    suspicious_activities: 0,
    blocked_ips: 0,
    successful_2fa: 0,
    total_events: 0
  });
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  // Use the custom hook to fetch security events
  const { data: eventsData, refetch } = useSupabaseQuery({
    queryKey: ['security-events', user?.id],
    table: 'security_audit_logs',
    select: '*',
    filters: { user_id: user?.id },
    enabled: !!user?.id
  });

  useEffect(() => {
    if (eventsData && Array.isArray(eventsData)) {
      // Type cast the data to SecurityEvent array
      const events = eventsData as SecurityEvent[];
      setSecurityEvents(events.slice(0, 50));
      loadSecurityMetrics(events);
    }
  }, [eventsData]);

  useEffect(() => {
    if (user?.id) {
      // Set up real-time monitoring
      const subscription = supabase
        .channel('security_events')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'security_audit_logs' },
          (payload) => {
            if (payload.new.user_id === user.id) {
              handleNewSecurityEvent(payload.new as SecurityEvent);
            }
          }
        )
        .subscribe();

      setRealTimeEnabled(true);

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  const loadSecurityMetrics = (events: SecurityEvent[]) => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentEvents = events.filter(e => new Date(e.created_at) >= thirtyDaysAgo);

    const newMetrics = {
      failed_logins: recentEvents.filter(e => e.event_type === 'failed_login').length,
      suspicious_activities: recentEvents.filter(e => e.event_type === 'suspicious_activity').length,
      blocked_ips: recentEvents.filter(e => e.event_type === 'blocked_ip').length,
      successful_2fa: recentEvents.filter(e => e.event_type === 'successful_2fa').length,
      total_events: recentEvents.length
    };

    setMetrics(newMetrics);
  };

  const handleNewSecurityEvent = (event: SecurityEvent) => {
    // Show toast for critical events
    if (event.event_type === 'failed_login' || event.event_type === 'suspicious_activity') {
      toast({
        title: "🚨 Alerta de Segurança",
        description: event.event_description,
        variant: "destructive"
      });
    }

    // Update events list
    setSecurityEvents(prev => [event, ...prev.slice(0, 49)]);

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      total_events: prev.total_events + 1,
      failed_logins: event.event_type === 'failed_login' ? prev.failed_logins + 1 : prev.failed_logins,
      suspicious_activities: event.event_type === 'suspicious_activity' ? prev.suspicious_activities + 1 : prev.suspicious_activities,
      blocked_ips: event.event_type === 'blocked_ip' ? prev.blocked_ips + 1 : prev.blocked_ips,
      successful_2fa: event.event_type === 'successful_2fa' ? prev.successful_2fa + 1 : prev.successful_2fa
    }));
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'failed_login':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'successful_login':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'suspicious_activity':
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'successful_2fa':
        return <Lock className="h-4 w-4 text-blue-500" />;
      case 'blocked_ip':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventSeverity = (eventType: string) => {
    switch (eventType) {
      case 'failed_login':
      case 'suspicious_activity':
      case 'blocked_ip':
        return 'high';
      case 'password_change':
      case 'email_change':
      case 'security_settings_updated':
        return 'medium';
      default:
        return 'low';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffMs = now.getTime() - eventTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} h atrás`;
    return `${Math.floor(diffMins / 1440)} dias atrás`;
  };

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <span className="text-xl">Monitor de Segurança</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Activity className="h-3 w-3 mr-1" />
                  {realTimeEnabled ? 'Ativo' : 'Inativo'}
                </Badge>
                <Badge variant="outline">
                  Últimos 30 dias
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Logins Falhados</p>
                <p className="text-2xl font-bold text-red-600">{metrics.failed_logins}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">2FA Sucessos</p>
                <p className="text-2xl font-bold text-green-600">{metrics.successful_2fa}</p>
              </div>
              <Lock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Atividades Suspeitas</p>
                <p className="text-2xl font-bold text-yellow-600">{metrics.suspicious_activities}</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Eventos de Segurança Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum evento de segurança registrado
              </div>
            ) : (
              securityEvents.slice(0, 20).map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    getEventSeverity(event.event_type) === 'high' ? 'border-l-red-500 bg-red-50' :
                    getEventSeverity(event.event_type) === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                    'border-l-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getEventIcon(event.event_type)}
                      <div>
                        <div className="font-medium">{event.event_description}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(event.created_at)}</span>
                            </span>
                            {event.ip_address && (
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{event.ip_address}</span>
                              </span>
                            )}
                            {event.user_agent && (
                              <span className="flex items-center space-x-1">
                                <Smartphone className="h-3 w-3" />
                                <span className="truncate max-w-xs">
                                  {event.user_agent.split(' ')[0]}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      className={
                        getEventSeverity(event.event_type) === 'high' ? 'bg-red-100 text-red-800' :
                        getEventSeverity(event.event_type) === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }
                    >
                      {event.event_type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recomendações de Segurança</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.failed_logins > 5 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Muitos logins falhados detectados. Considere ativar autenticação de dois fatores.
                </AlertDescription>
              </Alert>
            )}
            
            {metrics.successful_2fa === 0 && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Ative a autenticação de dois fatores para maior segurança da sua conta.
                </AlertDescription>
              </Alert>
            )}
            
            {metrics.suspicious_activities > 0 && (
              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  Atividades suspeitas detectadas. Monitore sua conta regularmente.
                </AlertDescription>
              </Alert>
            )}
            
            {metrics.total_events === 0 && (
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  Sua conta está segura. Continue seguindo as melhores práticas de segurança.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitor;
