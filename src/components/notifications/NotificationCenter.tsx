import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  Settings,
  Filter,
  Search,
  X,
  MoreVertical
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'mentorship' | 'forum' | 'knowledge' | 'regulatory' | 'marketing';
  read: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: {
    sender?: string;
    entityId?: string;
    entityType?: string;
  };
}

interface NotificationPreferences {
  mentorshipEnabled: boolean;
  forumEnabled: boolean;
  systemEnabled: boolean;
  knowledgeEnabled: boolean;
  marketingEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    mentorshipEnabled: true,
    forumEnabled: true,
    systemEnabled: true,
    knowledgeEnabled: true,
    marketingEnabled: false,
    emailNotifications: true,
    pushNotifications: true
  });
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    loadPreferences();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    // Simular carregamento de notificações
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Nova Sessão de Mentoria Agendada',
        message: 'Você tem uma sessão com Dr. Carlos Silva agendada para amanhã às 14:00',
        type: 'mentorship',
        read: false,
        createdAt: '2024-01-15T10:30:00Z',
        priority: 'high',
        actionUrl: '/mentorship',
        metadata: { sender: 'Dr. Carlos Silva', entityType: 'session' }
      },
      {
        id: '2',
        title: 'Novo Alerta Regulatório ANVISA',
        message: 'Publicado novo RDC sobre medicamentos genéricos - Prazo: 30 dias',
        type: 'regulatory',
        read: false,
        createdAt: '2024-01-15T09:15:00Z',
        priority: 'urgent',
        actionUrl: '/regulatory',
        metadata: { entityType: 'regulation' }
      },
      {
        id: '3',
        title: 'Resposta no Fórum',
        message: 'Alguém respondeu ao seu tópico "Bioequivalência e Dissolução"',
        type: 'forum',
        read: true,
        createdAt: '2024-01-15T08:45:00Z',
        priority: 'medium',
        actionUrl: '/forums',
        metadata: { entityType: 'forum_reply' }
      },
      {
        id: '4',
        title: 'Novo Recurso na Biblioteca',
        message: 'Adicionado: "Guia Completo de Validação Analítica" por Dra. Ana Costa',
        type: 'knowledge',
        read: true,
        createdAt: '2024-01-14T16:20:00Z',
        priority: 'low',
        actionUrl: '/knowledge',
        metadata: { sender: 'Dra. Ana Costa', entityType: 'knowledge_item' }
      },
      {
        id: '5',
        title: 'Sistema Atualizado',
        message: 'Nova versão do sistema disponível com melhorias de performance e segurança',
        type: 'system',
        read: false,
        createdAt: '2024-01-14T12:00:00Z',
        priority: 'medium',
        actionUrl: '/dashboard'
      },
      {
        id: '6',
        title: 'Oportunidade de Parceria',
        message: 'Nova empresa farmacêutica busca laboratório para estudos de bioequivalência',
        type: 'marketing',
        read: true,
        createdAt: '2024-01-14T10:30:00Z',
        priority: 'medium',
        actionUrl: '/marketplace'
      }
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  };

  const loadPreferences = async () => {
    // Simular carregamento de preferências
    // Em produção, carregaria do Supabase
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

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
    toast.success('Notificação removida');
  };

  const updatePreferences = async (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast.success('Preferências atualizadas');
  };

  const getNotificationIcon = (type: string) => {
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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'mentorship': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'forum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'knowledge': return 'bg-green-100 text-green-800 border-green-200';
      case 'regulatory': return 'bg-red-100 text-red-800 border-red-200';
      case 'system': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'marketing': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notif.read) ||
      (filter === 'read' && notif.read) ||
      notif.type === filter;
    
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Central de Notificações</h1>
            <p className="text-muted-foreground">
              Gerencie suas notificações e preferências
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-sm">
            {unreadCount} não lidas
          </Badge>
        )}
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filtros</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Marcar Todas como Lidas
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar notificações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    Todas
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                  >
                    Não Lidas
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Tipo
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilter('all')}>
                        Todas
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('mentorship')}>
                        Mentoria
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('forum')}>
                        Fórum
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('knowledge')}>
                        Biblioteca
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('regulatory')}>
                        Regulatório
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('system')}>
                        Sistema
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Notificações ({filteredNotifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {loading ? (
                  <div className="p-6 space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex space-x-4">
                          <div className="h-10 w-10 bg-muted rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma notificação encontrada</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-muted/50 transition-colors ${
                            !notification.read ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="relative">
                              <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  {!notification.read && (
                                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                                  )}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {!notification.read && (
                                        <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                          <Check className="h-4 w-4 mr-2" />
                                          Marcar como Lida
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem 
                                        onClick={() => deleteNotification(notification.id)}
                                        className="text-destructive"
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Remover
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {new Date(notification.createdAt).toLocaleString('pt-BR')}
                                  </span>
                                  {notification.metadata?.sender && (
                                    <>
                                      <span>•</span>
                                      <span>{notification.metadata.sender}</span>
                                    </>
                                  )}
                                </div>
                                
                                {notification.actionUrl && (
                                  <Button variant="outline" size="sm">
                                    Ver Detalhes
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Preferências de Notificação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Types */}
              <div className="space-y-4">
                <h4 className="font-medium">Tipos de Notificação</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="mentorship">Mentoria</Label>
                      <p className="text-sm text-muted-foreground">
                        Sessões agendadas, avaliações e mensagens de mentores
                      </p>
                    </div>
                    <Switch
                      id="mentorship"
                      checked={preferences.mentorshipEnabled}
                      onCheckedChange={(value) => updatePreferences('mentorshipEnabled', value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="forum">Fórum</Label>
                      <p className="text-sm text-muted-foreground">
                        Respostas aos seus tópicos e curtidas
                      </p>
                    </div>
                    <Switch
                      id="forum"
                      checked={preferences.forumEnabled}
                      onCheckedChange={(value) => updatePreferences('forumEnabled', value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="knowledge">Biblioteca de Conhecimento</Label>
                      <p className="text-sm text-muted-foreground">
                        Novos recursos, avaliações e downloads
                      </p>
                    </div>
                    <Switch
                      id="knowledge"
                      checked={preferences.knowledgeEnabled}
                      onCheckedChange={(value) => updatePreferences('knowledgeEnabled', value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="system">Sistema</Label>
                      <p className="text-sm text-muted-foreground">
                        Atualizações do sistema e alertas importantes
                      </p>
                    </div>
                    <Switch
                      id="system"
                      checked={preferences.systemEnabled}
                      onCheckedChange={(value) => updatePreferences('systemEnabled', value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="marketing">Marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        Oportunidades de negócio e parcerias
                      </p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={preferences.marketingEnabled}
                      onCheckedChange={(value) => updatePreferences('marketingEnabled', value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Delivery Methods */}
              <div className="space-y-4">
                <h4 className="font-medium">Métodos de Entrega</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="email">Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações por email
                      </p>
                    </div>
                    <Switch
                      id="email"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(value) => updatePreferences('emailNotifications', value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="push">Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações push no navegador
                      </p>
                    </div>
                    <Switch
                      id="push"
                      checked={preferences.pushNotifications}
                      onCheckedChange={(value) => updatePreferences('pushNotifications', value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;