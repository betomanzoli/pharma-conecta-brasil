
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegulatoryAlert {
  title: string;
  description: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  url?: string;
  published_at: string;
  expires_at?: string;
}

const logStep = (step: string, data?: any) => {
  console.log(`[REGULATORY-SYNC] ${step}`, data ? JSON.stringify(data) : '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Starting regulatory sync');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { source = 'anvisa' } = await req.json();
    logStep('Syncing from source', { source });

    // Simulate fetching from ANVISA API (in production, this would be real API calls)
    const mockAlerts: RegulatoryAlert[] = [
      {
        title: 'Nova RDC sobre Medicamentos Genéricos',
        description: 'Publicada nova resolução que altera os critérios para registro de medicamentos genéricos no Brasil.',
        alert_type: 'regulatory_update',
        severity: 'high',
        source: 'ANVISA',
        url: 'https://www.anvisa.gov.br/resolucoes/2024/rdc-generic-update.html',
        published_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Alerta de Segurança - Lote de Medicamento Recolhido',
        description: 'Recolhimento voluntário de lote específico devido a desvio de qualidade identificado em análise pós-comercialização.',
        alert_type: 'safety_alert',
        severity: 'critical',
        source: 'ANVISA',
        url: 'https://www.anvisa.gov.br/alertas/2024/safety-recall-001.html',
        published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Atualização de Boas Práticas de Fabricação',
        description: 'Revisão das diretrizes de BPF para indústrias farmacêuticas, incluindo novos requisitos de validação.',
        alert_type: 'guideline_update',
        severity: 'medium',
        source: 'ANVISA',
        published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: 'Consulta Pública - Medicamentos Inovadores',
        description: 'Abertura de consulta pública para regulamentação de medicamentos inovadores e terapias avançadas.',
        alert_type: 'public_consultation',
        severity: 'medium',
        source: 'ANVISA',
        url: 'https://www.anvisa.gov.br/consultas/2024/cp-medicamentos-inovadores.html',
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Insert new alerts into database
    const insertPromises = mockAlerts.map(alert => 
      supabase.from('regulatory_alerts').upsert(alert, { 
        onConflict: 'title,source,published_at',
        ignoreDuplicates: true 
      })
    );

    const results = await Promise.allSettled(insertPromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    logStep('Sync completed', { successful, failed, total: mockAlerts.length });

    // Clean up expired alerts
    const { error: cleanupError } = await supabase
      .from('regulatory_alerts')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (cleanupError) {
      logStep('Cleanup warning', { error: cleanupError.message });
    }

    return new Response(JSON.stringify({
      alerts: mockAlerts,
      sync_stats: {
        processed: mockAlerts.length,
        successful,
        failed
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    logStep('ERROR', { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
