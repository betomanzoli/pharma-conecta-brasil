
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAIEventLogger } from './useAIEventLogger';

interface UserPreferences {
  user_type?: string;
  expertise_areas?: string[];
  communication_style?: string;
}

interface AIIntegrationContext {
  userId: string;
  currentProject?: string;
  conversationHistory?: string;
  userPreferences?: UserPreferences;
  businessContext?: string;
}

export const useAIIntegration = () => {
  const { toast } = useToast();
  const { logAIEvent } = useAIEventLogger();

  const getIntegratedContext = useCallback(async (userId: string): Promise<AIIntegrationContext> => {
    try {
      // Buscar contexto do usuário de múltiplas fontes
      const sb: any = supabase as any;
      const [profileData, recentEvents, activeProjects] = await Promise.all([
        // Perfil do usuário
        sb.from('profiles').select('*').eq('id', userId).single(),
        
        // Eventos recentes de IA
        sb
          .from('ai_chat_events')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20),
          
        // Projetos ativos
        sb
          .from('projects')
          .select('*')
          .eq('user_id', userId)
          .in('status', ['active', 'planning'])
          .limit(5)
      ]);

      const context: AIIntegrationContext = {
        userId,
        userPreferences: {
          user_type: profileData.data?.user_type || 'professional',
          expertise_areas: [],
          communication_style: 'professional'
        },
        businessContext: `Usuário é ${profileData.data?.user_type || 'profissional'} especializado em farmacêutica.`,
      };

      // Adicionar contexto de projetos ativos
      if (activeProjects.data && activeProjects.data.length > 0) {
        context.currentProject = activeProjects.data[0].id;
        context.businessContext += ` Possui ${activeProjects.data.length} projeto(s) ativo(s).`;
      }

      // Adicionar insights dos eventos recentes
      if (recentEvents.data && recentEvents.data.length > 0) {
        const recentTopics = recentEvents.data
          .flatMap(event => event.topics || [])
          .filter((topic, index, arr) => arr.indexOf(topic) === index);
        
        context.businessContext += ` Tópicos recentes de interesse: ${recentTopics.join(', ')}.`;
      }

      return context;
    } catch (error) {
      console.error('Erro ao buscar contexto integrado:', error);
      return { userId };
    }
  }, []);

  const executeIntegratedAI = useCallback(async (
    action: 'chat' | 'matching' | 'project_analysis' | 'regulatory_check',
    input: unknown,
    context?: AIIntegrationContext
  ) => {
    try {
      let functionName = '';
      const enhancedInput: Record<string, unknown> = { ...input as Record<string, unknown> };

      // Adicionar contexto integrado ao input
      if (context) {
        enhancedInput.context = context;
        enhancedInput.user_context = context.businessContext;
      }

      switch (action) {
        case 'chat':
          functionName = 'ai-chatbot';
          enhancedInput.config = {
            ...(enhancedInput.config as Record<string, unknown> || {}),
            systemPrompt: `${(enhancedInput.config as any)?.systemPrompt || ''}\n\nContexto do usuário: ${context?.businessContext || ''}`
          };
          break;
          
        case 'matching':
          functionName = 'ai-matching-enhanced';
          enhancedInput.preferences = {
            ...(enhancedInput.preferences as Record<string, unknown> || {}),
            user_context: context
          };
          break;
          
        case 'project_analysis':
          functionName = 'ai-project-analyst';
          enhancedInput.project_context = context?.currentProject;
          break;
          
        case 'regulatory_check':
          functionName = 'ai-technical-regulatory';
          enhancedInput.user_profile = context?.userPreferences;
          break;
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: enhancedInput
      });

      if (error) throw error;

      // Log da integração
      await logAIEvent({
        source: 'ai_integration',
        action: action,
        message: `Executed integrated AI action: ${action}`,
        metadata: {
          function_used: functionName,
          context_applied: !!context,
          input_size: JSON.stringify(input).length
        }
      });

      return data;

    } catch (error) {
      console.error(`Erro na integração AI (${action}):`, error);
      toast({
        title: 'Erro na IA',
        description: `Falha ao executar ${action}. Sistema integrado em manutenção.`,
        variant: 'destructive'
      });
      throw error;
    }
  }, [logAIEvent, toast]);

  const syncUserLearning = useCallback(async (userId: string, learningData: unknown) => {
    try {
      // Atualizar perfil de aprendizado do usuário
      await supabase.functions.invoke('federal-learning-system', {
        body: {
          action: 'update_user_profile',
          user_id: userId,
          learning_data: learningData
        }
      });

      // Trigger atualização do sistema de matching
      await supabase.functions.invoke('ai-matching-monitor', {
        body: {
          action: 'update_user_preferences',
          user_id: userId
        }
      });

    } catch (error) {
      console.error('Erro na sincronização de aprendizado:', error);
    }
  }, []);

  return {
    getIntegratedContext,
    executeIntegratedAI,
    syncUserLearning
  };
};
