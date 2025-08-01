
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
  // Security: Set search path
  const searchPath = "SET search_path = 'public', 'extensions';";
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Starting AI matching process with security controls');

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Security: Execute search path setting
    await supabase.rpc('exec_sql', { sql: searchPath });

    const body = await req.json();
    
    // Input validation
    if (!body.entityType || !body.entityId) {
      throw new Error('entityType and entityId are required');
    }

    const { entityType, entityId, requirements, serviceType, location, budget }: MatchingRequest = body;
    
    logStep('Received matching request', { entityType, entityId, serviceType });

    // Audit log
    await supabase.from('performance_metrics').insert({
      metric_name: 'ai_matching_request',
      metric_value: 1,
      metric_unit: 'request',
      tags: {
        entity_type: entityType,
        entity_id: entityId,
        timestamp: new Date().toISOString()
      }
    });

    // Get entity details with RLS protection
    let entityData;
    switch (entityType) {
      case 'company':
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', entityId)
          .single();
        if (companyError) throw new Error(`Company not found: ${companyError.message}`);
        entityData = company;
        break;
      case 'laboratory':
        const { data: lab, error: labError } = await supabase
          .from('laboratories')
          .select('*')
          .eq('id', entityId)
          .single();
        if (labError) throw new Error(`Laboratory not found: ${labError.message}`);
        entityData = lab;
        break;
      case 'consultant':
        const { data: consultant, error: consultantError } = await supabase
          .from('consultants')
          .select('*')
          .eq('id', entityId)
          .single();
        if (consultantError) throw new Error(`Consultant not found: ${consultantError.message}`);
        entityData = consultant;
        break;
      default:
        throw new Error('Invalid entity type');
    }

    if (!entityData) {
      throw new Error('Entity not found or access denied');
    }

    logStep('Found entity data', { name: entityData.name });

    // AI-powered matching logic with security
    const matches: MatchingResult['matches'] = [];
    
    if (entityType === 'company') {
      // Company looking for laboratories or consultants
      if (serviceType === 'laboratory_analysis') {
        const { data: laboratories, error } = await supabase
          .from('laboratories')
          .select('*')
          .neq('id', entityId);

        if (error) {
          logStep('Error fetching laboratories', error);
        } else {
          laboratories?.forEach(lab => {
            let score = 0;
            const reasons: string[] = [];

            // Location matching (sanitized)
            const labLocation = String(lab.location || '').toLowerCase();
            const searchLocation = String(location || '').toLowerCase();
            
            if (location && labLocation.includes(searchLocation)) {
              score += 30;
              reasons.push('Localização compatível');
            }

            // Certification matching
            if (lab.certifications && entityData.expertise_area) {
              const commonCerts = lab.certifications.filter((cert: string) => 
                entityData.expertise_area.some((area: string) => 
                  String(cert).toLowerCase().includes(String(area).toLowerCase())
                )
              );
              if (commonCerts.length > 0) {
                score += 40;
                reasons.push(`Certificações relevantes: ${commonCerts.slice(0, 3).join(', ')}`);
              }
            }

            // Capacity availability
            const capacity = Number(lab.available_capacity) || 0;
            if (capacity > 0) {
              score += 20;
              reasons.push('Capacidade disponível');
            }

            // Equipment matching (with validation)
            if (lab.equipment_list && requirements && Array.isArray(requirements)) {
              const matchingEquipment = lab.equipment_list.filter((equipment: string) =>
                requirements.some(req => 
                  String(equipment).toLowerCase().includes(String(req).toLowerCase())
                )
              );
              if (matchingEquipment.length > 0) {
                score += 30;
                reasons.push(`Equipamentos compatíveis: ${matchingEquipment.slice(0, 3).join(', ')}`);
              }
            }

            if (score > 20) {
              matches.push({
                id: lab.id,
                name: String(lab.name || 'Laboratório'),
                type: 'laboratory',
                score: Math.min(score, 100), // Cap at 100
                reasons,
                location: String(lab.location || ''),
                capabilities: lab.certifications || []
              });
            }
          });
        }
      }

      // Look for consultants with security
      const { data: consultants, error: consultantsError } = await supabase
        .from('consultants')
        .select('*')
        .neq('id', entityId);

      if (!consultantsError && consultants) {
        consultants.forEach(consultant => {
          let score = 0;
          const reasons: string[] = [];

          // Expertise matching with validation
          if (consultant.expertise && entityData.expertise_area) {
            const consultantExpertise = Array.isArray(consultant.expertise) ? consultant.expertise : [];
            const entityAreas = Array.isArray(entityData.expertise_area) ? entityData.expertise_area : [];
            
            const commonExpertise = consultantExpertise.filter((exp: string) =>
              entityAreas.some((area: string) =>
                String(exp).toLowerCase().includes(String(area).toLowerCase()) ||
                String(area).toLowerCase().includes(String(exp).toLowerCase())
              )
            );
            
            if (commonExpertise.length > 0) {
              score += 50;
              reasons.push(`Expertise compatível: ${commonExpertise.slice(0, 3).join(', ')}`);
            }
          }

          // Budget matching with validation
          if (budget && consultant.hourly_rate) {
            const hourlyRate = Number(consultant.hourly_rate) || 0;
            const minBudget = Number(budget.min) || 0;
            const maxBudget = Number(budget.max) || Infinity;
            
            if (hourlyRate >= minBudget && hourlyRate <= maxBudget) {
              score += 30;
              reasons.push('Taxa dentro do orçamento');
            }
          }

          // Location matching (sanitized)
          const consultantLocation = String(consultant.location || '').toLowerCase();
          const searchLocation = String(location || '').toLowerCase();
          
          if (location && consultantLocation.includes(searchLocation)) {
            score += 20;
            reasons.push('Localização compatível');
          }

          // Experience validation
          const projectsCompleted = Number(consultant.projects_completed) || 0;
          if (projectsCompleted > 5) {
            score += 20;
            reasons.push(`Experiência comprovada: ${projectsCompleted} projetos`);
          }

          if (score > 30) {
            matches.push({
              id: consultant.id,
              name: `Consultor ${String(consultant.id).slice(0, 8)}`,
              type: 'consultant',
              score: Math.min(score, 100),
              reasons,
              location: String(consultant.location || ''),
              capabilities: consultant.expertise || []
            });
          }
        });
      }
    }

    // Sort matches by score (security: limit results)
    matches.sort((a, b) => b.score - a.score);
    const limitedMatches = matches.slice(0, 10);

    // Generate recommendations
    const recommendations: string[] = [];
    if (limitedMatches.length === 0) {
      recommendations.push('Considere ampliar os critérios de busca');
      recommendations.push('Verifique se há parceiros em regiões próximas');
    } else {
      recommendations.push(`Encontrados ${limitedMatches.length} parceiros compatíveis`);
      if (limitedMatches[0] && limitedMatches[0].score > 80) {
        recommendations.push('Match de alta qualidade encontrado - recomendamos contato direto');
      }
    }

    const result: MatchingResult = {
      matches: limitedMatches,
      recommendations
    };

    // Log performance metric
    await supabase.from('performance_metrics').insert({
      metric_name: 'ai_matching_completed',
      metric_value: limitedMatches.length,
      metric_unit: 'matches',
      tags: {
        entity_type: entityType,
        processing_time: Date.now() - performance.now(),
        success: true
      }
    });

    logStep('Matching completed successfully', { matchCount: result.matches.length });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    logStep('ERROR', { message: errorMessage });
    
    // Log error metric
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') || '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
      );
      
      await supabase.from('performance_metrics').insert({
        metric_name: 'ai_matching_error',
        metric_value: 1,
        metric_unit: 'error',
        tags: {
          error: errorMessage,
          timestamp: new Date().toISOString()
        }
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(JSON.stringify({ 
      error: 'An error occurred during matching',
      matches: [],
      recommendations: ['Tente novamente em alguns momentos']
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
