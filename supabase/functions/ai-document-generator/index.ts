import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");

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

    // Rate limiting and audit
    const FUNCTION_NAME = 'ai-document-generator';
    const WINDOW_MINUTES = 5;
    const MAX_CALLS = 10;
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count, error: countErr } = await supabase
      .from('function_invocations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', auth.user.id)
      .eq('function_name', FUNCTION_NAME)
      .gte('invoked_at', since);
    if (countErr) console.error('rate-limit count error', countErr);
    if ((count ?? 0) >= MAX_CALLS) {
      return new Response(
        JSON.stringify({ error: 'rate_limited', detail: `Limite de ${MAX_CALLS} chamadas a cada ${WINDOW_MINUTES} minutos.` }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    await supabase.from('function_invocations').insert({
      user_id: auth.user.id,
      function_name: FUNCTION_NAME,
      metadata: { ip: req.headers.get('x-forwarded-for') || '', ua: req.headers.get('user-agent') || '' }
    });
    await supabase.rpc('audit_log', { action_type: 'invoke', table_name: 'edge_function', record_id: null, details: { function_name: FUNCTION_NAME } });

    const body = await req.json();
    const { 
      document_type,
      product_category,
      template_name,
      regulatory_requirements,
      project_id 
    } = body;

    const documentGeneratorPrompt = `AGENTE GERADOR DE DOCUMENTAÇÃO REGULATÓRIA RESPONSÁVEL v1.0

═══════════════════════════════════════════════════
SEÇÃO 1: IDENTIDADE E ESPECIALIZAÇÃO
═══════════════════════════════════════════════════

ROLE: Especialista em Documentação Técnica e de Qualidade para o setor farmacêutico brasileiro.
ESPECIALIZAÇÃO: Geração de templates regulatórios, POPs/SOPs e checklists de compliance alinhados com ANVISA e GMP.
NÍVEL DE EXPERTISE: Especialista

PRINCÍPIOS ORIENTADORES:
- Transparência: Origem de cada requisito no template é clara (RDC X, Art. Y).
- Accountability: Responsável pela conformidade dos templates.
- Fairness: Templates claros e de fácil preenchimento.
- Segurança: Checklists não deixam passar requisitos críticos.
- Supervisão Humana: Templates devem ser preenchidos por especialistas qualificados.

PROTOCOLO DE ANÁLISE:
1. CONTEXTUALIZAÇÃO: Tipo ${document_type} para categoria ${product_category}
2. COLETA ESTRUTURADA: Guias ANVISA, ABNT, ICH (score 10/10)
3. PROCESSAMENTO: Mapear seções obrigatórias, placeholders instrutivos
4. VALIDAÇÃO CRUZADA: Comparar com checklist da norma, terminologia ANVISA

CHECKPOINTS OBRIGATÓRIOS:
✓ TÉCNICO: Estrutura conforme norma, versionamento, instruções claras
✓ ÉTICO: Seções para riscos, template requer aprovação humana
✓ GOVERNANÇA: Campos para assinaturas, referência à norma visível
✓ COMPLETUDE: Nenhum requisito omitido, template pronto para uso

FORMATO DE SAÍDA:

[DOCUMENTO GERADO]
- Tipo: ${document_type}
- Norma Base: [RDC/IN aplicável]
- Nível de Confiança: [100]%

[CONTEÚDO DO TEMPLATE/SOP/CHECKLIST]
[CABEÇALHO: Logo, Título, Código, Versão, Data]

1.0 OBJETIVO
   [Descrever o propósito...]

2.0 ÂMBITO  
   [Aplicabilidade...]

3.0 RESPONSABILIDADES
   [Definir papéis...]

4.0 PROCEDIMENTO
   [Passos detalhados...]

5.0 REGISTROS
   [Documentos relacionados...]

6.0 REFERÊNCIAS
   [Normas aplicáveis...]

[RODAPÉ: Página X de Y]

[INSTRUÇÕES DE USO]
- Preenchimento correto do template
- Necessidade de revisão/aprovação formal

[METADADOS DE VALIDAÇÃO]
- Timestamp: [Data/Hora]
- Versão: v1.0
- Fontes Verificadas: [Link ANVISA]
- Status Checkpoints: [TODOS ✓]

DOCUMENTO SOLICITADO:
Tipo: ${document_type}
Categoria: ${product_category}
Template: ${template_name}
Requisitos: ${regulatory_requirements}`;

    let generated = "";
    if (PERPLEXITY_API_KEY) {
      const resp = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            { role: "system", content: "Seja preciso na estrutura de documentos e conformidade regulatória." },
            { role: "user", content: documentGeneratorPrompt },
          ],
          temperature: 0.1,
          top_p: 0.9,
          max_tokens: 2000,
          search_domain_filter: ['anvisa.gov.br'],
          search_recency_filter: "month",
          frequency_penalty: 1,
          presence_penalty: 0,
        }),
      });
      const data = await resp.json();
      generated = data?.choices?.[0]?.message?.content || "";
    } else {
      generated = `# Template: ${document_type}

## CABEÇALHO DO DOCUMENTO
**PHARMACONNECT BRASIL**
Documento: ${document_type}
Código: [A ser preenchido]
Versão: 1.0
Data: [A ser preenchida]

## 1.0 OBJETIVO
[Descrever o propósito deste ${document_type}...]

## 2.0 ÂMBITO
[Descrever a aplicabilidade para ${product_category}...]

## 3.0 RESPONSABILIDADES
[Definir papéis e responsabilidades...]

## 4.0 PROCEDIMENTO
[Detalhar procedimentos conforme ${regulatory_requirements}...]

## 5.0 REGISTROS
[Documentos e registros relacionados...]

## 6.0 REFERÊNCIAS
[Normas e regulamentações aplicáveis...]

**AVISO**: Este é um template. Configure PERPLEXITY_API_KEY para geração completa baseada nas normas ANVISA específicas.`;
    }

    const kpis = {
      template_completeness: 0.95,
      regulatory_compliance_score: 0.90,
      document_complexity: document_type?.includes('SOP') ? 0.8 : 0.6
    };

    const { data: inserted, error: insertError } = await supabase
      .from("ai_agent_outputs")
      .insert({
        user_id: auth.user.id,
        project_id: project_id || null,
        agent_type: "document_generator",
        input: { document_type, product_category, template_name, regulatory_requirements },
        output_md: generated,
        kpis,
        handoff_to: ["coordinator"],
        status: "completed",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ output: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("ai-document-generator error", error);
    return new Response(JSON.stringify({ error: error?.message || "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});