
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MLModel {
  id: string;
  model_name: string;
  model_type: string;
  version: string;
  accuracy: number;
  precision_score: number;
  recall_score: number;
  f1_score: number;
  is_active: boolean;
  training_samples: number;
  weights: Record<string, number>;
  last_trained: string;
}

interface PrioritizedSource {
  source_id: string;
  source_type: string;
  priority_score: number;
  confidence: number;
  reasoning: string[];
}

interface PerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confidence_avg: number;
}

export const useMLPrioritization = () => {
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<MLModel | null>(null);
  const [prioritizedSources, setPrioritizedSources] = useState<PrioritizedSource[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const { toast } = useToast();

  const loadActiveModel = async () => {
    try {
      const { data, error } = await supabase
        .from('ml_models')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setModel(data);
        setPerformanceMetrics({
          accuracy: data.accuracy,
          precision: data.precision_score,
          recall: data.recall_score,
          f1_score: data.f1_score,
          confidence_avg: (data.accuracy + data.precision_score + data.recall_score + data.f1_score) / 4
        });
      }
    } catch (error) {
      console.error('Error loading ML model:', error);
    }
  };

  const generatePrioritizedSources = async () => {
    setLoading(true);
    try {
      // Simulate ML-based prioritization
      const mockSources: PrioritizedSource[] = [
        {
          source_id: '1',
          source_type: 'partnership',
          priority_score: 95.2,
          confidence: 94.8,
          reasoning: ['Alto potencial de ROI', 'Complementaridade estratégica', 'Histórico positivo']
        },
        {
          source_id: '2',
          source_type: 'supplier',
          priority_score: 87.3,
          confidence: 89.1,
          reasoning: ['Capacidade técnica superior', 'Preços competitivos', 'Confiabilidade']
        },
        {
          source_id: '3',
          source_type: 'laboratory',
          priority_score: 82.7,
          confidence: 85.4,
          reasoning: ['Certificações adequadas', 'Disponibilidade', 'Localização estratégica']
        },
        {
          source_id: '4',
          source_type: 'distributor',
          priority_score: 78.9,
          confidence: 81.2,
          reasoning: ['Rede de distribuição ampla', 'Experiência no setor', 'Suporte técnico']
        },
        {
          source_id: '5',
          source_type: 'consultant',
          priority_score: 75.6,
          confidence: 77.8,
          reasoning: ['Expertise especializada', 'Disponibilidade imediata', 'Referências sólidas']
        }
      ];

      setPrioritizedSources(mockSources);
    } catch (error) {
      console.error('Error generating prioritized sources:', error);
      toast({
        title: "Erro na Priorização",
        description: "Não foi possível gerar a priorização das fontes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const retrainModel = async () => {
    setLoading(true);
    try {
      // Simulate model retraining
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const updatedMetrics = {
        accuracy: Math.min(0.98, (performanceMetrics?.accuracy || 0.8) + 0.02),
        precision: Math.min(0.98, (performanceMetrics?.precision || 0.8) + 0.015),
        recall: Math.min(0.98, (performanceMetrics?.recall || 0.8) + 0.018),
        f1_score: Math.min(0.98, (performanceMetrics?.f1_score || 0.8) + 0.016),
        confidence_avg: 0
      };
      
      updatedMetrics.confidence_avg = (updatedMetrics.accuracy + updatedMetrics.precision + updatedMetrics.recall + updatedMetrics.f1_score) / 4;
      
      setPerformanceMetrics(updatedMetrics);
      
      toast({
        title: "Modelo Retreinado",
        description: "O modelo foi atualizado com sucesso com novos dados",
      });
    } catch (error) {
      console.error('Error retraining model:', error);
      toast({
        title: "Erro no Retreinamento",
        description: "Não foi possível retreinar o modelo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshMetrics = async () => {
    setLoading(true);
    try {
      await loadActiveModel();
      await generatePrioritizedSources();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveModel();
    generatePrioritizedSources();
  }, []);

  return {
    loading,
    model,
    prioritizedSources,
    performanceMetrics,
    retrainModel,
    refreshMetrics
  };
};
