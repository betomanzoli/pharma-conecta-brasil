import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logStep = (step: string, details?: any) => {
  console.log(`[${new Date().toISOString()}] ${step}`, details || '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Real-time Alerts - Starting');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { alertType, filters, userPreferences } = await req.json();
    logStep('Alert parameters', { alertType, filters });

    let alerts = [];

    switch (alertType) {
      case 'regulatory_changes':
        alerts = await getRegulatoryScanAlerts(perplexityKey, filters);
        break;
      case 'market_opportunities':
        alerts = await getMarketOpportunityAlerts(perplexityKey, filters);
        break;
      case 'compliance_deadlines':
        alerts = await getComplianceDeadlineAlerts(supabase, filters);
        break;
      case 'industry_news':
        alerts = await getIndustryNewsAlerts(perplexityKey, filters);
        break;
      case 'partnership_matches':
        alerts = await getPartnershipMatchAlerts(supabase, userPreferences);
        break;
      default:
        alerts = await getAllRelevantAlerts(supabase, perplexityKey, userPreferences);
    }

    // Processar e classificar alertas por relevância
    const processedAlerts = await processAlerts(alerts, userPreferences);
    
    // Salvar alertas relevantes no banco
    await saveRelevantAlerts(supabase, processedAlerts);

    logStep('Real-time alerts processed', { alertCount: processedAlerts.length });

    return new Response(JSON.stringify({
      success: true,
      alerts: processedAlerts,
      total_alerts: processedAlerts.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('Error in real-time alerts', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getRegulatoryScanAlerts(perplexityKey: string, filters: any) {
  logStep('Scanning regulatory changes');
  
  const prompt = `Busque as últimas mudanças regulatórias na ANVISA, FDA e EMA relevantes para a indústria farmacêutica brasileira. 
  Foco em: ${filters?.focus || 'medicamentos, registro, boas práticas'}. 
  Inclua apenas alertas dos últimos 7 dias com impacto direto na indústria.`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: 'Você é um analista regulatório farmacêutico. Forneça alertas estruturados e específicos.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1500,
      search_recency_filter: 'week'
    }),
  });

  const data = await response.json();
  return parseRegulatoryAlerts(data.choices[0].message.content);
}

async function getMarketOpportunityAlerts(perplexityKey: string, filters: any) {
  logStep('Scanning market opportunities');
  
  const prompt = `Identifique oportunidades de mercado emergentes na indústria farmacêutica brasileira. 
  Foco em: ${filters?.sectors || 'genéricos, biológicos, OTC'}. 
  Inclua editais, parcerias, investimentos e trends tecnológicos dos últimos 30 dias.`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: 'Você é um analista de mercado farmacêutico. Identifique oportunidades concretas e acionáveis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500,
      search_recency_filter: 'month'
    }),
  });

  const data = await response.json();
  return parseMarketOpportunities(data.choices[0].message.content);
}

async function getComplianceDeadlineAlerts(supabase: any, filters: any) {
  logStep('Getting compliance deadline alerts');
  
  // Buscar prazos de compliance próximos
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const { data: complianceData } = await supabase
    .from('compliance_tracking')
    .select('*')
    .lt('expires_at', thirtyDaysFromNow.toISOString())
    .eq('status', 'active')
    .order('expires_at', { ascending: true });

  return (complianceData || []).map((item: any) => ({
    type: 'compliance_deadline',
    title: `Prazo de compliance próximo: ${item.compliance_type}`,
    description: `Vence em ${new Date(item.expires_at).toLocaleDateString('pt-BR')}`,
    severity: getDaysUntilExpiry(item.expires_at) <= 7 ? 'critical' : 'high',
    source: 'internal_compliance',
    metadata: item
  }));
}

async function getIndustryNewsAlerts(perplexityKey: string, filters: any) {
  logStep('Scanning industry news');
  
  const prompt = `Busque notícias relevantes da indústria farmacêutica brasileira dos últimos 7 dias. 
  Foque em: fusões, aquisições, lançamentos de produtos, mudanças de liderança, investimentos em P&D. 
  Especialização: ${filters?.specialization || 'farmacêutica geral'}.`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: 'Você é um jornalista especializado em indústria farmacêutica. Foque em notícias impactantes.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1500,
      search_recency_filter: 'week'
    }),
  });

  const data = await response.json();
  return parseIndustryNews(data.choices[0].message.content);
}

