
import { useState, useEffect, useCallback } from 'react';
import { 
  federatedLearningService, 
  FederatedNode, 
  FederatedModel, 
  SyncRound 
} from '@/services/federatedLearningService';
import { useToast } from '@/hooks/use-toast';

interface UseFederatedLearningReturn {
  nodes: FederatedNode[];
  models: FederatedModel[];
  currentRound: SyncRound | null;
  isTraining: boolean;
  isSyncing: boolean;
  isLoading: boolean;
  error: string | null;
  privacyAudit: any;
  nodeContributions: any[];
  startTraining: (modelId: string, privacyPreserving?: boolean) => Promise<void>;
  synchronizeModels: (modelId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  performPrivacyAudit: () => Promise<void>;
  getTrainingMetrics: (roundNumber: number) => Promise<any>;
}

export const useFederatedLearning = (): UseFederatedLearningReturn => {
  const [nodes, setNodes] = useState<FederatedNode[]>([]);
  const [models, setModels] = useState<FederatedModel[]>([]);
  const [currentRound, setCurrentRound] = useState<SyncRound | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privacyAudit, setPrivacyAudit] = useState<any>(null);
  const [nodeContributions, setNodeContributions] = useState<any[]>([]);
  const { toast } = useToast();

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [nodesData, modelsData, contributionsData] = await Promise.all([
        federatedLearningService.getActiveNodes(),
        federatedLearningService.getFederatedModels(),
        federatedLearningService.getNodeContributions()
      ]);

      setNodes(nodesData);
      setModels(modelsData);
      setNodeContributions(contributionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados federados';
      setError(errorMessage);
      toast({
        title: "Erro no Sistema Federado",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const startTraining = useCallback(async (modelId: string, privacyPreserving: boolean = true) => {
    setIsTraining(true);
    setError(null);

    try {
      const round = await federatedLearningService.startTrainingRound(modelId, privacyPreserving);
      setCurrentRound(round);
      
      toast({
        title: "Treinamento Federado Iniciado",
        description: `Rodada ${round.round_number} iniciada com ${round.participating_nodes.length} nós`,
      });

      // Simulate training progress
      setTimeout(async () => {
        setCurrentRound(prev => prev ? { ...prev, status: 'completed', end_time: new Date().toISOString() } : null);
        setIsTraining(false);
        await refreshData();
        
        toast({
          title: "Treinamento Concluído",
          description: "Modelo federado atualizado com sucesso",
        });
      }, 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao iniciar treinamento';
      setError(errorMessage);
      setIsTraining(false);
      toast({
        title: "Erro no Treinamento",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [toast, refreshData]);

  const synchronizeModels = useCallback(async (modelId: string) => {
    setIsSyncing(true);
    setError(null);

    try {
      const result = await federatedLearningService.synchronizeModels(modelId);
      
      if (result.success) {
        toast({
          title: "Sincronização Concluída",
          description: `${result.nodes_synced} nós sincronizados. Consenso: ${result.consensus_reached ? 'Sim' : 'Não'}`,
        });
        await refreshData();
      } else {
        throw new Error('Falha na sincronização');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na sincronização';
      setError(errorMessage);
      toast({
        title: "Erro na Sincronização",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  }, [toast, refreshData]);

  const performPrivacyAudit = useCallback(async () => {
    try {
      const audit = await federatedLearningService.performPrivacyAudit();
      setPrivacyAudit(audit);
      
      toast({
        title: "Auditoria de Privacidade Concluída",
        description: `Score de privacidade: ${audit.privacy_score}/100`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na auditoria';
      setError(errorMessage);
      toast({
        title: "Erro na Auditoria",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [toast]);

  const getTrainingMetrics = useCallback(async (roundNumber: number) => {
    try {
      return await federatedLearningService.getTrainingMetrics(roundNumber);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar métricas';
      setError(errorMessage);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30 * 1000);

    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    nodes,
    models,
    currentRound,
    isTraining,
    isSyncing,
    isLoading,
    error,
    privacyAudit,
    nodeContributions,
    startTraining,
    synchronizeModels,
    refreshData,
    performPrivacyAudit,
    getTrainingMetrics
  };
};
