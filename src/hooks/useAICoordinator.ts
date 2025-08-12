
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
      // Simular coordenação até termos a edge function específica
      const simulatedOutput = `# Plano de Coordenação

## Foco: ${input.focus}

## Prioridades Identificadas:
${input.priorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Ações Recomendadas:
- Revisar outputs dos agentes especializados
- Priorizar atividades baseadas no foco definido
- Coordenar handoffs entre agentes
- Monitorar KPIs de progresso

## Próximos Passos:
1. Executar ações de alta prioridade
2. Revisar status dos projetos
3. Atualizar stakeholders sobre progresso`;

      const mockOutput: AgentOutputRow = {
        id: crypto.randomUUID(),
        user_id: 'current-user',
        project_id: input.project_id || null,
        agent_type: 'coordinator',
        input,
        output_md: simulatedOutput,
        kpis: { priorities_count: input.priorities.length, focus_area: input.focus },
        handoff_to: [],
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      toast({ title: 'Coordenação concluída', description: 'Plano de ação gerado.' });
      return mockOutput;
    } catch (e: any) {
      toast({ title: 'Falha na coordenação', description: e?.message || 'Tente novamente.', variant: 'destructive' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { coordinate, loading };
};
