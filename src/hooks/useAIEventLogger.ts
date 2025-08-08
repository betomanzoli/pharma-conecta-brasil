import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LogAIEventParams {
  source: 'master_ai_hub' | 'ai_assistant' | string;
  action?: string; // 'message' | 'init' | 'search' | ...
  message: string;
  intents?: string[];
  topics?: string[];
  projectId?: string;
  metadata?: Record<string, any>;
}

export const useAIEventLogger = () => {
  const logAIEvent = useCallback(async (params: LogAIEventParams) => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      const currentUser = auth?.user;
      if (!currentUser) return; // silently ignore if not logged in

      await supabase.from('ai_chat_events').insert({
        user_id: currentUser.id,
        source: params.source,
        action: params.action ?? 'message',
        message: params.message,
        intents: params.intents ?? [],
        topics: params.topics ?? [],
        project_id: params.projectId ?? null,
        metadata: params.metadata ?? {},
      });
    } catch (e) {
      // Silent fail to avoid impacting UX
    }
  }, []);

  return { logAIEvent };
};
