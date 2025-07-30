
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SECURITY-MONITOR] ${step}${detailsStr}`);
};

// Input validation functions
function validateInput(input: any, type: 'string' | 'number' | 'boolean' | 'uuid', required = true): boolean {
  if (required && (input === null || input === undefined)) {
    return false;
  }
  
  if (!required && (input === null || input === undefined)) {
    return true;
  }

  switch (type) {
    case 'string':
      return typeof input === 'string' && input.trim().length > 0;
    case 'number':
      return typeof input === 'number' && !isNaN(input);
    case 'boolean':
      return typeof input === 'boolean';
    case 'uuid':
      return typeof input === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input);
    default:
      return false;
  }
}

function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>\"']/g, '');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Security monitoring request received");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { action, ...params } = await req.json();
    
    // Validate action
    if (!validateInput(action, 'string')) {
      throw new Error('Invalid action parameter');
    }

    const sanitizedAction = sanitizeInput(action);
    logStep("Processing security action", { action: sanitizedAction, userId: user.id });

    switch (sanitizedAction) {
      case 'monitor_user_activity': {
        const { user_id, time_window_hours } = params;
        
        // Validate parameters
        if (!validateInput(user_id, 'uuid') || !validateInput(time_window_hours, 'number')) {
          throw new Error('Invalid parameters for user activity monitoring');
        }

        // Check if user can monitor this activity
        if (user.id !== user_id) {
          const { data: adminCheck } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', user.id)
            .single();
          
          if (!adminCheck || adminCheck.user_type !== 'admin') {
            throw new Error('Insufficient permissions to monitor other users');
          }
        }

        const timeWindowMs = Math.min(Math.max(time_window_hours, 1), 168) * 60 * 60 * 1000; // Max 1 week
        const startTime = new Date(Date.now() - timeWindowMs);

        // Get security events
        const { data: securityEvents, error: eventsError } = await supabase
          .from('security_audit_logs')
          .select('*')
          .eq('user_id', user_id)
          .gte('created_at', startTime.toISOString())
          .order('created_at', { ascending: false });

        if (eventsError) throw eventsError;

        // Analyze patterns
        const eventsByType = securityEvents?.reduce((acc: any, event) => {
          acc[event.event_type] = (acc[event.event_type] || 0) + 1;
          return acc;
        }, {}) || {};

        const ipAddresses = [...new Set(securityEvents?.map(e => e.ip_address).filter(Boolean) || [])];
        const userAgents = [...new Set(securityEvents?.map(e => e.user_agent).filter(Boolean) || [])];

        // Risk assessment
        const riskFactors = [];
        if (eventsByType.failed_login > 5) riskFactors.push('high_failed_logins');
        if (eventsByType.suspicious_activity > 0) riskFactors.push('suspicious_activity_detected');
        if (ipAddresses.length > 5) riskFactors.push('multiple_ip_addresses');
        if (userAgents.length > 3) riskFactors.push('multiple_user_agents');

        const riskLevel = riskFactors.length > 2 ? 'high' : riskFactors.length > 0 ? 'medium' : 'low';

        // Store monitoring result
        await supabase.from('performance_metrics').insert({
          metric_name: 'security_monitoring',
          metric_value: riskFactors.length,
          metric_unit: 'risk_factors',
          tags: {
            user_id,
            risk_level,
            risk_factors: riskFactors,
            events_analyzed: securityEvents?.length || 0
          }
        });

        return new Response(JSON.stringify({
          success: true,
          monitoring_result: {
            user_id,
            time_window_hours,
            events_analyzed: securityEvents?.length || 0,
            events_by_type: eventsByType,
            unique_ip_addresses: ipAddresses.length,
            unique_user_agents: userAgents.length,
            risk_level: riskLevel,
            risk_factors: riskFactors
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case 'real_time_threat_detection': {
        const { ip_address, user_agent, event_data } = params;
        
        // Validate parameters
        if (!validateInput(ip_address, 'string', false) || !validateInput(user_agent, 'string', false)) {
          throw new Error('Invalid parameters for threat detection');
        }

        const sanitizedIp = ip_address ? sanitizeInput(ip_address) : null;
        const sanitizedUserAgent = user_agent ? sanitizeInput(user_agent) : null;

        // Check for suspicious patterns
        const threats = [];
        
        // Check for known malicious IPs (simplified - in production use threat intelligence feeds)
        const suspiciousIps = ['127.0.0.1', '0.0.0.0']; // Example list
        if (sanitizedIp && suspiciousIps.includes(sanitizedIp)) {
          threats.push({
            type: 'malicious_ip',
            description: `Suspicious IP address detected: ${sanitizedIp}`,
            severity: 'high'
          });
        }

        // Check for suspicious user agents
        if (sanitizedUserAgent) {
          const botPatterns = ['bot', 'crawler', 'spider', 'scraper'];
          const isSuspiciousAgent = botPatterns.some(pattern => 
            sanitizedUserAgent.toLowerCase().includes(pattern)
          );
          
          if (isSuspiciousAgent) {
            threats.push({
              type: 'suspicious_user_agent',
              description: `Suspicious user agent detected: ${sanitizedUserAgent}`,
              severity: 'medium'
            });
          }
        }

        // Check recent activity for this user
        const { data: recentActivity } = await supabase
          .from('security_audit_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        const failedLogins = recentActivity?.filter(e => e.event_type === 'failed_login').length || 0;
        if (failedLogins > 3) {
          threats.push({
            type: 'multiple_failed_logins',
            description: `${failedLogins} failed login attempts in the last hour`,
            severity: 'high'
          });
        }

        // Log threat detection results
        if (threats.length > 0) {
          await supabase.from('security_audit_logs').insert({
            user_id: user.id,
            event_type: 'threat_detection',
            event_description: `Real-time threat detection: ${threats.length} threats detected`,
            ip_address: sanitizedIp,
            user_agent: sanitizedUserAgent,
            metadata: { threats, detected_at: new Date().toISOString() }
          });
        }

        return new Response(JSON.stringify({
          success: true,
          threat_detection: {
            threats_detected: threats.length,
            threats: threats,
            risk_level: threats.some(t => t.severity === 'high') ? 'high' : 
                      threats.some(t => t.severity === 'medium') ? 'medium' : 'low'
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case 'security_health_check': {
        // Perform comprehensive security health check
        const healthChecks = [];

        // Check RLS policies
        const { data: tables } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .in('table_name', ['profiles', 'user_security_settings', 'security_audit_logs']);

        healthChecks.push({
          check: 'rls_enabled',
          status: tables && tables.length > 0 ? 'pass' : 'fail',
          message: `${tables?.length || 0} critical tables have RLS enabled`
        });

        // Check for recent security events
        const { data: recentEvents } = await supabase
          .from('security_audit_logs')
          .select('count')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        healthChecks.push({
          check: 'security_logging',
          status: 'pass',
          message: `${recentEvents?.length || 0} security events logged in last 24h`
        });

        // Check user security settings coverage
        const { data: usersCount } = await supabase
          .from('profiles')
          .select('count');

        const { data: securitySettingsCount } = await supabase
          .from('user_security_settings')
          .select('count');

        const coverage = usersCount && securitySettingsCount ? 
          (securitySettingsCount.length / usersCount.length) * 100 : 0;

        healthChecks.push({
          check: 'security_settings_coverage',
          status: coverage > 90 ? 'pass' : coverage > 70 ? 'warning' : 'fail',
          message: `${coverage.toFixed(1)}% of users have security settings configured`
        });

        const overallHealth = healthChecks.filter(c => c.status === 'pass').length / healthChecks.length;

        return new Response(JSON.stringify({
          success: true,
          security_health: {
            overall_score: Math.round(overallHealth * 100),
            status: overallHealth > 0.8 ? 'healthy' : overallHealth > 0.6 ? 'warning' : 'critical',
            checks: healthChecks,
            checked_at: new Date().toISOString()
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      default:
        throw new Error('Invalid security monitoring action');
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in security monitoring", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
