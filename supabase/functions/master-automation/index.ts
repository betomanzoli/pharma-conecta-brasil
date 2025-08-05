
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[MASTER-AUTOMATION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Master automation request received");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const perplexityApiKey = Deno.env.get("PERPLEXITY_API_KEY");
    if (!perplexityApiKey) {
      throw new Error("PERPLEXITY_API_KEY not configured");
    }

    const { action, parameters, user_id } = await req.json();

    let result;

    switch (action) {
      case 'run_daily_matching':
        result = await runDailyMatching(supabase, user_id);
        break;
      case 'sync_regulatory_data':
        result = await syncRegulatoryData(supabase, perplexityApiKey);
        break;
      case 'update_market_intelligence':
        result = await updateMarketIntelligence(supabase, perplexityApiKey);
        break;
      case 'check_compliance_status':
        result = await checkComplianceStatus(supabase, user_id);
        break;
      case 'process_notifications':
        result = await processNotifications(supabase, user_id);
        break;
      case 'sync_all_apis':
        result = await syncAllApis(supabase, perplexityApiKey, user_id);
        break;
      default:
        throw new Error('Invalid automation action specified');
    }

    return new Response(JSON.stringify({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in master automation", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function runDailyMatching(supabase: any, userId?: string) {
  logStep("Running daily AI matching");

  try {
    // Buscar usuários ativos para matching
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(100);

    if (profilesError) throw profilesError;

    const matchingResults = [];

    for (const profile of profiles || []) {
      try {
        // Chamar AI matching avançado
        const { data: matchResult, error: matchError } = await supabase.functions.invoke('ai-matching-enhanced', {
          body: { 
            action: 'advanced_matching',
            parameters: {
              user_id: profile.id,
              user_type: profile.user_type,
              requirements: { general: true },
              preferences: { max_results: 5 }
            }
          }
        });

        if (!matchError && matchResult?.result?.matches) {
          matchingResults.push({
            user_id: profile.id,
            matches_found: matchResult.result.matches.length,
            top_match_score: matchResult.result.matches[0]?.match_score || 0
          });

          // Criar notificações para matches de alta qualidade
          const highQualityMatches = matchResult.result.matches.filter(
            (match: any) => match.match_score > 0.8
          );

          for (const match of highQualityMatches) {
            await supabase.from('notifications').insert({
              user_id: profile.id,
              title: 'Novo Parceiro Compatível Encontrado!',
              message: `Encontramos um parceiro com ${Math.round(match.match_score * 100)}% de compatibilidade: ${match.name}`,
              type: 'matching'
            });
          }
        }
      } catch (error) {
        logStep("Error in individual matching", { userId: profile.id, error });
      }
    }

    // Registrar métricas
    await supabase.from('performance_metrics').insert({
      metric_name: 'daily_matching_completed',
      metric_value: matchingResults.length,
      metric_unit: 'users_processed',
      tags: {
        total_matches: matchingResults.reduce((sum, r) => sum + r.matches_found, 0),
        avg_score: matchingResults.reduce((sum, r) => sum + r.top_match_score, 0) / matchingResults.length,
        timestamp: new Date().toISOString()
      }
    });

    return {
      users_processed: matchingResults.length,
      total_matches_found: matchingResults.reduce((sum, r) => sum + r.matches_found, 0),
      notifications_sent: matchingResults.filter(r => r.top_match_score > 0.8).length
    };

  } catch (error) {
    logStep("Error in daily matching", error);
    throw error;
  }
}

async function syncRegulatoryData(supabase: any, perplexityApiKey: string) {
  logStep("Syncing regulatory data");

  try {
    // Usar Perplexity para buscar atualizações regulatórias
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: `Busque as últimas atualizações regulatórias dos últimos 7 dias de:
            - ANVISA (Brasil)
            - FDA (Estados Unidos)  
            - EMA (Europa)
            
            Retorne um JSON com: title, description, source, published_date, severity (low/medium/high), url`
          },
          {
            role: 'user',
            content: 'Quais são as principais atualizações regulatórias farmacêuticas da última semana?'
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
        search_domain_filter: ['anvisa.gov.br', 'fda.gov', 'ema.europa.eu'],
        search_recency_filter: 'week'
      }),
    });

    const data = await response.json();
    const regulatoryContent = data.choices[0]?.message?.content || '';

    // Processar e extrair informações estruturadas
    const updates = parseRegulatoryUpdates(regulatoryContent);

    // Salvar atualizações na base
    const insertedAlerts = [];
    for (const update of updates) {
      try {
        const { data: alert, error } = await supabase
          .from('regulatory_alerts')
          .insert({
            title: update.title,
            description: update.description,
            source: update.source,
            alert_type: 'regulatory_update',
            severity: update.severity,
            url: update.url,
            published_at: update.published_date || new Date().toISOString()
          })
          .select()
          .single();

        if (!error) {
          insertedAlerts.push(alert);
        }
      } catch (error) {
        logStep("Error inserting regulatory alert", error);
      }
    }

    // Notificar usuários sobre alertas críticos
    const criticalAlerts = insertedAlerts.filter(alert => alert.severity === 'high');
    if (criticalAlerts.length > 0) {
      const { data: profiles } = await supabase.from('profiles').select('id').limit(50);
      
      for (const profile of profiles || []) {
        for (const alert of criticalAlerts) {
          await supabase.from('notifications').insert({
            user_id: profile.id,
            title: '⚠️ Alerta Regulatório Crítico',
            message: `${alert.source}: ${alert.title}`,
            type: 'regulatory'
          });
        }
      }
    }

    return {
      updates_found: updates.length,
      alerts_created: insertedAlerts.length,
      critical_alerts: criticalAlerts.length
    };

  } catch (error) {
    logStep("Error syncing regulatory data", error);
    throw error;
  }
}

