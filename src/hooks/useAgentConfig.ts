import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AgentConfig {
  agent_key: string;
  system_prompt: string;
  default_suggestions: string[];
  metadata?: any;
  enabled?: boolean;
}

export const useAgentConfig = (agentKey: string) => {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ai_agent_configs')
          .select('agent_key, system_prompt, default_suggestions, metadata, enabled')
          .eq('agent_key', agentKey)
          .maybeSingle();
        if (error) throw error;
        if (!active) return;
        setConfig(data as unknown as AgentConfig);
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || 'Falha ao carregar configuração do agente');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchConfig();
    return () => { active = false; };
  }, [agentKey]);

  return { config, loading, error };
};
