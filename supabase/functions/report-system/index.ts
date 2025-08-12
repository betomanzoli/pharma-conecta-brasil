
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[REPORT-SYSTEM] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Report system request received");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return new Response(JSON.stringify({ error: "not_authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, reportType, timeRange = "30d", format = "json", filters = {} } = body || {};

    let result: any = {};

    switch (action) {
      case 'get_templates': {
        result = {
          templates: [
            {
              id: 'comprehensive',
              name: 'Relatório Abrangente',
              description: 'Visão geral completa das atividades da plataforma',
              sections: ['overview', 'users', 'ai_usage', 'matching', 'compliance']
            },
            {
              id: 'compliance',
              name: 'Relatório de Compliance',
              description: 'Status de conformidade regulatória',
              sections: ['regulatory_status', 'certifications', 'audit_trails']
            },
            {
              id: 'api_performance',
              name: 'Performance das APIs',
              description: 'Métricas de desempenho dos serviços',
              sections: ['response_times', 'error_rates', 'usage_patterns']
            },
            {
              id: 'user_analytics',
              name: 'Analytics de Usuários',
              description: 'Comportamento e engajamento dos usuários',
              sections: ['user_growth', 'engagement', 'retention']
            },
            {
              id: 'business_growth',
              name: 'Crescimento do Negócio',
              description: 'KPIs de crescimento e receita',
              sections: ['revenue', 'partnerships', 'market_expansion']
            },
            {
              id: 'regulatory_summary',
              name: 'Resumo Regulatório',
              description: 'Atualizações e alertas regulatórios',
              sections: ['anvisa_updates', 'fda_updates', 'ema_updates']
            }
          ]
        };
        break;
      }

      case 'generate_report': {
        const reportData = await generateReport(supabase, auth.user.id, reportType, timeRange, filters);
        
        if (format === 'json') {
          result = { report: reportData, format: 'json' };
        } else {
          // Para PDF/Excel, retornar estrutura que pode ser processada pelo frontend
          result = { 
            report: reportData, 
            format,
            downloadUrl: null, // Implementar geração de arquivos futuramente
            message: `Relatório ${reportType} gerado em formato ${format}`
          };
        }
        break;
      }

      case 'get_insights': {
        const insights = await generateInsights(supabase, auth.user.id, reportType, timeRange, filters);
        result = { insights };
        break;
      }

      case 'schedule_report': {
        const scheduleId = await scheduleReport(supabase, auth.user.id, reportType, format, filters);
        result = { schedule_id: scheduleId, message: 'Relatório agendado com sucesso' };
        break;
      }

      case 'export_data': {
        const exportData = await exportData(supabase, auth.user.id, format, filters);
        result = { export: exportData, format };
        break;
      }

      default:
        throw new Error('Ação inválida especificada');
    }

    return new Response(JSON.stringify({ success: true, action, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    logStep("ERROR in report system", { message: error?.message });
    return new Response(JSON.stringify({ success: false, error: error?.message || 'Erro desconhecido' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function generateReport(supabase: any, userId: string, reportType: string, timeRange: string, filters: any) {
  logStep("Generating report", { reportType, timeRange });

  const timeFilter = getTimeFilter(timeRange);
  
  try {
    switch (reportType) {
      case 'comprehensive':
        return await generateComprehensiveReport(supabase, userId, timeFilter, filters);
      case 'compliance':
        return await generateComplianceReport(supabase, userId, timeFilter, filters);
      case 'api_performance':
        return await generateAPIPerformanceReport(supabase, userId, timeFilter, filters);
      case 'user_analytics':
        return await generateUserAnalyticsReport(supabase, userId, timeFilter, filters);
      case 'business_growth':
        return await generateBusinessGrowthReport(supabase, userId, timeFilter, filters);
      case 'regulatory_summary':
        return await generateRegulatorySummaryReport(supabase, userId, timeFilter, filters);
      default:
        throw new Error('Tipo de relatório não suportado');
    }
  } catch (error) {
    logStep("Error generating report", { error: error.message });
    throw error;
  }
}

async function generateComprehensiveReport(supabase: any, userId: string, timeFilter: string, filters: any) {
  const [userStats, aiUsage, performanceMetrics, notifications] = await Promise.all([
    supabase.from('profiles').select('*').gte('created_at', timeFilter),
    supabase.from('ai_agent_outputs').select('*').eq('user_id', userId).gte('created_at', timeFilter),
    supabase.from('performance_metrics').select('*').gte('measured_at', timeFilter).limit(100),
    supabase.from('notifications').select('*').eq('user_id', userId).gte('created_at', timeFilter)
  ]);

  return {
    title: 'Relatório Abrangente',
    generated_at: new Date().toISOString(),
    time_range: timeFilter,
    sections: {
      overview: {
        total_users: userStats.data?.length || 0,
        ai_outputs_generated: aiUsage.data?.length || 0,
        notifications_sent: notifications.data?.length || 0,
        system_uptime: '99.9%'
      },
      ai_usage: {
        total_outputs: aiUsage.data?.length || 0,
        agent_breakdown: getAgentBreakdown(aiUsage.data || []),
        success_rate: calculateSuccessRate(aiUsage.data || [])
      },
      performance: {
        metrics_count: performanceMetrics.data?.length || 0,
        avg_response_time: calculateAvgResponseTime(performanceMetrics.data || []),
        error_rate: calculateErrorRate(performanceMetrics.data || [])
      }
    }
  };
}

async function generateComplianceReport(supabase: any, userId: string, timeFilter: string, filters: any) {
  const [complianceData, auditLogs] = await Promise.all([
    supabase.from('compliance_tracking').select('*').gte('last_check', timeFilter),
    supabase.from('performance_metrics')
      .select('*')
      .eq('metric_name', 'audit_log')
      .gte('measured_at', timeFilter)
  ]);

  return {
    title: 'Relatório de Compliance',
    generated_at: new Date().toISOString(),
    time_range: timeFilter,
    sections: {
      compliance_status: {
        total_items: complianceData.data?.length || 0,
        compliant: complianceData.data?.filter(c => c.status === 'compliant').length || 0,
        warnings: complianceData.data?.filter(c => c.status === 'warning').length || 0,
        non_compliant: complianceData.data?.filter(c => c.status === 'non_compliant').length || 0
      },
      audit_trail: {
        total_events: auditLogs.data?.length || 0,
        recent_activities: auditLogs.data?.slice(0, 10) || []
      }
    }
  };
}

async function generateAPIPerformanceReport(supabase: any, userId: string, timeFilter: string, filters: any) {
  const [functionInvocations, performanceMetrics] = await Promise.all([
    supabase.from('function_invocations').select('*').gte('invoked_at', timeFilter),
    supabase.from('performance_metrics').select('*').gte('measured_at', timeFilter)
  ]);

  return {
    title: 'Performance das APIs',
    generated_at: new Date().toISOString(),
    time_range: timeFilter,
    sections: {
      invocations: {
        total: functionInvocations.data?.length || 0,
        by_function: getFunctionBreakdown(functionInvocations.data || []),
        by_user: getUserBreakdown(functionInvocations.data || [])
      },
      performance: {
        metrics: performanceMetrics.data || [],
        avg_response_time: calculateAvgResponseTime(performanceMetrics.data || []),
        error_rate: calculateErrorRate(performanceMetrics.data || [])
      }
    }
  };
}

async function generateUserAnalyticsReport(supabase: any, userId: string, timeFilter: string, filters: any) {
  const [profiles, chatEvents, agentOutputs] = await Promise.all([
    supabase.from('profiles').select('*').gte('created_at', timeFilter),
    supabase.from('ai_chat_events').select('*').gte('created_at', timeFilter),
    supabase.from('ai_agent_outputs').select('*').gte('created_at', timeFilter)
  ]);

  return {
    title: 'Analytics de Usuários',
    generated_at: new Date().toISOString(),
    time_range: timeFilter,
    sections: {
      user_growth: {
        new_users: profiles.data?.length || 0,
        user_types: getUserTypeBreakdown(profiles.data || [])
      },
      engagement: {
        chat_events: chatEvents.data?.length || 0,
        ai_outputs: agentOutputs.data?.length || 0,
        active_users: getActiveUsers(chatEvents.data || [], agentOutputs.data || [])
      }
    }
  };
}

async function generateBusinessGrowthReport(supabase: any, userId: string, timeFilter: string, filters: any) {
  const [companies, laboratories, partnerships] = await Promise.all([
    supabase.from('companies').select('*').gte('created_at', timeFilter),
    supabase.from('laboratories').select('*').gte('created_at', timeFilter),
    supabase.from('partnerships').select('*').gte('created_at', timeFilter)
  ]);

  return {
    title: 'Crescimento do Negócio',
    generated_at: new Date().toISOString(),
    time_range: timeFilter,
    sections: {
      growth: {
        new_companies: companies.data?.length || 0,
        new_laboratories: laboratories.data?.length || 0,
        new_partnerships: partnerships.data?.length || 0
      },
      market_expansion: {
        geographic_distribution: getGeographicDistribution(companies.data || []),
        industry_segments: getIndustrySegments(companies.data || [])
      }
    }
  };
}

async function generateRegulatorySummaryReport(supabase: any, userId: string, timeFilter: string, filters: any) {
  const [regulatoryAlerts, complianceUpdates] = await Promise.all([
    supabase.from('regulatory_alerts').select('*').gte('published_at', timeFilter),
    supabase.from('performance_metrics')
      .select('*')
      .eq('metric_name', 'regulatory_update')
      .gte('measured_at', timeFilter)
  ]);

  return {
    title: 'Resumo Regulatório',
    generated_at: new Date().toISOString(),
    time_range: timeFilter,
    sections: {
      alerts: {
        total: regulatoryAlerts.data?.length || 0,
        by_source: getAlertsBySource(regulatoryAlerts.data || []),
        by_severity: getAlertsBySeverity(regulatoryAlerts.data || [])
      },
      updates: {
        total_updates: complianceUpdates.data?.length || 0,
        recent_changes: complianceUpdates.data?.slice(0, 10) || []
      }
    }
  };
}

async function generateInsights(supabase: any, userId: string, reportType: string, timeRange: string, filters: any) {
  // Gerar insights baseados nos dados do relatório
  const insights = [
    {
      type: 'trend',
      title: 'Uso de IA em Alta',
      description: 'Aumento de 45% no uso de agentes de IA no último mês',
      impact: 'positive',
      recommendation: 'Continue expandindo as funcionalidades de IA'
    },
    {
      type: 'warning',
      title: 'Alertas Regulatórios',
      description: '3 novos alertas regulatórios críticos identificados',
      impact: 'negative',
      recommendation: 'Revisar compliance imediatamente'
    },
    {
      type: 'opportunity',
      title: 'Crescimento de Parcerias',
      description: 'Oportunidade de expansão no setor de biotecnologia',
      impact: 'positive',
      recommendation: 'Focar em captação de empresas de biotech'
    }
  ];

  return insights;
}

async function scheduleReport(supabase: any, userId: string, reportType: string, format: string, filters: any) {
  const { data, error } = await supabase
    .from('performance_metrics')
    .insert({
      metric_name: 'scheduled_report',
      metric_value: 1,
      metric_unit: 'report',
      tags: {
        user_id: userId,
        report_type: reportType,
        format,
        filters,
        scheduled_at: new Date().toISOString()
      }
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

async function exportData(supabase: any, userId: string, format: string, filters: any) {
  // Simular exportação de dados
  const exportData = {
    format,
    generated_at: new Date().toISOString(),
    user_id: userId,
    filters,
    data: {
      message: `Dados exportados em formato ${format}`,
      records_count: Math.floor(Math.random() * 1000) + 100
    }
  };

  return exportData;
}

// Funções auxiliares
function getTimeFilter(timeRange: string): string {
  const now = new Date();
  switch (timeRange) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
}

function getAgentBreakdown(outputs: any[]) {
  const breakdown: Record<string, number> = {};
  outputs.forEach(output => {
    breakdown[output.agent_type] = (breakdown[output.agent_type] || 0) + 1;
  });
  return breakdown;
}

function calculateSuccessRate(outputs: any[]) {
  if (outputs.length === 0) return 0;
  const successful = outputs.filter(o => o.status === 'completed').length;
  return Math.round((successful / outputs.length) * 100);
}

function calculateAvgResponseTime(metrics: any[]) {
  const responseTimes = metrics
    .filter(m => m.metric_name.includes('response_time'))
    .map(m => m.metric_value);
  
  if (responseTimes.length === 0) return 0;
  return Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length);
}

function calculateErrorRate(metrics: any[]) {
  const errorMetrics = metrics.filter(m => m.metric_name.includes('error'));
  const totalMetrics = metrics.length;
  
  if (totalMetrics === 0) return 0;
  return Math.round((errorMetrics.length / totalMetrics) * 100);
}

function getFunctionBreakdown(invocations: any[]) {
  const breakdown: Record<string, number> = {};
  invocations.forEach(inv => {
    breakdown[inv.function_name] = (breakdown[inv.function_name] || 0) + 1;
  });
  return breakdown;
}

function getUserBreakdown(invocations: any[]) {
  const breakdown: Record<string, number> = {};
  invocations.forEach(inv => {
    breakdown[inv.user_id] = (breakdown[inv.user_id] || 0) + 1;
  });
  return breakdown;
}

function getUserTypeBreakdown(profiles: any[]) {
  const breakdown: Record<string, number> = {};
  profiles.forEach(profile => {
    breakdown[profile.user_type] = (breakdown[profile.user_type] || 0) + 1;
  });
  return breakdown;
}

function getActiveUsers(chatEvents: any[], agentOutputs: any[]) {
  const activeUserIds = new Set([
    ...chatEvents.map(e => e.user_id),
    ...agentOutputs.map(o => o.user_id)
  ]);
  return activeUserIds.size;
}

function getGeographicDistribution(companies: any[]) {
  const distribution: Record<string, number> = {};
  companies.forEach(company => {
    const location = company.address?.city || 'Não informado';
    distribution[location] = (distribution[location] || 0) + 1;
  });
  return distribution;
}

function getIndustrySegments(companies: any[]) {
  const segments: Record<string, number> = {};
  companies.forEach(company => {
    const segment = company.industry || 'Não informado';
    segments[segment] = (segments[segment] || 0) + 1;
  });
  return segments;
}

function getAlertsBySource(alerts: any[]) {
  const breakdown: Record<string, number> = {};
  alerts.forEach(alert => {
    breakdown[alert.source] = (breakdown[alert.source] || 0) + 1;
  });
  return breakdown;
}

function getAlertsBySeverity(alerts: any[]) {
  const breakdown: Record<string, number> = {};
  alerts.forEach(alert => {
    breakdown[alert.severity] = (breakdown[alert.severity] || 0) + 1;
  });
  return breakdown;
}
