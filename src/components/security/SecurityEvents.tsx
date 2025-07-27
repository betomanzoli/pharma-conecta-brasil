
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Lock,
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

const SecurityEvents = () => {
  const { user } = useAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  const { data: eventsData } = useSupabaseQuery({
    queryKey: ['security-events', user?.id],
    table: 'security_audit_logs',
    select: '*',
    filters: { user_id: user?.id },
    enabled: !!user?.id
  });

  useEffect(() => {
    if (eventsData && Array.isArray(eventsData)) {
      const events = eventsData as SecurityEvent[];
      setSecurityEvents(events.slice(0, 20));
    }
  }, [eventsData]);

  useEffect(() => {
    if (user?.id) {
      const subscription = supabase
        .channel('security_events')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'security_audit_logs' },
          (payload) => {
            if (payload.new.user_id === user.id) {
              const newEvent = payload.new as SecurityEvent;
              setSecurityEvents(prev => [newEvent, ...prev.slice(0, 19)]);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Eventos de Segurança Recentes</span>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <Activity className="h-3 w-3 mr-1" />
            {realTimeEnabled ? 'Ativo' : 'Inativo'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {securityEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum evento de segurança registrado
            </div>
          ) : (
            securityEvents.map((event) => (
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
  );
};

export default SecurityEvents;
