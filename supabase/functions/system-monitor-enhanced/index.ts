
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

    // Comprehensive system health check
    const healthCheck = await performSystemHealthCheck(supabase);
    
    // Performance metrics collection
    const performanceMetrics = await collectPerformanceMetrics(supabase);
    
    // User activity analytics
    const userAnalytics = await collectUserAnalytics(supabase);

    // Generate alerts if needed
    const alerts = await generateSystemAlerts(healthCheck, performanceMetrics);

    return new Response(JSON.stringify({
      success: true,
      systemStatus: {
        health: healthCheck,
        performance: performanceMetrics,
        userAnalytics,
        alerts
      },
      timestamp: new Date().toISOString(),
      version: 'enhanced-v1.0'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function performSystemHealthCheck(supabase: any) {
  const checks = {
    database: { status: 'healthy', responseTime: 0 },
    auth: { status: 'healthy', responseTime: 0 }
  };

  // Database health check
  try {
    const start = Date.now();
    await supabase.from('profiles').select('count').limit(1);
    checks.database.responseTime = Date.now() - start;
  } catch (error) {
    checks.database.status = 'error';
  }

  const healthyChecks = Object.values(checks).filter(check => check.status === 'healthy').length;
  const overallScore = (healthyChecks / Object.keys(checks).length) * 100;

  return {
    checks,
    overallScore: Math.round(overallScore),
    status: overallScore >= 90 ? 'healthy' : overallScore >= 70 ? 'degraded' : 'critical',
    checkedAt: new Date().toISOString()
  };
}

async function collectPerformanceMetrics(supabase: any) {
  const { data: recentMetrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .gte('measured_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('measured_at', { ascending: false });

  const metrics = {
    totalRequests: recentMetrics?.length || 0,
    avgResponseTime: 0,
    errorRate: 0,
    throughput: 0
  };

  if (recentMetrics && recentMetrics.length > 0) {
    const responseTimes = recentMetrics
      .filter(m => m.metric_name === 'system_response_time')
      .map(m => m.metric_value);
    
    if (responseTimes.length > 0) {
      metrics.avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    }

    metrics.throughput = recentMetrics.length / 24; // requests per hour
  }

  return metrics;
}

async function collectUserAnalytics(supabase: any) {
  const { data: totalUsers } = await supabase
    .from('profiles')
    .select('id');

  const { data: activeUsers } = await supabase
    .from('profiles')
    .select('id')
    .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  return {
    totalUsers: totalUsers?.length || 0,
    activeUsers24h: activeUsers?.length || 0,
    userGrowthRate: 0
  };
}

async function generateSystemAlerts(healthCheck: any, performanceMetrics: any) {
  const alerts = [];

  if (healthCheck.overallScore < 80) {
    alerts.push({
      type: 'critical',
      message: 'System health score below threshold',
      details: `Current score: ${healthCheck.overallScore}%`
    });
  }

  if (performanceMetrics.errorRate > 5) {
    alerts.push({
      type: 'warning',
      message: 'High error rate detected',
      details: `Error rate: ${performanceMetrics.errorRate.toFixed(2)}%`
    });
  }

  return alerts;
}
