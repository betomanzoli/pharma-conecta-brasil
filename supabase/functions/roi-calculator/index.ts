
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ROICalculationRequest {
  investmentType: 'platform_subscription' | 'laboratory_partnership' | 'consultant_hiring' | 'regulatory_compliance';
  initialCost: number;
  monthlyCost?: number;
  timeHorizon: number; // months
  expectedBenefits: {
    timeReduction?: number; // percentage
    costSavings?: number; // absolute value
    revenueIncrease?: number; // absolute value
    riskReduction?: number; // percentage
  };
  companySize: 'small' | 'medium' | 'large';
  currentProcessCost?: number;
}

interface ROIResult {
  roi: number;
  paybackPeriod: number; // months
  netPresentValue: number;
  totalBenefits: number;
  totalCosts: number;
  monthlyBreakdown: Array<{
    month: number;
    cumulativeCost: number;
    cumulativeBenefit: number;
    netBenefit: number;
  }>;
  recommendations: string[];
  assumptions: string[];
}

const logStep = (step: string, data?: any) => {
  console.log(`[ROI-CALCULATOR] ${step}`, data ? JSON.stringify(data) : '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Starting ROI calculation');

    const request: ROICalculationRequest = await req.json();
    logStep('Received calculation request', { 
      investmentType: request.investmentType,
      timeHorizon: request.timeHorizon 
    });

    const {
      investmentType,
      initialCost,
      monthlyCost = 0,
      timeHorizon,
      expectedBenefits,
      companySize,
      currentProcessCost = 0
    } = request;

    // Industry benchmarks and multipliers
    const sizeMultipliers = {
      small: 1.0,
      medium: 1.5,
      large: 2.5
    };

    const investmentMultipliers = {
      platform_subscription: 1.0,
      laboratory_partnership: 1.8,
      consultant_hiring: 1.3,
      regulatory_compliance: 2.2
    };

    const baseMultiplier = sizeMultipliers[companySize] * investmentMultipliers[investmentType];

    // Calculate monthly benefits
    let monthlyBenefit = 0;

    // Time reduction benefits
    if (expectedBenefits.timeReduction && currentProcessCost) {
      const timeSavings = (expectedBenefits.timeReduction / 100) * currentProcessCost;
      monthlyBenefit += timeSavings * baseMultiplier;
    }

    // Direct cost savings
    if (expectedBenefits.costSavings) {
      monthlyBenefit += expectedBenefits.costSavings * baseMultiplier;
    }

    // Revenue increase
    if (expectedBenefits.revenueIncrease) {
      monthlyBenefit += expectedBenefits.revenueIncrease * baseMultiplier;
    }

    // Risk reduction value (converted to monetary benefit)
    if (expectedBenefits.riskReduction && currentProcessCost) {
      const riskValue = (expectedBenefits.riskReduction / 100) * currentProcessCost * 0.1; // 10% of process cost as risk value
      monthlyBenefit += riskValue * baseMultiplier;
    }

    // Calculate totals
    const totalCosts = initialCost + (monthlyCost * timeHorizon);
    const totalBenefits = monthlyBenefit * timeHorizon;
    const netPresentValue = totalBenefits - totalCosts;
    const roi = totalCosts > 0 ? ((totalBenefits - totalCosts) / totalCosts) * 100 : 0;

    // Calculate payback period
    let paybackPeriod = 0;
    let cumulativeBenefit = 0;
    let cumulativeCost = initialCost;

    for (let month = 1; month <= timeHorizon; month++) {
      cumulativeBenefit += monthlyBenefit;
      cumulativeCost += monthlyCost;
      
      if (cumulativeBenefit >= cumulativeCost && paybackPeriod === 0) {
        paybackPeriod = month;
      }
    }

    // Generate monthly breakdown
    const monthlyBreakdown = [];
    let cumCost = initialCost;
    let cumBenefit = 0;

    for (let month = 1; month <= Math.min(timeHorizon, 24); month++) {
      cumCost += monthlyCost;
      cumBenefit += monthlyBenefit;
      
      monthlyBreakdown.push({
        month,
        cumulativeCost: Math.round(cumCost),
        cumulativeBenefit: Math.round(cumBenefit),
        netBenefit: Math.round(cumBenefit - cumCost)
      });
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (roi > 200) {
      recommendations.push('ROI excelente - investimento altamente recomendado');
    } else if (roi > 100) {
      recommendations.push('ROI muito bom - investimento recomendado');
    } else if (roi > 50) {
      recommendations.push('ROI positivo - considere o investimento');
    } else if (roi > 0) {
      recommendations.push('ROI baixo - avalie outros benefícios intangíveis');
    } else {
      recommendations.push('ROI negativo - revise premissas ou considere alternativas');
    }

    if (paybackPeriod <= 6) {
      recommendations.push('Payback rápido - benefícios aparecem em curto prazo');
    } else if (paybackPeriod <= 12) {
      recommendations.push('Payback moderado - benefícios aparecem em médio prazo');
    } else if (paybackPeriod > 0) {
      recommendations.push('Payback longo - avalie se timeframe é adequado');
    }

    // Add industry-specific recommendations
    switch (investmentType) {
      case 'platform_subscription':
        recommendations.push('Considere o valor do networking e oportunidades de parcerias');
        break;
      case 'laboratory_partnership':
        recommendations.push('Avalie também ganhos de capacidade e flexibilidade');
        break;
      case 'consultant_hiring':
        recommendations.push('Considere transferência de conhecimento para equipe interna');
        break;
      case 'regulatory_compliance':
        recommendations.push('Inclua valor da redução de riscos regulatórios');
        break;
    }

    // Generate assumptions
    const assumptions: string[] = [
      `Cálculo baseado em ${timeHorizon} meses`,
      `Porte da empresa: ${companySize}`,
      `Tipo de investimento: ${investmentType}`,
      'Benefícios calculados com base em benchmarks da indústria farmacêutica',
      'Não inclui custos de oportunidade ou inflação',
      'Pressupõe implementação bem-sucedida da solução'
    ];

    const result: ROIResult = {
      roi: Math.round(roi * 100) / 100,
      paybackPeriod,
      netPresentValue: Math.round(netPresentValue),
      totalBenefits: Math.round(totalBenefits),
      totalCosts: Math.round(totalCosts),
      monthlyBreakdown,
      recommendations,
      assumptions
    };

    logStep('ROI calculation completed', { 
      roi: result.roi, 
      paybackPeriod: result.paybackPeriod 
    });

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
