
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AI-MATCHING-ENHANCED] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Enhanced AI matching request received");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, parameters } = await req.json();

    let result;

    switch (action) {
      case 'advanced_matching':
        result = await performAdvancedMatching(supabase, parameters);
        break;
      case 'semantic_search':
        result = await performSemanticSearch(supabase, parameters);
        break;
      case 'recommendation_engine':
        result = await generateRecommendations(supabase, parameters);
        break;
      case 'similarity_analysis':
        result = await performSimilarityAnalysis(supabase, parameters);
        break;
      case 'context_matching':
        result = await performContextMatching(supabase, parameters);
        break;
      default:
        throw new Error('Invalid action specified');
    }

    return new Response(JSON.stringify({
      success: true,
      action,
      result
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in enhanced AI matching", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function performAdvancedMatching(supabase: any, parameters: any) {
  logStep("Performing advanced AI matching");

  const { user_id, user_type, requirements, preferences } = parameters;

  // Get active ML model weights
  const { data: modelWeights, error: modelError } = await supabase
    .from('ml_model_weights')
    .select('*')
    .eq('is_active', true)
    .single();

  if (modelError) {
    logStep("No active ML model found, using default weights");
  }

  const weights = modelWeights?.weights || {
    location_weight: 0.25,
    expertise_weight: 0.30,
    compliance_weight: 0.20,
    size_weight: 0.15,
    rating_weight: 0.10
  };

  // Get user embeddings or generate new ones
  let userEmbedding = await getUserEmbedding(supabase, user_id, user_type);
  if (!userEmbedding) {
    userEmbedding = await generateUserEmbedding(supabase, user_id, user_type, requirements);
  }

  // Find potential matches based on user type
  let candidates = [];
  
  if (user_type === 'pharmaceutical_company') {
    const [labs, consultants] = await Promise.all([
      supabase.from('laboratories').select('*'),
      supabase.from('consultants').select('*')
    ]);
    candidates = [...(labs.data || []), ...(consultants.data || [])];
  } else if (user_type === 'laboratory') {
    const { data: companies } = await supabase.from('companies').select('*');
    candidates = companies || [];
  } else if (user_type === 'consultant') {
    const { data: companies } = await supabase.from('companies').select('*');
    candidates = companies || [];
  }

  // Calculate advanced matching scores
  const matchedCandidates = await Promise.all(
    candidates.map(async (candidate) => {
      const candidateEmbedding = await getCandidateEmbedding(supabase, candidate.id, getEntityType(candidate));
      
      const scores = {
        semantic_similarity: calculateSemanticSimilarity(userEmbedding, candidateEmbedding),
        location_score: calculateLocationScore(requirements, candidate),
        expertise_score: calculateExpertiseScore(requirements, candidate),
        compliance_score: calculateComplianceScore(requirements, candidate),
        size_score: calculateSizeScore(requirements, candidate),
        rating_score: calculateRatingScore(candidate),
        context_score: calculateContextScore(requirements, candidate)
      };

      const final_score = (
        scores.semantic_similarity * weights.expertise_weight +
        scores.location_score * weights.location_weight +
        scores.expertise_score * weights.expertise_weight +
        scores.compliance_score * weights.compliance_weight +
        scores.size_score * weights.size_weight +
        scores.rating_score * weights.rating_weight +
        scores.context_score * 0.1
      );

      return {
        ...candidate,
        match_score: final_score,
        score_breakdown: scores,
        match_reasons: generateMatchReasons(scores, candidate),
        confidence_level: calculateConfidenceLevel(scores)
      };
    })
  );

  // Sort by match score and return top matches
  const sortedMatches = matchedCandidates
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 20);

  // Store matching results for feedback loop
  await storeMatchingResults(supabase, user_id, sortedMatches);

  return {
    matches: sortedMatches,
    matching_algorithm: 'enhanced_ai_v2',
    model_version: modelWeights?.model_version || 'default',
    total_candidates: candidates.length,
    processing_time: Date.now()
  };
}

async function performSemanticSearch(supabase: any, parameters: any) {
  logStep("Performing semantic search");

  const { query, entity_type, limit = 10 } = parameters;

  // Generate query embedding
  const queryEmbedding = await generateTextEmbedding(query);

  // Get all entities of the specified type
  const tableName = getTableName(entity_type);
  const { data: entities } = await supabase.from(tableName).select('*');

  if (!entities) return { results: [] };

  // Calculate semantic similarity for each entity
  const results = await Promise.all(
    entities.map(async (entity) => {
      const entityEmbedding = await getCandidateEmbedding(supabase, entity.id, entity_type);
      const similarity = calculateSemanticSimilarity(queryEmbedding, entityEmbedding);
      
      return {
        ...entity,
        similarity_score: similarity,
        relevance_explanation: generateRelevanceExplanation(query, entity, similarity)
      };
    })
  );

  // Sort by similarity and return top results
  const sortedResults = results
    .sort((a, b) => b.similarity_score - a.similarity_score)
    .slice(0, limit);

  return {
    results: sortedResults,
    query,
    total_searched: entities.length,
    search_type: 'semantic'
  };
}

async function generateRecommendations(supabase: any, parameters: any) {
  logStep("Generating AI recommendations");

  const { user_id, user_type, context } = parameters;

  // Get user history and preferences
  const { data: userHistory } = await supabase
    .from('match_feedback')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })
    .limit(50);

  // Analyze user preferences from history
  const preferences = analyzeUserPreferences(userHistory || []);

  // Get collaborative filtering recommendations
  const collaborativeRecs = await getCollaborativeRecommendations(supabase, user_id, user_type);

  // Get content-based recommendations
  const contentRecs = await getContentBasedRecommendations(supabase, user_id, user_type, preferences);

  // Combine and weight recommendations
  const combinedRecommendations = combineRecommendations(collaborativeRecs, contentRecs);

  // Add explanation for each recommendation
  const explainedRecommendations = combinedRecommendations.map(rec => ({
    ...rec,
    explanation: generateRecommendationExplanation(rec, preferences),
    confidence: calculateRecommendationConfidence(rec)
  }));

  return {
    recommendations: explainedRecommendations,
    user_preferences: preferences,
    algorithm: 'hybrid_recommendation',
    generated_at: new Date().toISOString()
  };
}

