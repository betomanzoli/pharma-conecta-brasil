
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProductionMetrics {
  system_health: number;
  response_time: number;
  error_rate: number;
  user_satisfaction: number;
  data_quality: number;
  security_score: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('🔍 Iniciando monitoramento de produção...')

    // Collect production metrics
    const metrics = await collectProductionMetrics(supabaseClient)
    
    // Store metrics
    const { error: metricsError } = await supabaseClient
      .from('performance_metrics')
      .insert({
        metric_name: 'production_health',
        metric_value: metrics.system_health,
        metric_unit: 'score',
        tags: {
          type: 'production',
          environment: 'live',
          timestamp: new Date().toISOString(),
          details: metrics
        }
      })

    if (metricsError) {
      console.error('❌ Erro ao salvar métricas:', metricsError)
      throw metricsError
    }

    // Check for critical issues
    const alerts = await checkCriticalIssues(metrics, supabaseClient)
    
    console.log('✅ Monitoramento de produção concluído')
    console.log('📊 Métricas coletadas:', metrics)
    
    if (alerts.length > 0) {
      console.log('🚨 Alertas encontrados:', alerts)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        metrics,
        alerts,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    console.error('❌ Erro no monitoramento de produção:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      },
    )
  }
})

async function collectProductionMetrics(supabase: any): Promise<ProductionMetrics> {
  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

  // System health check
  const { count: errorCount } = await supabase
    .from('performance_metrics')
    .select('*', { count: 'exact' })
    .eq('metric_name', 'error')
    .gte('measured_at', oneHourAgo.toISOString())

  // Response time metrics
  const { data: responseMetrics } = await supabase
    .from('performance_metrics')
    .select('metric_value')
    .eq('metric_name', 'response_time')
    .gte('measured_at', oneHourAgo.toISOString())

  const avgResponseTime = responseMetrics?.length > 0 
    ? responseMetrics.reduce((sum: number, m: any) => sum + m.metric_value, 0) / responseMetrics.length
    : 0

  // User engagement metrics
  const { count: activeUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .gte('updated_at', oneHourAgo.toISOString())

  // Data quality check
  const { count: totalProfiles } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })

  const { count: completeProfiles } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .not('first_name', 'is', null)
    .not('last_name', 'is', null)

  const dataQuality = totalProfiles > 0 
    ? (completeProfiles / totalProfiles) * 100 
    : 100

  return {
    system_health: Math.max(0, 100 - (errorCount || 0)),
    response_time: avgResponseTime,
    error_rate: (errorCount || 0) / 100, // Normalize error rate
    user_satisfaction: 85, // Mock satisfaction score
    data_quality: dataQuality,
    security_score: 95 // Mock security score
  }
}

async function checkCriticalIssues(metrics: ProductionMetrics, supabase: any): Promise<string[]> {
  const alerts: string[] = []

  if (metrics.system_health < 80) {
    alerts.push(`Sistema com saúde baixa: ${metrics.system_health}%`)
  }

  if (metrics.response_time > 2000) {
    alerts.push(`Tempo de resposta alto: ${metrics.response_time}ms`)
  }

  if (metrics.error_rate > 5) {
    alerts.push(`Taxa de erro elevada: ${metrics.error_rate}%`)
  }

  if (metrics.data_quality < 70) {
    alerts.push(`Qualidade de dados baixa: ${metrics.data_quality}%`)
  }

  // Create system notifications for critical issues
  if (alerts.length > 0) {
    await supabase
      .from('performance_metrics')
      .insert({
        metric_name: 'system_alert',
        metric_value: alerts.length,
        metric_unit: 'count',
        tags: {
          type: 'critical_alert',
          alerts: alerts,
          timestamp: new Date().toISOString()
        }
      })
  }

  return alerts
}
