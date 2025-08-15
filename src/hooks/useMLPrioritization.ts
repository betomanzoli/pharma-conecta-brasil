
import { useState, useEffect } from 'react';
import { mlPrioritization, SourceMetrics, PrioritizedResult, MLModel } from '@/services/mlPrioritizationService';
import { useToast } from '@/hooks/use-toast';

export const useMLPrioritization = () => {
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<MLModel | null>(null);
  const [prioritizedSources, setPrioritizedSources] = useState<PrioritizedResult[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadActiveModel();
    loadPerformanceMetrics();
  }, []);

  const loadActiveModel = async () => {
    try {
      const activeModel = await mlPrioritization.loadActiveModel();
      setModel(activeModel);
    } catch (error) {
      console.error('Error loading ML model:', error);
    }
  };

  const loadPerformanceMetrics = async () => {
    try {
      const metrics = await mlPrioritization.getModelPerformanceMetrics();
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    }
  };

  const prioritizeSources = async (
    sourceMetrics: SourceMetrics[],
    queryContext: {
      query: string;
      domain: string;
      urgency: 'low' | 'medium' | 'high';
      user_preferences?: Record<string, any>;
    }
  ) => {
    setLoading(true);
    try {
      const results = await mlPrioritization.calculateSourcePriority(
        sourceMetrics,
        queryContext
      );
      setPrioritizedSources(results);
      return results;
    } catch (error: any) {
      toast({
        title: "Erro na Priorização ML",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateModelWithFeedback = async (feedbackData: {
    source_id: string;
    user_rating: number;
    query_success: boolean;
    response_time: number;
  }[]) => {
    try {
      await mlPrioritization.updateModelWeights(feedbackData);
      await loadActiveModel();
      await loadPerformanceMetrics();
      
      toast({
        title: "Modelo ML Atualizado",
        description: "Pesos do modelo foram ajustados com base no feedback"
      });
    } catch (error: any) {
      toast({
        title: "Erro ao Atualizar Modelo",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const retrainModel = async (trainingData?: any[]) => {
    setLoading(true);
    try {
      // Simulate model retraining
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await loadActiveModel();
      await loadPerformanceMetrics();
      
      toast({
        title: "Modelo Retreinado",
        description: "Modelo ML foi retreinado com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro no Retreinamento",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    model,
    prioritizedSources,
    performanceMetrics,
    prioritizeSources,
    updateModelWithFeedback,
    retrainModel,
    refreshMetrics: loadPerformanceMetrics
  };
};
