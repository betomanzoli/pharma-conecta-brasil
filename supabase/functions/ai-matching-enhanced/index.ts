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

        matches = [
          ...(labData?.map(lab => ({
            id: lab.id,
            type: 'laboratory',
            name: lab.name || `${lab.profiles.first_name} ${lab.profiles.last_name}`,
            score: calculateCompatibilityScore(userType, 'laboratory', preferences),
            specialties: lab.certifications || [],
            location: lab.location,
            verified: lab.anvisa_certified || false,
            profile: lab.profiles
          })) || []),
          ...(consultantData?.map(consultant => ({
            id: consultant.id,
            type: 'consultant',
            name: `${consultant.profiles.first_name} ${consultant.profiles.last_name}`,
            score: calculateCompatibilityScore(userType, 'consultant', preferences),
            specialties: consultant.expertise || [],
            location: consultant.location,
            hourlyRate: consultant.hourly_rate,
            profile: consultant.profiles
          })) || [])
        ];
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

        matches = companyData?.map(company => ({
          id: company.id,
          type: 'company',
          name: company.name,
          score: calculateCompatibilityScore(userType, 'company', preferences),
          specialties: company.expertise_area || [],
          location: `${company.city}, ${company.state}`,
          verified: company.compliance_status === 'compliant',
          profile: company.profiles
        })) || [];
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

        matches = [
          ...(allCompanies?.map(company => ({
            id: company.id,
            type: 'company',
            name: company.name,
            score: calculateCompatibilityScore(userType, 'company', preferences),
            specialties: company.expertise_area || [],
            location: `${company.city}, ${company.state}`,
            verified: company.compliance_status === 'compliant',
            profile: company.profiles
          })) || []),
          ...(allLabs?.map(lab => ({
            id: lab.id,
            type: 'laboratory',
            name: lab.name || `${lab.profiles.first_name} ${lab.profiles.last_name}`,
            score: calculateCompatibilityScore(userType, 'laboratory', preferences),
            specialties: lab.certifications || [],
            location: lab.location,
            verified: lab.anvisa_certified || false,
            profile: lab.profiles
          })) || [])
        ];
        break;

      default:
        throw new Error("Invalid user type");
    }

    // Sort by compatibility score
    matches = matches
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

function calculateCompatibilityScore(userType: string, targetType: string, preferences: any): number {
  let baseScore = Math.random() * 0.3 + 0.5; // 0.5-0.8 base

  // Type compatibility matrix
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    'pharmaceutical_company': {
      'laboratory': 0.9,
      'consultant': 0.8,
      'supplier': 0.85
    },
    'laboratory': {
      'company': 0.9,
      'supplier': 0.7,
      'consultant': 0.75
    },
    'consultant': {
      'company': 0.85,
      'laboratory': 0.8,
      'supplier': 0.6
    }
  };

  const typeBonus = compatibilityMatrix[userType]?.[targetType] || 0.5;
  
  // Preferences bonus
  let preferencesBonus = 0;
  if (preferences?.location && Math.random() > 0.5) preferencesBonus += 0.1;
  if (preferences?.specialties && Math.random() > 0.6) preferencesBonus += 0.15;
  if (preferences?.budget && Math.random() > 0.7) preferencesBonus += 0.1;

  const finalScore = Math.min((baseScore * typeBonus) + preferencesBonus, 1.0);
  
  return Math.round(finalScore * 100) / 100;
}