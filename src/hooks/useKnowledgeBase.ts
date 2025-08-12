import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useKnowledgeBase = () => {
  const { toast } = useToast();

  const ingest = useCallback(
    async (params: { title: string; content: string; source_url?: string; source_type?: string }) => {
      const { data, error } = await supabase.functions.invoke("kb-ingest", { body: params });
      if (error) {
        toast({ title: "Falha na ingestão", description: error.message, variant: "destructive" });
        throw error;
      }
      toast({ title: "Conhecimento adicionado", description: `Chunks: ${data?.chunks ?? 0}` });
      return data as { source_id: string; chunks: number };
    },
    [toast]
  );

  const search = useCallback(async (query: string, topK = 5) => {
    const { data, error } = await supabase.functions.invoke("kb-rag", { body: { query, top_k: topK } });
    if (error) {
      toast({ title: "Erro na busca", description: error.message, variant: "destructive" });
      throw error;
    }
    return (data?.results || []) as Array<{
      chunk_id: string;
      source_id: string;
      title: string;
      source_url: string | null;
      content: string;
      rank: number;
    }>;
  }, [toast]);

  return { ingest, search };
};
