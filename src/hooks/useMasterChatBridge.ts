
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ChatOptions {
  newThread?: boolean;
  title?: string;
  metadata?: Record<string, any>;
}

export const useMasterChatBridge = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const sendToMasterChat = useCallback((message: string, options?: ChatOptions) => {
    try {
      // Store the message and options in sessionStorage for the chat page to pick up
      sessionStorage.setItem('pendingChatMessage', JSON.stringify({
        message,
        options: options || {}
      }));
      
      // Navigate to chat page
      navigate('/chat');
      
      toast({
        title: 'Enviado para o chat',
        description: 'Redirecionando para o chat principal...'
      });
    } catch (error) {
      console.error('Error sending to master chat:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar para o chat',
        variant: 'destructive'
      });
    }
  }, [navigate, toast]);

  return { sendToMasterChat };
};