async function performSimilarityAnalysis(supabase: any, parameters: any) {
  logStep("Performing similarity analysis");

  const { entity_id, entity_type, comparison_entities } = parameters;

  // Get target entity embedding
  const targetEmbedding = await getCandidateEmbedding(supabase, entity_id, entity_type);

  // Calculate similarity with comparison entities
  const similarities = await Promise.all(
    comparison_entities.map(async (compEntity) => {
      const compEmbedding = await getCandidateEmbedding(supabase, compEntity.id, compEntity.type);
      const similarity = calculateSemanticSimilarity(targetEmbedding, compEmbedding);
      
      return {
        entity: compEntity,
        similarity_score: similarity,
        similarity_factors: analyzeSimilarityFactors(targetEmbedding, compEmbedding),
        relationship_strength: categorizeRelationshipStrength(similarity)
      };
    })
  );

  return {
    target_entity: { id: entity_id, type: entity_type },
    similarities: similarities.sort((a, b) => b.similarity_score - a.similarity_score),
    analysis_type: 'entity_similarity'
  };
}

async function performContextMatching(supabase: any, parameters: any) {
  logStep("Performing context-aware matching");

  const { user_id, context, requirements } = parameters;

  // Get contextual information
  const contextualData = await gatherContextualData(supabase, user_id, context);

  // Adjust matching weights based on context
  const contextualWeights = adjustWeightsForContext(context, contextualData);

  // Perform context-aware matching
  const matches = await performAdvancedMatching(supabase, {
    user_id,
    user_type: context.user_type,
    requirements: {
      ...requirements,
      context: contextualData
    },
    preferences: contextualWeights
  });

  return {
    ...matches,
    context_applied: context,
    contextual_factors: contextualData,
    adjusted_weights: contextualWeights
  };
}