async function getPartnershipMatchAlerts(supabase: any, userPreferences: any) {
  logStep('Finding partnership match alerts');
  
  // Buscar novos matches baseados no perfil do usuário
  const { data: recentMatches } = await supabase
    .from('match_feedback')
    .select('*')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // últimas 24h
    .eq('feedback_type', 'positive');

  return (recentMatches || []).map((match: any) => ({
    type: 'partnership_match',
    title: `Novo match encontrado: ${match.provider_name}`,
    description: `Compatibilidade de ${Math.round(match.match_score)}% com seu perfil`,
    severity: match.match_score >= 80 ? 'high' : 'medium',
    source: 'ai_matching',
    metadata: match
  }));
}

async function getAllRelevantAlerts(supabase: any, perplexityKey: string, userPreferences: any) {
  logStep('Getting all relevant alerts');
  
  const [regulatory, market, compliance, industry, partnerships] = await Promise.allSettled([
    getRegulatoryScanAlerts(perplexityKey, userPreferences),
    getMarketOpportunityAlerts(perplexityKey, userPreferences),
    getComplianceDeadlineAlerts(supabase, userPreferences),
    getIndustryNewsAlerts(perplexityKey, userPreferences),
    getPartnershipMatchAlerts(supabase, userPreferences)
  ]);

  const allAlerts = [];
  if (regulatory.status === 'fulfilled') allAlerts.push(...regulatory.value);
  if (market.status === 'fulfilled') allAlerts.push(...market.value);
  if (compliance.status === 'fulfilled') allAlerts.push(...compliance.value);
  if (industry.status === 'fulfilled') allAlerts.push(...industry.value);
  if (partnerships.status === 'fulfilled') allAlerts.push(...partnerships.value);

  return allAlerts;
}

async function processAlerts(alerts: any[], userPreferences: any) {
  logStep('Processing alerts', { count: alerts.length });
  
  return alerts
    .map(alert => ({
      ...alert,
      relevance_score: calculateRelevanceScore(alert, userPreferences),
      created_at: new Date().toISOString()
    }))
    .filter(alert => alert.relevance_score >= 50) // Mínimo de 50% relevância
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 20); // Top 20 alertas
}

function calculateRelevanceScore(alert: any, userPreferences: any): number {
  let score = 50; // Base score
  
  // Aumentar score baseado na especialização do usuário
  const userSpecialization = userPreferences?.specialization || [];
  const alertKeywords = (alert.title + ' ' + alert.description).toLowerCase();
  
  userSpecialization.forEach((spec: string) => {
    if (alertKeywords.includes(spec.toLowerCase())) {
      score += 15;
    }
  });
  
  // Aumentar score baseado na severidade
  switch (alert.severity) {
    case 'critical':
      score += 30;
      break;
    case 'high':
      score += 20;
      break;
    case 'medium':
      score += 10;
      break;
  }
  
  // Aumentar score para alertas recentes
  if (alert.type === 'partnership_match' || alert.type === 'compliance_deadline') {
    score += 25;
  }
  
  return Math.min(100, score);
}

async function saveRelevantAlerts(supabase: any, alerts: any[]) {
  if (alerts.length === 0) return;
  
  const alertsToSave = alerts.map(alert => ({
    source: alert.source || 'real_time_scanner',
    title: alert.title,
    description: alert.description,
    alert_type: alert.type,
    severity: alert.severity,
    published_at: new Date().toISOString(),
    url: alert.url,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
  }));

  await supabase.from('regulatory_alerts').upsert(alertsToSave, { 
    onConflict: 'source,title' 
  });
}

function parseRegulatoryAlerts(content: string): any[] {
  // Parser inteligente para extrair alertas regulatórios
  const alerts = [];
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  for (const line of lines) {
    if (line.includes('ANVISA') || line.includes('FDA') || line.includes('EMA')) {
      alerts.push({
        type: 'regulatory_change',
        title: line.slice(0, 100),
        description: line,
        severity: line.includes('urgente') || line.includes('crítico') ? 'critical' : 'medium',
        source: 'regulatory_scanner'
      });
    }
  }
  
  return alerts.slice(0, 5); // Top 5
}

function parseMarketOpportunities(content: string): any[] {
  const opportunities = [];
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  for (const line of lines) {
    if (line.includes('oportunidade') || line.includes('edital') || line.includes('investimento')) {
      opportunities.push({
        type: 'market_opportunity',
        title: line.slice(0, 100),
        description: line,
        severity: 'medium',
        source: 'market_scanner'
      });
    }
  }
  
  return opportunities.slice(0, 5);
}

function parseIndustryNews(content: string): any[] {
  const news = [];
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  for (const line of lines) {
    if (line.includes('farmacêutica') || line.includes('medicamento') || line.includes('laboratório')) {
      news.push({
        type: 'industry_news',
        title: line.slice(0, 100),
        description: line,
        severity: 'low',
        source: 'news_scanner'
      });
    }
  }
  
  return news.slice(0, 5);
}

function getDaysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}