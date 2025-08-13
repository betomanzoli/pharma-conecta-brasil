
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
      
      if (!currentUser) {
        console.log('[AI Event Logger] User not authenticated, skipping log:', params);
        return;
      }

      console.log('[AI Event Logger] Logging event:', params);

      const { error } = await supabase.from('ai_chat_events').insert({
        user_id: currentUser.id,
        source: params.source,
        action: params.action ?? 'message',
        message: params.message,
        intents: params.intents ?? [],
        topics: params.topics ?? [],
        project_id: params.projectId ?? null,
        metadata: params.metadata ?? {},
      });

      if (error) {
        console.error('[AI Event Logger] Failed to log event:', error, params);
      } else {
        console.log('[AI Event Logger] Event logged successfully');
      }
    } catch (e) {
      console.error('[AI Event Logger] Unexpected error:', e, params);
    }
  }, []);

  return { logAIEvent };
};
