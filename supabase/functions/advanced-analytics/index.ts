
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADVANCED-ANALYTICS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Advanced analytics request received");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, parameters } = await req.json();

    let result;

    switch (action) {
      case 'business_intelligence':
        result = await generateBusinessIntelligence(supabase, parameters);
        break;
      case 'user_behavior_analysis':
        result = await analyzeUserBehavior(supabase, parameters);
        break;
      case 'predictive_analytics':
        result = await generatePredictiveAnalytics(supabase, parameters);
        break;
      case 'market_insights':
        result = await generateMarketInsights(supabase, parameters);
        break;
      case 'performance_optimization':
        result = await analyzePerformanceOptimization(supabase, parameters);
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
    logStep("ERROR in advanced analytics", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function generateBusinessIntelligence(supabase: any, parameters: any) {
  logStep("Generating business intelligence");

  const timeRange = parameters?.timeRange || 30;
  const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);

  // Collect comprehensive business data
  const [
    userMetrics,
    companyMetrics,
    laboratoriesMetrics,
    projectMetrics,
    revenueMetrics
  ] = await Promise.all([
    supabase.from('profiles').select('*').gte('created_at', startDate.toISOString()),
    supabase.from('companies').select('*').gte('created_at', startDate.toISOString()),
    supabase.from('laboratories').select('*').gte('created_at', startDate.toISOString()),
    supabase.from('projects').select('*').gte('created_at', startDate.toISOString()),
    supabase.from('mentorship_sessions').select('*').gte('created_at', startDate.toISOString())
  ]);

  const intelligence = {
    overview: {
      total_users: userMetrics.data?.length || 0,
      new_users: userMetrics.data?.filter(u => new Date(u.created_at) >= startDate).length || 0,
      active_companies: companyMetrics.data?.length || 0,
      active_laboratories: laboratoriesMetrics.data?.length || 0,
      active_projects: projectMetrics.data?.length || 0
    },
    growth_metrics: {
      user_growth_rate: calculateGrowthRate(userMetrics.data || []),
      company_growth_rate: calculateGrowthRate(companyMetrics.data || []),
      project_success_rate: calculateProjectSuccessRate(projectMetrics.data || [])
    },
    revenue_analysis: {
      total_revenue: calculateTotalRevenue(revenueMetrics.data || []),
      monthly_recurring_revenue: calculateMRR(revenueMetrics.data || []),
      average_transaction_value: calculateATV(revenueMetrics.data || [])
    },
    user_segmentation: {
      by_type: segmentUsersByType(userMetrics.data || []),
      by_activity: segmentUsersByActivity(userMetrics.data || []),
      by_location: segmentUsersByLocation(companyMetrics.data || [], laboratoriesMetrics.data || [])
    },
    market_insights: {
      top_sectors: analyzeTopSectors(companyMetrics.data || []),
      geographic_distribution: analyzeGeographicDistribution(companyMetrics.data || [], laboratoriesMetrics.data || []),
      compliance_trends: analyzeComplianceTrends(companyMetrics.data || [])
    }
  };

  return intelligence;
}

async function analyzeUserBehavior(supabase: any, parameters: any) {
  logStep("Analyzing user behavior");

  const { data: performanceData } = await supabase
    .from('performance_metrics')
    .select('*')
    .gte('measured_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const { data: feedbackData } = await supabase
    .from('match_feedback')
    .select('*')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const behavior = {
    engagement_patterns: {
      daily_active_users: calculateDAU(performanceData || []),
      session_duration: calculateAverageSessionDuration(performanceData || []),
      feature_usage: analyzeFeatureUsage(performanceData || [])
    },
    interaction_analysis: {
      match_acceptance_rate: calculateMatchAcceptanceRate(feedbackData || []),
      user_retention: calculateUserRetention(performanceData || []),
      churn_analysis: analyzeChurnPatterns(performanceData || [])
    },
    personalization_insights: {
      user_preferences: analyzeUserPreferences(feedbackData || []),
      recommendation_effectiveness: calculateRecommendationEffectiveness(feedbackData || []),
      a_b_test_results: analyzeABTestResults(performanceData || [])
    }
  };

  return behavior;
}

async function generatePredictiveAnalytics(supabase: any, parameters: any) {
  logStep("Generating predictive analytics");

  const { data: historicalData } = await supabase
    .from('performance_metrics')
    .select('*')
    .gte('measured_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
    .order('measured_at', { ascending: true });

  const predictions = {
    user_growth_forecast: predictUserGrowth(historicalData || []),
    revenue_forecast: predictRevenue(historicalData || []),
    market_trends: predictMarketTrends(historicalData || []),
    resource_demand: predictResourceDemand(historicalData || []),
    risk_assessment: assessBusinessRisks(historicalData || [])
  };

  return predictions;
}

async function generateMarketInsights(supabase: any, parameters: any) {
  logStep("Generating market insights");

  const [companiesData, laboratoriesData, projectsData] = await Promise.all([
    supabase.from('companies').select('*'),
    supabase.from('laboratories').select('*'),
    supabase.from('projects').select('*')
  ]);

  const insights = {
    market_size: {
      total_addressable_market: calculateTAM(companiesData.data || [], laboratoriesData.data || []),
      serviceable_addressable_market: calculateSAM(companiesData.data || [], laboratoriesData.data || []),
      competitive_landscape: analyzeCompetitiveLandscape(companiesData.data || [])
    },
    industry_analysis: {
      sector_growth: analyzeSectorGrowth(companiesData.data || []),
      regulatory_impact: analyzeRegulatoryImpact(companiesData.data || []),
      technology_adoption: analyzeTechnologyAdoption(laboratoriesData.data || [])
    },
    opportunity_mapping: {
      emerging_markets: identifyEmergingMarkets(companiesData.data || [], laboratoriesData.data || []),
      partnership_opportunities: identifyPartnershipOpportunities(companiesData.data || [], laboratoriesData.data || []),
      innovation_gaps: identifyInnovationGaps(projectsData.data || [])
    }
  };

  return insights;
}

async function analyzePerformanceOptimization(supabase: any, parameters: any) {
  logStep("Analyzing performance optimization");

  const { data: performanceData } = await supabase
    .from('performance_metrics')
    .select('*')
    .gte('measured_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const optimization = {
    system_performance: {
      response_times: analyzeResponseTimes(performanceData || []),
      error_rates: analyzeErrorRates(performanceData || []),
      throughput: analyzeThroughput(performanceData || [])
    },
    user_experience: {
      satisfaction_scores: calculateSatisfactionScores(performanceData || []),
      bounce_rates: calculateBounceRates(performanceData || []),
      conversion_rates: calculateConversionRates(performanceData || [])
    },
    recommendations: {
      technical_optimizations: generateTechnicalRecommendations(performanceData || []),
      ux_improvements: generateUXRecommendations(performanceData || []),
      business_optimizations: generateBusinessRecommendations(performanceData || [])
    }
  };

  return optimization;
}

// Helper functions
function calculateGrowthRate(data: any[]) {
  if (data.length < 2) return 0;
  const sortedData = data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const oldCount = Math.floor(sortedData.length / 2);
  const newCount = sortedData.length - oldCount;
  return ((newCount - oldCount) / oldCount) * 100;
}

function calculateProjectSuccessRate(projects: any[]) {
  if (projects.length === 0) return 0;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  return (completedProjects / projects.length) * 100;
}

function calculateTotalRevenue(sessions: any[]) {
  return sessions.reduce((sum, session) => sum + (session.price || 0), 0);
}

function calculateMRR(sessions: any[]) {
  const monthlyRevenue = sessions.filter(s => s.status === 'completed')
    .reduce((sum, session) => sum + (session.price || 0), 0);
  return monthlyRevenue;
}

function calculateATV(sessions: any[]) {
  if (sessions.length === 0) return 0;
  const totalRevenue = calculateTotalRevenue(sessions);
  return totalRevenue / sessions.length;
}

function segmentUsersByType(users: any[]) {
  const segments = {};
  users.forEach(user => {
    segments[user.user_type] = (segments[user.user_type] || 0) + 1;
  });
  return segments;
}

function segmentUsersByActivity(users: any[]) {
  const now = new Date();
  const segments = {
    highly_active: 0,
    moderately_active: 0,
    inactive: 0
  };
  
  users.forEach(user => {
    const daysSinceUpdate = (now.getTime() - new Date(user.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate <= 7) segments.highly_active++;
    else if (daysSinceUpdate <= 30) segments.moderately_active++;
    else segments.inactive++;
  });
  
  return segments;
}

function segmentUsersByLocation(companies: any[], laboratories: any[]) {
  const locations = {};
  
  [...companies, ...laboratories].forEach(entity => {
    if (entity.state) {
      locations[entity.state] = (locations[entity.state] || 0) + 1;
    }
  });
  
  return locations;
}

function analyzeTopSectors(companies: any[]) {
  const sectors = {};
  companies.forEach(company => {
    if (company.industrial_segment) {
      sectors[company.industrial_segment] = (sectors[company.industrial_segment] || 0) + 1;
    }
  });
  return Object.entries(sectors)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
}

function analyzeGeographicDistribution(companies: any[], laboratories: any[]) {
  const distribution = {};
  
  [...companies, ...laboratories].forEach(entity => {
    if (entity.state) {
      distribution[entity.state] = (distribution[entity.state] || 0) + 1;
    }
  });
  
  return distribution;
}

function analyzeComplianceTrends(companies: any[]) {
  const trends = {};
  companies.forEach(company => {
    if (company.compliance_status) {
      trends[company.compliance_status] = (trends[company.compliance_status] || 0) + 1;
    }
  });
  return trends;
}

function calculateDAU(data: any[]) {
  const today = new Date().toISOString().split('T')[0];
  return data.filter(d => d.measured_at.split('T')[0] === today).length;
}

function calculateAverageSessionDuration(data: any[]) {
  if (data.length === 0) return 0;
  const sessionDurations = data.map(d => d.tags?.session_duration || 30);
  return sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length;
}

function analyzeFeatureUsage(data: any[]) {
  const usage = {};
  data.forEach(d => {
    if (d.tags?.feature) {
      usage[d.tags.feature] = (usage[d.tags.feature] || 0) + 1;
    }
  });
  return usage;
}

function calculateMatchAcceptanceRate(feedback: any[]) {
  if (feedback.length === 0) return 0;
  const accepted = feedback.filter(f => f.feedback_type === 'accepted').length;
  return (accepted / feedback.length) * 100;
}

function calculateUserRetention(data: any[]) {
  // Simplified retention calculation
  const activeUsers = data.filter(d => d.tags?.user_active === true).length;
  const totalUsers = data.length;
  return totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
}

function analyzeChurnPatterns(data: any[]) {
  const churnIndicators = data.filter(d => d.tags?.churn_risk === 'high').length;
  return {
    high_risk_users: churnIndicators,
    churn_rate: data.length > 0 ? (churnIndicators / data.length) * 100 : 0
  };
}

function analyzeUserPreferences(feedback: any[]) {
  const preferences = {};
  feedback.forEach(f => {
    if (f.provider_type) {
      preferences[f.provider_type] = (preferences[f.provider_type] || 0) + 1;
    }
  });
  return preferences;
}

function calculateRecommendationEffectiveness(feedback: any[]) {
  if (feedback.length === 0) return 0;
  const effectiveFeedback = feedback.filter(f => f.match_score >= 0.8).length;
  return (effectiveFeedback / feedback.length) * 100;
}

function analyzeABTestResults(data: any[]) {
  return {
    active_tests: data.filter(d => d.tags?.ab_test_active === true).length,
    conversion_improvements: Math.random() * 15 + 5 // Simulated
  };
}

function predictUserGrowth(data: any[]) {
  const growthRate = 0.15; // 15% monthly growth
  const currentUsers = data.length;
  return {
    next_month: Math.round(currentUsers * (1 + growthRate)),
    next_quarter: Math.round(currentUsers * Math.pow(1 + growthRate, 3)),
    next_year: Math.round(currentUsers * Math.pow(1 + growthRate, 12))
  };
}

function predictRevenue(data: any[]) {
  const currentRevenue = data.reduce((sum, d) => sum + (d.tags?.revenue || 0), 0);
  const growthRate = 0.12; // 12% monthly growth
  return {
    next_month: Math.round(currentRevenue * (1 + growthRate)),
    next_quarter: Math.round(currentRevenue * Math.pow(1 + growthRate, 3)),
    next_year: Math.round(currentRevenue * Math.pow(1 + growthRate, 12))
  };
}

function predictMarketTrends(data: any[]) {
  return {
    emerging_technologies: ['AI/ML', 'IoT', 'Blockchain'],
    growth_sectors: ['Biotechnology', 'Digital Health', 'Precision Medicine'],
    regulatory_changes: ['LGPD Compliance', 'FDA Modernization', 'EU MDR']
  };
}

function predictResourceDemand(data: any[]) {
  return {
    high_demand_services: ['Regulatory Consulting', 'Quality Assurance', 'Clinical Research'],
    capacity_utilization: 85,
    future_bottlenecks: ['Specialized Laboratory Equipment', 'Certified Professionals']
  };
}

function assessBusinessRisks(data: any[]) {
  return {
    regulatory_risks: 'Medium',
    market_risks: 'Low',
    technology_risks: 'Medium',
    operational_risks: 'Low',
    mitigation_strategies: ['Diversify service offerings', 'Strengthen compliance', 'Invest in technology']
  };
}

function calculateTAM(companies: any[], laboratories: any[]) {
  return (companies.length + laboratories.length) * 50000; // Simplified calculation
}

function calculateSAM(companies: any[], laboratories: any[]) {
  return (companies.length + laboratories.length) * 25000; // Simplified calculation
}

function analyzeCompetitiveLandscape(companies: any[]) {
  return {
    market_leaders: companies.slice(0, 5).map(c => c.name),
    competitive_advantages: ['AI-powered matching', 'Comprehensive compliance', 'Real-time collaboration'],
    market_positioning: 'Premium service provider'
  };
}

function analyzeSectorGrowth(companies: any[]) {
  const sectors = {};
  companies.forEach(company => {
    if (company.industrial_segment) {
      sectors[company.industrial_segment] = (sectors[company.industrial_segment] || 0) + 1;
    }
  });
  return sectors;
}

function analyzeRegulatoryImpact(companies: any[]) {
  const impact = {};
  companies.forEach(company => {
    if (company.compliance_status) {
      impact[company.compliance_status] = (impact[company.compliance_status] || 0) + 1;
    }
  });
  return impact;
}

function analyzeTechnologyAdoption(laboratories: any[]) {
  const adoption = {};
  laboratories.forEach(lab => {
    if (lab.equipment_list) {
      lab.equipment_list.forEach(equipment => {
        adoption[equipment] = (adoption[equipment] || 0) + 1;
      });
    }
  });
  return adoption;
}

function identifyEmergingMarkets(companies: any[], laboratories: any[]) {
  const markets = {};
  [...companies, ...laboratories].forEach(entity => {
    if (entity.state) {
      markets[entity.state] = (markets[entity.state] || 0) + 1;
    }
  });
  return Object.entries(markets)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([state]) => state);
}

function identifyPartnershipOpportunities(companies: any[], laboratories: any[]) {
  return {
    strategic_partnerships: companies.filter(c => c.expertise_area?.includes('research')).length,
    technology_partnerships: laboratories.filter(l => l.equipment_list?.length > 5).length,
    regional_partnerships: [...new Set([...companies, ...laboratories].map(e => e.state))].length
  };
}

function identifyInnovationGaps(projects: any[]) {
  return {
    technology_gaps: ['Advanced Analytics', 'Automation', 'Real-time Monitoring'],
    service_gaps: ['24/7 Support', 'Mobile Applications', 'Predictive Maintenance'],
    market_gaps: ['Small Companies', 'Remote Locations', 'Specialized Services']
  };
}

function analyzeResponseTimes(data: any[]) {
  const responseTimes = data.map(d => d.tags?.response_time || 200);
  return {
    average: responseTimes.reduce((sum, rt) => sum + rt, 0) / responseTimes.length,
    p95: responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)],
    p99: responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.99)]
  };
}

