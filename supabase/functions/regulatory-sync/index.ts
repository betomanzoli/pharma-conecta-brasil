
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { source = 'anvisa' } = await req.json();

    // Simulação de dados regulatórios (em produção, seria integração com APIs reais)
    const mockRegulatoryData = {
      anvisa: [
        {
          title: 'Atualização RDC 844/2023 - Medicamentos Genéricos',
          description: 'Nova resolução sobre critérios de bioequivalência para medicamentos genéricos',
          alert_type: 'guideline',
          severity: 'medium',
          url: 'https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/genericos'
        },
        {
          title: 'Recall Emergencial - Lote XYZ123',
          description: 'Recall imediato de lote específico por contaminação cruzada',
          alert_type: 'recall',
          severity: 'critical',
          url: 'https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/recalls'
        },
        {
          title: 'Inspeção Programada - Indústrias Farmoquímicas',
          description: 'Cronograma de inspeções em empresas farmoquímicas para Q2/2024',
          alert_type: 'inspection',
          severity: 'medium',
          url: 'https://www.gov.br/anvisa/pt-br/assuntos/inspecao'
        }
      ],
      fda: [
        {
          title: 'FDA Approves New Biosimilar for Oncology',
          description: 'FDA approves biosimilar drug for cancer treatment',
          alert_type: 'approval',
          severity: 'medium',
          url: 'https://www.fda.gov/drugs/biosimilars'
        }
      ],
      ema: [
        {
          title: 'EMA Safety Review - Cardiovascular Drugs',
          description: 'European review of cardiovascular drug safety profiles',
          alert_type: 'safety',
          severity: 'high',
          url: 'https://www.ema.europa.eu/en/medicines/safety-review'
        }
      ]
    };

    const alerts = mockRegulatoryData[source] || [];
    const insertedAlerts = [];

    // Inserir novos alertas na base de dados
    for (const alert of alerts) {
      const { data, error } = await supabase
        .from('regulatory_alerts')
        .insert({
          source,
          title: alert.title,
          description: alert.description,
          alert_type: alert.alert_type,
          severity: alert.severity,
          published_at: new Date().toISOString(),
          url: alert.url
        })
        .select()
        .single();

      if (!error && data) {
        insertedAlerts.push(data);
      }
    }

    // Buscar alertas recentes para retornar
    const { data: recentAlerts, error: fetchError } = await supabase
      .from('regulatory_alerts')
      .select('*')
      .eq('source', source)
      .order('created_at', { ascending: false })
      .limit(10);

    if (fetchError) {
      throw new Error(`Erro ao buscar alertas: ${fetchError.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      source,
      new_alerts_count: insertedAlerts.length,
      recent_alerts: recentAlerts,
      sync_timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no Regulatory Sync:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
