
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // WebSocket connection for real-time notifications
  const { lastMessage, isConnected } = useWebSocket(
    process.env.NODE_ENV === 'development' 
      ? 'ws://localhost:3001/ws' 
      : 'wss://your-websocket-server.com/ws'
  );

  // Helper function to validate and convert notification type
  const validateNotificationType = (type: string): 'info' | 'success' | 'warning' | 'error' => {
    if (type === 'info' || type === 'success' || type === 'warning' || type === 'error') {
      return type;
    }
    return 'info'; // Default fallback
  };

  // Helper function to convert database notification to typed notification
  const convertToNotification = (dbNotification: any): Notification => ({
    id: dbNotification.id,
    title: dbNotification.title,
    message: dbNotification.message,
    type: validateNotificationType(dbNotification.type),
    read: dbNotification.read,
    created_at: dbNotification.created_at
  });

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'new_project_request':
          addNotification({
            title: 'Nova Solicitação de Projeto',
            message: `Você recebeu uma nova solicitação: ${lastMessage.data.title}`,
            type: 'info'
          });
          break;
        case 'project_accepted':
          addNotification({
            title: 'Projeto Aceito',
            message: `Sua solicitação foi aceita: ${lastMessage.data.title}`,
            type: 'success'
          });
          break;
        case 'regulatory_alert':
          addNotification({
            title: 'Alerta Regulatório',
            message: lastMessage.data.message,
            type: 'warning'
          });
          break;
        default:
          break;
      }
    }
  }, [lastMessage]);

  // Load notifications from database
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Set up real-time subscription for notifications
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            const newNotification = convertToNotification(payload.new);
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show toast notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
              variant: newNotification.type === 'error' ? 'destructive' : 'default'
            });
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      // Convert database notifications to typed notifications
      const typedNotifications = (data || []).map(convertToNotification);
      setNotifications(typedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: user.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            read: false
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding notification:', error);
        return;
      }

      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' ? 'destructive' : 'default'
      });

    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      );
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

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotifications = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing notifications:', error);
        return;
      }

      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
