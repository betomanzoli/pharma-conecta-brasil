import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, preferences = {} } = await req.json();
    console.log('Advanced regulatory matching for user:', userId);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user profile and company information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Enhanced matching with regulatory compliance
    const matches = await generateRegulatoryCompliantMatches(supabase, profile, preferences);

    // Store matching results with regulatory insights
    await storeMatchingResults(supabase, userId, matches);

    // Generate regulatory alerts if needed
    const alerts = await checkRegulatoryAlerts(supabase, profile, matches);

    return new Response(JSON.stringify({
      success: true,
      matches,
      regulatory_insights: {
        compliance_score: calculateComplianceScore(matches),
        alerts,
        recommendations: generateRegulatoryRecommendations(matches)
      },
      total_matches: matches.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in advanced regulatory matching:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateRegulatoryCompliantMatches(supabase: any, profile: any, preferences: any) {
  console.log('Generating regulatory compliant matches...');

  // Get potential matches based on user type
  let potentialMatches = [];

  if (profile.user_type === 'company') {
    // Get user's company
    const { data: userCompany } = await supabase
      .from('companies')
      .select('*')
      .eq('profile_id', profile.id)
      .single();

    if (userCompany) {
      // Find laboratories and consultants
      const [labsResult, consultantsResult] = await Promise.all([
        supabase.from('laboratories').select('*'),
        supabase.from('consultants').select('*, profiles(*)')
      ]);

      potentialMatches = [
        ...labsResult.data?.map(lab => ({ ...lab, type: 'laboratory' })) || [],
        ...consultantsResult.data?.map(consultant => ({ ...consultant, type: 'consultant' })) || []
      ];
    }
  } else if (profile.user_type === 'laboratory') {
    // Find companies
    const { data: companies } = await supabase
      .from('companies')
      .select('*');
    
    potentialMatches = companies?.map(company => ({ ...company, type: 'company' })) || [];
  } else if (profile.user_type === 'consultant') {
    // Find companies
    const { data: companies } = await supabase
      .from('companies')
      .select('*');
    
    potentialMatches = companies?.map(company => ({ ...company, type: 'company' })) || [];
  }

  // Apply regulatory compliance filtering and scoring
  const regulatoryMatches = await Promise.all(
    potentialMatches.map(async (match) => {
      const regulatoryScore = await calculateRegulatoryCompatibility(supabase, profile, match);
      const complianceData = await getComplianceData(supabase, match);
      
      return {
        id: match.id,
        name: match.name,
        type: match.type,
        location: match.location || `${match.city}, ${match.state}`,
        description: match.description,
        compatibility_score: regulatoryScore.score,
        regulatory_factors: regulatoryScore.factors,
        compliance_status: complianceData.status,
        compliance_score: complianceData.score,
        regulatory_alerts: regulatoryScore.alerts,
        last_updated: new Date().toISOString()
      };
    })
  );

  // Filter by minimum compliance score and sort by regulatory compatibility
  return regulatoryMatches
    .filter(match => match.compliance_score >= 0.7)
    .sort((a, b) => b.compatibility_score - a.compatibility_score)
    .slice(0, 10);
}

async function calculateRegulatoryCompatibility(supabase: any, profile: any, match: any) {
  console.log('Calculating regulatory compatibility...');

  let score = 0.5; // Base score
  const factors = [];
  const alerts = [];

  // Check compliance status compatibility
  const [profileCompliance, matchCompliance] = await Promise.all([
    getComplianceData(supabase, { id: profile.id, type: profile.user_type }),
    getComplianceData(supabase, match)
  ]);

  // Compliance status alignment
  if (profileCompliance.status === 'compliant' && matchCompliance.status === 'compliant') {
    score += 0.3;
    factors.push('Both parties are fully compliant');
  } else if (profileCompliance.status === 'compliant' || matchCompliance.status === 'compliant') {
    score += 0.1;
    factors.push('One party is compliant');
    alerts.push('Compliance status mismatch - review before proceeding');
  }

  // Regulatory domain compatibility
  const profileDomains = await getRegulatoryDomains(supabase, profile.id, profile.user_type);
  const matchDomains = await getRegulatoryDomains(supabase, match.id, match.type);

  const commonDomains = profileDomains.filter(domain => matchDomains.includes(domain));
  if (commonDomains.length > 0) {
    score += 0.2 * (commonDomains.length / Math.max(profileDomains.length, matchDomains.length));
    factors.push(`Common regulatory domains: ${commonDomains.join(', ')}`);
  }

  // Geographic regulatory alignment
  const geoScore = calculateGeographicRegulatoryScore(profile, match);
  score += geoScore * 0.2;
  if (geoScore > 0.5) {
    factors.push('Good geographic regulatory alignment');
  }

  // Recent regulatory changes impact
  const recentChanges = await checkRecentRegulatoryChanges(supabase, [profile, match]);
  if (recentChanges.length > 0) {
    score -= 0.1;
    alerts.push(`Recent regulatory changes may affect this partnership: ${recentChanges.join(', ')}`);
  }

  return {
    score: Math.min(1.0, Math.max(0.0, score)),
    factors,
    alerts
  };
}

async function getComplianceData(supabase: any, entity: any) {
  const { data: compliance } = await supabase
    .from('compliance_tracking')
    .select('*')
    .eq('profile_id', entity.id)
    .order('last_check', { ascending: false })
    .limit(1);

  if (compliance && compliance.length > 0) {
    return {
      status: compliance[0].status,
      score: compliance[0].score || 0.5,
      last_check: compliance[0].last_check
    };
  }

  return {
    status: 'unknown',
    score: 0.5,
    last_check: null
  };
}

async function getRegulatoryDomains(supabase: any, entityId: string, entityType: string) {
  // Get regulatory domains based on entity type and activities
  const domains = ['pharmaceutical', 'medical_device', 'biotechnology'];
  
  if (entityType === 'company') {
    const { data: company } = await supabase
      .from('companies')
      .select('expertise_area')
      .eq('id', entityId)
      .single();
    
    return company?.expertise_area || domains;
  } else if (entityType === 'laboratory') {
    const { data: lab } = await supabase
      .from('laboratories')
      .select('certifications')
      .eq('id', entityId)
      .single();
    
    return lab?.certifications || domains;
  } else if (entityType === 'consultant') {
    const { data: consultant } = await supabase
      .from('consultants')
      .select('expertise')
      .eq('id', entityId)
      .single();
    
    return consultant?.expertise || domains;
  }

  return domains;
}

function calculateGeographicRegulatoryScore(profile: any, match: any) {
  // Same country/region gets higher score
  const profileLocation = profile.state || profile.location;
  const matchLocation = match.state || match.location;
  
  if (profileLocation && matchLocation) {
    return profileLocation.toLowerCase().includes(matchLocation.toLowerCase()) ||
           matchLocation.toLowerCase().includes(profileLocation.toLowerCase()) ? 1.0 : 0.3;
  }
  
  return 0.5;
}

async function checkRecentRegulatoryChanges(supabase: any, entities: any[]) {
  const { data: alerts } = await supabase
    .from('regulatory_alerts')
    .select('*')
    .gte('published_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .eq('severity', 'high');

  return alerts?.map(alert => alert.title) || [];
}

async function storeMatchingResults(supabase: any, userId: string, matches: any[]) {
  const results = matches.map(match => ({
    user_id: userId,
    match_id: match.id,
    match_type: match.type,
    compatibility_score: match.compatibility_score,
    compliance_score: match.compliance_score,
    regulatory_factors: match.regulatory_factors,
    regulatory_alerts: match.regulatory_alerts,
    created_at: new Date().toISOString()
  }));

  const { error } = await supabase
    .from('regulatory_matching_results')
    .insert(results);

  if (error) {
    console.error('Error storing matching results:', error);
  }
}

async function checkRegulatoryAlerts(supabase: any, profile: any, matches: any[]) {
  const alerts = [];

  // Check for high-risk compliance combinations
  const lowComplianceMatches = matches.filter(m => m.compliance_score < 0.8);
  if (lowComplianceMatches.length > 0) {
    alerts.push({
      type: 'compliance_risk',
      severity: 'medium',
      message: `${lowComplianceMatches.length} matches have compliance scores below 80%`,
      matches: lowComplianceMatches.map(m => m.id)
    });
  }

  // Check for regulatory domain mismatches
  const domainMismatches = matches.filter(m => 
    !m.regulatory_factors.some(factor => factor.includes('Common regulatory domains'))
  );
  if (domainMismatches.length > 0) {
    alerts.push({
      type: 'domain_mismatch',
      severity: 'low',
      message: `${domainMismatches.length} matches may have regulatory domain incompatibilities`,
      matches: domainMismatches.map(m => m.id)
    });
  }

  return alerts;
}

function calculateComplianceScore(matches: any[]) {
  if (matches.length === 0) return 0;
  
  const totalScore = matches.reduce((sum, match) => sum + match.compliance_score, 0);
  return totalScore / matches.length;
}

function generateRegulatoryRecommendations(matches: any[]) {
  const recommendations = [];

  const avgComplianceScore = calculateComplianceScore(matches);
  if (avgComplianceScore < 0.8) {
    recommendations.push('Consider focusing on matches with higher compliance scores to reduce regulatory risk');
  }

  const highAlertMatches = matches.filter(m => m.regulatory_alerts.length > 0);
  if (highAlertMatches.length > 0) {
    recommendations.push('Review regulatory alerts for flagged matches before proceeding with partnerships');
  }

  const topMatches = matches.slice(0, 3);
  if (topMatches.length > 0) {
    recommendations.push(`Focus on top ${topMatches.length} matches for optimal regulatory compatibility`);
  }

  return recommendations;
}