import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[WEBHOOK-HANDLER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received", { method: req.method, url: req.url });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse webhook payload
    const payload = await req.json();
    const { source, type, data } = payload;

    logStep("Webhook payload parsed", { source, type, dataKeys: Object.keys(data || {}) });

    let processedData;
    let notifications = [];

    switch (source) {
      case 'ANVISA':
        processedData = await processAnvisaWebhook(data, supabaseClient);
        notifications = await createAnvisaNotifications(processedData, supabaseClient);
        break;
        
      case 'FINEP':
        processedData = await processFinepWebhook(data, supabaseClient);
        notifications = await createFinepNotifications(processedData, supabaseClient);
        break;
        
      case 'CRM':
        processedData = await processCrmWebhook(data, supabaseClient);
        break;
        
      case 'ERP':
        processedData = await processErpWebhook(data, supabaseClient);
        break;
        
      default:
        logStep("Unknown webhook source", { source });
        return new Response(JSON.stringify({ 
          error: `Unknown webhook source: ${source}` 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
    }

    // Log processing results
    logStep("Webhook processed successfully", {
      source,
      type,
      recordsProcessed: processedData?.length || 0,
      notificationsCreated: notifications?.length || 0
    });

    return new Response(JSON.stringify({
      success: true,
      timestamp: new Date().toISOString(),
      source,
      type,
      recordsProcessed: processedData?.length || 0,
      notificationsCreated: notifications?.length || 0
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR processing webhook", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString() 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Processar webhook da ANVISA
async function processAnvisaWebhook(data: any, supabase: any) {
  const alerts = Array.isArray(data.alerts) ? data.alerts : [data];
  
  const processedAlerts = alerts.map((alert: any) => ({
    source: 'ANVISA',
    title: alert.title || 'Novo Alerta ANVISA',
    description: alert.description || '',
    alert_type: alert.type || 'general',
    severity: alert.severity || 'medium',
    published_at: alert.publishedAt || new Date().toISOString(),
    expires_at: alert.expiresAt || null,
    url: alert.url || null,
    content: {
      webhookData: alert,
      processedAt: new Date().toISOString()
    }
  }));

  const { data: inserted, error } = await supabase
    .from('regulatory_alerts')
    .upsert(processedAlerts, { onConflict: 'url' });

  if (error) throw error;

  return processedAlerts;
}

// Processar webhook da FINEP
async function processFinepWebhook(data: any, supabase: any) {
  const opportunities = Array.isArray(data.opportunities) ? data.opportunities : [data];
  
  const processedOpportunities = opportunities.map((opp: any) => ({
    source: 'FINEP',
    data_type: 'funding_opportunity',
    title: opp.title || 'Nova Oportunidade FINEP',
    description: opp.description || '',
    content: {
      amount: opp.amount,
      deadline: opp.deadline,
      category: opp.category,
      requirements: opp.requirements,
      webhookData: opp,
      processedAt: new Date().toISOString()
    },
    published_at: opp.publishedAt || new Date().toISOString(),
    expires_at: opp.deadline || null,
    url: opp.url || null
  }));

  const { data: inserted, error } = await supabase
    .from('integration_data')
    .upsert(processedOpportunities, { onConflict: 'url' });

  if (error) throw error;

  return processedOpportunities;
}

// Processar webhook de CRM
async function processCrmWebhook(data: any, supabase: any) {
  const leads = Array.isArray(data.leads) ? data.leads : [data];
  
  // Aqui você processaria leads do CRM e criaria/atualizaria contatos
  logStep("Processing CRM webhook", { leadsCount: leads.length });
  
  return leads;
}

// Processar webhook de ERP
async function processErpWebhook(data: any, supabase: any) {
  const transactions = Array.isArray(data.transactions) ? data.transactions : [data];
  
  // Aqui você processaria transações do ERP
  logStep("Processing ERP webhook", { transactionsCount: transactions.length });
  
  return transactions;
}

// Criar notificações para alertas ANVISA
async function createAnvisaNotifications(alerts: any[], supabase: any) {
  const criticalAlerts = alerts.filter(alert => 
    alert.severity === 'high' || alert.severity === 'critical'
  );

  if (criticalAlerts.length === 0) return [];

  // Buscar usuários para notificar
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .in('user_type', ['company', 'laboratory']);

  if (!profiles || profiles.length === 0) return [];

  const notifications = profiles.flatMap((profile: any) => 
    criticalAlerts.map(alert => ({
      user_id: profile.id,
      title: '🚨 Alerta Regulatório Crítico',
      message: `ANVISA: ${alert.title}`,
      type: 'regulatory',
      read: false
    }))
  );

  const { data: inserted, error } = await supabase
    .from('notifications')
    .insert(notifications);

  if (error) {
    logStep("Error creating ANVISA notifications", error);
    return [];
  }

  return notifications;
}

// Criar notificações para oportunidades FINEP
async function createFinepNotifications(opportunities: any[], supabase: any) {
  // Buscar usuários interessados em financiamento
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_type', 'company');

  if (!profiles || profiles.length === 0) return [];

  const notifications = profiles.flatMap((profile: any) => 
    opportunities.map(opp => ({
      user_id: profile.id,
      title: '💰 Nova Oportunidade de Financiamento',
      message: `FINEP: ${opp.title}`,
      type: 'opportunity',
      read: false
    }))
  );

  const { data: inserted, error } = await supabase
    .from('notifications')
    .insert(notifications);

  if (error) {
    logStep("Error creating FINEP notifications", error);
    return [];
  }

  return notifications;
}