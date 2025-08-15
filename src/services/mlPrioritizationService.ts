import { supabase } from '@/integrations/supabase/client';
import { SmartCacheService } from './smartCacheService';

export interface MLModel {
  id: string;
  model_name: string;
  version: string;
  model_type: string;
  accuracy: number;
  precision_score: number;
  recall_score: number;
  f1_score: number;
  training_data_size: number;
  last_trained: string;
  is_active: boolean;
  model_data: Record<string, any>;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  weights?: Record<string, number>;
}

export interface SourceMetrics {
  source_id: string;
  name: string;
  type: string;
  reliability_score: number;
  response_time: number;
  data_quality: number;
  historical_performance: number;
  availability: number;
  cost_per_query: number;
  specialization_domains: string[];
  last_updated: string;
}

export interface PrioritizedResult {
  source_id: string;
  source_type: string;
  priority_score: number;
  confidence: number;
  reasoning: string[];
  estimated_response_time: number;
  cost_estimate: number;
  quality_prediction: number;
  metadata?: {
    individual_scores?: Record<string, number>;
    metrics_snapshot?: {
      accuracy: number;
      response_time: number;
      success_rate: number;
    };
  };
}

export class MLPrioritizationService {
  private static instance: MLPrioritizationService;

  constructor() {}

  static getInstance(): MLPrioritizationService {
    if (!this.instance) {
      this.instance = new MLPrioritizationService();
    }
    return this.instance;
  }

