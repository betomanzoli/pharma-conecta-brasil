import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Check, Info, AlertTriangle, MessageSquare, Users, BookOpen, Settings } from 'lucide-react';
import { isDemoMode } from '@/utils/demoMode';
import { demoData } from '@/utils/demoData';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  read: boolean;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const isDemo = isDemoMode();

  useEffect(() => {
    const loadNotifications = () => {
      if (isDemo) {
        // Dados demo estruturados
        const demoNotifications: Notification[] = [
          {
            id: 'demo-1',
            title: 'Nova mensagem de parceiro',
            message: 'LabAnalise Avançado enviou uma proposta para seu projeto de desenvolvimento farmacêutico.',
            type: 'partnership',
            created_at: '2024-01-10T10:30:00Z',
            read: false
          },
          {
            id: 'demo-2',
            title: 'Atualização regulatória ANVISA',
            message: 'Nova resolução RDC nº 500/2024 sobre medicamentos genéricos foi publicada.',
            type: 'regulatory',
            created_at: '2024-01-09T14:15:00Z',
            read: false
          },
          {
            id: 'demo-3',
            title: 'Match de IA encontrado',
            message: 'Encontramos 3 laboratórios que atendem seus critérios de certificação ISO 17025.',
            type: 'ai_match',
            created_at: '2024-01-08T09:20:00Z',
            read: true
          },
          {
            id: 'demo-4',
            title: 'Novo recurso na biblioteca',
            message: 'Guia completo sobre Boas Práticas de Fabricação (BPF) foi adicionado à biblioteca.',
            type: 'knowledge',
            created_at: '2024-01-07T16:45:00Z',
            read: true
          }
        ];
        
        setNotifications(demoNotifications);
      } else {
        // Modo real - lista vazia por enquanto
        setNotifications([]);
      }
      
      setLoading(false);
    };

    loadNotifications();
  }, [isDemo]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'partnership':
        return <Users className="h-4 w-4" />;
      case 'regulatory':
        return <AlertTriangle className="h-4 w-4" />;
      case 'ai_match':
        return <MessageSquare className="h-4 w-4" />;
      case 'knowledge':
        return <BookOpen className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'partnership':
        return 'bg-blue-100 text-blue-800';
      case 'regulatory':
        return 'bg-red-100 text-red-800';
      case 'ai_match':
        return 'bg-green-100 text-green-800';
      case 'knowledge':
        return 'bg-purple-100 text-purple-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    return date.toLocaleDateString('pt-BR');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Notificações
                  </h1>
                  <p className="text-muted-foreground">
                    {isDemo 
                      ? `${unreadCount} não lidas - Dados demonstrativos`
                      : `${unreadCount} não lidas`
                    }
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline">
                  <Check className="h-4 w-4 mr-2" />
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </div>

          {isDemo && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <Info className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Modo Demonstração:</strong> Estas notificações são simuladas para mostrar 
                como funcionará o sistema de notificações da plataforma.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Nenhuma notificação
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {isDemo 
                      ? 'Ative o modo demonstração para ver exemplos de notificações.'
                      : 'Suas notificações aparecerão aqui quando houver atividade na plataforma.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-colors cursor-pointer hover:bg-muted/50 ${
                    !notification.read ? 'border-l-4 border-l-primary bg-muted/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base font-semibold">
                            {notification.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-foreground">
                      {notification.message}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {!isDemo && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Configurar Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Configure suas preferências de notificação para receber alertas 
                  sobre atividades importantes na plataforma.
                </p>
                <Button variant="outline" disabled>
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações (Em breve)
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default NotificationsPage;
