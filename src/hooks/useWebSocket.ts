
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

export const useWebSocket = (url?: string) => {
  const { user, session } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const websocket = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    if (!user || !session || !url) return;

    try {
      // In a real implementation, this would connect to your WebSocket server
      // For now, we'll simulate the connection
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        
        // Send authentication message using session access token
        ws.send(JSON.stringify({
          type: 'auth',
          token: session.access_token,
          userId: user.id
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          setTimeout(() => {
            connect();
          }, Math.pow(2, reconnectAttempts.current) * 1000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error');
      };

      websocket.current = ws;
    } catch (err) {
      console.error('Error creating WebSocket connection:', err);
      setError('Failed to connect');
    }
  };

  const disconnect = () => {
    if (websocket.current) {
      websocket.current.close();
      websocket.current = null;
    }
  };

  const sendMessage = (message: any) => {
    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
      websocket.current.send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    if (user && session && url) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, session, url]);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    connect,
    disconnect
  };
};
