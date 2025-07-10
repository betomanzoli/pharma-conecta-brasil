import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PicsRequest {
  search_term?: string;
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

    const { search_term, document_type, limit = 20 }: PicsRequest = await req.json();
    
    console.log('[PIC/S API] Processing request:', { search_term, document_type, limit });

    // Dados simulados do PIC/S (Pharmaceutical Inspection Co-operation Scheme)
    const picsDocuments = [
      {
        id: 'pics-gmp-001',
        title: 'PIC/S Guide to Good Manufacturing Practice for Medicinal Products',
        type: 'guideline',
        date: '2024-01-15',
        version: 'PE 009-18',
        category: 'GMP',
        description: 'Comprehensive guide covering principles and guidelines for GMP',
        url: 'https://picscheme.org/en/publications?tri=gmp',
        relevance_score: 95,
        status: 'active',
        language: 'EN',
        pages: 267,
        keywords: ['GMP', 'Manufacturing', 'Quality', 'Pharmaceutical']
      },
      {
        id: 'pics-insp-002',
        title: 'PIC/S Guidance on Good Practices for Data Management and Integrity',
        type: 'guidance',
        date: '2024-02-10',
        version: 'PI 041-1',
        category: 'Data Integrity',
        description: 'Guidelines for ensuring data integrity in pharmaceutical operations',
        url: 'https://picscheme.org/en/publications?tri=data',
        relevance_score: 88,
        status: 'active',
        language: 'EN',
        pages: 45,
        keywords: ['Data Integrity', 'ALCOA+', 'Quality Management', 'Compliance']
      },
      {
        id: 'pics-risk-003',
        title: 'PIC/S Guidance on Risk-Based Approach to GMP Inspections',
        type: 'guidance',
        date: '2023-11-20',
        version: 'PI 040-1',
        category: 'Risk Management',
        description: 'Framework for risk-based GMP inspection procedures',
        url: 'https://picscheme.org/en/publications?tri=risk',
        relevance_score: 82,
        status: 'active',
        language: 'EN',
        pages: 38,
        keywords: ['Risk Assessment', 'GMP Inspection', 'Quality Risk Management']
      },
      {
        id: 'pics-api-004',
        title: 'PIC/S Guidelines for APIs (Active Pharmaceutical Ingredients)',
        type: 'guideline',
        date: '2024-03-05',
        version: 'PE 008-4',
        category: 'API',
        description: 'Good manufacturing practices for active pharmaceutical ingredients',
        url: 'https://picscheme.org/en/publications?tri=api',
        relevance_score: 90,
        status: 'active',
        language: 'EN',
        pages: 156,
        keywords: ['API', 'Active Ingredients', 'Manufacturing', 'Quality Control']
      },
      {
        id: 'pics-computer-005',
        title: 'PIC/S Good Practices for Computerised Systems',
        type: 'guidance',
        date: '2023-09-15',
        version: 'PI 011-3',
        category: 'Computer Systems',
        description: 'Guidelines for validation and compliance of computerised systems',
        url: 'https://picscheme.org/en/publications?tri=computer',
        relevance_score: 85,
        status: 'active',
        language: 'EN',
        pages: 67,
        keywords: ['Computer Validation', 'CSV', '21 CFR Part 11', 'Electronic Records']
      }
    ];

    // Filtrar por termo de busca
    let filteredDocs = picsDocuments;
    if (search_term) {
      const searchLower = search_term.toLowerCase();
      filteredDocs = picsDocuments.filter(doc => 
        doc.title.toLowerCase().includes(searchLower) ||
        doc.description.toLowerCase().includes(searchLower) ||
        doc.keywords.some(keyword => keyword.toLowerCase().includes(searchLower)) ||
        doc.category.toLowerCase().includes(searchLower)
      );
    }

    // Filtrar por tipo de documento
    if (document_type) {
      filteredDocs = filteredDocs.filter(doc => doc.type === document_type);
    }

    // Limitar resultados
    const results = filteredDocs.slice(0, limit);

    // Salvar dados no banco para cache
    const dataToSave = results.map(doc => ({
      source: 'pics',
      data_type: 'regulatory_guidance',
      title: doc.title,
      description: doc.description,
      content: doc,
      url: doc.url,
      published_at: doc.date,
    }));

    await supabaseClient
      .from('integration_data')
      .upsert(dataToSave, { onConflict: 'source,title' });

    console.log(`[PIC/S API] Returning ${results.length} documents`);

    return new Response(
      JSON.stringify({
        success: true,
        source: 'PIC/S',
        total_found: filteredDocs.length,
        returned: results.length,
        documents: results,
        search_params: { search_term, document_type, limit },
        last_updated: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[PIC/S API] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        source: 'PIC/S',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
})