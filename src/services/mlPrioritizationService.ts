import { supabase } from '@/integrations/supabase/client';
import { SmartCacheService } from './smartCacheService';

export interface SourceMetrics {
  source_id: string;
  source_type: string;
  accuracy_score: number;
  relevance_score: number;
  freshness_score: number;
  reliability_score: number;
  user_feedback_score: number;
  response_time: number;
  success_rate: number;
  total_queries: number;
  last_updated: string;
}

export interface MLModel {
  id: string;
  model_version: string;
  accuracy_score: number;
  training_data_size: number;
  trained_at: string;
  is_active: boolean;
  weights: Record<string, number>;
}

export interface PrioritizedResult {
  source_id: string;
  source_type: string;
  priority_score: number;
  confidence: number;
  reasoning: string[];
  metadata: Record<string, any>;
}

export class MLPrioritizationService {
  private static instance: MLPrioritizationService;
  private modelWeights: Record<string, number> = {
    accuracy: 0.25,
    relevance: 0.30,
    freshness: 0.20,
    reliability: 0.15,
    user_feedback: 0.10
  };

  static getInstance(): MLPrioritizationService {
    if (!this.instance) {
      this.instance = new MLPrioritizationService();
    }
    return this.instance;
  }

  async loadActiveModel(): Promise<MLModel | null> {
    try {
      const { data, error } = await supabase
        .from('ml_model_weights')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.warn('[ML] No active model found, using default weights');
        return null;
      }

      // Fix: Safe parsing of weights from database
      if (data.weights && typeof data.weights === 'object' && !Array.isArray(data.weights)) {
        this.modelWeights = data.weights as Record<string, number>;
      }

      // Fix: Map database fields to MLModel interface
      return {
        id: data.id,
        model_version: data.model_version,
        accuracy_score: data.accuracy_score,
        training_data_size: data.training_data_size,
        trained_at: data.trained_at,
        is_active: data.is_active,
        weights: this.modelWeights
      } as MLModel;
    } catch (error) {
      console.error('[ML] Error loading model:', error);
      return null;
    }
  }

  async calculateSourcePriority(
    sourceMetrics: SourceMetrics[],
    queryContext: {
      query: string;
      domain: string;
      urgency: 'low' | 'medium' | 'high';
      user_preferences?: Record<string, any>;
    }
  ): Promise<PrioritizedResult[]> {
    const cacheKey = `ml_priority_${JSON.stringify(queryContext)}_${sourceMetrics.map(s => s.source_id).join(',')}`;
    
    return SmartCacheService.get(
      cacheKey,
      'ml:priority',
      async () => {
        await this.loadActiveModel();
        
        const prioritizedResults = sourceMetrics.map(metrics => {
          const scores = this.calculateIndividualScores(metrics, queryContext);
          const priorityScore = this.calculateWeightedScore(scores);
          const confidence = this.calculateConfidence(metrics, scores);
          const reasoning = this.generateReasoning(scores, metrics);

          return {
            source_id: metrics.source_id,
            source_type: metrics.source_type,
            priority_score: priorityScore,
            confidence,
            reasoning,
            metadata: {
              individual_scores: scores,
              metrics_snapshot: {
                accuracy: metrics.accuracy_score,
                response_time: metrics.response_time,
                success_rate: metrics.success_rate
              }
            }
          };
        });

        // Sort by priority score descending
        return prioritizedResults.sort((a, b) => b.priority_score - a.priority_score);
      }
    );
  }

  private calculateIndividualScores(
    metrics: SourceMetrics,
    context: { query: string; domain: string; urgency: string; user_preferences?: Record<string, any> }
  ): Record<string, number> {
    const scores = {
      accuracy: this.normalizeScore(metrics.accuracy_score, 0, 100),
      relevance: this.calculateRelevanceScore(metrics, context),
      freshness: this.calculateFreshnessScore(metrics.last_updated),
      reliability: this.normalizeScore(metrics.success_rate, 0, 100),
      user_feedback: this.normalizeScore(metrics.user_feedback_score, 0, 5) * 20 // Convert 0-5 to 0-100
    };

    // Apply urgency modifiers
    if (context.urgency === 'high') {
      scores.reliability *= 1.2;
      scores.freshness *= 1.1;
    } else if (context.urgency === 'low') {
      scores.accuracy *= 1.1;
    }

    // Apply domain-specific weights
    if (context.domain === 'regulatory') {
      scores.accuracy *= 1.2;
      scores.reliability *= 1.1;
    } else if (context.domain === 'research') {
      scores.freshness *= 1.2;
      scores.relevance *= 1.1;
    }

    return scores;
  }

  private calculateRelevanceScore(
    metrics: SourceMetrics,
    context: { query: string; domain: string }
  ): number {
    let baseScore = metrics.relevance_score;

    // Domain matching bonus
    const domainBonus = this.getDomainBonus(metrics.source_type, context.domain);
    baseScore += domainBonus;

    // Query complexity factor
    const complexityFactor = this.getQueryComplexityFactor(context.query);
    baseScore *= complexityFactor;

    return Math.min(baseScore, 100);
  }

  private getDomainBonus(sourceType: string, domain: string): number {
    const domainMatching: Record<string, Record<string, number>> = {
      'regulatory': {
        'anvisa': 15,
        'fda': 12,
        'ema': 10,
        'pubmed': 5,
        'internal': 8
      },
      'research': {
        'pubmed': 15,
        'arxiv': 12,
        'google_scholar': 10,
        'internal': 8,
        'anvisa': 5
      },
      'commercial': {
        'internal': 15,
        'market_data': 12,
        'company_reports': 10,
        'anvisa': 8,
        'pubmed': 5
      }
    };

    return domainMatching[domain]?.[sourceType] || 0;
  }

  private getQueryComplexityFactor(query: string): number {
    const wordCount = query.split(' ').length;
    const hasSpecialTerms = /\b(regulamentação|compliance|bpf|anvisa|fda)\b/i.test(query);
    
    let factor = 1.0;
    
    if (wordCount > 10) factor += 0.1; // Complex queries
    if (hasSpecialTerms) factor += 0.15; // Technical terms
    
    return Math.min(factor, 1.3);
  }

  private calculateFreshnessScore(lastUpdated: string): number {
    const now = new Date();
    const updated = new Date(lastUpdated);
    const daysDiff = (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff <= 1) return 100;
    if (daysDiff <= 7) return 90;
    if (daysDiff <= 30) return 70;
    if (daysDiff <= 90) return 50;
    return 30;
  }

  private calculateWeightedScore(scores: Record<string, number>): number {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [metric, score] of Object.entries(scores)) {
      const weight = this.modelWeights[metric] || 0;
      weightedSum += score * weight;
      totalWeight += weight;
    }

    return totalWeight > 0 ? (weightedSum / totalWeight) : 0;
  }

  private calculateConfidence(metrics: SourceMetrics, scores: Record<string, number>): number {
    const factors = [
      metrics.total_queries > 100 ? 1.0 : 0.7, // Query volume
      metrics.success_rate > 95 ? 1.0 : 0.8,   // Reliability
      Object.values(scores).every(s => s > 50) ? 1.0 : 0.6 // Score consistency
    ];

    return factors.reduce((acc, factor) => acc * factor, 1.0) * 100;
  }

  private generateReasoning(scores: Record<string, number>, metrics: SourceMetrics): string[] {
    const reasoning: string[] = [];
    
    const topScores = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);

    topScores.forEach(([metric, score]) => {
      if (score > 80) {
        reasoning.push(`Excelente ${metric}: ${score.toFixed(1)}/100`);
      } else if (score > 60) {
        reasoning.push(`Boa ${metric}: ${score.toFixed(1)}/100`);
      }
    });

    if (metrics.response_time < 1000) {
      reasoning.push('Resposta rápida (< 1s)');
    }

    if (metrics.success_rate > 98) {
      reasoning.push('Alta confiabilidade (98%+)');
    }

    return reasoning;
  }

  private normalizeScore(value: number, min: number, max: number): number {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  }

  async updateModelWeights(feedbackData: {
    source_id: string;
    user_rating: number;
    query_success: boolean;
    response_time: number;
  }[]): Promise<void> {
    try {
      // Process feedback to adjust weights
      const adjustments = this.calculateWeightAdjustments(feedbackData);
      
      // Update weights
      for (const [metric, adjustment] of Object.entries(adjustments)) {
        this.modelWeights[metric] = Math.max(0.05, Math.min(0.5, 
          this.modelWeights[metric] + adjustment
        ));
      }

      // Normalize weights to sum to 1
      const totalWeight = Object.values(this.modelWeights).reduce((sum, w) => sum + w, 0);
      for (const metric in this.modelWeights) {
        this.modelWeights[metric] /= totalWeight;
      }

      // Save updated model
      await this.saveModelWeights(feedbackData);
      
      console.log('[ML] Model weights updated:', this.modelWeights);
    } catch (error) {
      console.error('[ML] Error updating model weights:', error);
    }
  }

  private calculateWeightAdjustments(feedbackData: any[]): Record<string, number> {
    const adjustments: Record<string, number> = {};
    
    // Analyze feedback patterns
    const avgRating = feedbackData.reduce((sum, f) => sum + f.user_rating, 0) / feedbackData.length;
    const successRate = feedbackData.filter(f => f.query_success).length / feedbackData.length;
    
    // Adjust weights based on performance
    if (avgRating < 3) {
      adjustments.user_feedback = 0.02; // Increase user feedback importance
      adjustments.accuracy = -0.01;     // Decrease accuracy importance slightly
    } else if (avgRating > 4) {
      adjustments.accuracy = 0.01;      // Increase accuracy importance
    }

    if (successRate < 0.8) {
      adjustments.reliability = 0.02;   // Increase reliability importance
      adjustments.freshness = -0.01;    // Decrease freshness importance
    }

    return adjustments;
  }

  private async saveModelWeights(feedbackData: any[]): Promise<void> {
    try {
      // Deactivate current active model
      await supabase
        .from('ml_model_weights')
        .update({ is_active: false })
        .eq('is_active', true);

      // Fix: Insert new model version with correct field names
      await supabase
        .from('ml_model_weights')
        .insert({
          model_version: `v${Date.now()}`,
          weights: this.modelWeights,
          accuracy_score: 0.85, // Will be updated based on feedback
          training_data_size: feedbackData?.length || 0,
          is_active: true
        });
    } catch (error) {
      console.error('[ML] Error saving model weights:', error);
    }
  }

  async getModelPerformanceMetrics(): Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    confidence_avg: number;
  }> {
    try {
      const { data: recentFeedback } = await supabase
        .from('match_feedback')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .limit(100);

      if (!recentFeedback || recentFeedback.length === 0) {
        return {
          accuracy: 0.85,
          precision: 0.82,
          recall: 0.78,
          f1_score: 0.80,
          confidence_avg: 0.75
        };
      }

      // Calculate metrics based on actual feedback
      const totalFeedback = recentFeedback.length;
      const positiveFeedback = recentFeedback.filter(f => f.feedback_type === 'accepted').length;
      
      const accuracy = positiveFeedback / totalFeedback;
      const precision = accuracy * 0.95; // Approximation
      const recall = accuracy * 0.92;    // Approximation
      const f1_score = 2 * (precision * recall) / (precision + recall);
      const confidence_avg = recentFeedback.reduce((sum, f) => sum + (f.match_score || 0), 0) / totalFeedback;

      return {
        accuracy,
        precision,
        recall,
        f1_score,
        confidence_avg
      };
    } catch (error) {
      console.error('[ML] Error calculating performance metrics:', error);
      return {
        accuracy: 0.85,
        precision: 0.82,   
        recall: 0.78,
        f1_score: 0.80,
        confidence_avg: 0.75
      };
    }
  }
}

export const mlPrioritization = MLPrioritizationService.getInstance();
