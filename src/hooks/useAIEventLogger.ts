
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LogAIEventParams {
  source: 'master_ai_hub' | 'ai_assistant' | 'ai_matching' | 'federal_learning' | 'project_management' | string;
  action?: string;
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

      console.log('[AI Event Logger] Logging enhanced event:', params);

      // Melhorar categorização automática
      const enhancedTopics = params.topics || [];
      const enhancedIntents = params.intents || [];

      // Auto-detectar tópicos baseado no conteúdo
      const messageText = params.message.toLowerCase();
      
      if (messageText.includes('regulat') || messageText.includes('anvisa')) {
        enhancedTopics.push('regulatory');
      }
      if (messageText.includes('projeto') || messageText.includes('cronograma')) {
        enhancedTopics.push('project_management');
      }
      if (messageText.includes('parceria') || messageText.includes('matching')) {
        enhancedTopics.push('ai_matching');
      }
      if (messageText.includes('farmacêut') || messageText.includes('medicamento')) {
        enhancedTopics.push('pharmaceutical');
      }

      const { error } = await supabase.from('ai_chat_events').insert({
        user_id: currentUser.id,
        source: params.source,
        action: params.action ?? 'message',
        message: params.message,
        intents: enhancedIntents,
        topics: enhancedTopics,
        project_id: params.projectId ?? null,
        metadata: {
          ...params.metadata,
          timestamp: new Date().toISOString(),
          platform_version: '2.0',
          integration_status: 'active'
        },
      });

      if (error) {
        console.error('[AI Event Logger] Failed to log event:', error, params);
      } else {
        console.log('[AI Event Logger] Enhanced event logged successfully');
        
        // Trigger análise de padrões se necessário
        try {
          await supabase.functions.invoke('ml-feedback-loop', {
            body: {
              action: 'analyze_patterns',
              user_id: currentUser.id,
              event_type: params.source
            }
          });
        } catch (mlError) {
          console.log('[AI Event Logger] ML analysis trigger failed (non-critical):', mlError);
        }
      }
    } catch (e) {
      console.error('[AI Event Logger] Unexpected error:', e, params);
    }
  }, []);

  return { logAIEvent };
};
