
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TestRequest {
  integration: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { integration }: TestRequest = await req.json();
    
    console.log(`[TEST-INTEGRATION] Testing connection to: ${integration}`);

    // Simular teste de conexão com diferentes resultados baseados na integração
    const integrationTests = {
      // Reguladores Nacionais
      'anvisa': { success: true, latency: 1200, message: 'ANVISA API respondendo normalmente' },
      'inpi': { success: true, latency: 800, message: 'INPI: Consulta de patentes disponível' },
      'inmetro': { success: false, latency: 0, message: 'INMETRO: Serviço temporariamente indisponível' },
      'ibama': { success: true, latency: 1500, message: 'IBAMA: Licenças ambientais acessíveis' },
      
      // Reguladores Internacionais
      'fda': { success: true, latency: 2200, message: 'FDA API: Conexão internacional estável' },
      
      // Financiamento e Fomento
      'finep': { success: true, latency: 900, message: 'FINEP: Base de editais atualizada' },
      'bndes': { success: true, latency: 1100, message: 'BNDES: Linhas de crédito disponíveis' },
      'sebrae': { success: true, latency: 700, message: 'SEBRAE: Programas acessíveis' },
      
      // Associações Setoriais
      'sindusfarma': { success: true, latency: 600, message: 'SINDUSFARMA: Dados setoriais atualizados' },
      'abifina': { success: true, latency: 850, message: 'ABIFINA: Relatórios disponíveis' },
      'abiquifi': { success: false, latency: 0, message: 'ABIQUIFI: Manutenção programada' },
      'alanac': { success: true, latency: 950, message: 'ALANAC: Rede de laboratórios online' },
      
      // Entidades Industriais
      'cni': { success: true, latency: 1300, message: 'CNI: Indicadores industriais atualizados' },
      'fiesp': { success: true, latency: 1000, message: 'FIESP: Dados regionais disponíveis' },
      'abdi': { success: true, latency: 1100, message: 'ABDI: Relatórios de desenvolvimento' },
      
      // Pesquisa e Inovação
      'embrapii': { success: true, latency: 750, message: 'EMBRAPII: Projetos de inovação online' },
      'fiocruz': { success: true, latency: 1200, message: 'FIOCRUZ: Base de pesquisas disponível' },
      'bio_manguinhos': { success: true, latency: 800, message: 'Bio-Manguinhos: Dados de produção' },
      'butantan': { success: true, latency: 900, message: 'Butantan: Pesquisas em andamento' },
      
      // Governo e Ministérios
      'mdic': { success: true, latency: 1400, message: 'MDIC: Políticas comerciais atualizadas' },
      'mcti': { success: true, latency: 1300, message: 'MCTI: Programas de C&T&I disponíveis' },
      'capes': { success: true, latency: 1100, message: 'CAPES: Base de pesquisadores ativa' },
      'gov_relations': { success: true, latency: 1000, message: 'Gov Relations: Sistema operacional' },
      
      // Sistemas e Plataformas
      'sipid': { success: true, latency: 650, message: 'SIPID: Sistema de PI funcionando' },
      'innovation': { success: true, latency: 800, message: 'Innovation Platform: Conectando inovadores' },
      'grupo_farma_brasil': { success: true, latency: 700, message: 'Grupo Farma Brasil: Rede ativa' },
      'acessa': { success: false, latency: 0, message: 'ACESSA: Aguardando credenciais' },
      'nib': { success: false, latency: 0, message: 'NIB: Configuração pendente' },
      
      // Sistemas Financeiros
      'receita_federal': { success: true, latency: 1800, message: 'Receita Federal: Consultas CNPJ disponíveis' },
      'stripe': { success: false, latency: 0, message: 'Stripe: Chave API inválida' }
    };

    // Simular delay da conexão
    const testResult = integrationTests[integration] || { 
      success: false, 
      latency: 0, 
      message: 'Integração não configurada' 
    };

    await new Promise(resolve => setTimeout(resolve, Math.min(testResult.latency || 1000, 3000)));

    const result = {
      integration,
      success: testResult.success,
      latency: testResult.latency,
      message: testResult.message,
      timestamp: new Date().toISOString(),
      details: {
        endpoint_status: testResult.success ? 'online' : 'offline',
        data_freshness: testResult.success ? 'current' : 'stale',
        rate_limit_status: 'within_limits'
      }
    };

    console.log(`[TEST-INTEGRATION] ${integration}: ${testResult.success ? 'SUCCESS' : 'FAILED'} (${testResult.latency}ms)`);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('[TEST-INTEGRATION] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        integration: 'unknown',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
