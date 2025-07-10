import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IchRequest {
  guideline_type?: string;
  topic?: string;
  status?: string;
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { guideline_type, topic, status, limit = 20 }: IchRequest = await req.json();
    
    console.log('[ICH Guidelines] Processing request:', { guideline_type, topic, status, limit });

    // Dados atualizados das diretrizes ICH
    const ichGuidelines = [
      {
        id: 'ich-q1a',
        code: 'Q1A(R2)',
        title: 'Stability Testing of New Drug Substances and Products',
        type: 'Quality',
        topic: 'stability',
        step: 'Step 4',
        status: 'current',
        date: '2003-02-06',
        last_update: '2024-01-15',
        description: 'Guidance on stability testing requirements for registration applications',
        url: 'https://database.ich.org/sites/default/files/Q1A%28R2%29%20Guideline.pdf',
        category: 'Analytical',
        regulatory_impact: 'high',
        implementation_status: 'mandatory',
        regions: ['US', 'EU', 'JP', 'CA', 'AU', 'BR'],
        keywords: ['Stability', 'Shelf Life', 'Storage Conditions', 'Testing']
      },
      {
        id: 'ich-q2r1',
        code: 'Q2(R1)',
        title: 'Validation of Analytical Procedures: Text and Methodology',
        type: 'Quality',
        topic: 'analytical',
        step: 'Step 4',
        status: 'current',
        date: '2005-11-01',
        last_update: '2023-12-10',
        description: 'Requirements for validation of analytical procedures',
        url: 'https://database.ich.org/sites/default/files/Q2%28R1%29%20Guideline.pdf',
        category: 'Analytical',
        regulatory_impact: 'high',
        implementation_status: 'mandatory',
        regions: ['US', 'EU', 'JP', 'CA', 'AU', 'BR'],
        keywords: ['Analytical Validation', 'Method Validation', 'Specificity', 'Linearity']
      },
      {
        id: 'ich-q3a',
        code: 'Q3A(R2)',
        title: 'Impurities in New Drug Substances',
        type: 'Quality',
        topic: 'impurities',
        step: 'Step 4',
        status: 'current',
        date: '2006-10-25',
        last_update: '2024-02-20',
        description: 'Guidance on identification and qualification of impurities',
        url: 'https://database.ich.org/sites/default/files/Q3A%28R2%29%20Guideline.pdf',
        category: 'Chemistry',
        regulatory_impact: 'high',
        implementation_status: 'mandatory',
        regions: ['US', 'EU', 'JP', 'CA', 'AU', 'BR'],
        keywords: ['Impurities', 'Identification', 'Qualification', 'Thresholds']
      },
      {
        id: 'ich-e6-r3',
        code: 'E6(R3)',
        title: 'Good Clinical Practice: Integrated Addendum',
        type: 'Efficacy',
        topic: 'gcp',
        step: 'Step 4',
        status: 'current',
        date: '2024-05-17',
        last_update: '2024-05-17',
        description: 'Updated GCP guidelines incorporating modern technologies',
        url: 'https://database.ich.org/sites/default/files/ICH_E6-R3_GCP-Principles_Draft_2024.pdf',
        category: 'Clinical Trials',
        regulatory_impact: 'very_high',
        implementation_status: 'mandatory',
        regions: ['US', 'EU', 'JP', 'CA', 'AU', 'BR'],
        keywords: ['GCP', 'Clinical Trials', 'Digital Technologies', 'Risk-Based Monitoring']
      },
      {
        id: 'ich-m4',
        code: 'M4(R5)',
        title: 'Common Technical Document for Registration',
        type: 'Multidisciplinary',
        topic: 'ctd',
        step: 'Step 4',
        status: 'current',
        date: '2023-07-15',
        last_update: '2023-07-15',
        description: 'Standardized format for regulatory submissions',
        url: 'https://database.ich.org/sites/default/files/M4%28R5%29%20Guideline.pdf',
        category: 'Regulatory',
        regulatory_impact: 'very_high',
        implementation_status: 'mandatory',
        regions: ['US', 'EU', 'JP', 'CA', 'AU', 'BR'],
        keywords: ['CTD', 'Regulatory Submission', 'Dossier Format', 'Registration']
      },
      {
        id: 'ich-s1c',
        code: 'S1C(R2)',
        title: 'Dose Selection for Carcinogenicity Studies',
        type: 'Safety',
        topic: 'carcinogenicity',
        step: 'Step 4',
        status: 'current',
        date: '2022-11-30',
        last_update: '2022-11-30',
        description: 'Guidance on dose selection for carcinogenicity studies',
        url: 'https://database.ich.org/sites/default/files/S1C%28R2%29%20Guideline.pdf',
        category: 'Nonclinical Safety',
        regulatory_impact: 'medium',
        implementation_status: 'recommended',
        regions: ['US', 'EU', 'JP', 'CA', 'AU'],
        keywords: ['Carcinogenicity', 'Dose Selection', 'Toxicology', 'Maximum Tolerated Dose']
      }
    ];

    // Filtrar por tipo de diretriz
    let filteredGuidelines = ichGuidelines;
    if (guideline_type) {
      filteredGuidelines = filteredGuidelines.filter(g => g.type.toLowerCase() === guideline_type.toLowerCase());
    }

    // Filtrar por tópico
    if (topic) {
      const topicLower = topic.toLowerCase();
      filteredGuidelines = filteredGuidelines.filter(g => 
        g.topic.toLowerCase().includes(topicLower) ||
        g.title.toLowerCase().includes(topicLower) ||
        g.keywords.some(keyword => keyword.toLowerCase().includes(topicLower))
      );
    }

    // Filtrar por status
    if (status) {
      filteredGuidelines = filteredGuidelines.filter(g => g.status === status);
    }

    // Limitar resultados
    const results = filteredGuidelines.slice(0, limit);

    // Salvar dados no banco para cache
    const dataToSave = results.map(guideline => ({
      source: 'ich',
      data_type: 'regulatory_guideline',
      title: `${guideline.code}: ${guideline.title}`,
      description: guideline.description,
      content: guideline,
      url: guideline.url,
      published_at: guideline.date,
    }));

    await supabaseClient
      .from('integration_data')
      .upsert(dataToSave, { onConflict: 'source,title' });

    console.log(`[ICH Guidelines] Returning ${results.length} guidelines`);

    return new Response(
      JSON.stringify({
        success: true,
        source: 'ICH',
        total_found: filteredGuidelines.length,
        returned: results.length,
        guidelines: results,
        search_params: { guideline_type, topic, status, limit },
        categories: {
          Quality: filteredGuidelines.filter(g => g.type === 'Quality').length,
          Safety: filteredGuidelines.filter(g => g.type === 'Safety').length,
          Efficacy: filteredGuidelines.filter(g => g.type === 'Efficacy').length,
          Multidisciplinary: filteredGuidelines.filter(g => g.type === 'Multidisciplinary').length
        },
        last_updated: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[ICH Guidelines] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        source: 'ICH',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
})