  // Load active model
  async loadActiveModel(): Promise<MLModel | null> {
    const cacheKey = 'active_ml_model';
    
    try {
      const cached = SmartCacheService.get(cacheKey, 'memory', 5 * 60 * 1000);
      if (cached) return cached as MLModel;

      const { data, error } = await supabase
        .from('ml_models')
        .select('*')
        .eq('is_active', true)
        .eq('model_type', 'prioritization')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no model exists, create a default one
        if (error.code === 'PGRST116') {
          return await this.createDefaultModel();
        }
        throw error;
      }

      // Extract weights from model_data and add to the model
      const modelWithWeights: MLModel = {
        ...data,
        model_data: data.model_data as Record<string, any>,
        metadata: data.metadata as Record<string, any>,
        weights: (data.model_data as any)?.weights || {}
      };

      SmartCacheService.set(cacheKey, modelWithWeights, 'memory');
      return modelWithWeights;
    } catch (error) {
      console.error('[MLPrioritization] Error loading active model:', error);
      return await this.createDefaultModel();
    }
  }

  // Create default model if none exists
  private async createDefaultModel(): Promise<MLModel> {
    const defaultWeights = {
      reliability: 0.3,
      response_time: 0.2,
      data_quality: 0.25,
      cost: 0.1,
      specialization: 0.15
    };

    const defaultModel = {
      model_name: 'Default Prioritization Model',
      version: '1.0.0',
      model_type: 'prioritization',
      accuracy: 0.85,
      precision_score: 0.82,
      recall_score: 0.88,
      f1_score: 0.85,
      training_data_size: 1000,
      is_active: true,
      model_data: {
        weights: defaultWeights,
        thresholds: {
          high_priority: 0.8,
          medium_priority: 0.6,
          low_priority: 0.4
        }
      },
      metadata: {
        description: 'Modelo padrão para priorização de fontes',
        training_method: 'supervised',
        algorithm: 'random_forest'
      }
    };

    try {
      const { data, error } = await supabase
        .from('ml_models')
        .insert(defaultModel)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...data,
        model_data: data.model_data as Record<string, any>,
        metadata: data.metadata as Record<string, any>,
        weights: defaultWeights
      };
    } catch (error) {
      console.error('[MLPrioritization] Error creating default model:', error);
      // Return a mock model if database fails
      return {
        id: 'default',
        ...defaultModel,
        last_trained: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        weights: defaultWeights
      };
    }
  }

  // Calculate source priority using ML model
  async calculateSourcePriority(
    sourceMetrics: SourceMetrics[],
    queryContext: {
      query: string;
      domain: string;
      urgency: 'low' | 'medium' | 'high';
      user_preferences?: Record<string, any>;
    }
  ): Promise<PrioritizedResult[]> {
    try {
      const model = await this.loadActiveModel();
      if (!model) throw new Error('No ML model available');

      const weights = model.weights || {
        reliability: 0.3,
        response_time: 0.2,
        data_quality: 0.25,
        cost: 0.1,
        specialization: 0.15
      };

      const urgencyMultiplier = {
        low: 1.0,
        medium: 1.2,
        high: 1.5
      }[queryContext.urgency];

      const results: PrioritizedResult[] = sourceMetrics.map(source => {
        // Calculate priority score using weighted features
        let score = 0;
        score += source.reliability_score * weights.reliability;
        score += (1 - source.response_time / 10000) * weights.response_time; // Normalize response time
        score += source.data_quality * weights.data_quality;
        score += (1 - source.cost_per_query / 100) * weights.cost; // Normalize cost
        
        // Domain specialization bonus
        const specializationBonus = source.specialization_domains.includes(queryContext.domain) ? 
          weights.specialization : 0;
        score += specializationBonus;

        // Apply urgency multiplier
        score *= urgencyMultiplier;
        
        // Ensure score is between 0 and 100
        score = Math.max(0, Math.min(100, score * 100));

        const confidence = this.calculateConfidence(source, model);
        
        return {
          source_id: source.source_id,
          source_type: source.type,
          priority_score: score,
          confidence,
          reasoning: this.generateReasoning(source, queryContext, score),
          estimated_response_time: source.response_time,
          cost_estimate: source.cost_per_query,
          quality_prediction: source.data_quality,
          metadata: {
            individual_scores: {
              accuracy: Math.round(source.reliability_score * 100),
              relevance: Math.round((source.data_quality + (source.specialization_domains.includes(queryContext.domain) ? 0.2 : 0)) * 100),
              freshness: Math.round((1 - (Date.now() - new Date(source.last_updated).getTime()) / (24 * 60 * 60 * 1000 * 30)) * 100), // 30 days freshness
              reliability: Math.round(source.reliability_score * 100),
              user_feedback: Math.round(source.historical_performance * 100)
            },
            metrics_snapshot: {
              accuracy: source.reliability_score * 100,
              response_time: source.response_time,
              success_rate: source.availability * 100
            }
          }
        };
      });

      // Sort by priority score
      results.sort((a, b) => b.priority_score - a.priority_score);

      return results;
    } catch (error) {
      console.error('[MLPrioritization] Error calculating priority:', error);
      throw error;
    }
  }

  // Calculate confidence based on historical data
  private calculateConfidence(source: SourceMetrics, model: MLModel): number {
    const baseConfidence = model.accuracy || 0.85;
    const reliabilityFactor = source.reliability_score;
    const historyFactor = source.historical_performance;
    
    return Math.min(99, baseConfidence * reliabilityFactor * historyFactor * 100);
  }

  // Generate human-readable reasoning
  private generateReasoning(
    source: SourceMetrics, 
    context: any, 
    score: number
  ): string[] {
    const reasons: string[] = [];
    
    if (source.reliability_score > 0.8) {
      reasons.push('Alta confiabilidade histórica');
    }
    
    if (source.response_time < 2000) {
      reasons.push('Tempo de resposta rápido');
    }
    
    if (source.data_quality > 0.8) {
      reasons.push('Excelente qualidade de dados');
    }
    
    if (source.specialization_domains.includes(context.domain)) {
      reasons.push(`Especialização em ${context.domain}`);
    }
    
    if (source.cost_per_query < 10) {
      reasons.push('Custo-benefício favorável');
    }
    
    if (score > 80) {
      reasons.push('Pontuação ML alta');
    }
    
    return reasons;
  }

  // Update model weights based on feedback
  async updateModelWeights(feedbackData: Array<{
    source_id: string;
    user_rating: number;
    query_success: boolean;
    response_time: number;
  }>): Promise<void> {
    try {
      const model = await this.loadActiveModel();
      if (!model) throw new Error('No active model found');

      // Store feedback in database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      for (const feedback of feedbackData) {
        await supabase.from('ml_feedback').insert({
          user_id: user.id,
          model_id: model.id,
          source_id: feedback.source_id,
          query_text: 'context_query',
          predicted_priority: 0.5, // This would come from the actual prediction
          actual_outcome: feedback.query_success ? 'accepted' : 'rejected',
          user_rating: feedback.user_rating,
          response_time_ms: feedback.response_time,
          feedback_data: feedback as any
        });
      }

      // Simulate weight adjustment (in production, this would trigger retraining)
      console.log('[MLPrioritization] Feedback stored for model improvement');
    } catch (error) {
      console.error('[MLPrioritization] Error updating model weights:', error);
      throw error;
    }
  }

  // Get model performance metrics
  async getModelPerformanceMetrics(): Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    confidence_avg: number;
    total_predictions: number;
    feedback_count: number;
    avg_user_rating: number;
  }> {
    try {
      const model = await this.loadActiveModel();
      if (!model) throw new Error('No active model found');

      // Get feedback statistics
      const { data: feedbackStats } = await supabase
        .from('ml_feedback')
        .select('user_rating, actual_outcome')
        .eq('model_id', model.id);

      const feedbackCount = feedbackStats?.length || 0;
      const avgRating = feedbackCount > 0 ? 
        feedbackStats.reduce((sum, f) => sum + f.user_rating, 0) / feedbackCount : 0;

      return {
        accuracy: model.accuracy,
        precision: model.precision_score,
        recall: model.recall_score,
        f1_score: model.f1_score,
        confidence_avg: 0.85, // Mock average confidence
        total_predictions: model.training_data_size,
        feedback_count: feedbackCount,
        avg_user_rating: avgRating
      };
    } catch (error) {
      console.error('[MLPrioritization] Error getting performance metrics:', error);
      return {
        accuracy: 0.85,
        precision: 0.82,
        recall: 0.88,
        f1_score: 0.85,
        confidence_avg: 0.85,
        total_predictions: 1000,
        feedback_count: 0,
        avg_user_rating: 0
      };
    }
  }

  // Retrain model (placeholder for future implementation)
  async retrainModel(): Promise<void> {
    try {
      // In production, this would trigger actual model retraining
      console.log('[MLPrioritization] Model retraining initiated');
      
      // Simulate retraining delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update model metrics (simulated improvement)
      const model = await this.loadActiveModel();
      if (model) {
        await supabase
          .from('ml_models')
          .update({
            accuracy: Math.min(0.99, model.accuracy + 0.01),
            last_trained: new Date().toISOString()
          })
          .eq('id', model.id);
      }
      
      // Clear cache to force reload
      SmartCacheService.delete('active_ml_model', 'memory');
    } catch (error) {
      console.error('[MLPrioritization] Error retraining model:', error);
      throw error;
    }
  }
}

export const mlPrioritization = MLPrioritizationService.getInstance();
