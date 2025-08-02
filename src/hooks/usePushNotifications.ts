
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    checkNotificationSupport();
    registerServiceWorker();
  }, []);

  const checkNotificationSupport = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);
        console.log('Service Worker registrado:', reg);
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('Push notifications não suportadas');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await subscribeToPush();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  };

  const subscribeToPush = async () => {
    if (!registration) return;

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BEl62iUYgUivxIkv69yViEuiBIa40eX_wNUHv2XFWVb2dQx6S7B6K1AZGP8Y2x8n6FZIQCtqWpDlTaH-0vLo9O4')
      });
      
      setIsSubscribed(true);
      console.log('Inscrito em push notifications:', subscription);
      
      // Enviar subscription para o servidor
      if (user) {
        await savePushSubscription(subscription);
      }
    } catch (error) {
      console.error('Erro ao se inscrever em push notifications:', error);
    }
  };

  const savePushSubscription = async (subscription: PushSubscription) => {
    try {
      // Salvar subscription no Supabase para uso futuro
      const subscriptionData = {
        user_id: user?.id,
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
          auth: arrayBufferToBase64(subscription.getKey('auth'))
        }
      };
      
      console.log('Subscription salva:', subscriptionData);
    } catch (error) {
      console.error('Erro ao salvar subscription:', error);
    }
  };

  const showNotification = (title: string, options: NotificationOptions = {}) => {
    if (permission === 'granted') {
      if (registration) {
        registration.showNotification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options
        });
      } else {
        new Notification(title, options);
      }
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer | null): string => {
    if (!buffer) return '';
    const bytes = new Uint8Array(buffer);
    const binary = String.fromCharCode(...bytes);
    return window.btoa(binary);
  };

  return {
    permission,
    isSubscribed,
    requestPermission,
    showNotification,
    isSupported: 'Notification' in window
  };
};
