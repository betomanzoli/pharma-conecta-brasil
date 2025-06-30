
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

    const { company_id, search_criteria } = await req.json();

    // Buscar empresa solicitante
    const { data: requestingCompany, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', company_id)
      .single();

    if (companyError) {
      throw new Error(`Erro ao buscar empresa: ${companyError.message}`);
    }

    // Buscar todas as outras empresas
    const { data: allCompanies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .neq('id', company_id);

    if (companiesError) {
      throw new Error(`Erro ao buscar empresas: ${companiesError.message}`);
    }

    // Algoritmo de matching baseado em compatibilidade
    const matches = allCompanies.map(company => {
      let score = 0;
      const factors = [];

      // Compatibilidade por área de expertise
      if (requestingCompany.expertise_area && company.expertise_area) {
        const commonAreas = requestingCompany.expertise_area.filter(area => 
          company.expertise_area.includes(area)
        );
        if (commonAreas.length > 0) {
          score += 0.4;
          factors.push(`Áreas em comum: ${commonAreas.join(', ')}`);
        }
      }

      // Compatibilidade por localização (mesmo estado = +0.2)
      if (requestingCompany.state === company.state) {
        score += 0.2;
        factors.push(`Mesmo estado: ${company.state}`);
      }

      // Compatibilidade por status de compliance
      if (requestingCompany.compliance_status === 'compliant' && 
          company.compliance_status === 'compliant') {
        score += 0.2;
        factors.push('Ambas com compliance em dia');
      }

      // Bonus por filtros específicos de busca
      if (search_criteria) {
        if (search_criteria.service_type && company.expertise_area?.includes(search_criteria.service_type)) {
          score += 0.2;
          factors.push(`Serviço desejado: ${search_criteria.service_type}`);
        }
      }

      return {
        company,
        compatibility_score: Math.min(score, 1), // Max 1.0
        match_factors: factors,
        recommended_actions: [
          'Enviar mensagem de interesse',
          'Solicitar reunião virtual',
          'Compartilhar portfólio'
        ]
      };
    }).filter(match => match.compatibility_score > 0.3) // Filtrar matches com score > 30%
     .sort((a, b) => b.compatibility_score - a.compatibility_score)
     .slice(0, 10); // Top 10 matches

    // Salvar interações de matching
    for (const match of matches.slice(0, 5)) {
      await supabase
        .from('company_interactions')
        .upsert({
          company_a_id: company_id,
          company_b_id: match.company.id,
          interaction_type: 'match',
          compatibility_score: match.compatibility_score,
          notes: `AI Match: ${match.match_factors.join('; ')}`
        }, {
          onConflict: 'company_a_id,company_b_id,interaction_type'
        });
    }

    return new Response(JSON.stringify({
      success: true,
      matches,
      total_companies_analyzed: allCompanies.length,
      top_match_score: matches[0]?.compatibility_score || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no AI Matching:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
