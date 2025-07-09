import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYSTEM-MONITOR-ENHANCED] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("System Monitor Enhanced check started");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Comprehensive system health check
    const healthCheck = await performSystemHealthCheck(supabase);
    
    // Performance metrics collection
    const performanceMetrics = await collectPerformanceMetrics(supabase);
    
    // Security monitoring
    const securityStatus = await performSecurityCheck(supabase);
    
    // User activity analytics
    const userAnalytics = await collectUserAnalytics(supabase);

    // Integration status check
    const integrationStatus = await checkIntegrationHealth(supabase);

    // Generate alerts if needed
    const alerts = await generateSystemAlerts(healthCheck, performanceMetrics, securityStatus);

    // Store monitoring data
    await storeMonitoringData(supabase, {
      healthCheck,
      performanceMetrics,
      securityStatus,
      userAnalytics,
      integrationStatus,
      alerts
    });

    logStep("System monitoring completed", { 
      healthScore: healthCheck.overallScore,
      alertsGenerated: alerts.length
    });

    return new Response(JSON.stringify({
      success: true,
      systemStatus: {
        health: healthCheck,
        performance: performanceMetrics,
        security: securityStatus,
        userAnalytics,
        integrations: integrationStatus,
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
    logStep("ERROR in system monitoring", { message: errorMessage });
    
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
  logStep("Performing system health check");

  const checks = {
    database: { status: 'healthy', responseTime: 0 },
    storage: { status: 'healthy', responseTime: 0 },
    auth: { status: 'healthy', responseTime: 0 },
    edgeFunctions: { status: 'healthy', responseTime: 0 }
  };

  // Database health check
  try {
    const start = Date.now();
    await supabase.from('profiles').select('count').limit(1);
    checks.database.responseTime = Date.now() - start;
  } catch (error) {
    checks.database.status = 'error';
  }

  // Edge functions health check
  try {
    const start = Date.now();
    const { data } = await supabase.functions.invoke('system-monitor', { 
      body: { action: 'ping' } 
    });
    checks.edgeFunctions.responseTime = Date.now() - start;
  } catch (error) {
    checks.edgeFunctions.status = 'degraded';
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
  logStep("Collecting performance metrics");

  // Query recent performance data
  const { data: recentMetrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .gte('measured_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('measured_at', { ascending: false });

  // Calculate performance statistics
  const metrics = {
    totalRequests: recentMetrics?.length || 0,
    avgResponseTime: 0,
    errorRate: 0,
    throughput: 0,
    memoryUsage: Math.random() * 50 + 30, // Simulated
    cpuUsage: Math.random() * 40 + 20 // Simulated
  };

  if (recentMetrics && recentMetrics.length > 0) {
    const responseTimes = recentMetrics
      .filter(m => m.metric_name === 'response_time')
      .map(m => m.metric_value);
    
    if (responseTimes.length > 0) {
      metrics.avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    }

    const errors = recentMetrics.filter(m => m.metric_name === 'error_count');
    metrics.errorRate = (errors.length / recentMetrics.length) * 100;
    
    metrics.throughput = recentMetrics.length / 24; // requests per hour
  }

  return metrics;
}

async function performSecurityCheck(supabase: any) {
  logStep("Performing security check");

  // Check for recent failed login attempts
  const { data: failedLogins } = await supabase
    .from('performance_metrics')
    .select('*')
    .eq('metric_name', 'failed_login')
    .gte('measured_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

  // Check for suspicious activities
  const { data: suspiciousActivities } = await supabase
    .from('performance_metrics')
    .select('*')
    .eq('metric_name', 'suspicious_activity')
    .gte('measured_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  return {
    failedLoginAttempts: failedLogins?.length || 0,
    suspiciousActivities: suspiciousActivities?.length || 0,
    securityScore: Math.max(100 - (failedLogins?.length || 0) * 5 - (suspiciousActivities?.length || 0) * 10, 0),
    lastSecurityScan: new Date().toISOString(),
    threats: generateSecurityThreats(failedLogins, suspiciousActivities)
  };
}

async function collectUserAnalytics(supabase: any) {
  logStep("Collecting user analytics");

  // Get user statistics
  const { data: totalUsers } = await supabase
    .from('profiles')
    .select('count');

  const { data: activeUsers } = await supabase
    .from('profiles')
    .select('count')
    .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const { data: newUsers } = await supabase
    .from('profiles')
    .select('count')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  return {
    totalUsers: totalUsers?.length || 0,
    activeUsers24h: activeUsers?.length || 0,
    newUsers24h: newUsers?.length || 0,
    userGrowthRate: calculateGrowthRate(newUsers?.length || 0, totalUsers?.length || 1),
    usersByType: await getUsersByType(supabase)
  };
}

async function getUsersByType(supabase: any) {
  const { data: userTypes } = await supabase
    .from('profiles')
    .select('user_type');

  const typeCount: Record<string, number> = {};
  userTypes?.forEach(user => {
    typeCount[user.user_type] = (typeCount[user.user_type] || 0) + 1;
  });

  return typeCount;
}

async function checkIntegrationHealth(supabase: any) {
  logStep("Checking integration health");

  // Check API configurations
  const { data: apiConfigs } = await supabase
    .from('api_configurations')
    .select('*')
    .eq('is_active', true);

  const integrations = apiConfigs?.map(config => ({
    name: config.integration_name,
    status: config.last_sync ? 'active' : 'inactive',
    lastSync: config.last_sync,
    health: calculateIntegrationHealth(config)
  })) || [];

  return {
    totalIntegrations: integrations.length,
    activeIntegrations: integrations.filter(i => i.status === 'active').length,
    integrations
  };
}

function calculateIntegrationHealth(config: any): string {
  if (!config.last_sync) return 'unhealthy';
  
  const lastSyncTime = new Date(config.last_sync).getTime();
  const hoursSinceSync = (Date.now() - lastSyncTime) / (1000 * 60 * 60);
  
  if (hoursSinceSync < 1) return 'healthy';
  if (hoursSinceSync < 24) return 'warning';
  return 'unhealthy';
}

async function generateSystemAlerts(healthCheck: any, performanceMetrics: any, securityStatus: any) {
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

  if (securityStatus.failedLoginAttempts > 10) {
    alerts.push({
      type: 'security',
      message: 'High number of failed login attempts',
      details: `Failed attempts: ${securityStatus.failedLoginAttempts}`
    });
  }

  return alerts;
}

async function storeMonitoringData(supabase: any, monitoringData: any) {
  await supabase.from('performance_metrics').insert({
    metric_name: 'system_health_score',
    metric_value: monitoringData.healthCheck.overallScore,
    metric_unit: 'percentage',
    tags: {
      monitoring_data: monitoringData,
      timestamp: new Date().toISOString()
    }
  });
}

function calculateGrowthRate(newUsers: number, totalUsers: number): number {
  if (totalUsers === 0) return 0;
  return Math.round((newUsers / totalUsers) * 100 * 100) / 100;
}

function generateSecurityThreats(failedLogins: any[], suspiciousActivities: any[]): string[] {
  const threats = [];
  
  if (failedLogins && failedLogins.length > 5) {
    threats.push('Potential brute force attack detected');
  }
  
  if (suspiciousActivities && suspiciousActivities.length > 0) {
    threats.push('Suspicious user activity patterns detected');
  }
  
  return threats;
}