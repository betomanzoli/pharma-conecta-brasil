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
    logStep('Perplexity Search - Starting request');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { query, searchType, industry, specialization } = await req.json();
    logStep('Request parameters', { query, searchType, industry, specialization });

    // Build specific prompt by search type
    let prompt = '';
    switch (searchType) {
      case 'regulatory':
        prompt = `Busque informações regulatórias atualizadas sobre: ${query}. Foco em ANVISA, FDA, EMA. Inclua normas, alertas e mudanças recentes.`;
        break;
      case 'suppliers':
        prompt = `Encontre fornecedores farmacêuticos especializados em: ${query}. Inclua fabricantes de princípios ativos, excipientes, equipamentos. Especialização: ${specialization || 'geral'}.`;
        break;
      case 'laboratories':
        prompt = `Busque laboratórios especializados em: ${query}. Inclua BQV, EqFar, análises clínicas, pesquisa. Localização e especialização: ${specialization || 'geral'}.`;
        break;
      case 'consultants':
        prompt = `Encontre consultores farmacêuticos especializados em: ${query}. Áreas: regulatório, qualidade, produção, validação. Especialização: ${specialization || 'geral'}.`;
        break;
      case 'market_intelligence':
        prompt = `Análise de mercado farmacêutico para: ${query}. Inclua tendências, competidores, oportunidades de negócio. Setor: ${industry || 'farmacêutico'}.`;
        break;
      default:
        prompt = `Busca inteligente no setor farmacêutico: ${query}. Inclua informações relevantes sobre regulamentação, fornecedores, tecnologias.`;
    }

    logStep('Calling Perplexity API', { prompt });

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em indústria farmacêutica brasileira. Forneça informações precisas, atualizadas e relevantes para profissionais do setor.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: true,
        search_domain_filter: ['anvisa.gov.br', 'fda.gov', 'ema.europa.eu'],
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const result = {
      content: data.choices[0].message.content,
      related_questions: data.related_questions || [],
      sources: data.citations || [],
      search_type: searchType,
      timestamp: new Date().toISOString()
    };

    logStep('Perplexity API response received', { contentLength: result.content.length });

    // Save result to cache for future queries
    await supabase.from('cache_entries').insert({
      cache_key: `perplexity_${searchType}_${query.toLowerCase().replace(/\s+/g, '_')}`,
      source: 'perplexity',
      cache_data: result,
      ttl: 3600 // 1 hour
    });

    logStep('Result cached successfully');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('Error in Perplexity Search', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});