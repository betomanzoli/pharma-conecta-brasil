import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, MessageCircle, Award, AlertCircle } from 'lucide-react';
import { usePushNotifications } from './usePushNotifications';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export const useRealTimeNotifications = () => {
  const { profile } = useAuth();
  const { showNotification: showPushNotification, isSubscribed } = usePushNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Buscar notificações iniciais
  const fetchNotifications = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Marcar notificação como lida
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase.rpc('mark_notification_read', {
        notification_id: notificationId
      });

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    try {
      const { data, error } = await supabase.rpc('mark_all_notifications_read');
      
      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      return data;
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      return 0;
    }
  };

  // Configurar escuta em tempo real
  useEffect(() => {
    if (!profile?.id) return;

    fetchNotifications();

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);

          // Mostrar toast para nova notificação
          const getIcon = (type: string) => {
            switch (type) {
              case 'mentorship': return Award;
              case 'forum': return MessageCircle;
              case 'system': return AlertCircle;
              default: return Bell;
            }
          };

          const Icon = getIcon(newNotification.type);

          toast(newNotification.title, {
            description: newNotification.message,
            action: {
              label: 'Ver',
              onClick: () => markAsRead(newNotification.id)
            }
          });

          // Mostrar notificação push se habilitada e usuário não estiver na aba
          if (isSubscribed && document.hidden) {
            showPushNotification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico',
              tag: `notification-${newNotification.id}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          
          setNotifications(prev => 
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          );
          
          if (updatedNotification.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};