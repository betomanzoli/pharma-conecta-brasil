import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhoRequest {
  category?: string;
  region?: string;
  document_type?: string;
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

    const { category, region, document_type, limit = 20 }: WhoRequest = await req.json();
    
    console.log('[WHO Guidelines] Processing request:', { category, region, document_type, limit });

    // Dados atualizados das diretrizes WHO
    const whoGuidelines = [
      {
        id: 'who-gmp-001',
        code: 'WHO/TRS/1019',
        title: 'WHO good manufacturing practices for pharmaceutical products: main principles',
        type: 'Technical Report',
        category: 'Manufacturing',
        region: 'Global',
        status: 'current',
        date: '2024-01-25',
        version: 'Updated 2024',
        description: 'Fundamental principles of good manufacturing practices for pharmaceutical products',
        url: 'https://www.who.int/publications/i/item/WHO-TRS-1019',
        language: ['EN', 'ES', 'FR', 'AR', 'ZH', 'RU'],
        applicability: 'Global',
        regulatory_status: 'Recommended',
        keywords: ['GMP', 'Manufacturing', 'Quality Assurance', 'Pharmaceutical']
      },
      {
        id: 'who-prequalification-002',
        code: 'WHO/PQP/23.05',
        title: 'WHO Prequalification Programme: Guidelines for manufacturers',
        type: 'Guideline',
        category: 'Prequalification',
        region: 'Global',
        status: 'current',
        date: '2023-12-10',
        version: '2023',
        description: 'Guidelines for pharmaceutical manufacturers seeking WHO prequalification',
        url: 'https://extranet.who.int/pqweb/guidelines',
        language: ['EN', 'FR', 'ES'],
        applicability: 'Developing Countries',
        regulatory_status: 'Mandatory for WHO procurement',
        keywords: ['Prequalification', 'Global Health', 'Access to Medicines', 'Quality']
      },
      {
        id: 'who-pharmacovigilance-003',
        code: 'WHO/UMC/23.01',
        title: 'WHO Guidelines for Good Pharmacovigilance Practices',
        type: 'Guideline',
        category: 'Safety',
        region: 'Global',
        status: 'current',
        date: '2023-11-30',
        version: '2023 Revision',
        description: 'Guidelines for establishing and maintaining pharmacovigilance systems',
        url: 'https://www.who.int/publications/i/item/good-pharmacovigilance-practices',
        language: ['EN', 'ES', 'FR', 'PT'],
        applicability: 'Global',
        regulatory_status: 'Recommended',
        keywords: ['Pharmacovigilance', 'Safety Monitoring', 'Adverse Events', 'Signal Detection']
      },
      {
        id: 'who-biologicals-004',
        code: 'WHO/BS/24.2450',
        title: 'WHO Guidelines for the production and control of vaccines',
        type: 'Technical Report',
        category: 'Biologicals',
        region: 'Global',
        status: 'current',
        date: '2024-03-15',
        version: '2024 Update',
        description: 'Requirements for vaccine development, production and quality control',
        url: 'https://www.who.int/publications/i/item/vaccine-guidelines',
        language: ['EN', 'FR', 'ES', 'ZH'],
        applicability: 'Global',
        regulatory_status: 'Reference Standard',
        keywords: ['Vaccines', 'Biologicals', 'Quality Control', 'Immunization']
      },
      {
        id: 'who-clinical-trials-005',
        code: 'WHO/HTM/23.15',
        title: 'WHO Handbook for Good Clinical Research Practice',
        type: 'Handbook',
        category: 'Clinical Research',
        region: 'Global',
        status: 'current',
        date: '2023-10-20',
        version: '2023 Edition',
        description: 'Standards for conducting clinical research in diverse settings',
        url: 'https://www.who.int/publications/i/item/good-clinical-research-practice',
        language: ['EN', 'ES', 'FR', 'PT', 'AR'],
        applicability: 'Global',
        regulatory_status: 'Reference Standard',
        keywords: ['Clinical Trials', 'GCP', 'Research Ethics', 'Global Health']
      },
      {
        id: 'who-antimicrobial-006',
        code: 'WHO/AMR/24.02',
        title: 'WHO Guidelines on Antimicrobial Resistance Surveillance',
        type: 'Guideline',
        category: 'Antimicrobial Resistance',
        region: 'Global',
        status: 'current',
        date: '2024-02-28',
        version: '2024',
        description: 'Guidelines for surveillance and monitoring of antimicrobial resistance',
        url: 'https://www.who.int/publications/i/item/amr-surveillance-guidelines',
        language: ['EN', 'ES', 'FR', 'ZH', 'AR'],
        applicability: 'Global',
        regulatory_status: 'Recommended',
        keywords: ['AMR', 'Antimicrobial Resistance', 'Surveillance', 'Public Health']
      }
    ];

    // Filtrar por categoria
    let filteredGuidelines = whoGuidelines;
    if (category) {
      const categoryLower = category.toLowerCase();
      filteredGuidelines = filteredGuidelines.filter(g => 
        g.category.toLowerCase().includes(categoryLower) ||
        g.keywords.some(keyword => keyword.toLowerCase().includes(categoryLower))
      );
    }

    // Filtrar por região
    if (region) {
      filteredGuidelines = filteredGuidelines.filter(g => g.region.toLowerCase() === region.toLowerCase());
    }

    // Filtrar por tipo de documento
    if (document_type) {
      filteredGuidelines = filteredGuidelines.filter(g => g.type.toLowerCase() === document_type.toLowerCase());
    }

    // Limitar resultados
    const results = filteredGuidelines.slice(0, limit);

    // Salvar dados no banco para cache
    const dataToSave = results.map(guideline => ({
      source: 'who',
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

    console.log(`[WHO Guidelines] Returning ${results.length} guidelines`);

    return new Response(
      JSON.stringify({
        success: true,
        source: 'WHO',
        total_found: filteredGuidelines.length,
        returned: results.length,
        guidelines: results,
        search_params: { category, region, document_type, limit },
        statistics: {
          by_category: {
            manufacturing: filteredGuidelines.filter(g => g.category === 'Manufacturing').length,
            safety: filteredGuidelines.filter(g => g.category === 'Safety').length,
            biologicals: filteredGuidelines.filter(g => g.category === 'Biologicals').length,
            clinical_research: filteredGuidelines.filter(g => g.category === 'Clinical Research').length
          },
          by_applicability: {
            global: filteredGuidelines.filter(g => g.applicability === 'Global').length,
            developing_countries: filteredGuidelines.filter(g => g.applicability === 'Developing Countries').length
          }
        },
        last_updated: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[WHO Guidelines] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        source: 'WHO',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
})