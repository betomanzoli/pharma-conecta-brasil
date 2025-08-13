import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
  });

  try {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) {
      return new Response(JSON.stringify({ error: "not_authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { analysis_type, product_data, market_data, project_id } = body;

    let prompt = "";
    let outputType = "";

    switch (analysis_type) {
      case "business_case":
        prompt = `Crie um business case detalhado para o produto farmacêutico com os seguintes dados:
        ${JSON.stringify(product_data, null, 2)}
        
        Inclua:
        1. Resumo executivo
        2. Análise de mercado
        3. Proposta de valor
        4. Modelo de negócio
        5. Projeções financeiras
        6. Riscos e mitigações
        7. Cronograma de implementação
        8. Conclusões e recomendações`;
        outputType = "business_case";
        break;

      case "swot_analysis":
        prompt = `Faça uma análise SWOT completa para o produto/empresa farmacêutica:
        ${JSON.stringify(product_data, null, 2)}
        
        Analise:
        - Forças (Strengths): Vantagens internas
        - Fraquezas (Weaknesses): Limitações internas  
        - Oportunidades (Opportunities): Fatores externos favoráveis
        - Ameaças (Threats): Fatores externos desfavoráveis
        
        Forneça estratégias para cada quadrante.`;
        outputType = "swot_analysis";
        break;

      case "market_analysis":
        prompt = `Conduza uma análise de mercado farmacêutico para:
        ${JSON.stringify({ product_data, market_data }, null, 2)}
        
        Inclua:
        1. Tamanho do mercado (TAM, SAM, SOM)
        2. Análise da concorrência
        3. Segmentação de clientes
        4. Tendências do mercado
        5. Barreiras de entrada
        6. Análise de pricing
        7. Canais de distribuição
        8. Projeções de crescimento`;
        outputType = "market_analysis";
        break;

      case "competitive_analysis":
        prompt = `Faça uma análise competitiva detalhada para:
        ${JSON.stringify(product_data, null, 2)}
        
        Analise:
        1. Principais competidores diretos e indiretos
        2. Participação de mercado
        3. Estratégias de pricing
        4. Posicionamento de marca
        5. Forças e fraquezas dos competidores
        6. Diferenciação competitiva
        7. Estratégias recomendadas`;
        outputType = "competitive_analysis";
        break;

      default:
        throw new Error("Tipo de análise não suportado");
    }

    let analysisResult = "";

    if (PERPLEXITY_API_KEY) {
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-large-128k-online",
          messages: [
            {
              role: "system",
              content: `Você é um estrategista de negócios especializado no setor farmacêutico brasileiro. 
              Seus análises devem ser baseadas em dados reais do mercado, regulamentações da ANVISA, 
              tendências do setor e melhores práticas da indústria farmacêutica.`
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        analysisResult = data.choices[0]?.message?.content || "Erro ao gerar análise";
      } else {
        throw new Error("Erro na API Perplexity");
      }
    } else {
      analysisResult = `# Análise ${outputType.toUpperCase()}

## Dados Analisados
${JSON.stringify(product_data, null, 2)}

## Análise Estratégica
Esta é uma análise estruturada baseada nos dados fornecidos. 

Para análises mais detalhadas e baseadas em dados de mercado em tempo real, 
recomenda-se a configuração da integração com APIs de inteligência de mercado.

## Próximos Passos
1. Validar os dados com fontes primárias
2. Conduzir pesquisa de mercado adicional
3. Consultar especialistas do setor
4. Implementar monitoramento contínuo

**Nota**: Esta análise foi gerada com dados limitados. Para resultados mais precisos, 
configure as integrações de API necessárias.`;
    }

    // Salvar o resultado no banco
    const { data: agentOutput, error: insertError } = await supabase
      .from("ai_agent_outputs")
      .insert({
        user_id: auth.user.id,
        project_id: project_id || null,
        agent_type: "business_strategist",
        input: body,
        output_md: analysisResult,
        kpis: {
          analysis_type: outputType,
          data_points: Object.keys(product_data || {}).length,
          output_length: analysisResult.length,
          has_market_data: !!market_data
        },
        handoff_to: [],
        status: "completed"
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erro ao salvar output:", insertError);
    }

    return new Response(JSON.stringify({
      output: agentOutput,
      analysis: analysisResult,
      type: outputType
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("ai-business-strategist error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "internal_error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});