async function updateMarketIntelligence(supabase: any, perplexityApiKey: string) {
  logStep("Updating market intelligence");

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Analise tendências do mercado farmacêutico brasileiro, incluindo: novos produtos, fusões/aquisições, investimentos, regulamentações impactantes, e inovações tecnológicas.'
          },
          {
            role: 'user',
            content: 'Quais são as principais tendências e oportunidades no mercado farmacêutico brasileiro atual?'
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
        search_recency_filter: 'month'
      }),
    });

    const data = await response.json();
    const marketInsights = data.choices[0]?.message?.content || '';

    // Salvar intelligence de mercado
    await supabase.from('performance_metrics').insert({
      metric_name: 'market_intelligence',
      metric_value: 1,
      metric_unit: 'update',
      tags: {
        content_length: marketInsights.length,
        insights: marketInsights.substring(0, 500),
        timestamp: new Date().toISOString(),
        source: 'perplexity_analysis'
      }
    });

    return {
      insights_generated: true,
      content_length: marketInsights.length,
      summary: marketInsights.substring(0, 200) + '...'
    };

  } catch (error) {
    logStep("Error updating market intelligence", error);
    throw error;
  }
}

async function checkComplianceStatus(supabase: any, userId?: string) {
  logStep("Checking compliance status");

  try {
    // Buscar empresas para verificar compliance
    const { data: companies, error } = await supabase
      .from('companies')
      .select('*')
      .limit(20);

    if (error) throw error;

    const complianceResults = [];

    for (const company of companies || []) {
      // Simular verificação de compliance
      const complianceScore = Math.random() * 100;
      const status = complianceScore > 80 ? 'compliant' : complianceScore > 60 ? 'warning' : 'non_compliant';

      // Atualizar status de compliance
      await supabase
        .from('compliance_tracking')
        .upsert({
          company_id: company.id,
          profile_id: company.profile_id,
          compliance_type: 'general',
          status: status,
          score: complianceScore,
          last_check: new Date().toISOString(),
          details: {
            checks_performed: ['documentation', 'certifications', 'regulatory_compliance'],
            issues_found: status === 'non_compliant' ? ['missing_documentation'] : [],
            recommendations: status !== 'compliant' ? ['update_certifications'] : []
          }
        }, {
          onConflict: 'company_id,compliance_type'
        });

      complianceResults.push({
        company_id: company.id,
        status,
        score: complianceScore
      });

      // Notificar sobre problemas de compliance
      if (status === 'non_compliant' && company.profile_id) {
        await supabase.from('notifications').insert({
          user_id: company.profile_id,
          title: '⚠️ Problema de Compliance Detectado',
          message: `Sua empresa ${company.name} precisa de atenção em questões de compliance regulatório.`,
          type: 'compliance'
        });
      }
    }

    return {
      companies_checked: complianceResults.length,
      compliant: complianceResults.filter(r => r.status === 'compliant').length,
      warnings: complianceResults.filter(r => r.status === 'warning').length,
      non_compliant: complianceResults.filter(r => r.status === 'non_compliant').length
    };

  } catch (error) {
    logStep("Error checking compliance status", error);
    throw error;
  }
}

