
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { 
  Shield, 
  AlertTriangle, 
  Lock,
  Eye
} from 'lucide-react';

interface SecurityMetrics {
  failed_logins: number;
  suspicious_activities: number;
  successful_2fa: number;
  total_events: number;
}

const SecurityMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    failed_logins: 0,
    suspicious_activities: 0,
    successful_2fa: 0,
    total_events: 0
  });

  const { data: eventsData } = useSupabaseQuery({
    queryKey: ['security-metrics', user?.id],
    table: 'security_audit_logs',
    select: '*',
    filters: { user_id: user?.id },
    enabled: !!user?.id
  });

  useEffect(() => {
    if (eventsData && Array.isArray(eventsData)) {
      const events = eventsData as any[];
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentEvents = events.filter(e => new Date(e.created_at) >= thirtyDaysAgo);

      const newMetrics = {
        failed_logins: recentEvents.filter(e => e.event_type === 'failed_login').length,
        suspicious_activities: recentEvents.filter(e => e.event_type === 'suspicious_activity').length,
        successful_2fa: recentEvents.filter(e => e.event_type === 'successful_2fa').length,
        total_events: recentEvents.length
      };

      setMetrics(newMetrics);
    }
  }, [eventsData]);

  const metricsCards = [
    {
      title: 'Logins Falhados',
      value: metrics.failed_logins,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: '2FA Sucessos',
      value: metrics.successful_2fa,
      icon: Lock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Atividades Suspeitas',
      value: metrics.suspicious_activities,
      icon: Eye,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total de Eventos',
      value: metrics.total_events,
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsCards.map((metric) => (
        <Card key={metric.title} className={metric.bgColor}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
              <metric.icon className={`h-8 w-8 ${metric.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SecurityMetrics;