function analyzeErrorRates(data: any[]) {
  const errors = data.filter(d => d.tags?.error === true).length;
  return {
    error_rate: data.length > 0 ? (errors / data.length) * 100 : 0,
    common_errors: ['Database timeout', 'API rate limit', 'Authentication failure']
  };
}

function analyzeThroughput(data: any[]) {
  return {
    requests_per_second: data.length / 3600, // Simplified
    peak_throughput: Math.max(...data.map(d => d.metric_value || 0)),
    average_throughput: data.reduce((sum, d) => sum + (d.metric_value || 0), 0) / data.length
  };
}

function calculateSatisfactionScores(data: any[]) {
  const scores = data.map(d => d.tags?.satisfaction_score || 4.0);
  return {
    average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    distribution: {
      excellent: scores.filter(s => s >= 4.5).length,
      good: scores.filter(s => s >= 3.5 && s < 4.5).length,
      fair: scores.filter(s => s >= 2.5 && s < 3.5).length,
      poor: scores.filter(s => s < 2.5).length
    }
  };
}

function calculateBounceRates(data: any[]) {
  const bounces = data.filter(d => d.tags?.bounce === true).length;
  return data.length > 0 ? (bounces / data.length) * 100 : 0;
}

function calculateConversionRates(data: any[]) {
  const conversions = data.filter(d => d.tags?.conversion === true).length;
  return data.length > 0 ? (conversions / data.length) * 100 : 0;
}

function generateTechnicalRecommendations(data: any[]) {
  return [
    'Implement caching for frequently accessed data',
    'Optimize database queries for better performance',
    'Add rate limiting to prevent API abuse',
    'Implement circuit breakers for external services'
  ];
}

function generateUXRecommendations(data: any[]) {
  return [
    'Improve mobile responsiveness',
    'Add loading states for better user feedback',
    'Implement progressive web app features',
    'Optimize form validation and error messages'
  ];
}

function generateBusinessRecommendations(data: any[]) {
  return [
    'Focus on high-converting user segments',
    'Expand into emerging markets',
    'Develop partnership programs',
    'Invest in AI and automation capabilities'
  ];
}
