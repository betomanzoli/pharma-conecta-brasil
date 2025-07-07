import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYSTEM-MONITOR] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("System monitoring started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const metrics = [];
    const startTime = Date.now();

    // 1. Verificar conectividade do banco
    try {
      const { count: profilesCount } = await supabaseClient
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      metrics.push({
        metric_name: 'database_connectivity',
        metric_value: 1,
        metric_unit: 'boolean',
        tags: { status: 'healthy', table: 'profiles', count: profilesCount }
      });
      
      logStep("Database connectivity check passed", { profilesCount });
    } catch (error) {
      metrics.push({
        metric_name: 'database_connectivity',
        metric_value: 0,
        metric_unit: 'boolean',
        tags: { status: 'error', error: error.message }
      });
      logStep("Database connectivity check failed", error);
    }

    // 2. Verificar Edge Functions
    const functionsToCheck = [
      'anvisa-sync',
      'comprehensive-integration-sync', 
      'webhook-handler',
      'ai-chatbot'
    ];

    for (const funcName of functionsToCheck) {
      try {
        const funcUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/${funcName}`;
        const response = await fetch(funcUrl, {
          method: 'OPTIONS',
          headers: {
            'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`
          }
        });

        const isHealthy = response.status < 500;
        metrics.push({
          metric_name: 'edge_function_health',
          metric_value: isHealthy ? 1 : 0,
          metric_unit: 'boolean',
          tags: { function_name: funcName, status_code: response.status }
        });

        logStep(`Function ${funcName} health check`, { healthy: isHealthy, status: response.status });
      } catch (error) {
        metrics.push({
          metric_name: 'edge_function_health',
          metric_value: 0,
          metric_unit: 'boolean',
          tags: { function_name: funcName, error: error.message }
        });
        logStep(`Function ${funcName} health check failed`, error);
      }
    }

    // 3. Verificar integrações ativas
    try {
      const { data: integrations } = await supabaseClient
        .from('api_configurations')
        .select('integration_name, is_active, last_sync')
        .eq('is_active', true);

      const activeCount = integrations?.length || 0;
      const recentSyncs = integrations?.filter(i => {
        if (!i.last_sync) return false;
        const lastSync = new Date(i.last_sync);
        const hoursSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
        return hoursSinceSync < 25; // Menos de 25 horas
      }).length || 0;

      metrics.push({
        metric_name: 'active_integrations',
        metric_value: activeCount,
        metric_unit: 'count',
        tags: { recent_syncs: recentSyncs }
      });

      logStep("Integration health check", { activeCount, recentSyncs });
    } catch (error) {
      logStep("Integration health check failed", error);
    }

    // 4. Verificar notificações não lidas
    try {
      const { count: unreadNotifications } = await supabaseClient
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      metrics.push({
        metric_name: 'unread_notifications',
        metric_value: unreadNotifications || 0,
        metric_unit: 'count'
      });

      logStep("Notifications check", { unreadNotifications });
    } catch (error) {
      logStep("Notifications check failed", error);
    }

    // 5. Verificar performance da aplicação
    const processingTime = Date.now() - startTime;
    metrics.push({
      metric_name: 'system_response_time',
      metric_value: processingTime,
      metric_unit: 'milliseconds',
      tags: { endpoint: 'system-monitor' }
    });

    // 6. Verificar uso de memória (simulado)
    const memoryUsage = Math.random() * 100; // Em produção seria real
    metrics.push({
      metric_name: 'memory_usage',
      metric_value: memoryUsage,
      metric_unit: 'percentage'
    });

    // 7. Verificar carga do sistema (simulado)
    const systemLoad = Math.random() * 5; // Em produção seria real
    metrics.push({
      metric_name: 'system_load',
      metric_value: systemLoad,
      metric_unit: 'average'
    });

    // Salvar métricas no banco
    if (metrics.length > 0) {
      const { error: metricsError } = await supabaseClient
        .from('performance_metrics')
        .insert(metrics);

      if (metricsError) {
        logStep("Error saving metrics", metricsError);
      } else {
        logStep("Metrics saved successfully", { count: metrics.length });
      }
    }

    // Calcular status geral do sistema
    const healthyServices = metrics.filter(m => 
      (m.metric_name.includes('connectivity') || m.metric_name.includes('health')) && 
      m.metric_value === 1
    ).length;

    const totalHealthChecks = metrics.filter(m => 
      m.metric_name.includes('connectivity') || m.metric_name.includes('health')
    ).length;

    const overallHealth = totalHealthChecks > 0 ? (healthyServices / totalHealthChecks) * 100 : 0;

    const summary = {
      timestamp: new Date().toISOString(),
      overall_health: overallHealth,
      processing_time_ms: processingTime,
      metrics_count: metrics.length,
      status: overallHealth >= 80 ? 'healthy' : overallHealth >= 50 ? 'degraded' : 'critical',
      details: {
        database_healthy: metrics.find(m => m.metric_name === 'database_connectivity')?.metric_value === 1,
        functions_healthy: healthyServices,
        total_checks: totalHealthChecks,
        active_integrations: metrics.find(m => m.metric_name === 'active_integrations')?.metric_value || 0,
        unread_notifications: metrics.find(m => m.metric_name === 'unread_notifications')?.metric_value || 0
      }
    };

    logStep("System monitoring completed", summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in system monitoring", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString(),
      status: 'critical'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});