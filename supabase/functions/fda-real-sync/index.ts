import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logStep = (step: string, details?: any) => {
  console.log(`[${new Date().toISOString()}] ${step}`, details || '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('FDA Real Sync - Starting');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { syncType, limit = 100 } = await req.json();
    logStep('Sync parameters', { syncType, limit });

    let results = {};

    switch (syncType) {
      case 'drugs':
        results = await syncDrugs(supabase, limit);
        break;
      case 'adverse_events':
        results = await syncAdverseEvents(supabase, limit);
        break;
      case 'food_enforcement':
        results = await syncFoodEnforcement(supabase, limit);
        break;
      case 'device_events':
        results = await syncDeviceEvents(supabase, limit);
        break;
      case 'all':
        results = await syncAll(supabase, limit);
        break;
      default:
        throw new Error('Invalid sync type');
    }

    logStep('FDA sync completed', { syncType, resultsCount: Object.keys(results).length });

    return new Response(JSON.stringify({
      success: true,
      syncType,
      results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('Error in FDA sync', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncDrugs(supabase: any, limit: number) {
  logStep('Syncing drugs from FDA');
  
  const response = await fetch(`https://api.fda.gov/drug/drugsfda.json?limit=${limit}`, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'PharmaConnect/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`FDA API error: ${response.status}`);
  }

  const data = await response.json();
  
  const processedData = data.results?.map((item: any) => ({
    external_id: item.application_number || item.product_number,
    application_number: item.application_number,
    product_number: item.product_number,
    brand_name: item.openfda?.brand_name?.[0] || item.brand_name,
    generic_name: item.openfda?.generic_name?.[0] || item.generic_name,
    dosage_form: item.openfda?.dosage_form?.[0],
    route: item.openfda?.route?.[0],
    marketing_status: item.marketing_status,
    active_ingredient: item.active_ingredient,
    strength: item.strength,
    submission_date: item.submission_date,
    fda_data: item
  })) || [];

  const { data: insertedData, error } = await supabase
    .from('fda_drugs')
    .upsert(processedData, { onConflict: 'external_id' });

  if (error) {
    logStep('Error inserting drugs', error);
    throw error;
  }

  return { drugs: processedData.length };
}

async function syncAdverseEvents(supabase: any, limit: number) {
  logStep('Syncing adverse events from FDA');
  
  const response = await fetch(`https://api.fda.gov/drug/event.json?limit=${limit}`, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'PharmaConnect/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`FDA API error: ${response.status}`);
  }

  const data = await response.json();
  
  const processedData = data.results?.map((item: any) => ({
    external_id: item.safetyreportid,
    safetyreportid: item.safetyreportid,
    receivedate: item.receivedate,
    serious: item.serious,
    medicinalproduct: item.patient?.drug?.[0]?.medicinalproduct,
    reaction_text: item.patient?.reaction?.[0]?.reactionmeddrapt,
    patientsex: item.patient?.patientsex,
    patientage: item.patient?.patientage,
    fda_data: item
  })) || [];

  const { data: insertedData, error } = await supabase
    .from('fda_adverse_events')
    .upsert(processedData, { onConflict: 'external_id' });

  if (error) {
    logStep('Error inserting adverse events', error);
    throw error;
  }

  return { adverse_events: processedData.length };
}

async function syncFoodEnforcement(supabase: any, limit: number) {
  logStep('Syncing food enforcement from FDA');
  
  const response = await fetch(`https://api.fda.gov/food/enforcement.json?limit=${limit}`, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'PharmaConnect/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`FDA API error: ${response.status}`);
  }

  const data = await response.json();
  
  const processedData = data.results?.map((item: any) => ({
    external_id: item.recall_number,
    recall_number: item.recall_number,
    status: item.status,
    classification: item.classification,
    product_description: item.product_description,
    reason_for_recall: item.reason_for_recall,
    recall_initiation_date: item.recall_initiation_date,
    state: item.state,
    country: item.country,
    fda_data: item
  })) || [];

  const { data: insertedData, error } = await supabase
    .from('fda_food_enforcement')
    .upsert(processedData, { onConflict: 'external_id' });

  if (error) {
    logStep('Error inserting food enforcement', error);
    throw error;
  }

  return { food_enforcement: processedData.length };
}

async function syncDeviceEvents(supabase: any, limit: number) {
  logStep('Syncing device events from FDA');
  
  const response = await fetch(`https://api.fda.gov/device/event.json?limit=${limit}`, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'PharmaConnect/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`FDA API error: ${response.status}`);
  }

  const data = await response.json();
  
  const processedData = data.results?.map((item: any) => ({
    external_id: item.mdr_report_key,
    mdr_report_key: item.mdr_report_key,
    event_type: item.event_type,
    date_received: item.date_received,
    device_name: item.device?.[0]?.brand_name,
    manufacturer: item.device?.[0]?.manufacturer_d_name,
    patient_problem_code: item.patient?.[0]?.patient_problem_code,
    fda_data: item
  })) || [];

  const { data: insertedData, error } = await supabase
    .from('fda_device_events')
    .upsert(processedData, { onConflict: 'external_id' });

  if (error) {
    logStep('Error inserting device events', error);
    throw error;
  }

  return { device_events: processedData.length };
}

async function syncAll(supabase: any, limit: number) {
  logStep('Starting full FDA sync');
  
  const results = await Promise.allSettled([
    syncDrugs(supabase, limit),
    syncAdverseEvents(supabase, limit),
    syncFoodEnforcement(supabase, limit),
    syncDeviceEvents(supabase, limit)
  ]);

  const finalResults = {
    drugs: results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason },
    adverse_events: results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason },
    food_enforcement: results[2].status === 'fulfilled' ? results[2].value : { error: results[2].reason },
    device_events: results[3].status === 'fulfilled' ? results[3].value : { error: results[3].reason }
  };

  // Atualizar timestamp da última sincronização
  await supabase
    .from('api_configurations')
    .upsert({
      integration_name: 'fda_real',
      last_sync: new Date().toISOString(),
      is_active: true
    }, { onConflict: 'integration_name' });

  return finalResults;
}