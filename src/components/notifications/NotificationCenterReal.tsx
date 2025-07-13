import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  Filter,
  Search,
  X,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'mentorship' | 'forum' | 'knowledge' | 'regulatory' | 'marketing';
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_url?: string;
  metadata?: any;
  created_at: string;
}

interface NotificationPreferences {
  mentorship_enabled: boolean;
  forum_enabled: boolean;
  system_enabled: boolean;
  knowledge_enabled: boolean;
  marketing_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

const NotificationCenterReal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    mentorship_enabled: true,
    forum_enabled: true,
    system_enabled: true,
    knowledge_enabled: true,
    marketing_enabled: false,
    email_notifications: true,
    push_notifications: true
  });
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadPreferences();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Mapear dados para garantir compatibilidade com interface
      const mappedNotifications: Notification[] = (data || []).map((notification: any) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type as 'system' | 'mentorship' | 'forum' | 'knowledge' | 'regulatory' | 'marketing',
        read: notification.read || false,
        priority: (notification.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent',
        action_url: notification.action_url || undefined,
        metadata: notification.metadata || {},
        created_at: notification.created_at
      }));

      setNotifications(mappedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: "Erro ao carregar notificações",
        description: "Não foi possível carregar suas notificações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences({
          mentorship_enabled: data.mentorship_enabled,
          forum_enabled: data.forum_enabled,
          system_enabled: data.system_enabled,
          knowledge_enabled: data.knowledge_enabled,
          marketing_enabled: data.marketing_enabled,
          email_notifications: data.email_notifications,
          push_notifications: data.push_notifications
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );

      toast({
        title: "Notificação marcada como lida"
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );

      toast({
        title: "Todas as notificações foram marcadas como lidas"
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const updatePreferences = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({ 
          user_id: user.id,
          [key]: value 
        });

      if (error) throw error;

      setPreferences(prev => ({ ...prev, [key]: value }));
      toast({
        title: "Preferências atualizadas"
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
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
                                    {new Date(notification.created_at).toLocaleString('pt-BR')}
                                  </span>
                                </div>
                                
                                {notification.action_url && (
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
              <CardTitle>Preferências de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mentorship">Mentoria</Label>
                  <Switch
                    id="mentorship"
                    checked={preferences.mentorship_enabled}
                    onCheckedChange={(checked) => updatePreferences('mentorship_enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="forum">Fórum</Label>
                  <Switch
                    id="forum"
                    checked={preferences.forum_enabled}
                    onCheckedChange={(checked) => updatePreferences('forum_enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="system">Sistema</Label>
                  <Switch
                    id="system"
                    checked={preferences.system_enabled}
                    onCheckedChange={(checked) => updatePreferences('system_enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="knowledge">Biblioteca</Label>
                  <Switch
                    id="knowledge"
                    checked={preferences.knowledge_enabled}
                    onCheckedChange={(checked) => updatePreferences('knowledge_enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing">Marketing</Label>
                  <Switch
                    id="marketing"
                    checked={preferences.marketing_enabled}
                    onCheckedChange={(checked) => updatePreferences('marketing_enabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenterReal;