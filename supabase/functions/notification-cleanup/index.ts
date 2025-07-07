import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[NOTIFICATION-CLEANUP] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Notification cleanup started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Limpar notificações antigas e lidas
    const { data: deletedNotifications, error: deleteError } = await supabaseClient
      .from('notifications')
      .delete()
      .eq('read', true)
      .lt('created_at', thirtyDaysAgo.toISOString())
      .select('id');

    if (deleteError) {
      logStep("Error deleting old notifications", deleteError);
    } else {
      logStep("Old notifications deleted", { count: deletedNotifications?.length || 0 });
    }

    // 2. Arquivar notificações muito antigas (mais de 90 dias) mesmo que não lidas
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: archivedNotifications, error: archiveError } = await supabaseClient
      .from('notifications')
      .delete()
      .lt('created_at', ninetyDaysAgo.toISOString())
      .select('id');

    if (archiveError) {
      logStep("Error archiving very old notifications", archiveError);
    } else {
      logStep("Very old notifications archived", { count: archivedNotifications?.length || 0 });
    }

    // 3. Limpar dados de integração antigos
    const { data: deletedIntegrationData, error: integrationError } = await supabaseClient
      .from('integration_data')
      .delete()
      .not('expires_at', 'is', null)
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (integrationError) {
      logStep("Error deleting expired integration data", integrationError);
    } else {
      logStep("Expired integration data deleted", { count: deletedIntegrationData?.length || 0 });
    }

    // 4. Limpar alertas regulatórios expirados
    const { data: deletedAlerts, error: alertsError } = await supabaseClient
      .from('regulatory_alerts')
      .delete()
      .not('expires_at', 'is', null)
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (alertsError) {
      logStep("Error deleting expired regulatory alerts", alertsError);
    } else {
      logStep("Expired regulatory alerts deleted", { count: deletedAlerts?.length || 0 });
    }

    // 5. Limpar métricas de performance antigas
    try {
      await supabaseClient.rpc('clean_old_metrics');
      logStep("Old performance metrics cleaned");
    } catch (error) {
      logStep("Error cleaning old metrics", error);
    }

    // 6. Atualizar estatísticas de limpeza
    const totalCleaned = (deletedNotifications?.length || 0) + 
                        (archivedNotifications?.length || 0) + 
                        (deletedIntegrationData?.length || 0) + 
                        (deletedAlerts?.length || 0);

    // 7. Criar resumo da limpeza
    const summary = {
      timestamp: new Date().toISOString(),
      total_items_cleaned: totalCleaned,
      notifications_deleted: deletedNotifications?.length || 0,
      notifications_archived: archivedNotifications?.length || 0,
      integration_data_deleted: deletedIntegrationData?.length || 0,
      alerts_deleted: deletedAlerts?.length || 0,
      status: 'completed'
    };

    // 8. Registrar métrica de limpeza
    await supabaseClient
      .from('performance_metrics')
      .insert({
        metric_name: 'cleanup_items_processed',
        metric_value: totalCleaned,
        metric_unit: 'count',
        tags: summary
      });

    logStep("Cleanup completed successfully", summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in notification cleanup", { message: errorMessage });
    
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