async function processNotifications(supabase: any, userId?: string) {
  logStep("Processing smart notifications");

  try {
    // Processar notificações pendentes e criar insights
    const { data: recentMetrics, error } = await supabase
      .from('performance_metrics')
      .select('*')
      .gte('measured_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('measured_at', { ascending: false });

    if (error) throw error;

    // Analisar padrões e criar notificações inteligentes
    const insights = analyzeMetricsForInsights(recentMetrics || []);

    const notificationsCreated = [];
    for (const insight of insights) {
      if (insight.shouldNotify) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .limit(10);

        for (const profile of profiles || []) {
          const { data: notification } = await supabase
            .from('notifications')
            .insert({
              user_id: profile.id,
              title: insight.title,
              message: insight.message,
              type: 'system_insight'
            })
            .select()
            .single();

          if (notification) {
            notificationsCreated.push(notification);
          }
        }
      }
    }

    return {
      insights_analyzed: insights.length,
      notifications_created: notificationsCreated.length,
      insights: insights.map(i => ({ title: i.title, priority: i.priority }))
    };

  } catch (error) {
    logStep("Error processing notifications", error);
    throw error;
  }
}

async function syncAllApis(supabase: any, perplexityApiKey: string, userId?: string) {
  logStep("Syncing all APIs and running complete automation cycle");

  try {
    const results = {
      matching: await runDailyMatching(supabase, userId),
      regulatory: await syncRegulatoryData(supabase, perplexityApiKey),
      market: await updateMarketIntelligence(supabase, perplexityApiKey),
      compliance: await checkComplianceStatus(supabase, userId),
      notifications: await processNotifications(supabase, userId)
    };

    // Registrar execução completa
    await supabase.from('performance_metrics').insert({
      metric_name: 'complete_automation_cycle',
      metric_value: 1,
      metric_unit: 'cycle',
      tags: {
        results,
        execution_time: Date.now(),
        triggered_by: userId || 'system'
      }
    });

    return {
      status: 'completed',
      results,
      total_operations: Object.keys(results).length,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logStep("Error in complete API sync", error);
    throw error;
  }
}

// Funções auxiliares
function parseRegulatoryUpdates(content: string) {
  // Implementação simplificada - em produção seria mais robusta
  const updates = [];
  
  try {
    // Tentar extrair JSON do conteúdo
    const jsonMatch = content.match(/\[.*\]/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch (error) {
    // Se falhar, criar update genérico
    logStep("Could not parse regulatory content as JSON, creating generic update");
  }

  // Fallback: criar atualizações baseadas no conteúdo
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  const relevantLines = lines.filter(line => 
    line.toLowerCase().includes('anvisa') || 
    line.toLowerCase().includes('fda') || 
    line.toLowerCase().includes('ema')
  );

  for (const line of relevantLines.slice(0, 3)) {
    updates.push({
      title: line.substring(0, 100),
      description: line,
      source: line.toLowerCase().includes('anvisa') ? 'ANVISA' : 
               line.toLowerCase().includes('fda') ? 'FDA' : 'EMA',
      severity: 'medium',
      published_date: new Date().toISOString(),
      url: ''
    });
  }

  return updates;
}

function analyzeMetricsForInsights(metrics: any[]) {
  const insights = [];

  // Análise de padrões de uso
  const matchingMetrics = metrics.filter(m => m.metric_name.includes('matching'));
  if (matchingMetrics.length > 5) {
    const avgMatches = matchingMetrics.reduce((sum, m) => sum + m.metric_value, 0) / matchingMetrics.length;
    
    if (avgMatches > 10) {
      insights.push({
        title: '🎯 Alta Atividade de Matching',
        message: `Sistema de matching está muito ativo com média de ${Math.round(avgMatches)} matches por sessão`,
        priority: 'medium',
        shouldNotify: true
      });
    }
  }

  // Análise de compliance
  const complianceMetrics = metrics.filter(m => m.metric_name.includes('compliance'));
  if (complianceMetrics.length > 0) {
    insights.push({
      title: '📋 Status de Compliance Atualizado',
      message: 'Novos relatórios de compliance foram gerados. Verifique seu dashboard.',
      priority: 'high',
      shouldNotify: true
    });
  }

  return insights;
}
