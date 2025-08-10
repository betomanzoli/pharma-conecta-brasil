
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BusinessCaseInput {
  opportunity: string;
  product_type?: string;
  target_market?: string;
  competitors?: string;
  differentiation?: string;
  investment_range?: string;
  timeframe?: string;
  risks?: string;
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

export const useAIBusinessStrategist = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const analyzeBusinessCase = useCallback(async (input: BusinessCaseInput): Promise<AgentOutputRow | null> => {
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-business-strategist', {
        body: input,
      });
      if (fnError) throw fnError;
      const row = data?.output as AgentOutputRow | undefined;
      toast({ title: 'Análise gerada', description: 'Business case e SWOT prontos.' });
      return row ?? null;
    } catch (e: any) {
      toast({ title: 'Falha na análise', description: e?.message || 'Tente novamente.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { analyzeBusinessCase, loading };
};
