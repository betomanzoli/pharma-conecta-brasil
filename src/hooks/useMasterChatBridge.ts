
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useMasterChatBridge = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const redirectToChat = useCallback((prompt: string, context?: any) => {
    try {
      // Store the prompt and context in localStorage for the chat page to pick up
      const chatData = {
        prompt,
        context,
        timestamp: Date.now(),
        source: 'prompt_library'
      };
      
      localStorage.setItem('chat_bridge_data', JSON.stringify(chatData));
      
      // Navigate to chat page
      navigate('/chat');
      
      toast({
        title: 'Redirecionando para o Chat',
        description: 'Prompt carregado no Master AI Assistant'
      });
    } catch (error) {
      console.error('Error redirecting to chat:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível redirecionar para o chat',
        variant: 'destructive'
      });
    }
  }, [navigate, toast]);

  const getBridgeData = useCallback(() => {
    try {
      const stored = localStorage.getItem('chat_bridge_data');
      if (stored) {
        const data = JSON.parse(stored);
        // Clear the data after retrieval
        localStorage.removeItem('chat_bridge_data');
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving bridge data:', error);
      localStorage.removeItem('chat_bridge_data');
      return null;
    }
  }, []);

  return {
    redirectToChat,
    getBridgeData
  };
};
