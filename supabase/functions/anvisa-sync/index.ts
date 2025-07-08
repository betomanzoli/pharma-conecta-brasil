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

    console.log('Starting ANVISA data synchronization...')

    // Simular sincronização com APIs da ANVISA
    const mockAlerts = [
      {
        source: 'anvisa',
        title: 'Nova RDC sobre Medicamentos Genéricos',
        description: 'ANVISA publica nova resolução RDC nº 73/2024 alterando critérios de bioequivalência',
        alert_type: 'regulatory_change',
        severity: 'high',
        published_at: new Date().toISOString()
      }
    ]

    // Inserir alertas regulatórios
    for (const alert of mockAlerts) {
      await supabase.from('regulatory_alerts').insert(alert)
    }

    // Log da sincronização
    await supabase.from('regulatory_api_logs').insert({
      api_source: 'anvisa',
      endpoint: 'alertas_regulatorios',
      status_code: 200,
      response_time_ms: 500,
      success: true,
      records_processed: mockAlerts.length
    })

    return new Response(
      JSON.stringify({ success: true, processed: mockAlerts.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('ANVISA sync error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})