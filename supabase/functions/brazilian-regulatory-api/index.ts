import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[BRAZILIAN-REGULATORY-API] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Brazilian Regulatory API request received");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, query, cnpj, registrationNumber } = await req.json();

    if (action === 'anvisa_alerts') {
      // Buscar alertas regulatórios brasileiros usando Perplexity
      logStep("Fetching ANVISA alerts", { query });
      
      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em regulamentação farmacêutica brasileira. Forneça informações precisas e atualizadas sobre alertas da ANVISA.'
            },
            {
              role: 'user',
              content: `Busque os alertas mais recentes da ANVISA relacionados a: ${query || 'medicamentos e produtos farmacêuticos'}. Forneça título, descrição, data de publicação, tipo de alerta e gravidade para cada item encontrado.`
            }
          ],
          temperature: 0.1,
          max_tokens: 2000,
          search_domain_filter: ['gov.br', 'anvisa.gov.br'],
          search_recency_filter: 'month'
        }),
      });

      if (!perplexityResponse.ok) {
        throw new Error(`Perplexity API error: ${await perplexityResponse.text()}`);
      }

      const perplexityData = await perplexityResponse.json();
      const content = perplexityData.choices[0].message.content;

      // Processar e estruturar os alertas
      const alerts = parseAlertsFromContent(content);
      
      // Salvar no banco de dados
      if (alerts.length > 0) {
        const { error } = await supabase
          .from('regulatory_alerts')
          .upsert(alerts, { onConflict: 'title,published_at' });
        
        if (error) {
          logStep("Error saving alerts", { error: error.message });
        } else {
          logStep("Alerts saved successfully", { count: alerts.length });
        }
      }

      return new Response(JSON.stringify({
        success: true,
        alerts,
        count: alerts.length,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === 'company_compliance') {
      // Verificar compliance de empresa por CNPJ
      logStep("Checking company compliance", { cnpj });
      
      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em compliance farmacêutico brasileiro. Analise o status de conformidade de empresas farmacêuticas.'
            },
            {
              role: 'user',
              content: `Verifique o status de compliance da empresa com CNPJ ${cnpj} junto à ANVISA. Inclua informações sobre licenças, certificações, eventuais penalidades e status regulatório atual.`
            }
          ],
          temperature: 0.1,
          max_tokens: 1500,
          search_domain_filter: ['gov.br', 'anvisa.gov.br'],
          search_recency_filter: 'year'
        }),
      });

      if (!perplexityResponse.ok) {
        throw new Error(`Perplexity API error: ${await perplexityResponse.text()}`);
      }

      const perplexityData = await perplexityResponse.json();
      const content = perplexityData.choices[0].message.content;
      
      const complianceData = parseComplianceFromContent(content, cnpj);
      
      // Salvar dados de compliance
      const { error } = await supabase
        .from('compliance_tracking')
        .upsert(complianceData, { onConflict: 'company_id,compliance_type' });
      
      if (error) {
        logStep("Error saving compliance data", { error: error.message });
      }

      return new Response(JSON.stringify({
        success: true,
        compliance: complianceData,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (action === 'product_registration') {
      // Verificar registro de produto
      logStep("Checking product registration", { registrationNumber });
      
      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em registros de medicamentos da ANVISA. Forneça informações precisas sobre produtos farmacêuticos registrados.'
            },
            {
              role: 'user',
              content: `Verifique o status do registro ANVISA número ${registrationNumber}. Inclua informações sobre o produto, titular do registro, validade, status atual e eventuais restrições.`
            }
          ],
          temperature: 0.1,
          max_tokens: 1500,
          search_domain_filter: ['gov.br', 'anvisa.gov.br']
        }),
      });

      if (!perplexityResponse.ok) {
        throw new Error(`Perplexity API error: ${await perplexityResponse.text()}`);
      }

      const perplexityData = await perplexityResponse.json();
      const content = perplexityData.choices[0].message.content;
      
      const productData = parseProductFromContent(content, registrationNumber);

      return new Response(JSON.stringify({
        success: true,
        product: productData,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error('Invalid action. Use "anvisa_alerts", "company_compliance", or "product_registration"');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in Brazilian Regulatory API", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function parseAlertsFromContent(content: string): any[] {
  const alerts = [];
  
  // Extrair informações estruturadas do conteúdo
  const lines = content.split('\n');
  let currentAlert = null;
  
  for (const line of lines) {
    if (line.includes('Alerta') || line.includes('ANVISA') && line.includes(':')) {
      if (currentAlert) {
        alerts.push(currentAlert);
      }
      currentAlert = {
        id: crypto.randomUUID(),
        title: line.trim(),
        source: 'ANVISA',
        alert_type: 'regulatory',
        severity: determineSeverity(line),
        published_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 dias
        description: '',
        url: null
      };
    } else if (currentAlert && line.trim()) {
      currentAlert.description += line.trim() + ' ';
    }
  }
  
  if (currentAlert) {
    alerts.push(currentAlert);
  }
  
  return alerts.slice(0, 10); // Limitar a 10 alertas
}

function parseComplianceFromContent(content: string, cnpj: string): any {
  return {
    id: crypto.randomUUID(),
    company_id: null, // Será preenchido se a empresa existir no sistema
    compliance_type: 'anvisa_general',
    status: content.toLowerCase().includes('regular') || content.toLowerCase().includes('válid') ? 'compliant' : 'pending',
    score: content.toLowerCase().includes('regular') ? 0.85 : 0.45,
    last_check: new Date().toISOString(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
    details: {
      cnpj,
      analysis: content.substring(0, 500),
      checked_via: 'perplexity_search',
      regulatory_items: extractRegulatoryItems(content)
    }
  };
}

function parseProductFromContent(content: string, registrationNumber: string): any {
  return {
    registration_number: registrationNumber,
    status: content.toLowerCase().includes('válid') || content.toLowerCase().includes('ativo') ? 'active' : 'unknown',
    product_name: extractProductName(content),
    holder: extractHolder(content),
    analysis: content.substring(0, 500),
    checked_at: new Date().toISOString()
  };
}

function determineSeverity(text: string): string {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('crítico') || lowerText.includes('emergência') || lowerText.includes('recolhimento')) {
    return 'high';
  } else if (lowerText.includes('atenção') || lowerText.includes('cuidado')) {
    return 'medium';
  }
  return 'low';
}

function extractRegulatoryItems(content: string): string[] {
  const items = [];
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('bpf') || lowerContent.includes('boas práticas')) {
    items.push('Boas Práticas de Fabricação');
  }
  if (lowerContent.includes('licença') || lowerContent.includes('autorização')) {
    items.push('Licença de Funcionamento');
  }
  if (lowerContent.includes('certificado')) {
    items.push('Certificações');
  }
  
  return items;
}

function extractProductName(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.toLowerCase().includes('produto') || line.toLowerCase().includes('medicamento')) {
      return line.trim().substring(0, 100);
    }
  }
  return 'Produto não identificado';
}

function extractHolder(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.toLowerCase().includes('titular') || line.toLowerCase().includes('empresa')) {
      return line.trim().substring(0, 100);
    }
  }
  return 'Titular não identificado';
}