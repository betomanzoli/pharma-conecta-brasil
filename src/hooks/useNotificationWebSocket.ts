
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Notification } from '@/types/notification';

interface WebSocketMessage {
  type: 'notification' | 'ping' | 'error';
  data?: Omit<Notification, 'id' | 'created_at' | 'read'>;
  error?: string;
}

export const useNotificationWebSocket = (
  onNotificationReceived: (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => void
) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    if (!user || wsRef.current?.readyState === WebSocket.CONNECTING) return;

    try {
      // Simular conexão WebSocket para notificações em tempo real
      const ws = new WebSocket(`wss://echo.websocket.org/`);
      
      ws.onopen = () => {
        console.log('WebSocket conectado para notificações');
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        // Enviar mensagem de identificação
        ws.send(JSON.stringify({
          type: 'identify',
          userId: user.id
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          if (message.type === 'notification' && message.data) {
            onNotificationReceived(message.data);
          }
        } catch (error) {
          console.error('Erro ao processar mensagem WebSocket:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket desconectado:', event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;
        
        // Tentar reconectar se não foi um fechamento intencional
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error);
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Desconexão intencional');
      wsRef.current = null;
    }
    
    setIsConnected(false);
  };

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    if (user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user]);

  // Ping periódico para manter conexão viva
  useEffect(() => {
    if (isConnected) {
      const pingInterval = setInterval(() => {
        sendMessage({ type: 'ping' });
      }, 30000); // Ping a cada 30 segundos

      return () => clearInterval(pingInterval);
    }
  }, [isConnected]);

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage
  };
};
