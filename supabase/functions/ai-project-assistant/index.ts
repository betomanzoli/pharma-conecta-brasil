
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
    logStep('AI Project Assistant - Starting request');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { action, projectData, eap, risks, schedule } = await req.json();
    logStep('Project Assistant action', { action });

    let results = {};

    switch (action) {
      case 'generate_eap':
        results = await generateEAP(perplexityKey, projectData);
        break;
      case 'analyze_risks':
        results = await analyzeRisks(perplexityKey, projectData, eap);
        break;
      case 'generate_schedule':
        results = await generateSchedule(perplexityKey, projectData, eap, risks);
        break;
      case 'create_intelligent_project':
        results = await createIntelligentProject(supabase, projectData, eap, risks, schedule);
        break;
      default:
        throw new Error('Invalid action');
    }

    logStep('Project Assistant completed', { action, success: true });

    return new Response(JSON.stringify({
      success: true,
      action,
      ...results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('Error in AI Project Assistant', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateEAP(perplexityKey: string, projectData: any) {
  logStep('Generating EAP with AI');
  
  const prompt = `Como especialista em gestão de projetos farmacêuticos, crie uma Estrutura Analítica de Projeto (EAP) detalhada para:

Projeto: ${projectData.title}
Descrição: ${projectData.description}
Tipo: ${projectData.project_type}
Orçamento: ${projectData.budget_range}
Prazo: ${projectData.expected_timeline}

Forneça uma EAP em formato JSON com:
1. Fases principais (mínimo 3, máximo 6)
2. Entregáveis principais para cada fase
3. Marcos críticos
4. Atividades detalhadas
5. Estimativas de duração
6. Interdependências

Formato esperado:
{
  "phases": [
    {
      "name": "Nome da Fase",
      "duration_days": 30,
      "deliverables": ["Entregável 1", "Entregável 2"],
      "milestones": ["Marco 1"],
      "activities": [
        {
          "name": "Atividade",
          "duration": 5,
          "dependencies": []
        }
      ]
    }
  ],
  "critical_path": ["Atividade crítica 1", "Atividade crítica 2"]
}`;

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
          content: 'Você é um especialista em gestão de projetos farmacêuticos com 20 anos de experiência. Retorne apenas JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    }),
  });

  const data = await response.json();
  const eapText = data.choices[0].message.content;
  
  try {
    const eapJson = JSON.parse(eapText.replace(/```json|```/g, '').trim());
    return { eap: eapJson };
  } catch (parseError) {
    logStep('Error parsing EAP JSON, using fallback');
    return {
      eap: {
        phases: [
          {
            name: "Iniciação e Planejamento",
            duration_days: 30,
            deliverables: ["Termo de Abertura", "Plano do Projeto"],
            milestones: ["Aprovação do Projeto"],
            activities: [
              { name: "Definição de escopo", duration: 5, dependencies: [] },
              { name: "Identificação de stakeholders", duration: 3, dependencies: ["Definição de escopo"] }
            ]
          },
          {
            name: "Execução",
            duration_days: 120,
            deliverables: ["Produto/Serviço Principal"],
            milestones: ["Primeiro Protótipo", "Validação"],
            activities: [
              { name: "Desenvolvimento", duration: 90, dependencies: ["Aprovação do Projeto"] },
              { name: "Testes", duration: 20, dependencies: ["Desenvolvimento"] }
            ]
          },
          {
            name: "Encerramento",
            duration_days: 15,
            deliverables: ["Relatório Final", "Lições Aprendidas"],
            milestones: ["Entrega Final"],
            activities: [
              { name: "Documentação", duration: 10, dependencies: ["Testes"] },
              { name: "Encerramento formal", duration: 3, dependencies: ["Documentação"] }
            ]
          }
        ],
        critical_path: ["Definição de escopo", "Desenvolvimento", "Testes", "Documentação"]
      }
    };
  }
}

async function analyzeRisks(perplexityKey: string, projectData: any, eap: any) {
  logStep('Analyzing risks with AI');
  
  const prompt = `Como especialista em análise de riscos de projetos farmacêuticos, analise os seguintes riscos para:

Projeto: ${projectData.title}
Tipo: ${projectData.project_type}
EAP: ${JSON.stringify(eap, null, 2)}

Identifique e analise riscos em categorias:
1. Técnicos/Científicos
2. Regulatórios
3. Financeiros
4. Cronograma
5. Recursos Humanos
6. Fornecedores/Parceiros
7. Mercado/Competitivos

Para cada risco, forneça:
- Probabilidade (0.0 a 1.0)
- Impacto (0.0 a 1.0)
- Categoria
- Descrição
- Estratégia de mitigação
- Indicadores de alerta precoce

Formato JSON:
{
  "risks": [
    {
      "category": "Técnico",
      "name": "Nome do Risco",
      "description": "Descrição detalhada",
      "probability": 0.3,
      "impact": 0.8,
      "severity": "Alta",
      "mitigation_strategy": "Estratégia de mitigação",
      "early_warning_signs": ["Sinal 1", "Sinal 2"]
    }
  ],
  "risk_matrix_summary": {
    "high_priority_risks": 3,
    "medium_priority_risks": 5,
    "low_priority_risks": 2
  }
}`;

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
          content: 'Você é um especialista em análise de riscos farmacêuticos. Retorne apenas JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 2000
    }),
  });

  const data = await response.json();
  const risksText = data.choices[0].message.content;
  
  try {
    const risksJson = JSON.parse(risksText.replace(/```json|```/g, '').trim());
    return { risks: risksJson };
  } catch (parseError) {
    logStep('Error parsing risks JSON, using fallback');
    return {
      risks: {
        risks: [
          {
            category: "Técnico",
            name: "Complexidade Técnica",
            description: "Desafios técnicos podem impactar o desenvolvimento",
            probability: 0.4,
            impact: 0.7,
            severity: "Alta",
            mitigation_strategy: "Revisões técnicas frequentes e consultoria especializada",
            early_warning_signs: ["Atrasos em marcos técnicos", "Dificuldades não previstas"]
          },
          {
            category: "Regulatório",
            name: "Mudanças Regulatórias",
            description: "Alterações nas regulamentações podem afetar o projeto",
            probability: 0.3,
            impact: 0.8,
            severity: "Alta",
            mitigation_strategy: "Monitoramento contínuo de mudanças regulatórias",
            early_warning_signs: ["Consultas públicas", "Novas diretrizes"]
          }
        ],
        risk_matrix_summary: {
          high_priority_risks: 2,
          medium_priority_risks: 3,
          low_priority_risks: 1
        }
      }
    };
  }
}

