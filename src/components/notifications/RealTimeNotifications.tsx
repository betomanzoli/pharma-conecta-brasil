import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Clock, 
  AlertTriangle, 
  Info, 
  Users, 
  BookOpen,
  TrendingUp,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'mentorship' | 'forum' | 'knowledge' | 'regulatory' | 'marketing';
  read: boolean;
  created_at: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface RealTimeNotificationsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Nova Sessão de Mentoria',
        message: 'Dr. Carlos Silva agendou uma sessão para amanhã às 14:00',
        type: 'mentorship',
        read: false,
        created_at: '2024-01-15T10:30:00Z',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Alerta Regulatório',
        message: 'Novo RDC da ANVISA sobre medicamentos genéricos',
        type: 'regulatory',
        read: false,
        created_at: '2024-01-15T09:15:00Z',
        priority: 'urgent'
      },
      {
        id: '3',
        title: 'Resposta no Fórum',
        message: 'Alguém respondeu ao seu tópico sobre bioequivalência',
        type: 'forum',
        read: true,
        created_at: '2024-01-15T08:45:00Z',
        priority: 'medium'
      }
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    toast.success('Notificação marcada como lida');
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast.success('Todas as notificações foram marcadas como lidas');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'mentorship': return Users;
      case 'forum': return Users;
      case 'knowledge': return BookOpen;
      case 'regulatory': return AlertTriangle;
      case 'system': return Info;
      case 'marketing': return TrendingUp;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mentorship': return 'bg-blue-100 text-blue-800';
      case 'forum': return 'bg-purple-100 text-purple-800';
      case 'knowledge': return 'bg-green-100 text-green-800';
      case 'regulatory': return 'bg-red-100 text-red-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'marketing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mentorship': return 'Mentoria';
      case 'forum': return 'Fórum';
      case 'knowledge': return 'Biblioteca';
      case 'regulatory': return 'Regulatório';
      case 'system': return 'Sistema';
      case 'marketing': return 'Marketing';
      default: return 'Geral';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notificações</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notificações</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Marcar todas
              </Button>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma notificação ainda
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {notifications.map((notification, index) => {
                const Icon = getIcon(notification.type);
                
                return (
                  <div key={notification.id}>
                    <div 
                      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={`text-xs ${getTypeColor(notification.type)}`}>
                              {getTypeLabel(notification.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </span>
                          </div>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RealTimeNotifications;