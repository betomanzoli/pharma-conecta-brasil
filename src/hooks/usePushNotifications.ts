import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePushNotifications = () => {
  const { profile } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Verificar se o browser suporta notificações
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // Verificar se já tem permissão e usuário quer receber push
    if (permission === 'granted') {
      checkSubscriptionStatus();
    }
  }, [permission, profile?.id]);

  const checkSubscriptionStatus = async () => {
    if (!profile?.id) return;

    try {
      const { data } = await supabase
        .from('notification_preferences')
        .select('push_notifications')
        .eq('user_id', profile.id)
        .single();

      setIsSubscribed(data?.push_notifications || false);
    } catch (error) {
      console.error('Erro ao verificar status de inscrição:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Atualizar preferências no banco
        await supabase
          .from('notification_preferences')
          .upsert({
            user_id: profile?.id,
            push_notifications: true,
            updated_at: new Date().toISOString(),
          });
        
        setIsSubscribed(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  };

  const showNotification = async (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted' || !isSubscribed) {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'pharmanet-notification',
        requireInteraction: false,
        ...options,
      });

      // Auto-fechar após 5 segundos
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Focar na aba quando clicar na notificação
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
    }
  };

  const disableNotifications = async () => {
    try {
      await supabase
        .from('notification_preferences')
        .upsert({
          user_id: profile?.id,
          push_notifications: false,
          updated_at: new Date().toISOString(),
        });
      
      setIsSubscribed(false);
    } catch (error) {
      console.error('Erro ao desabilitar notificações:', error);
    }
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    showNotification,
    disableNotifications,
  };
};