async function generateSchedule(perplexityKey: string, projectData: any, eap: any, risks: any) {
  logStep('Generating intelligent schedule');
  
  const prompt = `Como especialista em cronogramas de projetos farmacêuticos, otimize o cronograma considerando:

Projeto: ${projectData.title}
EAP: ${JSON.stringify(eap, null, 2)}
Riscos: ${JSON.stringify(risks, null, 2)}

Crie um cronograma otimizado com:
1. Sequenciamento inteligente de atividades
2. Buffers de tempo para riscos identificados
3. Paralelização onde possível
4. Marcos de controle
5. Pontos de decisão Go/No-Go
6. Recursos necessários por fase

Formato JSON:
{
  "schedule": {
    "total_duration_days": 180,
    "phases": [
      {
        "name": "Fase 1",
        "start_day": 1,
        "end_day": 30,
        "activities": [
          {
            "name": "Atividade 1",
            "start_day": 1,
            "duration": 5,
            "resources_required": ["Recurso 1"],
            "predecessors": [],
            "buffer_days": 2
          }
        ],
        "milestones": [
          {
            "name": "Marco 1",
            "day": 30,
            "criteria": "Critérios de sucesso"
          }
        ]
      }
    ],
    "critical_path": ["Atividade crítica 1"],
    "resource_optimization": {
      "peak_resource_usage": "Semana 8-12",
      "recommendations": ["Recomendação 1"]
    }
  }
}`;

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
          content: 'Você é um especialista em cronogramas farmacêuticos. Retorne apenas JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    }),
  });

  const data = await response.json();
  const scheduleText = data.choices[0].message.content;
  
  try {
    const scheduleJson = JSON.parse(scheduleText.replace(/```json|```/g, '').trim());
    return { schedule: scheduleJson };
  } catch (parseError) {
    logStep('Error parsing schedule JSON, using fallback');
    return {
      schedule: {
        total_duration_days: 165,
        phases: [
          {
            name: "Iniciação",
            start_day: 1,
            end_day: 30,
            activities: [
              {
                name: "Definição de escopo",
                start_day: 1,
                duration: 5,
                resources_required: ["Gerente de Projeto"],
                predecessors: [],
                buffer_days: 2
              }
            ],
            milestones: [
              {
                name: "Aprovação do Projeto",
                day: 30,
                criteria: "Termo de abertura assinado"
              }
            ]
          }
        ],
        critical_path: ["Definição de escopo", "Desenvolvimento"],
        resource_optimization: {
          peak_resource_usage: "Semana 6-10",
          recommendations: ["Considerar recursos adicionais na fase de desenvolvimento"]
        }
      }
    };
  }
}

async function createIntelligentProject(supabase: any, projectData: any, eap: any, risks: any, schedule: any) {
  logStep('Creating intelligent project in database');
  
  try {
    // Create the main project record
    const { data: project, error: projectError } = await supabase
      .from('project_requests')
      .insert({
        title: projectData.title,
        description: projectData.description,
        service_type: projectData.project_type || 'intelligent_project',
        budget_min: parseFloat(projectData.budget_range.split('-')[0].replace(/[^0-9]/g, '')) || 0,
        budget_max: parseFloat(projectData.budget_range.split('-')[1]?.replace(/[^0-9]/g, '') || '0') || 0,
        status: 'planning',
        ai_generated: true,
        metadata: {
          eap: eap,
          risks: risks,
          schedule: schedule,
          created_with_ai: true,
          ai_version: '1.0'
        }
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Log the creation for metrics
    await supabase
      .from('performance_metrics')
      .insert({
        metric_name: 'intelligent_project_created',
        metric_value: 1,
        metric_unit: 'project',
        tags: {
          project_id: project.id,
          project_type: projectData.project_type,
          ai_assisted: true,
          phases_count: eap.phases?.length || 0,
          risks_count: risks.risks?.length || 0
        }
      });

    return { 
      project: project,
      success: true,
      message: 'Projeto inteligente criado com sucesso!'
    };
  } catch (error) {
    logStep('Error creating intelligent project', error);
    throw error;
  }
}
