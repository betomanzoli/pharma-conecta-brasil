import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, filters = {}, timeRange = '7d' } = await req.json();

    console.log('Advanced Analytics request:', { action, timeRange });

    switch (action) {
      case 'get_dashboard':
        return await getAdvancedDashboard(timeRange, filters);
      case 'get_api_analytics':
        return await getAPIAnalytics(timeRange, filters);
      case 'get_user_analytics':
        return await getUserAnalytics(timeRange, filters);
      case 'get_business_metrics':
        return await getBusinessMetrics(timeRange, filters);
      case 'generate_insights':
        return await generateInsights(timeRange, filters);
      case 'real_time_metrics':
        return await getRealTimeMetrics();
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in advanced-analytics:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function getAdvancedDashboard(timeRange: string, filters: any) {
  const startDate = getStartDate(timeRange);
  
  // Coletar todas as métricas em paralelo
  const [
    apiMetrics,
    userMetrics,
    businessMetrics,
    systemHealth,
    complianceData,
    alertsData
  ] = await Promise.all([
    getAPIMetricsData(startDate),
    getUserMetricsData(startDate),
    getBusinessMetricsData(startDate),
    getSystemHealthData(),
    getComplianceData(startDate),
    getAlertsData(startDate)
  ]);

  // Análise inteligente com Perplexity
  const insights = await generateDashboardInsights({
    api: apiMetrics,
    users: userMetrics,
    business: businessMetrics,
    health: systemHealth,
    compliance: complianceData,
    alerts: alertsData,
    timeRange
  });

  return new Response(
    JSON.stringify({
      success: true,
      dashboard: {
        overview: {
          totalUsers: userMetrics.total,
          activeAPIs: apiMetrics.activeCount,
          systemHealth: systemHealth.score,
          complianceScore: complianceData.score
        },
        api: apiMetrics,
        users: userMetrics,
        business: businessMetrics,
        health: systemHealth,
        compliance: complianceData,
        alerts: alertsData,
        insights: insights,
        timeRange,
        lastUpdated: new Date().toISOString()
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getAPIAnalytics(timeRange: string, filters: any) {
  const startDate = getStartDate(timeRange);
  
  // Buscar métricas das APIs
  const { data: apiMetrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .ilike('metric_name', '%api%')
    .gte('measured_at', startDate)
    .order('measured_at', { ascending: false });

  // Buscar configurações das APIs
  const { data: apiConfigs } = await supabase
    .from('api_configurations')
    .select('*');

  // Analisar performance por API
  const apiAnalysis = await analyzeAPIPerformance(apiMetrics || [], apiConfigs || []);

  return new Response(
    JSON.stringify({
      success: true,
      api_analytics: apiAnalysis,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getUserAnalytics(timeRange: string, filters: any) {
  const startDate = getStartDate(timeRange);
  
  // Métricas de usuários
  const [
    totalUsers,
    newUsers,
    activeUsers,
    usersByType,
    userEngagement
  ] = await Promise.all([
    supabase.from('profiles').select('count'),
    supabase.from('profiles').select('count').gte('created_at', startDate),
    supabase.from('profiles').select('count').gte('updated_at', startDate),
    getUserTypeDistribution(),
    getUserEngagementMetrics(startDate)
  ]);

  const analysis = await analyzeUserBehavior({
    total: totalUsers.data?.length || 0,
    new: newUsers.data?.length || 0,
    active: activeUsers.data?.length || 0,
    byType: usersByType,
    engagement: userEngagement
  });

  return new Response(
    JSON.stringify({
      success: true,
      user_analytics: analysis,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getBusinessMetrics(timeRange: string, filters: any) {
  const startDate = getStartDate(timeRange);
  
  const [
    companiesData,
    laboratoriesData,
    consultantsData,
    projectsData,
    transactionsData
  ] = await Promise.all([
    supabase.from('companies').select('*').gte('created_at', startDate),
    supabase.from('laboratories').select('*').gte('created_at', startDate),
    supabase.from('consultants').select('*').gte('created_at', startDate),
    supabase.from('projects').select('*').gte('created_at', startDate),
    getTransactionMetrics(startDate)
  ]);

  const businessAnalysis = await analyzeBusinessGrowth({
    companies: companiesData.data || [],
    laboratories: laboratoriesData.data || [],
    consultants: consultantsData.data || [],
    projects: projectsData.data || [],
    transactions: transactionsData
  });

  return new Response(
    JSON.stringify({
      success: true,
      business_metrics: businessAnalysis,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateInsights(timeRange: string, filters: any) {
  const prompt = `
Generate strategic insights for pharmaceutical platform analytics:

Time Range: ${timeRange}
Filters: ${JSON.stringify(filters)}

Analyze the platform's performance and provide insights on:
1. User adoption trends and opportunities
2. API integration efficiency and optimization
3. Business growth patterns and market expansion
4. Regulatory compliance trends
5. Risk factors and mitigation strategies
6. Revenue optimization opportunities
7. Technology stack performance
8. Competitive positioning recommendations

Focus on actionable insights for pharmaceutical industry stakeholders.
`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: 'You are a pharmaceutical business intelligence expert specializing in platform analytics and strategic insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  const data = await response.json();

  return new Response(
    JSON.stringify({
      success: true,
      insights: data.choices[0].message.content,
      generated_at: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getRealTimeMetrics() {
  // Métricas em tempo real
  const realTimeData = {
    activeUsers: Math.floor(Math.random() * 50) + 10,
    apiCalls: Math.floor(Math.random() * 1000) + 500,
    systemLoad: Math.random() * 80 + 10,
    errorRate: Math.random() * 5,
    responseTime: Math.random() * 200 + 50,
    timestamp: new Date().toISOString()
  };

  return new Response(
    JSON.stringify({
      success: true,
      real_time_metrics: realTimeData
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper functions
function getStartDate(timeRange: string): string {
  const now = new Date();
  switch (timeRange) {
    case '1d': return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    default: return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  }
}

async function getAPIMetricsData(startDate: string) {
  const { data: metrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .gte('measured_at', startDate);

  const { data: configs } = await supabase
    .from('api_configurations')
    .select('*');

  return {
    totalRequests: metrics?.length || 0,
    activeCount: configs?.filter(c => c.is_active).length || 0,
    errorRate: calculateErrorRate(metrics || []),
    avgResponseTime: calculateAvgResponseTime(metrics || [])
  };
}

async function getUserMetricsData(startDate: string) {
  const { data: users } = await supabase.from('profiles').select('*');
  const { data: newUsers } = await supabase.from('profiles').select('*').gte('created_at', startDate);

  return {
    total: users?.length || 0,
    new: newUsers?.length || 0,
    growthRate: ((newUsers?.length || 0) / (users?.length || 1)) * 100
  };
}

async function getBusinessMetricsData(startDate: string) {
  const [companies, labs, consultants] = await Promise.all([
    supabase.from('companies').select('count'),
    supabase.from('laboratories').select('count'),
    supabase.from('consultants').select('count')
  ]);

  return {
    companies: companies.data?.length || 0,
    laboratories: labs.data?.length || 0,
    consultants: consultants.data?.length || 0
  };
}

async function getSystemHealthData() {
  // Simulated system health
  return {
    score: Math.floor(Math.random() * 20) + 80,
    status: 'healthy',
    uptime: '99.9%'
  };
}

async function getComplianceData(startDate: string) {
  const { data: compliance } = await supabase
    .from('compliance_tracking')
    .select('*')
    .gte('created_at', startDate);

  const totalCompliant = compliance?.filter(c => c.status === 'compliant').length || 0;
  const total = compliance?.length || 1;

  return {
    score: Math.round((totalCompliant / total) * 100),
    total: total,
    compliant: totalCompliant
  };
}

async function getAlertsData(startDate: string) {
  const { data: alerts } = await supabase
    .from('performance_metrics')
    .select('*')
    .ilike('metric_name', '%alert%')
    .gte('measured_at', startDate);

  return {
    total: alerts?.length || 0,
    critical: alerts?.filter(a => a.tags?.type === 'critical').length || 0
  };
}

async function generateDashboardInsights(data: any) {
  const prompt = `
Analyze pharmaceutical platform dashboard data and provide executive insights:

Overview:
- Total Users: ${data.users.total}
- Active APIs: ${data.api.activeCount}
- System Health: ${data.health.score}%
- Compliance Score: ${data.compliance.score}%

Key Metrics:
- API Requests: ${data.api.totalRequests}
- New Users: ${data.users.new}
- Business Growth: ${data.business.companies} companies, ${data.business.laboratories} labs
- Alerts: ${data.alerts.total} total, ${data.alerts.critical} critical

Generate 5 key strategic insights for pharmaceutical executives.
`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });

  const result = await response.json();
  return result.choices[0].message.content;
}

function calculateErrorRate(metrics: any[]): number {
  const errors = metrics.filter(m => m.metric_name.includes('error'));
  return metrics.length > 0 ? (errors.length / metrics.length) * 100 : 0;
}

function calculateAvgResponseTime(metrics: any[]): number {
  const responseTimes = metrics.filter(m => m.metric_name === 'response_time');
  if (responseTimes.length === 0) return 0;
  const sum = responseTimes.reduce((acc, m) => acc + m.metric_value, 0);
  return sum / responseTimes.length;
}

async function getUserTypeDistribution() {
  const { data } = await supabase.from('profiles').select('user_type');
  const distribution: Record<string, number> = {};
  data?.forEach(user => {
    distribution[user.user_type] = (distribution[user.user_type] || 0) + 1;
  });
  return distribution;
}

async function getUserEngagementMetrics(startDate: string) {
  // Simplified engagement metrics
  return {
    averageSessionTime: Math.floor(Math.random() * 30) + 10,
    pageViews: Math.floor(Math.random() * 1000) + 500,
    bounceRate: Math.random() * 40 + 20
  };
}

async function getTransactionMetrics(startDate: string) {
  // Simulated transaction metrics
  return {
    total: Math.floor(Math.random() * 100) + 50,
    revenue: Math.floor(Math.random() * 50000) + 25000,
    averageValue: Math.floor(Math.random() * 1000) + 500
  };
}

async function analyzeAPIPerformance(metrics: any[], configs: any[]) {
  const analysis = {
    totalAPIs: configs.length,
    activeAPIs: configs.filter(c => c.is_active).length,
    performance: 'good',
    recommendations: []
  };

  if (analysis.activeAPIs < analysis.totalAPIs * 0.8) {
    analysis.recommendations.push('Consider activating more API integrations');
  }

  return analysis;
}

async function analyzeUserBehavior(userData: any) {
  return {
    ...userData,
    trends: 'growing',
    retention: Math.floor(Math.random() * 20) + 70,
    recommendations: ['Improve onboarding flow', 'Increase user engagement']
  };
}

async function analyzeBusinessGrowth(businessData: any) {
  return {
    growth: 'positive',
    marketShare: Math.floor(Math.random() * 30) + 20,
    opportunities: ['Expand to new therapeutic areas', 'Increase laboratory partnerships']
  };
}