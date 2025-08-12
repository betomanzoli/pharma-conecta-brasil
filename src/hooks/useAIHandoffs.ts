import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAIHandoffs = () => {
  const { toast } = useToast();

  const enqueue = useCallback(
    async (params: {
      source_agent: string;
      target_agents: string[];
      input?: Record<string, any>;
      project_id?: string | null;
      agent_output_id?: string | null;
    }) => {
      const { source_agent, target_agents, input = {}, project_id = null, agent_output_id = null } = params;
      const { error, data } = await supabase.rpc("enqueue_ai_handoffs", {
        p_source_agent: source_agent,
        p_target_agents: target_agents,
        p_input: input,
        p_project_id: project_id,
        p_agent_output_id: agent_output_id,
      });
      if (error) {
        toast({ title: "Falha ao enfileirar", description: error.message, variant: "destructive" });
        throw error;
      }
      toast({ title: "Tarefas criadas", description: `${data || 0} handoffs enfileirados.` });
      return data as number;
    },
    [toast]
  );

  const runNext = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke("ai-handoff-runner", {
      body: { action: "run_next" },
    });
    if (error) {
      toast({ title: "Falha na execução", description: error.message, variant: "destructive" });
      throw error;
    }
    const processed = data?.processed ?? 0;
    if (processed > 0) toast({ title: "Handoff executado", description: `Processados: ${processed}` });
    return processed as number;
  }, [toast]);

  const runAll = useCallback(async (limit = 10) => {
    const { data, error } = await supabase.functions.invoke("ai-handoff-runner", {
      body: { action: "run_all", limit },
    });
    if (error) {
      toast({ title: "Falha na execução", description: error.message, variant: "destructive" });
      throw error;
    }
    const processed = data?.processed ?? 0;
    toast({ title: "Handoffs executados", description: `Total: ${processed}` });
    return processed as number;
  }, [toast]);

  return { enqueue, runNext, runAll };
};
