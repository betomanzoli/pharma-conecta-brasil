import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

interface UseRealTimeNotificationsProps {
  onNotificationReceived: (notification: Notification) => void;
  onNotificationUpdated: (notification: Notification) => void;
}

export const useRealTimeNotifications = ({
  onNotificationReceived,
  onNotificationUpdated
}: UseRealTimeNotificationsProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!profile?.id) return;

    const setupChannel = () => {
      // Cleanup existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      const channel = supabase
        .channel(`notifications-${profile.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${profile.id}`
          },
          (payload) => {
            const notification = payload.new as Notification;
            onNotificationReceived(notification);
            
            // Show toast notification
            toast({
              title: notification.title,
              description: notification.message,
              variant: notification.type === 'error' ? 'destructive' : 'default'
            });
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
            const notification = payload.new as Notification;
            onNotificationUpdated(notification);
          }
        )
        .subscribe();

      channelRef.current = channel;
    };

    setupChannel();

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [profile?.id, onNotificationReceived, onNotificationUpdated, toast]);

  return {
    isConnected: !!channelRef.current
  };
};