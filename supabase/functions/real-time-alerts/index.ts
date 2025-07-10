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
    const { action, alertType = 'all', urgency = 'medium' } = await req.json();

    console.log('Real-time Alerts request:', { action, alertType, urgency });

    switch (action) {
      case 'monitor_regulatory':
        return await monitorRegulatoryChanges();
      case 'check_compliance':
        return await checkComplianceAlerts();
      case 'api_health_alerts':
        return await checkAPIHealthAlerts();
      case 'system_alerts':
        return await generateSystemAlerts();
      case 'create_notification':
        return await createNotification(alertType, urgency);
      case 'get_active_alerts':
        return await getActiveAlerts();
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in real-time-alerts:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function monitorRegulatoryChanges() {
  // Buscar alertas regulatórios recentes
  const { data: regulatoryAlerts } = await supabase
    .from('regulatory_alerts')
    .select('*')
    .gte('published_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('published_at', { ascending: false });

  // Buscar dados FDA e ANVISA
  const [fdaData, anvisaData] = await Promise.all([
    supabase.from('fda_adverse_events').select('*').limit(10),
    supabase.from('anvisa_conjuntos_dados').select('*').limit(10)
  ]);

  // Análise inteligente de mudanças regulatórias
  const analysis = await analyzeRegulatoryChanges({
    alerts: regulatoryAlerts || [],
    fdaData: fdaData.data || [],
    anvisaData: anvisaData.data || []
  });

  // Criar notificações para usuários relevantes
  const notifications = await createRegulatoryNotifications(analysis.criticalChanges);

  return new Response(
    JSON.stringify({
      success: true,
      regulatory_monitoring: {
        new_alerts: regulatoryAlerts?.length || 0,
        critical_changes: analysis.criticalChanges,
        impact_assessment: analysis.impact,
        recommendations: analysis.recommendations,
        notifications_sent: notifications.length
      },
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function checkComplianceAlerts() {
  // Verificar status de compliance das empresas
  const { data: companies } = await supabase
    .from('companies')
    .select(`
      *,
      compliance_tracking (*)
    `);

  const complianceIssues = [];
  const expiringCompliance = [];

  for (const company of companies || []) {
    const compliance = company.compliance_tracking?.[0];
    
    if (compliance?.expires_at) {
      const expiryDate = new Date(compliance.expires_at);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
        expiringCompliance.push({
          company: company.name,
          type: compliance.compliance_type,
          expires_in: daysUntilExpiry,
          severity: daysUntilExpiry <= 7 ? 'critical' : 'warning'
        });
      }
    }
    
    if (company.compliance_status === 'pending' || company.compliance_status === 'expired') {
      complianceIssues.push({
        company: company.name,
        status: company.compliance_status,
        severity: 'high'
      });
    }
  }

  // Gerar alertas de compliance
  const alerts = await generateComplianceAlerts(complianceIssues, expiringCompliance);

  return new Response(
    JSON.stringify({
      success: true,
      compliance_alerts: {
        issues: complianceIssues,
        expiring_soon: expiringCompliance,
        alerts_generated: alerts.length,
        total_companies_checked: companies?.length || 0
      },
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function checkAPIHealthAlerts() {
  // Verificar saúde das APIs
  const { data: apiConfigs } = await supabase
    .from('api_configurations')
    .select('*')
    .eq('is_active', true);

  const apiIssues = [];
  
  for (const api of apiConfigs || []) {
    const healthCheck = await performAPIHealthCheck(api);
    
    if (healthCheck.status !== 'healthy') {
      apiIssues.push({
        api: api.integration_name,
        status: healthCheck.status,
        error: healthCheck.error,
        last_sync: api.last_sync,
        severity: healthCheck.status === 'error' ? 'critical' : 'warning'
      });
    }
  }

  // Gerar alertas para APIs com problemas
  const alerts = await generateAPIAlerts(apiIssues);

  return new Response(
    JSON.stringify({
      success: true,
      api_health_alerts: {
        issues: apiIssues,
        healthy_apis: (apiConfigs?.length || 0) - apiIssues.length,
        total_apis: apiConfigs?.length || 0,
        alerts_generated: alerts.length
      },
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateSystemAlerts() {
  // Coletar métricas do sistema
  const { data: metrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .gte('measured_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .order('measured_at', { ascending: false });

  const systemAlerts = [];
  
  // Verificar alta taxa de erro
  const errorMetrics = metrics?.filter(m => m.metric_name.includes('error')) || [];
  if (errorMetrics.length > 10) {
    systemAlerts.push({
      type: 'system_error',
      severity: 'high',
      message: `Alta taxa de erros detectada: ${errorMetrics.length} erros na última hora`,
      action_required: 'Verificar logs do sistema'
    });
  }

  // Verificar performance
  const responseTimeMetrics = metrics?.filter(m => m.metric_name === 'response_time') || [];
  const avgResponseTime = responseTimeMetrics.reduce((sum, m) => sum + m.metric_value, 0) / (responseTimeMetrics.length || 1);
  
  if (avgResponseTime > 1000) {
    systemAlerts.push({
      type: 'performance_degradation',
      severity: 'medium',
      message: `Tempo de resposta elevado: ${avgResponseTime.toFixed(0)}ms`,
      action_required: 'Verificar performance do servidor'
    });
  }

  // Salvar alertas
  for (const alert of systemAlerts) {
    await supabase.from('performance_metrics').insert({
      metric_name: 'system_alert',
      metric_value: 1,
      metric_unit: 'alert',
      tags: alert
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      system_alerts: systemAlerts,
      metrics_analyzed: metrics?.length || 0,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createNotification(alertType: string, urgency: string) {
  // Buscar usuários relevantes baseado no tipo de alerta
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .in('user_type', ['admin', 'pharmaceutical_company', 'laboratory']);

  const notifications = [];
  
  for (const user of users || []) {
    const notification = {
      user_id: user.id,
      title: getNotificationTitle(alertType, urgency),
      message: getNotificationMessage(alertType, urgency),
      type: alertType,
      priority: urgency,
      created_at: new Date().toISOString()
    };
    
    // Inserir notificação
    const { data } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    
    if (data) notifications.push(data);
  }

  return new Response(
    JSON.stringify({
      success: true,
      notifications_created: notifications.length,
      alert_type: alertType,
      urgency: urgency
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getActiveAlerts() {
  // Buscar alertas ativos das últimas 24h
  const { data: alerts } = await supabase
    .from('performance_metrics')
    .select('*')
    .eq('metric_name', 'system_alert')
    .gte('measured_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('measured_at', { ascending: false });

  // Categorizar alertas por severidade
  const categorized = {
    critical: alerts?.filter(a => a.tags?.severity === 'critical') || [],
    warning: alerts?.filter(a => a.tags?.severity === 'warning') || [],
    info: alerts?.filter(a => a.tags?.severity === 'info') || []
  };

  return new Response(
    JSON.stringify({
      success: true,
      active_alerts: categorized,
      total_alerts: alerts?.length || 0,
      timestamp: new Date().toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper functions
async function analyzeRegulatoryChanges(data: any) {
  const prompt = `
Analyze recent regulatory changes in pharmaceutical industry:

New Alerts: ${data.alerts.length}
FDA Data Updates: ${data.fdaData.length}
ANVISA Data Updates: ${data.anvisaData.length}

Recent Regulatory Alerts:
${data.alerts.map((alert: any) => `- ${alert.title}: ${alert.severity}`).join('\n')}

Identify:
1. Critical changes requiring immediate action
2. Impact assessment on pharmaceutical operations
3. Compliance recommendations
4. Risk mitigation strategies

Focus on actionable insights for pharmaceutical companies.
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
          content: 'You are a pharmaceutical regulatory affairs expert specializing in compliance monitoring and risk assessment.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500,
    }),
  });

  const result = await response.json();
  const analysis = result.choices[0].message.content;

  return {
    criticalChanges: extractCriticalChanges(analysis),
    impact: extractImpactAssessment(analysis),
    recommendations: extractRecommendations(analysis)
  };
}

async function performAPIHealthCheck(api: any) {
  try {
    if (api.integration_name === 'anvisa_dados_gov_br') {
      const response = await fetch(`${api.base_url}/api/3/action/package_list`, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      return { 
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime: 0
      };
    } else if (api.integration_name === 'fda_api') {
      const response = await fetch(`${api.base_url}/drug/label.json?limit=1`, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      return { 
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime: 0
      };
    }
    
    return { status: 'unknown', responseTime: 0 };
  } catch (error) {
    return { 
      status: 'error', 
      error: error.message,
      responseTime: 0
    };
  }
}

async function createRegulatoryNotifications(criticalChanges: string[]) {
  const notifications = [];
  
  for (const change of criticalChanges) {
    // Buscar empresas farmacêuticas
    const { data: companies } = await supabase
      .from('companies')
      .select('user_id')
      .contains('expertise_area', ['farmacologia', 'pesquisa_clinica']);
    
    for (const company of companies || []) {
      if (company.user_id) {
        const { data } = await supabase
          .from('notifications')
          .insert({
            user_id: company.user_id,
            title: 'Mudança Regulatória Crítica',
            message: change,
            type: 'regulatory',
            priority: 'high'
          })
          .select()
          .single();
        
        if (data) notifications.push(data);
      }
    }
  }
  
  return notifications;
}

async function generateComplianceAlerts(issues: any[], expiring: any[]) {
  const alerts = [];
  
  // Alertas para problemas de compliance
  for (const issue of issues) {
    alerts.push({
      type: 'compliance_issue',
      severity: 'high',
      message: `${issue.company}: Status de compliance ${issue.status}`,
      action_required: 'Verificar documentação de compliance'
    });
  }
  
  // Alertas para compliance expirando
  for (const exp of expiring) {
    alerts.push({
      type: 'compliance_expiring',
      severity: exp.severity,
      message: `${exp.company}: ${exp.type} expira em ${exp.expires_in} dias`,
      action_required: 'Renovar certificação'
    });
  }
  
  return alerts;
}

async function generateAPIAlerts(issues: any[]) {
  const alerts = [];
  
  for (const issue of issues) {
    alerts.push({
      type: 'api_health',
      severity: issue.severity,
      message: `API ${issue.api}: ${issue.status}`,
      error: issue.error,
      action_required: 'Verificar configuração da API'
    });
  }
  
  return alerts;
}

function getNotificationTitle(alertType: string, urgency: string): string {
  const titles = {
    regulatory: 'Alerta Regulatório',
    compliance: 'Alerta de Compliance',
    api_health: 'Status da API',
    system: 'Alerta do Sistema'
  };
  
  return titles[alertType as keyof typeof titles] || 'Notificação';
}

function getNotificationMessage(alertType: string, urgency: string): string {
  const messages = {
    regulatory: 'Nova mudança regulatória detectada que pode afetar suas operações.',
    compliance: 'Verificação de compliance necessária.',
    api_health: 'Problema detectado na integração de API.',
    system: 'Problema no sistema requer atenção.'
  };
  
  return messages[alertType as keyof typeof messages] || 'Nova notificação disponível.';
}

function extractCriticalChanges(analysis: string): string[] {
  const lines = analysis.split('\n');
  return lines.filter(line => 
    line.toLowerCase().includes('critical') || 
    line.toLowerCase().includes('urgent')
  ).slice(0, 5);
}

function extractImpactAssessment(analysis: string): string {
  const lines = analysis.split('\n');
  const impactSection = lines.find(line => 
    line.toLowerCase().includes('impact')
  );
  return impactSection || 'Impact assessment not available';
}

function extractRecommendations(analysis: string): string[] {
  const lines = analysis.split('\n');
  return lines.filter(line => 
    line.toLowerCase().includes('recommend') || 
    line.toLowerCase().includes('should')
  ).slice(0, 3);
}