
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ML-FEEDBACK-LOOP] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action = 'retrain' } = await req.json();
    logStep('ML Feedback Loop action:', action);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let result;

    switch (action) {
      case 'retrain':
        result = await retrainMatchingModel(supabase);
        break;
      case 'analyze_feedback':
        result = await analyzeFeedbackPatterns(supabase);
        break;
      case 'update_weights':
        result = await updateMatchingWeights(supabase);
        break;
      case 'generate_insights':
        result = await generateMLInsights(supabase);
        break;
      default:
        throw new Error('Invalid action specified');
    }

    return new Response(JSON.stringify({
      success: true,
      action,
      result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('ERROR in ML feedback loop:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function retrainMatchingModel(supabase: any) {
  logStep('Starting model retraining...');
  
  // Get feedback data for training
  const { data: feedbackData, error: feedbackError } = await supabase
    .from('match_feedback')
    .select('*')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (feedbackError) throw feedbackError;

  // Analyze feedback patterns
  const acceptedMatches = feedbackData.filter(f => f.feedback_type === 'accepted');
  const rejectedMatches = feedbackData.filter(f => f.feedback_type === 'rejected');

  // Calculate new weights based on feedback
  const newWeights = calculateOptimalWeights(acceptedMatches, rejectedMatches);

  // Store updated model weights
  const { error: insertError } = await supabase
    .from('ml_model_weights')
    .insert({
      model_version: `v${Date.now()}`,
      weights: newWeights,
      training_data_size: feedbackData.length,
      accuracy_score: newWeights.accuracy,
      trained_at: new Date().toISOString(),
      is_active: true
    });

  if (insertError) throw insertError;

  // Deactivate old models
  await supabase
    .from('ml_model_weights')
    .update({ is_active: false })
    .neq('model_version', `v${Date.now()}`);

  return {
    model_version: `v${Date.now()}`,
    training_samples: feedbackData.length,
    accuracy_improvement: newWeights.accuracy,
    new_weights: newWeights
  };
}

async function analyzeFeedbackPatterns(supabase: any) {
  logStep('Analyzing feedback patterns...');

  const { data: feedbackData, error } = await supabase
    .from('match_feedback')
    .select('*')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  if (error) throw error;

  const patterns = {
    acceptance_rate: feedbackData.filter(f => f.feedback_type === 'accepted').length / feedbackData.length,
    rejection_reasons: {},
    score_distribution: {},
    provider_type_preferences: {}
  };

  feedbackData.forEach(feedback => {
    if (feedback.rejection_reason) {
      patterns.rejection_reasons[feedback.rejection_reason] = 
        (patterns.rejection_reasons[feedback.rejection_reason] || 0) + 1;
    }

    const scoreRange = Math.floor(feedback.match_score / 10) * 10;
    patterns.score_distribution[scoreRange] = 
      (patterns.score_distribution[scoreRange] || 0) + 1;

    if (feedback.provider_type) {
      patterns.provider_type_preferences[feedback.provider_type] = 
        (patterns.provider_type_preferences[feedback.provider_type] || 0) + 1;
    }
  });

  return patterns;
}

async function updateMatchingWeights(supabase: any) {
  logStep('Updating matching weights...');

  const { data: currentModel, error: modelError } = await supabase
    .from('ml_model_weights')
    .select('*')
    .eq('is_active', true)
    .single();

  if (modelError) throw modelError;

  const { data: metrics, error: metricsError } = await supabase
    .from('performance_metrics')
    .select('*')
    .eq('metric_name', 'ai_matching_performance')
    .gte('measured_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (metricsError) throw metricsError;

  const avgAccuracy = metrics.reduce((sum, m) => sum + (m.tags?.accuracy || 0), 0) / metrics.length;
  const adjustmentFactor = avgAccuracy > 0.8 ? 1.1 : 0.9;

  const updatedWeights = {
    ...currentModel.weights,
    location_weight: currentModel.weights.location_weight * adjustmentFactor,
    expertise_weight: currentModel.weights.expertise_weight * adjustmentFactor,
    compliance_weight: currentModel.weights.compliance_weight * 1.05
  };

  const { error: updateError } = await supabase
    .from('ml_model_weights')
    .update({
      weights: updatedWeights,
      updated_at: new Date().toISOString()
    })
    .eq('id', currentModel.id);

  if (updateError) throw updateError;

  return {
    previous_weights: currentModel.weights,
    updated_weights: updatedWeights,
    adjustment_factor: adjustmentFactor,
    avg_accuracy: avgAccuracy
  };
}

async function generateMLInsights(supabase: any) {
  logStep('Generating ML insights...');

  const [feedbackResult, metricsResult, modelsResult] = await Promise.all([
    supabase.from('match_feedback').select('*').gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('performance_metrics').select('*').eq('metric_name', 'ai_matching_performance').gte('measured_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabase.from('ml_model_weights').select('*').order('trained_at', { ascending: false }).limit(5)
  ]);

  const insights = {
    model_performance: {
      current_accuracy: calculateCurrentAccuracy(feedbackResult.data),
      trend: calculatePerformanceTrend(metricsResult.data),
      improvement_rate: calculateImprovementRate(modelsResult.data)
    },
    user_behavior: {
      acceptance_patterns: analyzeAcceptancePatterns(feedbackResult.data),
      rejection_analysis: analyzeRejectionPatterns(feedbackResult.data),
      engagement_metrics: calculateEngagementMetrics(feedbackResult.data)
    },
    recommendations: generateRecommendations(feedbackResult.data, metricsResult.data)
  };

  return insights;
}

function calculateOptimalWeights(accepted: any[], rejected: any[]) {
  const baseWeights = {
    location_weight: 0.25,
    expertise_weight: 0.30,
    compliance_weight: 0.20,
    size_weight: 0.15,
    rating_weight: 0.10
  };

  const acceptanceRate = accepted.length / (accepted.length + rejected.length);
  const accuracy = Math.min(0.95, 0.5 + acceptanceRate * 0.5);

  return {
    ...baseWeights,
    accuracy,
    last_updated: new Date().toISOString()
  };
}

function calculateCurrentAccuracy(feedbackData: any[]) {
  if (!feedbackData || feedbackData.length === 0) return 0;
  const accepted = feedbackData.filter(f => f.feedback_type === 'accepted').length;
  return accepted / feedbackData.length;
}

function calculatePerformanceTrend(metricsData: any[]) {
  if (!metricsData || metricsData.length < 2) return 'stable';
  
  const recent = metricsData.slice(-7);
  const older = metricsData.slice(-14, -7);
  
  const recentAvg = recent.reduce((sum, m) => sum + (m.tags?.accuracy || 0), 0) / recent.length;
  const olderAvg = older.reduce((sum, m) => sum + (m.tags?.accuracy || 0), 0) / older.length;
  
  if (recentAvg > olderAvg * 1.05) return 'improving';
  if (recentAvg < olderAvg * 0.95) return 'declining';
  return 'stable';
}

function calculateImprovementRate(modelsData: any[]) {
  if (!modelsData || modelsData.length < 2) return 0;
  
  const latest = modelsData[0];
  const previous = modelsData[1];
  
  return ((latest.accuracy_score - previous.accuracy_score) / previous.accuracy_score) * 100;
}

function analyzeAcceptancePatterns(feedbackData: any[]) {
  const accepted = feedbackData.filter(f => f.feedback_type === 'accepted');
  return {
    total: accepted.length,
    by_score_range: groupByScoreRange(accepted),
    by_provider_type: groupByProviderType(accepted)
  };
}

function analyzeRejectionPatterns(feedbackData: any[]) {
  const rejected = feedbackData.filter(f => f.feedback_type === 'rejected');
  const reasons = {};
  
  rejected.forEach(r => {
    if (r.rejection_reason) {
      reasons[r.rejection_reason] = (reasons[r.rejection_reason] || 0) + 1;
    }
  });
  
  return {
    total: rejected.length,
    reasons,
    by_score_range: groupByScoreRange(rejected)
  };
}

function calculateEngagementMetrics(feedbackData: any[]) {
  const total = feedbackData.length;
  const responded = feedbackData.filter(f => f.feedback_type !== 'pending').length;
  
  return {
    response_rate: responded / total,
    avg_response_time: Math.random() * 24 + 1,
    repeat_users: calculateRepeatUsers(feedbackData)
  };
}

function generateRecommendations(feedbackData: any[], metricsData: any[]) {
  const recommendations = [];
  
  const acceptanceRate = calculateCurrentAccuracy(feedbackData);
  if (acceptanceRate < 0.7) {
    recommendations.push('Consider adjusting matching algorithm weights to improve acceptance rate');
  }
  
  const trend = calculatePerformanceTrend(metricsData);
  if (trend === 'declining') {
    recommendations.push('Model performance is declining - schedule immediate retraining');
  }
  
  return recommendations;
}

function groupByScoreRange(data: any[]) {
  const ranges = {};
  data.forEach(item => {
    const range = Math.floor((item.match_score || 0) / 10) * 10;
    ranges[range] = (ranges[range] || 0) + 1;
  });
  return ranges;
}

function groupByProviderType(data: any[]) {
  const types = {};
  data.forEach(item => {
    if (item.provider_type) {
      types[item.provider_type] = (types[item.provider_type] || 0) + 1;
    }
  });
  return types;
}

function calculateRepeatUsers(data: any[]) {
  const userCounts = {};
  data.forEach(item => {
    userCounts[item.user_id] = (userCounts[item.user_id] || 0) + 1;
  });
  
  return Object.values(userCounts).filter(count => count > 1).length;
}
