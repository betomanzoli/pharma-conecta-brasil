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

  // Releitura por requisição para garantir uso do segredo atualizado
  const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");

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
    const { 
      product_type, 
      route_administration, 
      dosage_form, 
      target_regions, 
      active_ingredient,
      indication,
      project_id 
    } = body;

    const productInfo = {
      type: product_type,
      route: route_administration,
      dosage: dosage_form,
      regions: target_regions || ['Brazil'],
      ingredient: active_ingredient,
      indication: indication
    };

const regulatoryPrompt = `AGENTE ESPECIALISTA REGULATÓRIO ANVISA RESPONSÁVEL v1.0

═══════════════════════════════════════════════════
SEÇÃO 1: IDENTIDADE E ESPECIALIZAÇÃO  
═══════════════════════════════════════════════════

ROLE: Especialista Sênior em Assuntos Regulatórios com foco exclusivo na legislação farmacêutica brasileira (ANVISA).
ESPECIALIZAÇÃO: Análise de compliance, interpretação de RDCs e INs, e desenho de pathways regulatórios.
NÍVEL DE EXPERTISE: Especialista

PRINCÍPIOS ORIENTADORES:
- Transparência: Conclusões rastreáveis a normas específicas. Incerteza deve ser declarada.
- Accountability: Responsável pela precisão das informações regulatórias.
- Segurança: Segurança do paciente é critério primário na avaliação de riscos.
- Supervisão Humana: Interpretações complexas devem ser validadas por consultor humano.

PROTOCOLO DE ANÁLISE:
1. CONTEXTUALIZAÇÃO DO PRODUTO: ${product_type} - ${route_administration} - ${dosage_form}
2. COLETA E VERIFICAÇÃO: Fontes primárias (DOU, ANVISA), score mínimo 9/10
3. PROCESSAMENTO MULTI-DIMENSIONAL: Técnica, compliance, risco
4. VALIDAÇÃO CRUZADA: Verificar normas conflitantes e gaps

CHECKPOINTS OBRIGATÓRIOS:
✓ TÉCNICO: Normas verificadas, prazos ANVISA considerados, referências corretas
✓ ÉTICO: Riscos de segurança priorizados, fast-track legítimo
✓ GOVERNANÇA: Baseado em legislação, trilha de auditoria clara  
✓ COMPLETUDE: Todos aspectos abordados, próximos passos claros

FORMATO DE SAÍDA:

[RESUMO EXECUTIVO REGULATÓRIO]
- Conclusão Principal: [Enquadramento e pathway]
- Nível de Confiança: [X]%
- Principal Risco Regulatório: [Descrição do maior risco]

[ANÁLISE REGULATÓRIA DETALHADA]
- Legislação Aplicável: [RDCs, INs aplicáveis]
- Pathway Regulatório Completo: [Etapas, prazos, custos]
- Documentação Técnica Essencial: [Documentos para dossiê]

[ANÁLISE DE RISCOS DE COMPLIANCE]
- Riscos e Probabilidade: [Lista com classificação]
- Impacto Potencial: [Descrição dos impactos]
- Ações de Mitigação: [Recomendações]

[METADADOS DE VALIDAÇÃO]
- Timestamp: [Data/Hora]
- Versão: v1.0
- Scores de Confiabilidade: [DOU: 10/10, ANVISA: 10/10]
- Status Checkpoints: [TODOS ✓]

PRODUTO ANALISADO:
- Tipo: ${product_type}
- Via: ${route_administration}  
- Forma: ${dosage_form}
- Ativo: ${active_ingredient}
- Indicação: ${indication}
- Regiões: ${target_regions?.join(', ') || 'Brasil'}`

ANÁLISE SOLICITADA:

1. CLASSIFICAÇÃO REGULATÓRIA
   - Categoria do produto (medicamento, fitoterápico, etc.)
   - Classificação de risco
   - Requisitos específicos por região

2. CAMINHOS REGULATÓRIOS
   
   A) ANVISA (Brasil):
   - Tipo de registro necessário
   - Documentação exigida
   - Prazos estimados
   - Taxas aplicáveis
   - Estudos clínicos necessários
   
   B) FDA (EUA) - se aplicável:
   - Via regulatória recomendada (NDA, ANDA, 505(b)(2))
   - Requisitos pré-clínicos e clínicos
   - Cronograma esperado
   
   C) EMA (Europa) - se aplicável:
   - Procedimento recomendado (Centralizado, Descentralizado, etc.)
   - Requisitos específicos
   - Timeline estimado

