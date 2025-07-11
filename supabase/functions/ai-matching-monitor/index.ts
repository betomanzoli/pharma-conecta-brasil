import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar métricas críticas do AI Matching
    const alerts = [];
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // 1. Taxa de falha elevada (últimas 1h)
    const { data: recentRequests } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('metric_name', 'ai_matching_request')
      .gte('created_at', oneHourAgo.toISOString());

    if (recentRequests && recentRequests.length > 10) {
      const errorRate = recentRequests.filter(r => 
        r.tags?.error || r.metric_value === 0
      ).length / recentRequests.length;

      if (errorRate > 0.1) { // > 10% de falhas
        alerts.push({
          severity: 'high',
          type: 'error_rate',
          message: `Taxa de falha elevada: ${Math.round(errorRate * 100)}% nas últimas 1h`,
          value: errorRate,
          threshold: 0.1,
          timestamp: now.toISOString()
        });
      }
    }

    // 2. Tempo de resposta elevado (últimas 1h)
    const { data: performanceMetrics } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('metric_name', 'ai_matching_compatibility_score')
      .gte('created_at', oneHourAgo.toISOString());

    if (performanceMetrics && performanceMetrics.length > 0) {
      const avgResponseTime = performanceMetrics
        .filter(m => m.tags?.processing_time)
        .reduce((sum, m) => sum + (m.tags.processing_time || 0), 0) / performanceMetrics.length;

      if (avgResponseTime > 3000) { // > 3 segundos
        alerts.push({
          severity: 'medium',
          type: 'performance',
          message: `Tempo de resposta elevado: ${Math.round(avgResponseTime)}ms`,
          value: avgResponseTime,
          threshold: 3000,
          timestamp: now.toISOString()
        });
      }
    }

    // 3. Baixa qualidade de matches (últimas 24h)
    const { data: scoreMetrics } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('metric_name', 'ai_matching_compatibility_score')
      .gte('created_at', oneDayAgo.toISOString());

    if (scoreMetrics && scoreMetrics.length > 20) {
      const avgScore = scoreMetrics.reduce((sum, m) => sum + m.metric_value, 0) / scoreMetrics.length;

      if (avgScore < 0.5) { // Score médio < 50%
        alerts.push({
          severity: 'medium',
          type: 'quality',
          message: `Qualidade dos matches baixa: ${Math.round(avgScore * 100)}% nas últimas 24h`,
          value: avgScore,
          threshold: 0.5,
          timestamp: now.toISOString()
        });
      }
    }

    // 4. Taxa de cache hit muito baixa (últimas 24h)
    if (scoreMetrics && scoreMetrics.length > 10) {
      const cacheHits = scoreMetrics.filter(m => m.tags?.cache_hit === true).length;
      const cacheHitRate = cacheHits / scoreMetrics.length;

      if (cacheHitRate < 0.2) { // < 20% cache hit
        alerts.push({
          severity: 'low',
          type: 'cache',
          message: `Taxa de cache hit baixa: ${Math.round(cacheHitRate * 100)}%`,
          value: cacheHitRate,
          threshold: 0.2,
          timestamp: now.toISOString()
        });
      }
    }

    // 5. Feedback negativo elevado (últimas 24h)
    const { data: feedbackMetrics } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('metric_name', 'ai_matching_feedback')
      .gte('created_at', oneDayAgo.toISOString());

    if (feedbackMetrics && feedbackMetrics.length > 10) {
      const rejectionRate = feedbackMetrics.filter(f => f.metric_value === 0).length / feedbackMetrics.length;

      if (rejectionRate > 0.7) { // > 70% rejeições
        alerts.push({
          severity: 'high',
          type: 'user_satisfaction',
          message: `Alta taxa de rejeição: ${Math.round(rejectionRate * 100)}% nas últimas 24h`,
          value: rejectionRate,
          threshold: 0.7,
          timestamp: now.toISOString()
        });
      }
    }

    // 6. Verificar uso da API Perplexity (custo)
    const { data: apiCalls } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('metric_name', 'perplexity_api_call')
      .gte('created_at', oneDayAgo.toISOString());

    if (apiCalls && apiCalls.length > 1000) { // > 1000 calls/dia
      alerts.push({
        severity: 'medium',
        type: 'api_usage',
        message: `Alto uso da Perplexity API: ${apiCalls.length} calls nas últimas 24h`,
        value: apiCalls.length,
        threshold: 1000,
        timestamp: now.toISOString()
      });
    }

    // Registrar alertas encontrados
    if (alerts.length > 0) {
      await supabase.from('performance_metrics').insert({
        metric_name: 'ai_matching_alerts',
        metric_value: alerts.length,
        metric_unit: 'alerts',
        tags: {
          alerts: alerts,
          check_timestamp: now.toISOString()
        }
      });

      console.log(`🚨 ${alerts.length} alertas detectados:`, alerts);
    }

    // Calcular métricas de ROI
    const { data: acceptedMatches } = await supabase
      .from('performance_metrics')
      .select('*')
      .eq('metric_name', 'ai_matching_feedback')
      .eq('metric_value', 1) // Aceitos
      .gte('created_at', oneDayAgo.toISOString());

    const roi = {
      matches_accepted: acceptedMatches?.length || 0,
      estimated_revenue: (acceptedMatches?.length || 0) * 2500, // R$ 2.500 por match aceito
      platform_value: (acceptedMatches?.length || 0) * 15000, // R$ 15.000 de valor gerado
      satisfaction_score: feedbackMetrics && feedbackMetrics.length > 0 ? 
        (feedbackMetrics.filter(f => f.metric_value === 1).length / feedbackMetrics.length) * 100 : 85
    };

    return new Response(JSON.stringify({
      success: true,
      alerts,
      roi,
      summary: {
        total_alerts: alerts.length,
        critical_alerts: alerts.filter(a => a.severity === 'high').length,
        system_health: alerts.length === 0 ? 'healthy' : 
                      alerts.filter(a => a.severity === 'high').length > 0 ? 'critical' : 'warning',
        check_timestamp: now.toISOString()
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error in AI matching monitor:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});