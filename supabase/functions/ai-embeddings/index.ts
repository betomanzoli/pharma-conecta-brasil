import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AI-EMBEDDINGS] ${step}${detailsStr}`);
};

// Função para criar embeddings usando OpenAI
async function createEmbedding(text: string): Promise<number[]> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// Função para calcular similaridade de cosseno
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

// Função para criar perfil de texto para embeddings
function createProfileText(entity: any, type: string): string {
  switch (type) {
    case 'company':
      return `Empresa farmacêutica ${entity.name}. Localização: ${entity.city}, ${entity.state}. 
              Especialidades: ${entity.expertise_area?.join(', ') || 'N/A'}. 
              Descrição: ${entity.description || 'N/A'}. 
              Status de compliance: ${entity.compliance_status || 'N/A'}.`;
              
    case 'laboratory':
      return `Laboratório ${entity.name}. Localização: ${entity.location || 'N/A'}. 
              Certificações: ${entity.certifications?.join(', ') || 'N/A'}. 
              Equipamentos: ${entity.equipment_list?.join(', ') || 'N/A'}. 
              Descrição: ${entity.description || 'N/A'}. 
              Capacidade disponível: ${entity.available_capacity || 0}.`;
              
    case 'consultant':
      return `Consultor especializado em ${entity.expertise?.join(', ') || 'N/A'}. 
              Localização: ${entity.location || 'N/A'}. 
              Certificações: ${entity.certifications?.join(', ') || 'N/A'}. 
              Taxa por hora: ${entity.hourly_rate || 'N/A'}. 
              Projetos completados: ${entity.projects_completed || 0}. 
              Descrição: ${entity.description || 'N/A'}.`;
              
    default:
      return entity.description || entity.name || '';
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("AI Embeddings request received");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { action, userType, userId, preferences } = await req.json();

    if (action === 'generate_user_embedding') {
      // Gerar embedding para o perfil do usuário
      logStep("Generating user embedding", { userType, userId });
      
      let userEntity;
      let userText = '';
      
      // Buscar dados do usuário baseado no tipo
      if (userType === 'pharmaceutical_company') {
        const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('profile_id', userId)
          .single();
          
        if (company) {
          userEntity = company;
          userText = createProfileText(company, 'company');
          
          // Adicionar preferências se fornecidas
          if (preferences) {
            userText += ` Preferências de busca: ${JSON.stringify(preferences)}`;
          }
        }
      } else if (userType === 'laboratory') {
        const { data: lab } = await supabase
          .from('laboratories')
          .select('*')
          .eq('profile_id', userId)
          .single();
          
        if (lab) {
          userEntity = lab;
          userText = createProfileText(lab, 'laboratory');
        }
      } else if (userType === 'consultant') {
        const { data: consultant } = await supabase
          .from('consultants')
          .select('*')
          .eq('profile_id', userId)
          .single();
          
        if (consultant) {
          userEntity = consultant;
          userText = createProfileText(consultant, 'consultant');
        }
      }

      if (!userEntity || !userText) {
        throw new Error('User entity not found or invalid');
      }

      const userEmbedding = await createEmbedding(userText);
      
      logStep("User embedding generated", { 
        textLength: userText.length, 
        embeddingLength: userEmbedding.length 
      });

      return new Response(JSON.stringify({
        success: true,
        embedding: userEmbedding,
        profileText: userText,
        metadata: {
          userType,
          userId,
          timestamp: new Date().toISOString()
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
      
    } else if (action === 'calculate_similarities') {
      // Calcular similaridades entre embedding do usuário e candidatos
      const { userEmbedding, candidates } = await req.json();
      
      logStep("Calculating similarities", { candidatesCount: candidates.length });
      
      const similarities = [];
      
      for (const candidate of candidates) {
        const candidateText = createProfileText(candidate, candidate.type);
        const candidateEmbedding = await createEmbedding(candidateText);
        const similarity = cosineSimilarity(userEmbedding, candidateEmbedding);
        
        similarities.push({
          ...candidate,
          similarity_score: similarity,
          compatibility_score: Math.round(similarity * 100) / 100,
          profile_text: candidateText
        });
      }
      
      // Ordenar por similaridade
      similarities.sort((a, b) => b.similarity_score - a.similarity_score);
      
      logStep("Similarities calculated", { 
        count: similarities.length,
        avgSimilarity: similarities.reduce((sum, s) => sum + s.similarity_score, 0) / similarities.length
      });

      return new Response(JSON.stringify({
        success: true,
        similarities,
        metadata: {
          calculatedAt: new Date().toISOString(),
          count: similarities.length
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error('Invalid action. Use "generate_user_embedding" or "calculate_similarities"');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in AI embeddings", { message: errorMessage });
    
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