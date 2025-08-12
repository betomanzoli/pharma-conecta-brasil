
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface SendToChatOptions {
  newThread?: boolean;
  title?: string;
  metadata?: Record<string, any>;
}

export const useMasterChatBridge = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const sendToMasterChat = useCallback(async (
    content: string, 
    options: SendToChatOptions = {}
  ) => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) {
        toast({ title: 'Erro', description: 'Usuário não autenticado', variant: 'destructive' });
        return;
      }

      const { newThread = false, title, metadata = {} } = options;

      if (newThread) {
        // Criar nova thread
        const { data, error } = await supabase.functions.invoke('master-chatbot', {
          body: { 
            action: 'init_thread', 
            user_id: auth.user.id, 
            title: title || 'Resultado de IA',
            message: content
          }
        });

        if (error) throw error;

        // Enviar mensagem inicial
        await supabase.functions.invoke('master-chatbot', {
          body: { 
            action: 'chat', 
            user_id: auth.user.id, 
            thread_id: data.thread_id,
            message: content
          }
        });

        toast({ 
          title: 'Sucesso', 
          description: 'Novo chat criado com o resultado' 
        });

        // Navegar para o chat
        navigate('/chat');
      } else {
        // Buscar thread ativa ou criar nova
        const { data: threads } = await supabase.functions.invoke('master-chatbot', {
          body: { action: 'list_threads', user_id: auth.user.id }
        });

        let threadId = threads?.threads?.[0]?.id;

        if (!threadId) {
          const { data } = await supabase.functions.invoke('master-chatbot', {
            body: { 
              action: 'init_thread', 
              user_id: auth.user.id, 
              title: 'Chat Principal'
            }
          });
          threadId = data.thread_id;
        }

        // Enviar mensagem
        await supabase.functions.invoke('master-chatbot', {
          body: { 
            action: 'chat', 
            user_id: auth.user.id, 
            thread_id: threadId,
            message: content
          }
        });

        toast({ 
          title: 'Sucesso', 
          description: 'Resultado enviado para o chat' 
        });

        navigate('/chat');
      }
    } catch (error: any) {
      toast({ 
        title: 'Erro', 
        description: error?.message || 'Falha ao enviar para chat',
        variant: 'destructive' 
      });
    }
  }, [toast, navigate]);

  return { sendToMasterChat };
};