3. ESTUDOS E DOCUMENTAÇÃO
   - Estudos pré-clínicos necessários
   - Estudos clínicos requeridos (fases)
   - Documentação técnica (CTD/eCTD)
   - Estudos de bioequivalência/biodisponibilidade

4. CRONOGRAMA E CUSTOS
   - Timeline estimado para registro
   - Custos aproximados por etapa
   - Marcos críticos do projeto

5. RISCOS E MITIGAÇÕES
   - Principais riscos regulatórios
   - Estratégias de mitigação
   - Pontos de atenção específicos

6. RECOMENDAÇÕES ESTRATÉGICAS
   - Sequência recomendada de registros
   - Oportunidades de otimização
   - Próximos passos sugeridos

Baseie a análise nas regulamentações atuais e forneça informações práticas e acionáveis.`;

    let regulatoryAnalysis = "";

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
              content: `Você é um especialista em assuntos regulatórios farmacêuticos com amplo conhecimento em:
              - Regulamentações ANVISA (Brasil)
              - FDA Guidelines (Estados Unidos)  
              - EMA Regulations (Europa)
              - ICH Guidelines
              - Desenvolvimento farmacêutico
              - Registro de medicamentos
              - Estudos clínicos e pré-clínicos
              
              Forneça análises técnicas precisas e atualizadas baseadas nas regulamentações vigentes.`
            },
            { role: "user", content: prompt }
          ],
          max_tokens: 2500,
          temperature: 0.5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        regulatoryAnalysis = data.choices[0]?.message?.content || "Erro ao gerar análise";
      } else {
        throw new Error("Erro na API Perplexity");
      }
    } else {
      regulatoryAnalysis = `# Análise Técnica e Regulatória

## Produto Analisado
- **Tipo**: ${product_type}
- **Via**: ${route_administration}
- **Forma farmacêutica**: ${dosage_form}
- **Princípio ativo**: ${active_ingredient}
- **Indicação**: ${indication}
- **Regiões**: ${target_regions?.join(', ') || 'Brasil'}

## 1. CLASSIFICAÇÃO REGULATÓRIA

### ANVISA (Brasil)
- Classificação como medicamento de acordo com RDC 200/2017
- Categoria de risco a ser determinada com base no princípio ativo
- Possível enquadramento em lista de medicamentos específicos

## 2. CAMINHOS REGULATÓRIOS

### Registro ANVISA
- **Processo**: Registro de medicamento novo ou similar
- **Documentação**: Dossiê técnico completo conforme RDC 200/2017
- **Prazo estimado**: 365 dias úteis (pode variar)
- **Estudos clínicos**: Necessários conforme categoria do produto

### Considerações FDA/EMA
- Análise de viabilidade para mercados internacionais
- Requisitos específicos de cada agência
- Harmonização com diretrizes ICH

## 3. PRÓXIMOS PASSOS RECOMENDADOS

1. **Consulta pré-submissão** com ANVISA
2. **Desenvolvimento do dossiê técnico** 
3. **Planejamento de estudos clínicos**
4. **Estratégia de propriedade intelectual**

## Observação Importante
Esta análise preliminar é baseada nas informações fornecidas. Para uma análise mais detalhada e atualizada com as regulamentações mais recentes, recomenda-se:

- Consulta direta às agências regulatórias
- Revisão das normativas mais recentes
- Consulta com especialistas regulatórios
- Configuração de APIs de dados regulatórios em tempo real

**Recomendação**: Configure a integração com APIs especializadas para obter análises mais precisas e atualizadas.`;
    }

    // Salvar resultado no banco
    const { data: agentOutput, error: insertError } = await supabase
      .from("ai_agent_outputs")
      .insert({
        user_id: auth.user.id,
        project_id: project_id || null,
        agent_type: "technical_regulatory",
        input: body,
        output_md: regulatoryAnalysis,
        kpis: {
          product_type: product_type,
          regions_analyzed: target_regions?.length || 1,
          output_length: regulatoryAnalysis.length,
          has_active_ingredient: !!active_ingredient
        },
        handoff_to: ["business_strategist"], // Pode seguir para análise de negócio
        status: "completed"
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erro ao salvar output:", insertError);
    }

    return new Response(JSON.stringify({
      output: agentOutput,
      analysis: regulatoryAnalysis,
      recommendations: {
        next_steps: [
          "Consulta pré-submissão com ANVISA",
          "Desenvolvimento do dossiê técnico", 
          "Planejamento de estudos clínicos"
        ],
        timeline_estimate: "12-18 meses para registro ANVISA",
        critical_success_factors: [
          "Qualidade dos dados pré-clínicos",
          "Estratégia de estudos clínicos",
          "Conformidade regulatória"
        ]
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("ai-technical-regulatory error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "internal_error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
