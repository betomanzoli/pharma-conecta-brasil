
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  BellRing,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  Users,
  Shield,
  Zap,
  X,
  Eye
} from 'lucide-react';

interface SmartNotification {
  id: string;
  type: 'match' | 'regulatory' | 'automation' | 'compliance' | 'market' | 'system';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: any;
}

const SmartNotificationCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    // Simular notificações inteligentes em tempo real
    const interval = setInterval(checkForNewNotifications, 60000); // A cada minuto
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      // Simular notificações inteligentes baseadas em automações
      const mockNotifications: SmartNotification[] = [
        {
          id: '1',
          type: 'match',
          title: '🎯 Novo Match Inteligente Encontrado',
          message: 'Laboratório XYZ tem 96% de compatibilidade com seus critérios de qualidade e localização',
          priority: 'high',
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min atrás
          read: false,
          actionUrl: '/matches',
          metadata: { matchScore: 96, labName: 'Laboratório XYZ' }
        },
        {
          id: '2',
          type: 'regulatory',
          title: '📊 Nova Resolução ANVISA Detectada',
          message: 'RDC nº 430/2024 sobre análises microbiológicas pode impactar seus processos',
          priority: 'high',
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min atrás
          read: false,
          actionUrl: '/regulatory',
          metadata: { regulation: 'RDC 430/2024', source: 'ANVISA' }
        },
        {
          id: '3',
          type: 'automation',
          title: '⚡ Automação Concluída com Sucesso',
          message: 'Sincronização regulatória executada - 47 novos registros processados',
          priority: 'medium',
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min atrás
          read: false,
          metadata: { recordsProcessed: 47, automationType: 'regulatory_sync' }
        },
        {
          id: '4',
          type: 'market',
          title: '📈 Oportunidade de Mercado Identificada',
          message: 'Crescimento de 23% na demanda por testes de biodisponibilidade no seu estado',
          priority: 'medium',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1h atrás
          read: true,
          metadata: { growth: 23, sector: 'biodisponibilidade', region: 'São Paulo' }
        },
        {
          id: '5',
          type: 'compliance',
          title: '🛡️ Status de Compliance Atualizado',
          message: 'Seu score de compliance aumentou para 94.2% após atualizações automáticas',
          priority: 'low',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2h atrás
          read: true,
          metadata: { score: 94.2, previousScore: 91.8 }
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);

    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForNewNotifications = async () => {
    try {
      // Verificar se há novas automações executadas
      const { data: recentMetrics } = await supabase
        .from('performance_metrics')
        .select('*')
        .gte('measured_at', new Date(Date.now() - 60000).toISOString()) // Último minuto
        .in('metric_name', ['ai_matching_execution', 'regulatory_sync_execution']);

      if (recentMetrics && recentMetrics.length > 0) {
        // Gerar notificações baseadas nas métricas
        recentMetrics.forEach(metric => {
          const notification = generateNotificationFromMetric(metric);
          if (notification) {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Toast para notificações importantes
            if (notification.priority === 'high') {
              toast({
                title: notification.title,
                description: notification.message,
              });
            }
          }
        });
      }

    } catch (error) {
      console.error('Error checking for new notifications:', error);
    }
  };

  const generateNotificationFromMetric = (metric: any): SmartNotification | null => {
    const baseNotification = {
      id: `metric-${metric.id}`,
      timestamp: metric.measured_at,
      read: false
    };

    switch (metric.metric_name) {
      case 'ai_matching_execution':
        return {
          ...baseNotification,
          type: 'match',
          title: '🔍 AI Matching Executado',
          message: `${metric.metric_value} novos matches encontrados automaticamente`,
          priority: metric.metric_value > 5 ? 'high' : 'medium',
          actionUrl: '/matches',
          metadata: { matchCount: metric.metric_value }
        } as SmartNotification;
      
      case 'regulatory_sync_execution':
        return {
          ...baseNotification,
          type: 'regulatory',
          title: '📊 Dados Regulatórios Sincronizados',
          message: `${metric.metric_value} registros regulatórios atualizados`,
          priority: 'medium',
          actionUrl: '/regulatory',
          metadata: { recordCount: metric.metric_value }
        } as SmartNotification;
      
      default:
        return null;
    }
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    
    const wasUnread = notifications.find(n => n.id === notificationId && !n.read);
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match': return <Users className="h-5 w-5 text-blue-500" />;
      case 'regulatory': return <Shield className="h-5 w-5 text-red-500" />;
      case 'automation': return <Zap className="h-5 w-5 text-purple-500" />;
      case 'compliance': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'market': return <TrendingUp className="h-5 w-5 text-orange-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {unreadCount > 0 ? (
                <BellRing className="h-6 w-6 text-primary" />
              ) : (
                <Bell className="h-6 w-6 text-muted-foreground" />
              )}
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <span>Notificações Inteligentes</span>
              <div className="text-sm text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
              </div>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma notificação no momento</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-4 p-4 rounded-lg border ${
                  !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Marcar como lida
                        </Button>
                      )}
                      <Button
                        onClick={() => removeNotification(notification.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartNotificationCenter;
