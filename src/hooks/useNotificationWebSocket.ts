
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Notification } from '@/types/notification';

interface WebSocketNotification {
  type: 'new_project_request' | 'project_accepted' | 'regulatory_alert' | 'system_notification';
  data: {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
  };
}

export const useNotificationWebSocket = (
  onNotificationReceived: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => void
) => {
  const { user } = useAuth();
  const [wsUrl, setWsUrl] = useState<string | undefined>(undefined);

  // Só definir URL se estiver em ambiente de desenvolvimento com servidor WebSocket real
  useEffect(() => {
    // Por enquanto, desabilitar WebSocket até configurar servidor real
    // if (process.env.NODE_ENV === 'development') {
    //   setWsUrl('ws://localhost:3001/ws');
    // }
    setWsUrl(undefined);
  }, []);

  const { lastMessage, isConnected } = useWebSocket(wsUrl);

  useEffect(() => {
    if (lastMessage && user) {
      const wsNotification = lastMessage as WebSocketNotification;
      
      switch (wsNotification.type) {
        case 'new_project_request':
          onNotificationReceived({
            title: 'Nova Solicitação de Projeto',
            message: `Você recebeu uma nova solicitação: ${wsNotification.data.title}`,
            type: 'info'
          });
          break;
        case 'project_accepted':
          onNotificationReceived({
            title: 'Projeto Aceito',
            message: `Sua solicitação foi aceita: ${wsNotification.data.title}`,
            type: 'success'
          });
          break;
        case 'regulatory_alert':
          onNotificationReceived({
            title: 'Alerta Regulatório',
            message: wsNotification.data.message,
            type: 'warning'
          });
          break;
        case 'system_notification':
          onNotificationReceived({
            title: wsNotification.data.title,
            message: wsNotification.data.message,
            type: wsNotification.data.type || 'info'
          });
          break;
        default:
          break;
      }
    }
  }, [lastMessage, onNotificationReceived, user]);

  return { isConnected };
};