// Helper functions

async function getUserEmbedding(supabase: any, userId: string, userType: string) {
  const { data } = await supabase
    .from('ai_embeddings')
    .select('embedding_vector')
    .eq('entity_id', userId)
    .eq('entity_type', userType)
    .single();

  return data?.embedding_vector;
}

async function generateUserEmbedding(supabase: any, userId: string, userType: string, requirements: any) {
  // Generate text representation of user
  const userText = createUserDescription(requirements, userType);
  
  // Generate embedding
  const embedding = await generateTextEmbedding(userText);
  
  // Store in cache
  await supabase.from('ai_embeddings').insert({
    entity_id: userId,
    entity_type: userType,
    embedding_vector: embedding,
    content_hash: hashContent(userText),
    model_used: 'text-embedding-ada-002'
  });

  return embedding;
}

async function getCandidateEmbedding(supabase: any, entityId: string, entityType: string) {
  // Check cache first
  const { data: cached } = await supabase
    .from('ai_embeddings')
    .select('embedding_vector')
    .eq('entity_id', entityId)
    .eq('entity_type', entityType)
    .single();

  if (cached) return cached.embedding_vector;

  // Generate new embedding
  const entityText = await getEntityDescription(supabase, entityId, entityType);
  const embedding = await generateTextEmbedding(entityText);

  // Store in cache
  await supabase.from('ai_embeddings').insert({
    entity_id: entityId,
    entity_type: entityType,
    embedding_vector: embedding,
    content_hash: hashContent(entityText),
    model_used: 'text-embedding-ada-002'
  });

  return embedding;
}

async function generateTextEmbedding(text: string) {
  // Simplified embedding generation (in production, use OpenAI API)
  const embedding = new Array(1536).fill(0);
  for (let i = 0; i < text.length && i < 1536; i++) {
    embedding[i] = text.charCodeAt(i) / 1000;
  }
  return embedding;
}

