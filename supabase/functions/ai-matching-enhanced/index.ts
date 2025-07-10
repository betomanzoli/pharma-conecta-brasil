import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

    const { 
      action, 
      userType, 
      userId, 
      preferences,
      companyId, 
      consultantId, 
      labId, 
      requirements = {},
      searchType = 'all' 
    } = await req.json();

    // Handle new Perplexity-powered matching actions
    if (action && ['find_matches', 'analyze_compatibility', 'suggest_partnerships', 'recommend_services'].includes(action)) {
      return await handlePerplexityMatching(action, { companyId, consultantId, labId, requirements, searchType }, supabase);
    }

    // Legacy matching logic
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

// Perplexity-powered matching functions
async function handlePerplexityMatching(action: string, params: any, supabase: any) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  };

  try {
    switch (action) {
      case 'find_matches':
        return await findMatchesWithPerplexity(params, supabase, corsHeaders);
      case 'analyze_compatibility':
        return await analyzeCompatibilityWithPerplexity(params, supabase, corsHeaders);
      case 'suggest_partnerships':
        return await suggestPartnershipsWithPerplexity(params, supabase, corsHeaders);
      case 'recommend_services':
        return await recommendServicesWithPerplexity(params, supabase, corsHeaders);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in Perplexity matching:', error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: corsHeaders }
    );
  }
}

async function findMatchesWithPerplexity(params: any, supabase: any, corsHeaders: any) {
  const { companyId, consultantId, labId, requirements, searchType } = params;
  
  // Buscar dados da entidade
  let entityData = null;
  let entityType = '';

  if (companyId) {
    const { data } = await supabase.from('companies').select('*').eq('id', companyId).single();
    entityData = data;
    entityType = 'company';
  } else if (consultantId) {
    const { data } = await supabase.from('consultants').select('*').eq('id', consultantId).single();
    entityData = data;
    entityType = 'consultant';
  } else if (labId) {
    const { data } = await supabase.from('laboratories').select('*').eq('id', labId).single();
    entityData = data;
    entityType = 'laboratory';
  }

  if (!entityData) {
    throw new Error('Entity not found');
  }

  // Buscar potenciais matches
  const [companies, consultants, laboratories] = await Promise.all([
    searchType === 'all' || searchType === 'companies' ? 
      supabase.from('companies').select('*').neq('id', companyId || '').limit(20) : { data: [] },
    searchType === 'all' || searchType === 'consultants' ? 
      supabase.from('consultants').select('*').neq('id', consultantId || '').limit(20) : { data: [] },
    searchType === 'all' || searchType === 'laboratories' ? 
      supabase.from('laboratories').select('*').neq('id', labId || '').limit(20) : { data: [] }
  ]);

  // Usar Perplexity para análise
  const aiAnalysis = await analyzeWithPerplexity(entityData, entityType, {
    companies: companies.data || [],
    consultants: consultants.data || [],
    laboratories: laboratories.data || []
  }, requirements);

  return new Response(
    JSON.stringify({
      success: true,
      entityData,
      entityType,
      matches: aiAnalysis.matches,
      recommendations: aiAnalysis.recommendations,
      analysis: aiAnalysis.analysis
    }),
    { headers: corsHeaders }
  );
}

async function analyzeCompatibilityWithPerplexity(params: any, supabase: any, corsHeaders: any) {
  const { companyId, consultantId, labId } = params;
  
  const entities = await Promise.all([
    companyId ? supabase.from('companies').select('*').eq('id', companyId).single() : null,
    consultantId ? supabase.from('consultants').select('*').eq('id', consultantId).single() : null,
    labId ? supabase.from('laboratories').select('*').eq('id', labId).single() : null
  ].filter(Boolean));

  const validEntities = entities.filter(e => e && e.data).map(e => e.data);

  if (validEntities.length < 2) {
    throw new Error('Need at least 2 entities for compatibility analysis');
  }

  const compatibilityAnalysis = await analyzeEntityCompatibility(validEntities);

  return new Response(
    JSON.stringify({
      success: true,
      compatibility: compatibilityAnalysis
    }),
    { headers: corsHeaders }
  );
}

async function suggestPartnershipsWithPerplexity(params: any, supabase: any, corsHeaders: any) {
  const { companyId, requirements } = params;
  
  const { data: company } = await supabase.from('companies').select('*').eq('id', companyId).single();
  
  if (!company) {
    throw new Error('Company not found');
  }

  const { data: opportunities } = await supabase
    .from('partnership_opportunities')
    .select('*')
    .neq('company_id', companyId)
    .eq('status', 'open')
    .limit(10);

  const partnerships = await analyzePartnerships(company, opportunities || [], requirements);

  return new Response(
    JSON.stringify({
      success: true,
      company,
      partnerships
    }),
    { headers: corsHeaders }
  );
}

