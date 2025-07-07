import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANVISA-SYNC] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("ANVISA sync started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Simular dados da ANVISA (em produção, seria uma API real)
    const anvisaData = await fetchAnvisaData();
    
    logStep("ANVISA data fetched", { recordsCount: anvisaData.length });

    // Processar e inserir dados regulatórios
    const processedData = anvisaData.map(item => ({
      source: 'ANVISA',
      title: item.title,
      description: item.description,
      alert_type: item.type,
      severity: item.severity,
      published_at: item.publishedAt,
      expires_at: item.expiresAt,
      url: item.url,
      content: {
        originalData: item,
        processed: true,
        syncedAt: new Date().toISOString()
      }
    }));

    // Inserir alertas regulatórios
    const { data: alertsData, error: alertsError } = await supabaseClient
      .from('regulatory_alerts')
      .upsert(processedData, { 
        onConflict: 'url',
        ignoreDuplicates: false 
      });

    if (alertsError) {
      logStep("Error inserting regulatory alerts", alertsError);
      throw alertsError;
    }

    logStep("Regulatory alerts inserted", { count: processedData.length });

    // Inserir dados de integração genéricos
    const integrationData = processedData.map(item => ({
      source: 'ANVISA',
      data_type: 'regulatory_alert',
      title: item.title,
      description: item.description,
      content: item.content,
      published_at: item.published_at,
      expires_at: item.expires_at,
      url: item.url
    }));

    const { data: integrationInsert, error: integrationError } = await supabaseClient
      .from('integration_data')
      .upsert(integrationData, { 
        onConflict: 'url',
        ignoreDuplicates: false 
      });

    if (integrationError) {
      logStep("Error inserting integration data", integrationError);
      throw integrationError;
    }

    logStep("Integration data inserted", { count: integrationData.length });

    // Atualizar configuração da API
    const { error: configError } = await supabaseClient
      .from('api_configurations')
      .upsert({
        integration_name: 'ANVISA',
        is_active: true,
        last_sync: new Date().toISOString(),
        sync_frequency_hours: 24,
        base_url: 'https://consultas.anvisa.gov.br',
      }, { onConflict: 'integration_name' });

    if (configError) {
      logStep("Error updating API configuration", configError);
    }

    // Criar notificações para novos alertas críticos
    const criticalAlerts = processedData.filter(item => 
      item.severity === 'high' || item.severity === 'critical'
    );

    if (criticalAlerts.length > 0) {
      logStep("Creating notifications for critical alerts", { count: criticalAlerts.length });
      
      // Buscar todos os usuários para notificar
      const { data: profiles } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('user_type', 'company');

      if (profiles && profiles.length > 0) {
        const notifications = profiles.flatMap(profile => 
          criticalAlerts.map(alert => ({
            user_id: profile.id,
            title: 'Novo Alerta Regulatório ANVISA',
            message: `Alerta crítico: ${alert.title}`,
            type: 'regulatory',
            read: false
          }))
        );

        await supabaseClient
          .from('notifications')
          .insert(notifications);

        logStep("Notifications created", { count: notifications.length });
      }
    }

    const summary = {
      timestamp: new Date().toISOString(),
      source: 'ANVISA',
      alerts_processed: processedData.length,
      critical_alerts: criticalAlerts.length,
      status: 'success'
    };

    logStep("ANVISA sync completed successfully", summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in ANVISA sync", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString(),
      status: 'failed'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Simular busca de dados da ANVISA (substituir por API real)
async function fetchAnvisaData() {
  // Em produção, isso seria uma chamada real para a API da ANVISA
  const mockData = [
    {
      title: "Alerta sobre medicamento X - Recolhimento voluntário",
      description: "A empresa ABC está recolhendo voluntariamente o lote 123456 do medicamento X devido a problemas de qualidade.",
      type: "product_recall",
      severity: "high",
      publishedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      url: `https://consultas.anvisa.gov.br/alert/${Date.now()}`
    },
    {
      title: "Nova regulamentação para medicamentos biológicos",
      description: "Publicada nova instrução normativa sobre registro de medicamentos biológicos.",
      type: "regulation_update",
      severity: "medium",
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
      expiresAt: null,
      url: `https://consultas.anvisa.gov.br/regulation/${Date.now()}`
    },
    {
      title: "Suspensão temporária de fábrica",
      description: "Fábrica XYZ teve suas atividades suspensas temporariamente devido a não conformidades.",
      type: "facility_suspension",
      severity: "critical",
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 dias
      url: `https://consultas.anvisa.gov.br/suspension/${Date.now()}`
    }
  ];

  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return mockData;
}