import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[FDA-API] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("FDA API request received");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action = 'sync_all', search, limit = 100 } = await req.json();

    // Buscar configurações da API FDA
    const { data: apiConfig } = await supabase
      .from('api_configurations')
      .select('*')
      .eq('integration_name', 'fda_api')
      .eq('is_active', true)
      .single();

    if (!apiConfig) {
      throw new Error('Configuração da API FDA não encontrada ou inativa');
    }

    const baseUrl = apiConfig.base_url;
    logStep("Using FDA API configuration", { baseUrl });

    // Implementar cada endpoint da FDA
    switch (action) {
      case 'sync_drugs':
        return await syncDrugs(supabase, baseUrl, search, limit);
      
      case 'sync_adverse_events':
        return await syncAdverseEvents(supabase, baseUrl, search, limit);
      
      case 'sync_food_enforcement':
        return await syncFoodEnforcement(supabase, baseUrl, search, limit);
      
      case 'sync_device_adverse_events':
        return await syncDeviceAdverseEvents(supabase, baseUrl, search, limit);
      
      case 'sync_all':
        return await syncAllEndpoints(supabase, baseUrl);
      
      default:
        throw new Error(`Ação não reconhecida: ${action}`);
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in FDA API", { message: errorMessage });
    
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

// Função para sincronizar dados de medicamentos
async function syncDrugs(supabase: any, baseUrl: string, search?: string, limit = 100) {
  logStep("Sincronizando medicamentos FDA");
  
  let url = `${baseUrl}/drug/drugsfda.json?limit=${limit}`;
  if (search) {
    url += `&search=openfda.brand_name:"${search}"`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar medicamentos FDA: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.results || []) {
    const drugData = {
      external_id: item.application_number || crypto.randomUUID(),
      application_number: item.application_number,
      product_number: item.products?.[0]?.product_number,
      brand_name: item.products?.[0]?.brand_name,
      generic_name: item.products?.[0]?.active_ingredients?.[0]?.name,
      dosage_form: item.products?.[0]?.dosage_form,
      route: item.products?.[0]?.route,
      marketing_status: item.products?.[0]?.marketing_status,
      te_code: item.products?.[0]?.te_code,
      strength: item.products?.[0]?.active_ingredients?.[0]?.strength,
      submission_type: item.submissions?.[0]?.submission_type,
      submission_number: item.submissions?.[0]?.submission_number,
      submission_status: item.submissions?.[0]?.submission_status,
      submission_classification: item.submissions?.[0]?.submission_classification,
      submission_date: item.submissions?.[0]?.submission_status_date ? new Date(item.submissions[0].submission_status_date) : null,
      review_priority: item.submissions?.[0]?.review_priority,
      fda_data: item
    };
    
    const { data: inserted, error } = await supabase
      .from('fda_drugs')
      .upsert(drugData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (error) {
      logStep("Erro ao inserir medicamento FDA", { error: error.message });
    } else {
      results.push(inserted);
    }
  }
  
  logStep("Medicamentos FDA sincronizados", { count: results.length });
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar eventos adversos
async function syncAdverseEvents(supabase: any, baseUrl: string, search?: string, limit = 100) {
  logStep("Sincronizando eventos adversos FDA");
  
  let url = `${baseUrl}/drug/event.json?limit=${limit}`;
  if (search) {
    url += `&search=patient.drug.medicinalproduct:"${search}"`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar eventos adversos FDA: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.results || []) {
    const eventData = {
      external_id: item.safetyreportid || crypto.randomUUID(),
      safetyreportid: item.safetyreportid,
      safetyreportversion: item.safetyreportversion,
      receivedate: item.receivedate,
      receiptdate: item.receiptdate,
      primarysource: item.primarysource?.qualification,
      reporttype: item.reporttype,
      serious: item.serious,
      seriousnessother: item.seriousnessother,
      seriousnessdeath: item.seriousnessdeath,
      seriousnesslifethreatening: item.seriousnesslifethreatening,
      seriousnesshospitalization: item.seriousnesshospitalization,
      seriousnessdisabling: item.seriousnessdisabling,
      seriousnesscongenitalanomali: item.seriousnesscongenitalanomali,
      patientsex: item.patient?.patientsex,
      patientage: item.patient?.patientagegroup,
      medicinalproduct: item.patient?.drug?.[0]?.medicinalproduct,
      reaction_text: item.patient?.reaction?.[0]?.reactionmeddrapt,
      reaction_outcome: item.patient?.reaction?.[0]?.reactionoutcome,
      fda_data: item
    };
    
    const { data: inserted, error } = await supabase
      .from('fda_adverse_events')
      .upsert(eventData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (error) {
      logStep("Erro ao inserir evento adverso FDA", { error: error.message });
    } else {
      results.push(inserted);
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar recalls de alimentos
async function syncFoodEnforcement(supabase: any, baseUrl: string, search?: string, limit = 100) {
  logStep("Sincronizando recalls de alimentos FDA");
  
  let url = `${baseUrl}/food/enforcement.json?limit=${limit}`;
  if (search) {
    url += `&search=product_description:"${search}"`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar recalls de alimentos FDA: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.results || []) {
    const recallData = {
      external_id: item.recall_number || crypto.randomUUID(),
      recall_number: item.recall_number,
      reason_for_recall: item.reason_for_recall,
      status: item.status,
      distribution_pattern: item.distribution_pattern,
      product_quantity: item.product_quantity,
      recalling_firm: item.recalling_firm,
      classification: item.classification,
      code_info: item.code_info,
      product_description: item.product_description,
      product_type: item.product_type,
      event_id: item.event_id,
      more_code_info: item.more_code_info,
      initial_firm_notification: item.initial_firm_notification,
      report_date: item.report_date ? new Date(item.report_date) : null,
      voluntary_mandated: item.voluntary_mandated,
      city: item.city,
      state: item.state,
      country: item.country,
      fda_data: item
    };
    
    const { data: inserted, error } = await supabase
      .from('fda_food_enforcement')
      .upsert(recallData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (error) {
      logStep("Erro ao inserir recall de alimento FDA", { error: error.message });
    } else {
      results.push(inserted);
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar eventos adversos de dispositivos
async function syncDeviceAdverseEvents(supabase: any, baseUrl: string, search?: string, limit = 100) {
  logStep("Sincronizando eventos adversos de dispositivos FDA");
  
  let url = `${baseUrl}/device/event.json?limit=${limit}`;
  if (search) {
    url += `&search=device.generic_name:"${search}"`;
  }
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar eventos adversos de dispositivos FDA: ${response.statusText}`);
  }
  
  const data = await response.json();
  const results = [];
  
  for (const item of data.results || []) {
    const deviceEventData = {
      external_id: item.mdr_report_key || crypto.randomUUID(),
      mdr_report_key: item.mdr_report_key,
      event_location: item.event_location,
      report_number: item.report_number,
      report_source_code: item.report_source_code,
      report_to_fda: item.report_to_fda,
      date_report: item.date_report,
      event_type: item.event_type,
      date_of_event: item.date_of_event,
      device_name: item.device?.[0]?.generic_name,
      device_class: item.device?.[0]?.device_class,
      manufacturer_name: item.device?.[0]?.manufacturer_d_name,
      model_number: item.device?.[0]?.model_number,
      lot_number: item.device?.[0]?.lot_number,
      product_problem: item.mdr_text?.[0]?.text,
      event_description: item.mdr_text?.[1]?.text,
      fda_data: item
    };
    
    const { data: inserted, error } = await supabase
      .from('fda_device_adverse_events')
      .upsert(deviceEventData, { onConflict: 'external_id' })
      .select()
      .single();
    
    if (error) {
      logStep("Erro ao inserir evento adverso de dispositivo FDA", { error: error.message });
    } else {
      results.push(inserted);
    }
  }
  
  return new Response(JSON.stringify({
    success: true,
    synced_count: results.length,
    timestamp: new Date().toISOString()
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

// Função para sincronizar todos os endpoints
async function syncAllEndpoints(supabase: any, baseUrl: string) {
  logStep("Iniciando sincronização completa FDA");
  
  const results = {
    drugs: 0,
    adverse_events: 0,
    food_enforcement: 0,
    device_adverse_events: 0
  };
  
  try {
    // Sincronizar dados com limite menor para sincronização completa
    const limit = 50;
    
    const drugsResult = await syncDrugs(supabase, baseUrl, undefined, limit);
    const drugsData = await drugsResult.json();
    results.drugs = drugsData.synced_count || 0;
    
    const adverseResult = await syncAdverseEvents(supabase, baseUrl, undefined, limit);
    const adverseData = await adverseResult.json();
    results.adverse_events = adverseData.synced_count || 0;
    
    const foodResult = await syncFoodEnforcement(supabase, baseUrl, undefined, limit);
    const foodData = await foodResult.json();
    results.food_enforcement = foodData.synced_count || 0;
    
    const deviceResult = await syncDeviceAdverseEvents(supabase, baseUrl, undefined, limit);
    const deviceData = await deviceResult.json();
    results.device_adverse_events = deviceData.synced_count || 0;
    
    // Atualizar timestamp da última sincronização
    await supabase
      .from('api_configurations')
      .update({ last_sync: new Date().toISOString() })
      .eq('integration_name', 'fda_api');
    
    logStep("Sincronização completa FDA finalizada", results);
    
    return new Response(JSON.stringify({
      success: true,
      results,
      total_synced: Object.values(results).reduce((sum, count) => sum + count, 0),
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    logStep("Erro na sincronização completa FDA", { error: error.message });
    throw error;
  }
}