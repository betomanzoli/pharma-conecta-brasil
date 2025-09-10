
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CoordinatorInput {
  focus: string;
  priorities: string[];
  project_id?: string | null;
}

export interface AgentOutputRow {
  id: string;
  user_id: string;
  project_id: string | null;
  agent_type: string;
  input: any;
  output_md: string;
  kpis: any;
  handoff_to: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export const useAICoordinator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const coordinate = useCallback(async (input: CoordinatorInput): Promise<AgentOutputRow | null> => {
    setLoading(true);
    try {
      // Usar a nova edge function do orquestrador
      const { data, error } = await supabase.functions.invoke('ai-coordinator-orchestrator', {
        body: {
          project_id: input.project_id,
          focus: input.focus,
          priorities: input.priorities
        }
      });

      if (error) throw error;

      const result: AgentOutputRow = data.output || {
        id: crypto.randomUUID(),
        user_id: 'current-user',
        project_id: input.project_id || null,
        agent_type: 'coordinator',
        input,
        output_md: data.output?.output_md || 'Erro na geração do plano.',
        kpis: data.output?.kpis || { synthesized_items: 0 },
        handoff_to: [],
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      toast({ 
        title: 'Orquestração concluída', 
        description: 'Plano executivo consolidado gerado com validação de checkpoints.' 
      });
      return result;
    } catch (e: any) {
      toast({ title: 'Falha na coordenação', description: e?.message || 'Tente novamente.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { coordinate, loading };
};
