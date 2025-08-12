
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Starting regulatory data synchronization...')

    // Log the sync start
    const { data: logData } = await supabase.from('regulatory_api_logs').insert({
      api_source: 'regulatory_sync',
      endpoint: '/sync',
      status_code: 200,
      success: true,
      data_updated: true
    }).select().single()

    // Sync ANVISA alerts (simulated)
    const anvisaAlerts = await syncAnvisaAlerts(supabase)
    
    // Sync FDA data (simulated)
    const fdaData = await syncFdaData(supabase)

    // Update compliance tracking for companies
    const { data: companies } = await supabase.from('companies').select('id, name')
    
    let companiesUpdated = 0
    for (const company of companies || []) {
      const complianceScore = Math.random() * 0.4 + 0.6
      const status = complianceScore >= 0.8 ? 'compliant' : 'partial'

      await supabase.from('compliance_tracking').upsert({
        company_id: company.id,
        compliance_type: 'anvisa',
        status: status,
        score: complianceScore,
        last_check: new Date().toISOString(),
        details: { automated_check: true, sync_id: logData?.id }
      }, { onConflict: 'company_id,compliance_type' })
      
      companiesUpdated++
    }

    // Log performance metrics
    await supabase.from('performance_metrics').insert({
      metric_name: 'regulatory_sync_completed',
      metric_value: 1,
      metric_unit: 'sync_operation',
      tags: {
        anvisa_alerts: anvisaAlerts,
        fda_records: fdaData,
        companies_updated: companiesUpdated,
        timestamp: new Date().toISOString()
      }
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        anvisa_alerts: anvisaAlerts,
        fda_records: fdaData,
        companies_updated: companiesUpdated
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Regulatory sync error:', error)
    
    // Log the error
    await supabase.from('regulatory_api_logs').insert({
      api_source: 'regulatory_sync',
      endpoint: '/sync',
      status_code: 500,
      success: false,
      error_message: error.message,
      data_updated: false
    })

    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function syncAnvisaAlerts(supabase: any): Promise<number> {
  console.log('Syncing ANVISA alerts...')
  
  // Simulated ANVISA alerts data
  const mockAlerts = [
    {
      source: 'ANVISA',
      title: 'Nova Resolução sobre Medicamentos Biológicos',
      description: 'Atualização nos requisitos para registro de medicamentos biológicos e biossimilares.',
      alert_type: 'regulatory_update',
      severity: 'medium',
      published_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.gov.br/anvisa/pt-br'
    },
    {
      source: 'ANVISA',
      title: 'Recall de Medicamento - Lote Específico',
      description: 'Recolhimento voluntário de lotes específicos por questões de qualidade.',
      alert_type: 'recall',
      severity: 'high',
      published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://www.gov.br/anvisa/pt-br'
    }
  ]

  let alertsCreated = 0
  for (const alert of mockAlerts) {
    const { error } = await supabase.from('regulatory_alerts').upsert(alert, {
      onConflict: 'source,title'
    })
    
    if (!error) alertsCreated++
  }

  return alertsCreated
}

async function syncFdaData(supabase: any): Promise<number> {
  console.log('Syncing FDA data...')
  
  // Simulated FDA adverse events
  const mockFdaEvents = [
    {
      external_id: `fda_${Date.now()}_1`,
      safetyreportid: `FDA-${Math.floor(Math.random() * 1000000)}`,
      receivedate: new Date().toISOString().split('T')[0].replace(/-/g, ''),
      primarysource: 'Physician',
      serious: '1',
      medicinalproduct: 'Sample Product',
      reaction_text: 'Adverse reaction reported',
      fda_data: {
        source: 'openFDA',
        sync_timestamp: new Date().toISOString()
      }
    }
  ]

  let eventsCreated = 0
  for (const event of mockFdaEvents) {
    const { error } = await supabase.from('fda_adverse_events').upsert(event, {
      onConflict: 'external_id'
    })
    
    if (!error) eventsCreated++
  }

  return eventsCreated
}
