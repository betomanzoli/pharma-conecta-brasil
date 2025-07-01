
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
  const { lastMessage, isConnected } = useWebSocket(
    process.env.NODE_ENV === 'development' 
      ? 'ws://localhost:3001/ws' 
      : 'wss://your-websocket-server.com/ws'
  );

  useEffect(() => {
    if (lastMessage) {
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
  }, [lastMessage, onNotificationReceived]);

  return { isConnected };
};
