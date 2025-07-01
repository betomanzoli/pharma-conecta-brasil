
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MatchingRequest {
  entityType: 'company' | 'laboratory' | 'consultant';
  entityId: string;
  requirements?: string[];
  serviceType?: string;
  location?: string;
  budget?: { min: number; max: number };
}

interface MatchingResult {
  matches: Array<{
    id: string;
    name: string;
    type: string;
    score: number;
    reasons: string[];
    location?: string;
    capabilities?: string[];
  }>;
  recommendations: string[];
}

const logStep = (step: string, data?: any) => {
  console.log(`[AI-MATCHING] ${step}`, data ? JSON.stringify(data) : '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Starting AI matching process');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { entityType, entityId, requirements, serviceType, location, budget }: MatchingRequest = await req.json();
    logStep('Received matching request', { entityType, entityId, serviceType });

    // Get entity details
    let entityData;
    switch (entityType) {
      case 'company':
        const { data: company } = await supabase.from('companies').select('*').eq('id', entityId).single();
        entityData = company;
        break;
      case 'laboratory':
        const { data: lab } = await supabase.from('laboratories').select('*').eq('id', entityId).single();
        entityData = lab;
        break;
      case 'consultant':
        const { data: consultant } = await supabase.from('consultants').select('*').eq('id', entityId).single();
        entityData = consultant;
        break;
    }

    if (!entityData) {
      throw new Error('Entity not found');
    }

    logStep('Found entity data', { name: entityData.name });

    // AI-powered matching logic
    const matches: MatchingResult['matches'] = [];
    
    if (entityType === 'company') {
      // Company looking for laboratories or consultants
      if (serviceType === 'laboratory_analysis') {
        const { data: laboratories } = await supabase
          .from('laboratories')
          .select('*')
          .neq('id', entityId);

        laboratories?.forEach(lab => {
          let score = 0;
          const reasons: string[] = [];

          // Location matching
          if (location && lab.location?.toLowerCase().includes(location.toLowerCase())) {
            score += 30;
            reasons.push('Localização compatível');
          }

          // Certification matching
          if (lab.certifications && entityData.expertise_area) {
            const commonCerts = lab.certifications.filter((cert: string) => 
              entityData.expertise_area.some((area: string) => 
                cert.toLowerCase().includes(area.toLowerCase())
              )
            );
            if (commonCerts.length > 0) {
              score += 40;
              reasons.push(`Certificações relevantes: ${commonCerts.join(', ')}`);
            }
          }

          // Capacity availability
          if (lab.available_capacity && lab.available_capacity > 0) {
            score += 20;
            reasons.push('Capacidade disponível');
          }

          // Equipment matching
          if (lab.equipment_list && requirements) {
            const matchingEquipment = lab.equipment_list.filter((equipment: string) =>
              requirements.some(req => equipment.toLowerCase().includes(req.toLowerCase()))
            );
            if (matchingEquipment.length > 0) {
              score += 30;
              reasons.push(`Equipamentos compatíveis: ${matchingEquipment.join(', ')}`);
            }
          }

          if (score > 20) {
            matches.push({
              id: lab.id,
              name: lab.name,
              type: 'laboratory',
              score,
              reasons,
              location: lab.location,
              capabilities: lab.certifications
            });
          }
        });
      }

      // Look for consultants
      const { data: consultants } = await supabase
        .from('consultants')
        .select('*')
        .neq('id', entityId);

      consultants?.forEach(consultant => {
        let score = 0;
        const reasons: string[] = [];

        // Expertise matching
        if (consultant.expertise && entityData.expertise_area) {
          const commonExpertise = consultant.expertise.filter((exp: string) =>
            entityData.expertise_area.some((area: string) =>
              exp.toLowerCase().includes(area.toLowerCase()) ||
              area.toLowerCase().includes(exp.toLowerCase())
            )
          );
          if (commonExpertise.length > 0) {
            score += 50;
            reasons.push(`Expertise compatível: ${commonExpertise.join(', ')}`);
          }
        }

        // Budget matching
        if (budget && consultant.hourly_rate) {
          const hourlyRate = parseFloat(consultant.hourly_rate.toString());
          if (hourlyRate >= budget.min && hourlyRate <= budget.max) {
            score += 30;
            reasons.push('Taxa dentro do orçamento');
          }
        }

        // Location matching
        if (location && consultant.location?.toLowerCase().includes(location.toLowerCase())) {
          score += 20;
          reasons.push('Localização compatível');
        }

        // Experience (projects completed)
        if (consultant.projects_completed && consultant.projects_completed > 5) {
          score += 20;
          reasons.push(`Experiência comprovada: ${consultant.projects_completed} projetos`);
        }

        if (score > 30) {
          matches.push({
            id: consultant.id,
            name: `Consultor ${consultant.id}`, // In real scenario, get from profiles
            type: 'consultant',
            score,
            reasons,
            location: consultant.location,
            capabilities: consultant.expertise
          });
        }
      });
    }

    // Sort matches by score
    matches.sort((a, b) => b.score - a.score);

    // Generate recommendations
    const recommendations: string[] = [];
    if (matches.length === 0) {
      recommendations.push('Considere ampliar os critérios de busca');
      recommendations.push('Verifique se há laboratórios em regiões próximas');
    } else {
      recommendations.push(`Encontrados ${matches.length} parceiros compatíveis`);
      if (matches[0].score > 80) {
        recommendations.push('Match de alta qualidade encontrado - recomendamos contato direto');
      }
    }

    const result: MatchingResult = {
      matches: matches.slice(0, 10), // Top 10 matches
      recommendations
    };

    logStep('Matching completed', { matchCount: result.matches.length });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    logStep('ERROR', { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
