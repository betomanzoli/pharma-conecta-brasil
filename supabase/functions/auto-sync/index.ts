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
    logStep('Auto-sync scheduler - Starting');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { action, syncConfig } = await req.json();
    logStep('Sync action', { action });

    let results = {};

    switch (action) {
      case 'sync_all_apis':
        results = await syncAllAPIs(supabase);
        break;
      case 'sync_anvisa_data':
        results = await syncAnvisaData(supabase);
        break;
      case 'sync_fda_data':
        results = await syncFDAData(supabase);
        break;
      case 'update_ai_embeddings':
        results = await updateAIEmbeddings(supabase);
        break;
      case 'generate_compatibility_scores':
        results = await generateCompatibilityScores(supabase);
        break;
      case 'schedule_sync':
        results = await scheduleSync(supabase, syncConfig);
        break;
      default:
        throw new Error('Invalid sync action');
    }

    logStep('Auto-sync completed', { action, results });

    return new Response(JSON.stringify({
      success: true,
      action,
      results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('Error in auto-sync', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncAllAPIs(supabase: any) {
  logStep('Starting full API synchronization');
  
  const results = await Promise.allSettled([
    syncAnvisaData(supabase),
    syncFDAData(supabase),
    updateAIEmbeddings(supabase),
    generateCompatibilityScores(supabase)
  ]);

  return {
    anvisa: results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason },
    fda: results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason },
    embeddings: results[2].status === 'fulfilled' ? results[2].value : { error: results[2].reason },
    compatibility: results[3].status === 'fulfilled' ? results[3].value : { error: results[3].reason }
  };
}

async function syncAnvisaData(supabase: any) {
  logStep('Syncing ANVISA data');
  
  try {
    // Chamar a função de sincronização ANVISA
    const { data, error } = await supabase.functions.invoke('anvisa-real-sync', {
      body: { syncType: 'all' }
    });

    if (error) throw error;

    // Atualizar timestamp da última sincronização
    await supabase
      .from('api_configurations')
      .upsert({
        integration_name: 'anvisa_auto_sync',
        last_sync: new Date().toISOString(),
        is_active: true
      }, { onConflict: 'integration_name' });

    return { 
      success: true, 
      synced_records: data?.results || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logStep('Error syncing ANVISA data', error);
    return { success: false, error: error.message };
  }
}

async function syncFDAData(supabase: any) {
  logStep('Syncing FDA data');
  
  try {
    // Chamar a função de sincronização FDA
    const { data, error } = await supabase.functions.invoke('fda-real-sync', {
      body: { syncType: 'all', limit: 50 }
    });

    if (error) throw error;

    // Atualizar timestamp da última sincronização
    await supabase
      .from('api_configurations')
      .upsert({
        integration_name: 'fda_auto_sync',
        last_sync: new Date().toISOString(),
        is_active: true
      }, { onConflict: 'integration_name' });

    return { 
      success: true, 
      synced_records: data?.results || 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logStep('Error syncing FDA data', error);
    return { success: false, error: error.message };
  }
}

async function updateAIEmbeddings(supabase: any) {
  logStep('Updating AI embeddings');
  
  try {
    // Buscar entidades que precisam de embeddings atualizados
    const { data: companies } = await supabase
      .from('companies')
      .select('id, name, description, expertise_area')
      .is('sentiment_score', null)
      .limit(50);

    const { data: laboratories } = await supabase
      .from('laboratories')
      .select('id, name, description, certifications')
      .is('sentiment_score', null)
      .limit(50);

    let processed = 0;

    // Processar companies
    for (const company of companies || []) {
      const embedding = await generateEmbedding(company);
      await supabase
        .from('companies')
        .update({ 
          sentiment_score: embedding.sentiment_score,
          sentiment_label: embedding.sentiment_label 
        })
        .eq('id', company.id);
      processed++;
    }

    // Processar laboratories
    for (const lab of laboratories || []) {
      const embedding = await generateEmbedding(lab);
      await supabase
        .from('laboratories')
        .update({ 
          sentiment_score: embedding.sentiment_score,
          sentiment_label: embedding.sentiment_label 
        })
        .eq('id', lab.id);
      processed++;
    }

    return { 
      success: true, 
      processed_entities: processed,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logStep('Error updating AI embeddings', error);
    return { success: false, error: error.message };
  }
}

async function generateEmbedding(entity: any) {
  // Simular geração de embedding e análise de sentimento
  const text = `${entity.name} ${entity.description || ''} ${(entity.expertise_area || entity.certifications || []).join(' ')}`;
  
  // Análise de sentimento básica
  const positiveWords = ['excelente', 'qualidade', 'inovação', 'eficiência', 'confiável'];
  const negativeWords = ['problema', 'atraso', 'falha', 'deficiência'];
  
  let score = 0.5; // neutral
  const lowerText = text.toLowerCase();
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 0.1;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 0.1;
  });
  
  score = Math.max(0, Math.min(1, score));
  
  let label = 'neutral';
  if (score > 0.6) label = 'positive';
  else if (score < 0.4) label = 'negative';
  
  return {
    sentiment_score: score,
    sentiment_label: label
  };
}

async function generateCompatibilityScores(supabase: any) {
  logStep('Generating compatibility scores');
  
  try {
    // Buscar empresas e laboratórios para calcular compatibilidade
    const { data: companies } = await supabase
      .from('companies')
      .select('*')
      .limit(20);

    const { data: laboratories } = await supabase
      .from('laboratories')
      .select('*')
      .limit(20);

    let processed = 0;

    // Calcular scores de compatibilidade entre empresas e laboratórios
    for (const company of companies || []) {
      for (const lab of laboratories || []) {
        const compatibilityScore = calculateCompatibility(company, lab);
        
        if (compatibilityScore >= 70) { // Só salvar matches com score alto
          await supabase
            .from('match_feedback')
            .upsert({
              user_id: company.profile_id || company.user_id,
              match_id: `${company.id}_${lab.id}`,
              provider_name: lab.name,
              provider_type: 'laboratory',
              match_score: compatibilityScore,
              feedback_type: 'ai_generated'
            }, { onConflict: 'user_id,match_id' });
          processed++;
        }
      }
    }

    return { 
      success: true, 
      compatibility_scores_generated: processed,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logStep('Error generating compatibility scores', error);
    return { success: false, error: error.message };
  }
}

function calculateCompatibility(company: any, lab: any): number {
  let score = 0;
  
  // Compatibilidade de localização
  if (company.city && lab.city && company.city === lab.city) {
    score += 25;
  } else if (company.state && lab.state && company.state === lab.state) {
    score += 15;
  }
  
  // Compatibilidade de expertise
  const companyExpertise = company.expertise_area || [];
  const labCertifications = lab.certifications || [];
  
  if (companyExpertise.some((exp: string) => 
    labCertifications.some((cert: string) => cert.toLowerCase().includes(exp.toLowerCase()))
  )) {
    score += 30;
  }
  
  // Score base
  score += 20;
  
  // Bonus por sentiment positivo
  if (company.sentiment_label === 'positive') score += 10;
  if (lab.sentiment_label === 'positive') score += 10;
  
  return Math.min(100, score);
}

async function scheduleSync(supabase: any, config: any) {
  logStep('Scheduling sync', config);
  
  try {
    const jobConfig = {
      job_name: config.jobName || 'auto_sync_all',
      function_name: 'auto-sync',
      schedule: config.schedule || '0 6 * * *', // Diário às 6h
      is_active: true,
      next_run: calculateNextRun(config.schedule || '0 6 * * *')
    };

    await supabase
      .from('cron_jobs')
      .upsert(jobConfig, { onConflict: 'job_name' });

    return { 
      success: true, 
      scheduled_job: jobConfig,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logStep('Error scheduling sync', error);
    return { success: false, error: error.message };
  }
}

function calculateNextRun(schedule: string): string {
  // Simular cálculo da próxima execução baseado no cron schedule
  const now = new Date();
  const nextRun = new Date(now);
  
  if (schedule.includes('6 * * *')) { // Diário às 6h
    nextRun.setHours(6, 0, 0, 0);
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
  }
  
  return nextRun.toISOString();
}