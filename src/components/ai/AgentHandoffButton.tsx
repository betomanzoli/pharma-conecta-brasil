
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users } from 'lucide-react';
import { useAIHandoffs } from '@/hooks/useAIHandoffs';
import { useToast } from '@/hooks/use-toast';

interface AgentHandoffButtonProps {
  sourceAgent: string;
  targetAgents: string[];
  agentOutputId?: string;
  projectId?: string;
  outputData?: Record<string, any>;
  onHandoffComplete?: () => void;
}

const AgentHandoffButton: React.FC<AgentHandoffButtonProps> = ({
  sourceAgent,
  targetAgents,
  agentOutputId,
  projectId,
  outputData = {},
  onHandoffComplete
}) => {
  const { enqueue } = useAIHandoffs();
  const { toast } = useToast();

  const handleHandoff = async () => {
    try {
      await enqueue({
        source_agent: sourceAgent,
        target_agents: targetAgents,
        input: outputData,
        project_id: projectId || null,
        agent_output_id: agentOutputId || null
      });

      toast({
        title: 'Handoff enfileirado',
        description: `${targetAgents.length} tarefa(s) criada(s) para ${targetAgents.join(', ')}`,
      });

      if (onHandoffComplete) {
        onHandoffComplete();
      }
    } catch (error) {
      toast({
        title: 'Erro no handoff',
        description: 'Falha ao criar tarefas. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Button
      onClick={handleHandoff}
      variant="outline"
      className="flex items-center space-x-2"
    >
      <Users className="h-4 w-4" />
      <span>Handoff → {targetAgents.join(', ')}</span>
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
};

export default AgentHandoffButton;
