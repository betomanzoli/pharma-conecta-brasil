import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertTriangle, Info, Clock, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isDemoMode, demoData } from '@/utils/demoMode';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
}

const NotificationsPage = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const isDemo = isDemoMode();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        if (isDemo) {
          // Use demo data and ensure all required properties are present,
          // without accessing n.read (which doesn't exist on demo data type)
          const demoNotifications = demoData.notifications.map(n => ({
            id: n.id || `demo-${Math.random().toString(36).substr(2, 9)}`,
            title: n.title,
            message: n.message,
            type: (n.type as 'info' | 'warning' | 'success' | 'error') ?? 'info',
            read: false,
            created_at: n.created_at || new Date().toISOString(),
          }));
          setNotifications(demoNotifications);
        } else {
          // Here would be the real Supabase call
          // const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
          setNotifications([]);
        }
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as notificações',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [isDemo, toast]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    
    if (!isDemo) {
      // Here would be the real Supabase call
      // await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    toast({
      title: 'Sucesso',
      description: 'Todas as notificações foram marcadas como lidas'
    });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    toast({
      title: 'Notificação removida',
      description: 'A notificação foi excluída com sucesso'
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Carregando notificações...</p>
              </div>
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
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Bell className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Notificações</h1>
                  <p className="text-muted-foreground">
                    Acompanhe suas atualizações e lembretes importantes
                  </p>
                </div>
              </div>
              
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline">
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total</span>
                      <Badge variant="secondary">{notifications.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Não lidas</span>
                      <Badge className="bg-blue-100 text-blue-800">{unreadCount}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Lidas</span>
                      <Badge variant="outline">{notifications.length - unreadCount}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              {notifications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma notificação
                    </h3>
                    <p className="text-gray-500">
                      {isDemo 
                        ? 'No modo demo, algumas notificações de exemplo apareceriam aqui.' 
                        : 'Você não possui notificações no momento.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => {
                    const Icon = getIcon(notification.type);
                    return (
                      <Card 
                        key={notification.id} 
                        className={`${!notification.read ? 'ring-2 ring-blue-200' : ''} ${getTypeColor(notification.type)}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <Icon className="h-5 w-5 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {notification.title}
                                  {!notification.read && (
                                    <Badge className="ml-2 bg-blue-500 text-white text-xs">Nova</Badge>
                                  )}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(notification.created_at).toLocaleString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <Button
                                  onClick={() => markAsRead(notification.id)}
                                  variant="ghost"
                                  size="sm"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                onClick={() => deleteNotification(notification.id)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default NotificationsPage;
