import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ROI-CALCULATOR-ENHANCED] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("ROI Calculator Enhanced request received");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      projectType, 
      investmentAmount, 
      timeframe, 
      marketSegment, 
      riskLevel,
      additionalFactors 
    } = await req.json();

    if (!projectType || !investmentAmount || !timeframe) {
      throw new Error("ProjectType, investmentAmount, and timeframe are required");
    }

    logStep("Processing ROI calculation", { 
      projectType, 
      investmentAmount, 
      timeframe, 
      marketSegment 
    });

    // Enhanced ROI calculation based on pharmaceutical industry standards
    const roiData = calculateEnhancedROI({
      projectType,
      investmentAmount,
      timeframe,
      marketSegment,
      riskLevel: riskLevel || 'medium',
      additionalFactors: additionalFactors || {}
    });

    // Store calculation for analytics
    await supabase.from('performance_metrics').insert({
      metric_name: 'roi_calculation',
      metric_value: roiData.expectedROI,
      metric_unit: 'percentage',
      tags: {
        project_type: projectType,
        investment_amount: investmentAmount,
        timeframe,
        market_segment: marketSegment,
        timestamp: new Date().toISOString()
      }
    });

    logStep("ROI calculation completed", { 
      expectedROI: roiData.expectedROI,
      confidence: roiData.confidence
    });

    return new Response(JSON.stringify({
      success: true,
      roiData,
      recommendations: generateRecommendations(roiData),
      metadata: {
        calculatedAt: new Date().toISOString(),
        version: 'enhanced-v1.0'
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in ROI calculation", { message: errorMessage });
    
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

function calculateEnhancedROI(params: any) {
  const { projectType, investmentAmount, timeframe, marketSegment, riskLevel, additionalFactors } = params;

  // Base ROI rates for pharmaceutical industry
  const baseROIRates: Record<string, number> = {
    'drug_development': 0.15, // 15% annually (high risk, high reward)
    'clinical_trials': 0.12,
    'regulatory_compliance': 0.08,
    'manufacturing_upgrade': 0.10,
    'digital_transformation': 0.18,
    'market_expansion': 0.14,
    'r_and_d': 0.16,
    'quality_improvement': 0.09
  };

  // Market segment multipliers
  const marketMultipliers: Record<string, number> = {
    'oncology': 1.3,
    'cardiovascular': 1.1,
    'neurology': 1.25,
    'infectious_disease': 1.2,
    'generic_drugs': 0.8,
    'rare_diseases': 1.4,
    'biosimilars': 0.9,
    'vaccines': 1.15
  };

  // Risk level adjustments
  const riskAdjustments: Record<string, number> = {
    'low': 0.9,
    'medium': 1.0,
    'high': 1.2,
    'very_high': 1.4
  };

  const baseROI = baseROIRates[projectType] || 0.10;
  const marketMultiplier = marketMultipliers[marketSegment] || 1.0;
  const riskAdjustment = riskAdjustments[riskLevel] || 1.0;

  // Calculate expected ROI
  const annualROI = baseROI * marketMultiplier * riskAdjustment;
  const totalROI = annualROI * timeframe;
  const expectedReturn = investmentAmount * (1 + totalROI);
  const profit = expectedReturn - investmentAmount;

  // Calculate confidence based on various factors
  let confidence = 0.75; // Base confidence
  
  if (projectType === 'regulatory_compliance') confidence += 0.1;
  if (marketSegment === 'generic_drugs') confidence += 0.15;
  if (riskLevel === 'low') confidence += 0.1;
  if (timeframe <= 2) confidence += 0.05;
  
  confidence = Math.min(confidence, 0.95);

  // Monthly projections
  const monthlyProjections = [];
  for (let month = 1; month <= timeframe * 12; month++) {
    const monthlyProgress = month / (timeframe * 12);
    const cumulativeReturn = investmentAmount * (1 + (totalROI * monthlyProgress));
    
    monthlyProjections.push({
      month,
      year: Math.ceil(month / 12),
      quarter: Math.ceil((month % 12) / 3) || 4,
      cumulativeReturn,
      monthlyGain: month === 1 ? 0 : cumulativeReturn - monthlyProjections[month - 2]?.cumulativeReturn || 0,
      roi: ((cumulativeReturn - investmentAmount) / investmentAmount) * 100
    });
  }

  return {
    expectedROI: Math.round(totalROI * 100 * 100) / 100, // Percentage with 2 decimals
    annualROI: Math.round(annualROI * 100 * 100) / 100,
    expectedReturn,
    profit,
    confidence: Math.round(confidence * 100),
    timeframe,
    investmentAmount,
    projectType,
    marketSegment,
    riskLevel,
    monthlyProjections,
    breakEvenPoint: calculateBreakEvenPoint(investmentAmount, profit, timeframe),
    riskFactors: identifyRiskFactors(projectType, marketSegment, riskLevel),
    opportunities: identifyOpportunities(projectType, marketSegment, additionalFactors)
  };
}

function calculateBreakEvenPoint(investment: number, profit: number, timeframe: number): number {
  // Simplified break-even calculation
  const monthlyReturn = profit / (timeframe * 12);
  const monthsToBreakEven = investment / monthlyReturn;
  return Math.max(Math.ceil(monthsToBreakEven), 1);
}

function identifyRiskFactors(projectType: string, marketSegment: string, riskLevel: string): string[] {
  const risks: string[] = [];
  
  if (projectType === 'drug_development') {
    risks.push('Falha em testes clínicos', 'Rejeição regulatória', 'Competição de mercado');
  }
  
  if (marketSegment === 'oncology') {
    risks.push('Alto custo de desenvolvimento', 'Regulamentação rigorosa');
  }
  
  if (riskLevel === 'high' || riskLevel === 'very_high') {
    risks.push('Volatilidade de mercado', 'Mudanças regulatórias');
  }
  
  return risks;
}

function identifyOpportunities(projectType: string, marketSegment: string, additionalFactors: any): string[] {
  const opportunities: string[] = [];
  
  if (projectType === 'digital_transformation') {
    opportunities.push('Eficiência operacional', 'Redução de custos', 'Melhoria na qualidade');
  }
  
  if (marketSegment === 'rare_diseases') {
    opportunities.push('Incentivos regulatórios', 'Preços premium', 'Menor competição');
  }
  
  if (additionalFactors?.hasPartnership) {
    opportunities.push('Compartilhamento de riscos', 'Acesso a expertise');
  }
  
  return opportunities;
}

function generateRecommendations(roiData: any): string[] {
  const recommendations: string[] = [];
  
  if (roiData.expectedROI < 10) {
    recommendations.push('Considere revisar o escopo do projeto para melhorar o ROI');
  }
  
  if (roiData.confidence < 60) {
    recommendations.push('Recomenda-se maior análise de riscos antes do investimento');
  }
  
  if (roiData.breakEvenPoint > 24) {
    recommendations.push('Ponto de equilíbrio longo - avalie estratégias para acelerar retornos');
  }
  
  if (roiData.expectedROI > 20) {
    recommendations.push('Excelente potencial de retorno - considere aumentar o investimento');
  }
  
  return recommendations;
}