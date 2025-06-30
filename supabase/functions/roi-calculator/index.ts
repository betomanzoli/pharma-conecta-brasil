
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      project_type, 
      investment_amount, 
      timeline_months, 
      market_size, 
      competition_level,
      regulatory_complexity 
    } = await req.json();

    // Fatores de risco e retorno por tipo de projeto farmacêutico
    const projectFactors = {
      'research': { base_roi: 0.25, risk_factor: 0.8, time_penalty: 0.05 },
      'manufacturing': { base_roi: 0.15, risk_factor: 0.4, time_penalty: 0.03 },
      'distribution': { base_roi: 0.12, risk_factor: 0.3, time_penalty: 0.02 },
      'regulatory': { base_roi: 0.20, risk_factor: 0.6, time_penalty: 0.04 },
      'clinical_trials': { base_roi: 0.35, risk_factor: 0.9, time_penalty: 0.07 }
    };

    const factors = projectFactors[project_type] || projectFactors['manufacturing'];

    // Cálculo do ROI ajustado
    let roi_percentage = factors.base_roi * 100;

    // Ajuste por tamanho do mercado
    const market_multiplier = {
      'small': 0.8,
      'medium': 1.0,
      'large': 1.3,
      'very_large': 1.6
    };
    roi_percentage *= market_multiplier[market_size] || 1.0;

    // Ajuste por nível de concorrência
    const competition_multiplier = {
      'low': 1.2,
      'medium': 1.0,
      'high': 0.8,
      'very_high': 0.6
    };
    roi_percentage *= competition_multiplier[competition_level] || 1.0;

    // Ajuste por complexidade regulatória
    const regulatory_multiplier = {
      'low': 1.1,
      'medium': 1.0,
      'high': 0.9,
      'very_high': 0.7
    };
    roi_percentage *= regulatory_multiplier[regulatory_complexity] || 1.0;

    // Penalidade por tempo (projetos mais longos = menor ROI)
    const time_penalty = Math.max(0, (timeline_months - 12) * factors.time_penalty);
    roi_percentage -= time_penalty;

    // Cálculos financeiros
    const roi_decimal = roi_percentage / 100;
    const expected_return = investment_amount * (1 + roi_decimal);
    const profit = expected_return - investment_amount;
    const monthly_return = profit / timeline_months;

    // Análise de risco
    const risk_score = (factors.risk_factor * 100) + 
                      (timeline_months > 24 ? 20 : 0) + 
                      (competition_level === 'very_high' ? 15 : 0) +
                      (regulatory_complexity === 'very_high' ? 10 : 0);

    const risk_category = risk_score > 80 ? 'Alto' : 
                         risk_score > 50 ? 'Médio' : 'Baixo';

    // Recomendações personalizadas
    const recommendations = [];
    
    if (roi_percentage < 10) {
      recommendations.push('Considere revisar o modelo de negócio ou buscar parcerias estratégicas');
    }
    if (timeline_months > 36) {
      recommendations.push('Projeto de longo prazo - considere marcos intermediários para validação');
    }
    if (risk_score > 70) {
      recommendations.push('Alto risco - recomenda-se diversificação ou parcerias para mitigação');
    }
    if (market_size === 'large' || market_size === 'very_large') {
      recommendations.push('Mercado promissor - considere acelerar o desenvolvimento');
    }

    // Benchmarks do setor farmacêutico brasileiro
    const industry_benchmarks = {
      generic_drugs: { avg_roi: 12, avg_timeline: 18 },
      brand_drugs: { avg_roi: 25, avg_timeline: 36 },
      medical_devices: { avg_roi: 18, avg_timeline: 24 },
      clinical_research: { avg_roi: 30, avg_timeline: 48 }
    };

    return new Response(JSON.stringify({
      success: true,
      roi_analysis: {
        roi_percentage: Math.round(roi_percentage * 100) / 100,
        investment_amount,
        expected_return: Math.round(expected_return),
        profit: Math.round(profit),
        monthly_return: Math.round(monthly_return),
        timeline_months,
        risk_score: Math.round(risk_score),
        risk_category,
        recommendations,
        industry_benchmarks,
        calculation_details: {
          base_roi: factors.base_roi,
          market_adjustment: market_multiplier[market_size],
          competition_adjustment: competition_multiplier[competition_level],
          regulatory_adjustment: regulatory_multiplier[regulatory_complexity],
          time_penalty
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no ROI Calculator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
