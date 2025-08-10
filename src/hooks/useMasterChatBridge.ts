import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAIEventLogger } from '@/hooks/useAIEventLogger';

interface SendOptions {
  newThread?: boolean;
  title?: string;
  metadata?: Record<string, any>;
}

export const useMasterChatBridge = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logAIEvent } = useAIEventLogger();

  const ensureThreadId = useCallback(async (): Promise<string | null> => {
    try {
      const cached = localStorage.getItem('master_chat.thread_id');
      if (cached) return cached;
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id;
      if (!uid) return null;
      const { data, error } = await supabase.functions.invoke('master-chatbot', {
        body: { action: 'init_thread', user_id: uid, title: 'Chat Master AI' },
      });
      if (error) return null;
      const tid = data?.thread_id as string | null;
      if (tid) localStorage.setItem('master_chat.thread_id', tid);
      return tid;
    } catch {
      return null;
    }
  }, []);

  const sendToMasterChat = useCallback(async (message: string, opts: SendOptions = {}) => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id;
      if (!uid) throw new Error('Usuário não autenticado');

      let threadId: string | null = null;
      if (opts.newThread) {
        const { data, error } = await supabase.functions.invoke('master-chatbot', {
          body: { action: 'init_thread', user_id: uid, title: opts.title || 'Novo chat' },
        });
        if (error) throw error;
        threadId = data?.thread_id || null;
        if (threadId) localStorage.setItem('master_chat.thread_id', threadId);
      } else {
        threadId = await ensureThreadId();
      }

      await logAIEvent({ source: 'agent_module', action: 'send_to_chat', message: message.slice(0, 200), metadata: { newThread: !!opts.newThread, ...opts.metadata } });

      const { error: chatErr } = await supabase.functions.invoke('master-chatbot', {
        body: { action: 'chat', user_id: uid, thread_id: threadId, message },
      });
      if (chatErr) throw chatErr;

      toast({ title: 'Enviado ao chat', description: 'Conteúdo enviado ao Master AI.' });
      navigate('/chat');
    } catch (e: any) {
      toast({ title: 'Falha ao enviar', description: e?.message || 'Tente novamente', variant: 'destructive' });
    }
  }, [ensureThreadId, logAIEvent, navigate, toast]);

  return { sendToMasterChat };
};