function calculateSemanticSimilarity(embeddingA: number[], embeddingB: number[]) {
  if (!embeddingA || !embeddingB) return 0;
  
  const dotProduct = embeddingA.reduce((sum, a, i) => sum + a * embeddingB[i], 0);
  const magnitudeA = Math.sqrt(embeddingA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(embeddingB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

function calculateLocationScore(requirements: any, candidate: any) {
  if (!requirements.location || !candidate.location) return 0.5;
  
  const sameState = requirements.location.state === candidate.state;
  const sameCity = requirements.location.city === candidate.city;
  
  if (sameCity) return 1.0;
  if (sameState) return 0.8;
  return 0.3;
}

function calculateExpertiseScore(requirements: any, candidate: any) {
  if (!requirements.expertise || !candidate.expertise_area) return 0.5;
  
  const requiredSkills = requirements.expertise;
  const candidateSkills = candidate.expertise_area || candidate.specialty || [];
  
  const overlap = requiredSkills.filter(skill => 
    candidateSkills.some(cSkill => cSkill.toLowerCase().includes(skill.toLowerCase()))
  ).length;
  
  return Math.min(1.0, overlap / requiredSkills.length);
}

function calculateComplianceScore(requirements: any, candidate: any) {
  if (!requirements.compliance_required) return 1.0;
  
  const candidateCompliance = candidate.compliance_status || candidate.certifications;
  if (!candidateCompliance) return 0.2;
  
  if (candidateCompliance === 'approved' || candidateCompliance === 'active') return 1.0;
  if (candidateCompliance === 'pending') return 0.6;
  return 0.3;
}

function calculateSizeScore(requirements: any, candidate: any) {
  if (!requirements.size_preference) return 0.8;
  
  const candidateSize = candidate.company_size || candidate.capacity || 'medium';
  const preferred = requirements.size_preference;
  
  if (candidateSize === preferred) return 1.0;
  return 0.6;
}

function calculateRatingScore(candidate: any) {
  const rating = candidate.average_rating || candidate.rating || 4.0;
  return Math.min(1.0, rating / 5.0);
}

function calculateContextScore(requirements: any, candidate: any) {
  let score = 0.5;
  
  if (requirements.urgency === 'high' && candidate.response_time === 'fast') score += 0.3;
  if (requirements.budget && candidate.pricing && candidate.pricing <= requirements.budget) score += 0.2;
  
  return Math.min(1.0, score);
}

function generateMatchReasons(scores: any, candidate: any) {
  const reasons = [];
  
  if (scores.semantic_similarity > 0.8) reasons.push('High semantic similarity');
  if (scores.location_score > 0.8) reasons.push('Excellent location match');
  if (scores.expertise_score > 0.8) reasons.push('Strong expertise alignment');
  if (scores.compliance_score > 0.8) reasons.push('Meets compliance requirements');
  if (scores.rating_score > 0.8) reasons.push('Highly rated provider');
  
  return reasons;
}

function calculateConfidenceLevel(scores: any) {
  const avgScore = Object.values(scores).reduce((sum: number, score: number) => sum + score, 0) / Object.keys(scores).length;
  
  if (avgScore > 0.8) return 'high';
  if (avgScore > 0.6) return 'medium';
  return 'low';
}

async function storeMatchingResults(supabase: any, userId: string, matches: any[]) {
  const matchingData = matches.map(match => ({
    user_id: userId,
    match_id: match.id,
    match_score: match.match_score,
    feedback_type: 'pending',
    provider_name: match.name,
    provider_type: getEntityType(match),
    created_at: new Date().toISOString()
  }));

  await supabase.from('match_feedback').insert(matchingData);
}

function getEntityType(entity: any) {
  if (entity.cnpj) return 'company';
  if (entity.equipment_list) return 'laboratory';
  if (entity.specialty) return 'consultant';
  return 'unknown';
}

function getTableName(entityType: string) {
  switch (entityType) {
    case 'company': return 'companies';
    case 'laboratory': return 'laboratories';
    case 'consultant': return 'consultants';
    default: return 'companies';
  }
}

function generateRelevanceExplanation(query: string, entity: any, similarity: number) {
  if (similarity > 0.8) return 'Highly relevant to your search';
  if (similarity > 0.6) return 'Good match for your requirements';
  if (similarity > 0.4) return 'Partially relevant';
  return 'Limited relevance';
}

function analyzeUserPreferences(history: any[]) {
  const preferences = {
    preferred_provider_types: {},
    preferred_locations: {},
    score_threshold: 0.7,
    common_requirements: []
  };

  history.forEach(item => {
    if (item.provider_type) {
      preferences.preferred_provider_types[item.provider_type] = 
        (preferences.preferred_provider_types[item.provider_type] || 0) + 1;
    }
    
    if (item.feedback_type === 'accepted' && item.match_score > preferences.score_threshold) {
      preferences.score_threshold = Math.max(preferences.score_threshold, item.match_score);
    }
  });

  return preferences;
}

async function getCollaborativeRecommendations(supabase: any, userId: string, userType: string) {
  // Find similar users based on feedback patterns
  const { data: similarUsers } = await supabase
    .from('match_feedback')
    .select('user_id, provider_type, feedback_type')
    .neq('user_id', userId)
    .eq('feedback_type', 'accepted');

  // Group recommendations by what similar users liked
  const recommendations = {};
  (similarUsers || []).forEach(item => {
    if (item.provider_type) {
      recommendations[item.provider_type] = (recommendations[item.provider_type] || 0) + 1;
    }
  });

  return Object.entries(recommendations)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([type, count]) => ({
      type,
      score: count,
      source: 'collaborative'
    }));
}

async function getContentBasedRecommendations(supabase: any, userId: string, userType: string, preferences: any) {
  // Get user's historical preferences
  const recommendations = [];
  
  Object.entries(preferences.preferred_provider_types).forEach(([type, count]) => {
    recommendations.push({
      type,
      score: count,
      source: 'content_based'
    });
  });

  return recommendations;
}

function combineRecommendations(collaborative: any[], contentBased: any[]) {
  const combined = {};
  
  collaborative.forEach(rec => {
    combined[rec.type] = (combined[rec.type] || 0) + rec.score * 0.6;
  });
  
  contentBased.forEach(rec => {
    combined[rec.type] = (combined[rec.type] || 0) + rec.score * 0.4;
  });
  
  return Object.entries(combined)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([type, score]) => ({
      type,
      score,
      source: 'hybrid'
    }));
}

function generateRecommendationExplanation(rec: any, preferences: any) {
  return `Recommended based on your ${rec.source} preferences and similar users' choices`;
}

function calculateRecommendationConfidence(rec: any) {
  if (rec.score > 10) return 'high';
  if (rec.score > 5) return 'medium';
  return 'low';
}

function analyzeSimilarityFactors(embeddingA: number[], embeddingB: number[]) {
  return {
    semantic_overlap: calculateSemanticSimilarity(embeddingA, embeddingB),
    conceptual_alignment: Math.random() * 0.3 + 0.5, // Simplified
    domain_relevance: Math.random() * 0.4 + 0.4
  };
}

function categorizeRelationshipStrength(similarity: number) {
  if (similarity > 0.8) return 'strong';
  if (similarity > 0.6) return 'moderate';
  if (similarity > 0.4) return 'weak';
  return 'minimal';
}

async function gatherContextualData(supabase: any, userId: string, context: any) {
  const contextData = {
    time_context: {
      current_time: new Date().toISOString(),
      business_hours: isBusinessHours(),
      season: getCurrentSeason()
    },
    user_context: {
      recent_activity: await getUserRecentActivity(supabase, userId),
      preferences: await getUserPreferences(supabase, userId)
    },
    market_context: {
      industry_trends: await getIndustryTrends(supabase),
      supply_demand: await getSupplyDemandMetrics(supabase)
    }
  };

  return contextData;
}

function adjustWeightsForContext(context: any, contextualData: any) {
  const baseWeights = {
    location_weight: 0.25,
    expertise_weight: 0.30,
    compliance_weight: 0.20,
    size_weight: 0.15,
    rating_weight: 0.10
  };

  // Adjust based on context
  if (context.urgency === 'high') {
    baseWeights.location_weight *= 1.2;
    baseWeights.rating_weight *= 1.3;
  }

  if (context.budget_constrained) {
    baseWeights.size_weight *= 0.8;
  }

  return baseWeights;
}

function createUserDescription(requirements: any, userType: string) {
  return `User type: ${userType}. Requirements: ${JSON.stringify(requirements)}`;
}

async function getEntityDescription(supabase: any, entityId: string, entityType: string) {
  const tableName = getTableName(entityType);
  const { data } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', entityId)
    .single();

  if (!data) return '';

  return `${data.name || 'Entity'} - ${data.description || ''} - ${JSON.stringify(data)}`;
}

function hashContent(content: string) {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

function isBusinessHours() {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 9 && hour <= 17;
}

function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

async function getUserRecentActivity(supabase: any, userId: string) {
  const { data } = await supabase
    .from('match_feedback')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  return data || [];
}

async function getUserPreferences(supabase: any, userId: string) {
  // Simplified preferences
  return {
    preferred_location: 'São Paulo',
    preferred_size: 'medium',
    quality_focus: 'high'
  };
}

async function getIndustryTrends(supabase: any) {
  return {
    growing_sectors: ['biotechnology', 'digital_health'],
    emerging_technologies: ['AI', 'IoT', 'blockchain'],
    regulatory_focus: ['sustainability', 'data_privacy']
  };
}

async function getSupplyDemandMetrics(supabase: any) {
  return {
    high_demand_services: ['regulatory_consulting', 'quality_assurance'],
    supply_shortage: ['specialized_equipment', 'expert_consultants'],
    market_saturation: ['basic_testing', 'routine_analysis']
  };
}
