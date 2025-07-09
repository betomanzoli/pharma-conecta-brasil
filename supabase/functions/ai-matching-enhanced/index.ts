import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AI-MATCHING-ENHANCED] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("AI Enhanced Matching request received");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userType, userId, preferences } = await req.json();

    if (!userType || !userId) {
      throw new Error("UserType and userId are required");
    }

    logStep("Processing enhanced matching", { userType, userId, preferences });

    // Get user profile for real matching
    let userProfile;
    if (userType === 'pharmaceutical_company') {
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('profile_id', userId)
        .single();
      userProfile = company;
    } else if (userType === 'laboratory') {
      const { data: lab } = await supabase
        .from('laboratories')
        .select('*')
        .eq('profile_id', userId)
        .single();
      userProfile = lab;
    } else if (userType === 'consultant') {
      const { data: consultant } = await supabase
        .from('consultants')
        .select('*')
        .eq('profile_id', userId)
        .single();
      userProfile = consultant;
    }

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    let matches = [];

    // Enhanced matching logic based on user type
    switch (userType) {
      case 'pharmaceutical_company':
        // Match with laboratories, suppliers, and consultants
        const { data: labData } = await supabase
          .from('laboratories')
          .select(`
            *,
            profiles!inner(*)
          `)
          .limit(10);

        const { data: consultantData } = await supabase
          .from('consultants')
          .select(`
            *,
            profiles!inner(*)
          `)
          .limit(10);

        // Calculate real compatibility scores for laboratories
        const labMatches = [];
        if (labData) {
          for (const lab of labData) {
            const compatibility = await calculateRealCompatibilityScore(
              userType, 'laboratory', preferences, userProfile, lab, supabase
            );
            
            labMatches.push({
              id: lab.id,
              type: 'laboratory',
              name: lab.name || `${lab.profiles.first_name} ${lab.profiles.last_name}`,
              score: compatibility.score,
              specialties: lab.certifications || [],
              location: lab.location,
              verified: lab.anvisa_certified || false,
              profile: lab.profiles,
              compatibility_factors: compatibility.factors
            });
          }
        }

        // Calculate real compatibility scores for consultants
        const consultantMatches = [];
        if (consultantData) {
          for (const consultant of consultantData) {
            const compatibility = await calculateRealCompatibilityScore(
              userType, 'consultant', preferences, userProfile, consultant, supabase
            );
            
            consultantMatches.push({
              id: consultant.id,
              type: 'consultant',
              name: `${consultant.profiles.first_name} ${consultant.profiles.last_name}`,
              score: compatibility.score,
              specialties: consultant.expertise || [],
              location: consultant.location,
              hourlyRate: consultant.hourly_rate,
              profile: consultant.profiles,
              compatibility_factors: compatibility.factors
            });
          }
        }

        matches = [...labMatches, ...consultantMatches];
        break;

      case 'laboratory':
        // Match with pharmaceutical companies and equipment suppliers
        const { data: companyData } = await supabase
          .from('companies')
          .select(`
            *,
            profiles!inner(*)
          `)
          .limit(10);

        // Calculate real compatibility scores for companies
        if (companyData) {
          for (const company of companyData) {
            const compatibility = await calculateRealCompatibilityScore(
              userType, 'company', preferences, userProfile, company, supabase
            );
            
            matches.push({
              id: company.id,
              type: 'company',
              name: company.name,
              score: compatibility.score,
              specialties: company.expertise_area || [],
              location: `${company.city}, ${company.state}`,
              verified: company.compliance_status === 'compliant',
              profile: company.profiles,
              compatibility_factors: compatibility.factors
            });
          }
        }
        break;

      case 'consultant':
        // Match with companies and laboratories needing consulting
        const { data: allCompanies } = await supabase
          .from('companies')
          .select(`
            *,
            profiles!inner(*)
          `)
          .limit(10);

        const { data: allLabs } = await supabase
          .from('laboratories')
          .select(`
            *,
            profiles!inner(*)
          `)
          .limit(10);

        // Calculate real compatibility scores for companies
        const companyMatches = [];
        if (allCompanies) {
          for (const company of allCompanies) {
            const compatibility = await calculateRealCompatibilityScore(
              userType, 'company', preferences, userProfile, company, supabase
            );
            
            companyMatches.push({
              id: company.id,
              type: 'company',
              name: company.name,
              score: compatibility.score,
              specialties: company.expertise_area || [],
              location: `${company.city}, ${company.state}`,
              verified: company.compliance_status === 'compliant',
              profile: company.profiles,
              compatibility_factors: compatibility.factors
            });
          }
        }

        // Calculate real compatibility scores for laboratories
        const labMatches = [];
        if (allLabs) {
          for (const lab of allLabs) {
            const compatibility = await calculateRealCompatibilityScore(
              userType, 'laboratory', preferences, userProfile, lab, supabase
            );
            
            labMatches.push({
              id: lab.id,
              type: 'laboratory',
              name: lab.name || `${lab.profiles.first_name} ${lab.profiles.last_name}`,
              score: compatibility.score,
              specialties: lab.certifications || [],
              location: lab.location,
              verified: lab.anvisa_certified || false,
              profile: lab.profiles,
              compatibility_factors: compatibility.factors
            });
          }
        }

        matches = [...companyMatches, ...labMatches];
        break;

      default:
        throw new Error("Invalid user type");
    }

    // Sort by compatibility score and filter out low scores
    matches = matches
      .filter(match => match.score > 0.3) // Only show matches with > 30% compatibility
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    // Log matching stats
    await supabase.from('performance_metrics').insert({
      metric_name: 'ai_matching_request',
      metric_value: matches.length,
      metric_unit: 'matches',
      tags: {
        user_type: userType,
        user_id: userId,
        timestamp: new Date().toISOString()
      }
    });

    logStep("Enhanced matching completed", { 
      totalMatches: matches.length,
      avgScore: matches.reduce((sum, m) => sum + m.score, 0) / matches.length
    });

    return new Response(JSON.stringify({
      success: true,
      matches,
      metadata: {
        userType,
        totalMatches: matches.length,
        timestamp: new Date().toISOString(),
        version: 'enhanced-v1.0'
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in enhanced AI matching", { message: errorMessage });
    
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

async function calculateRealCompatibilityScore(
  userType: string, 
  targetType: string, 
  preferences: any,
  userProfile: any,
  targetProfile: any,
  supabase: any
): Promise<{score: number, factors: string[]}> {
  
  const factors: string[] = [];
  let totalScore = 0;
  let maxPossibleScore = 0;

  // 1. Similaridade semântica via embeddings (peso 40%)
  try {
    const { data: embeddingResult } = await supabase.functions.invoke('ai-embeddings', {
      body: {
        action: 'calculate_similarities',
        userEmbedding: null, // Will be generated internally
        candidates: [{ ...targetProfile, type: targetType }]
      }
    });

    if (embeddingResult?.success && embeddingResult.similarities?.length > 0) {
      const semanticScore = embeddingResult.similarities[0].similarity_score * 0.4;
      totalScore += semanticScore;
      factors.push(`Similaridade semântica: ${Math.round(semanticScore * 100)}%`);
    }
    maxPossibleScore += 0.4;
  } catch (error) {
    logStep("Semantic similarity calculation failed", { error: error.message });
  }

  // 2. Compatibilidade de localização (peso 20%)
  if (userProfile.location && targetProfile.location) {
    const userLocation = userProfile.location.toLowerCase();
    const targetLocation = targetProfile.location.toLowerCase();
    
    if (userLocation.includes(targetLocation) || targetLocation.includes(userLocation)) {
      totalScore += 0.2;
      factors.push('Localização compatível');
    } else if (userProfile.state && targetProfile.state && 
               userProfile.state.toLowerCase() === targetProfile.state.toLowerCase()) {
      totalScore += 0.1;
      factors.push('Mesmo estado');
    }
  }
  maxPossibleScore += 0.2;

  // 3. Correspondência de especialidades (peso 25%)
  let expertiseMatch = false;
  if (userType === 'pharmaceutical_company' && targetType === 'laboratory') {
    const companyExpertise = userProfile.expertise_area || [];
    const labCertifications = targetProfile.certifications || [];
    
    const intersection = companyExpertise.filter(exp => 
      labCertifications.some(cert => 
        cert.toLowerCase().includes(exp.toLowerCase()) ||
        exp.toLowerCase().includes(cert.toLowerCase())
      )
    );
    
    if (intersection.length > 0) {
      const expertiseScore = Math.min(intersection.length / companyExpertise.length, 1) * 0.25;
      totalScore += expertiseScore;
      factors.push(`Especialidades compatíveis: ${intersection.join(', ')}`);
      expertiseMatch = true;
    }
  } else if (userType === 'pharmaceutical_company' && targetType === 'consultant') {
    const companyExpertise = userProfile.expertise_area || [];
    const consultantExpertise = targetProfile.expertise || [];
    
    const intersection = companyExpertise.filter(exp => 
      consultantExpertise.some(cons => 
        cons.toLowerCase().includes(exp.toLowerCase()) ||
        exp.toLowerCase().includes(cons.toLowerCase())
      )
    );
    
    if (intersection.length > 0) {
      const expertiseScore = Math.min(intersection.length / companyExpertise.length, 1) * 0.25;
      totalScore += expertiseScore;
      factors.push(`Expertise compatível: ${intersection.join(', ')}`);
      expertiseMatch = true;
    }
  }
  maxPossibleScore += 0.25;

  // 4. Fatores específicos do tipo (peso 15%)
  if (targetType === 'laboratory' && targetProfile.available_capacity > 0) {
    totalScore += 0.075;
    factors.push('Capacidade disponível');
  }
  
  if (targetType === 'consultant' && targetProfile.projects_completed > 5) {
    totalScore += 0.075;
    factors.push(`Experiência comprovada: ${targetProfile.projects_completed} projetos`);
  }
  
  if (targetProfile.compliance_status === 'compliant' || targetProfile.anvisa_certified) {
    totalScore += 0.075;
    factors.push('Certificação ANVISA');
  }
  maxPossibleScore += 0.15;

  // Normalizar score final
  const finalScore = maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;
  
  return {
    score: Math.round(finalScore * 100) / 100,
    factors
  };
}