import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CoordinatorInput {
  project_id?: string | null;
  focus?: string;
  priorities?: string[];
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
      const { data, error: fnError } = await supabase.functions.invoke('ai-coordinator-orchestrator', {
        body: input,
      });
      if (fnError) throw fnError;
      const row = data?.output as AgentOutputRow | undefined;
      toast({ title: 'Plano de coordenação', description: 'Resumo e ações priorizadas prontas.' });
      return row ?? null;
    } catch (e: any) {
      toast({ title: 'Falha na coordenação', description: e?.message || 'Tente novamente.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { coordinate, loading };
};
