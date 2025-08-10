
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TechRegulatoryInput {
  product_type: string;
  route_or_manufacturing?: string;
  dosage_form?: string;
  target_regions?: string;
  clinical_stage?: string;
  reference_product?: string;
  known_risks?: string;
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

export const useAITechRegulatory = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const analyzeTechRegulatory = useCallback(async (input: TechRegulatoryInput): Promise<AgentOutputRow | null> => {
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-technical-regulatory', {
        body: input,
      });
      if (fnError) throw fnError;
      const row = data?.output as AgentOutputRow | undefined;
      toast({ title: 'Avaliação concluída', description: 'Análise técnico-regulatória gerada.' });
      return row ?? null;
    } catch (e: any) {
      toast({ title: 'Falha na avaliação', description: e?.message || 'Tente novamente.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { analyzeTechRegulatory, loading };
};