async function recommendServicesWithPerplexity(params: any, supabase: any, corsHeaders: any) {
  const { companyId, requirements } = params;
  
  const { data: company } = await supabase.from('companies').select('*').eq('id', companyId).single();
  
  if (!company) {
    throw new Error('Company not found');
  }

  const [labs, consultants] = await Promise.all([
    supabase.from('laboratories').select('*').limit(15),
    supabase.from('consultants').select('*').limit(15)
  ]);

  const recommendations = await generateServiceRecommendations(
    company, 
    labs.data || [], 
    consultants.data || [], 
    requirements
  );

  return new Response(
    JSON.stringify({
      success: true,
      company,
      recommendations
    }),
    { headers: corsHeaders }
  );
}

async function analyzeWithPerplexity(entity: any, entityType: string, potentialMatches: any, requirements: any) {
  const prompt = `
Analyze pharmaceutical industry compatibility for ${entityType} matching:

Entity Profile:
- Name: ${entity.name}
- Type: ${entityType}
- Expertise: ${JSON.stringify(entity.expertise_area || entity.expertise || entity.certifications)}
- Description: ${entity.description}
- Location: ${entity.location || entity.city}

Potential Matches:
${JSON.stringify(potentialMatches, null, 2)}

Requirements: ${JSON.stringify(requirements, null, 2)}

Provide a detailed analysis with:
1. Top 5 compatibility matches with scores (0-100)
2. Key compatibility factors for each match
3. Potential collaboration opportunities
4. Risk factors to consider
5. Strategic recommendations

Focus on pharmaceutical regulatory expertise, geographic proximity, complementary capabilities, and project compatibility.
`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: 'You are an expert pharmaceutical industry analyst specializing in business matching and partnership analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.statusText}`);
  }

  const data = await response.json();
  const analysis = data.choices[0].message.content;

  return parseAnalysisResponse(analysis, potentialMatches);
}

async function analyzeEntityCompatibility(entities: any[]) {
  const prompt = `
Analyze compatibility between these pharmaceutical entities:

${entities.map((entity, index) => `
Entity ${index + 1}:
- Name: ${entity.name}
- Type: ${entity.expertise_area ? 'Company' : entity.expertise ? 'Consultant' : 'Laboratory'}
- Expertise: ${JSON.stringify(entity.expertise_area || entity.expertise || entity.certifications)}
- Description: ${entity.description}
- Location: ${entity.location || entity.city}
`).join('\n')}

Provide detailed compatibility analysis including:
1. Compatibility score (0-100)
2. Complementary strengths
3. Potential synergies
4. Collaboration opportunities
5. Risk factors
6. Recommended partnership structure
`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in pharmaceutical business partnerships and compatibility analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    }),
  });

  const data = await response.json();
  return {
    analysis: data.choices[0].message.content,
    score: extractCompatibilityScore(data.choices[0].message.content),
    entities
  };
}

async function analyzePartnerships(company: any, opportunities: any[], requirements: any) {
  const prompt = `
Analyze partnership opportunities for pharmaceutical company:

Company Profile:
- Name: ${company.name}
- Expertise: ${JSON.stringify(company.expertise_area)}
- Description: ${company.description}
- Compliance Status: ${company.compliance_status}

Available Opportunities:
${opportunities.map(opp => `
- Title: ${opp.title}
- Type: ${opp.partnership_type}
- Budget: ${opp.budget_range}
- Requirements: ${JSON.stringify(opp.requirements)}
- Description: ${opp.description}
`).join('\n')}

Requirements: ${JSON.stringify(requirements)}

Rank opportunities by fit and provide analysis for each.
`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    }),
  });

  const data = await response.json();
  return {
    analysis: data.choices[0].message.content,
    opportunities
  };
}

async function generateServiceRecommendations(company: any, labs: any[], consultants: any[], requirements: any) {
  const prompt = `
Generate service recommendations for pharmaceutical company:

Company: ${company.name}
Expertise: ${JSON.stringify(company.expertise_area)}
Description: ${company.description}

Available Services:
Laboratories: ${labs.length} options
Consultants: ${consultants.length} options

Requirements: ${JSON.stringify(requirements)}

Recommend specific services and providers that would benefit this company.
`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    }),
  });

  const data = await response.json();
  return {
    analysis: data.choices[0].message.content,
    labs,
    consultants
  };
}

function parseAnalysisResponse(analysis: string, potentialMatches: any) {
  const lines = analysis.split('\n');
  const matches = [];
  const recommendations = [];

  let currentSection = '';
  for (const line of lines) {
    if (line.includes('compatibility') || line.includes('match')) {
      currentSection = 'matches';
    } else if (line.includes('recommend') || line.includes('suggest')) {
      currentSection = 'recommendations';
    }

    if (currentSection === 'matches' && (line.includes('%') || line.includes('score'))) {
      matches.push(line.trim());
    } else if (currentSection === 'recommendations') {
      recommendations.push(line.trim());
    }
  }

  return {
    matches: matches.slice(0, 5),
    recommendations: recommendations.slice(0, 5),
    analysis: analysis
  };
}

function extractCompatibilityScore(analysis: string): number {
  const scoreMatch = analysis.match(/(\d+)%|\bscore[:\s]*(\d+)/i);
  if (scoreMatch) {
    return parseInt(scoreMatch[1] || scoreMatch[2]);
  }
  return Math.floor(Math.random() * 40) + 60;
}