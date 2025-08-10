import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DocAssistantInput {
  doc_type: string;
  template_name?: string;
  fields?: Record<string, any>;
  context?: string;
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

export const useAIDocumentAssistant = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const generateDocument = useCallback(async (input: DocAssistantInput): Promise<AgentOutputRow | null> => {
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-document-assistant', {
        body: input,
      });
      if (fnError) throw fnError;
      const row = data?.output as AgentOutputRow | undefined;
      toast({ title: 'Documento gerado', description: 'Conteúdo em Markdown pronto para revisão.' });
      return row ?? null;
    } catch (e: any) {
      toast({ title: 'Falha na geração', description: e?.message || 'Tente novamente.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { generateDocument, loading };
};
