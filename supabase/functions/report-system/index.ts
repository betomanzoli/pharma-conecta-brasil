import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      action, 
      reportType = 'comprehensive',
      filters = {},
      format = 'json',
      timeRange = '30d'
    } = await req.json();

    console.log('Report System request:', { action, reportType, format, timeRange });

    switch (action) {
      case 'generate_report':
        return await generateReport(reportType, filters, format, timeRange);
      case 'get_templates':
        return await getReportTemplates();
      case 'create_template':
        return await createReportTemplate(filters);
      case 'schedule_report':
        return await scheduleReport(reportType, filters, format);
      case 'export_data':
        return await exportData(filters, format);
      case 'get_insights':
        return await generateReportInsights(reportType, filters, timeRange);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in report-system:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function generateReport(reportType: string, filters: any, format: string, timeRange: string) {
  const startDate = getStartDate(timeRange);
  
  let reportData: any = {};
  
  switch (reportType) {
    case 'comprehensive':
      reportData = await generateComprehensiveReport(startDate, filters);
      break;
    case 'compliance':
      reportData = await generateComplianceReport(startDate, filters);
      break;
    case 'api_performance':
      reportData = await generateAPIPerformanceReport(startDate, filters);
      break;
    case 'user_analytics':
      reportData = await generateUserAnalyticsReport(startDate, filters);
      break;
    case 'business_growth':
      reportData = await generateBusinessGrowthReport(startDate, filters);
      break;
    case 'regulatory_summary':
      reportData = await generateRegulatorySummaryReport(startDate, filters);
      break;
    default:
      throw new Error('Invalid report type');
  }

  // Gerar insights com IA
  const insights = await generateAIInsights(reportData, reportType);
  
  const report = {
    id: generateReportId(),
    type: reportType,
    title: getReportTitle(reportType),
    generated_at: new Date().toISOString(),
    time_range: timeRange,
    filters: filters,
    data: reportData,
    insights: insights,
    summary: generateSummary(reportData),
    recommendations: insights.recommendations || []
  };

  // Salvar relatório
  await saveReport(report);

  // Retornar no formato solicitado
  if (format === 'pdf') {
    return await generatePDFReport(report);
  } else if (format === 'excel') {
    return await generateExcelReport(report);
  }

  return new Response(
    JSON.stringify({
      success: true,
      report: report
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateComprehensiveReport(startDate: string, filters: any) {
  const [
    userMetrics,
    apiMetrics,
    businessMetrics,
    complianceMetrics,
    systemHealth,
    financialMetrics
  ] = await Promise.all([
    getUserMetrics(startDate),
    getAPIMetrics(startDate),
    getBusinessMetrics(startDate),
    getComplianceMetrics(startDate),
    getSystemHealthMetrics(),
    getFinancialMetrics(startDate)
  ]);

  return {
    executive_summary: {
      total_users: userMetrics.total,
      new_users: userMetrics.new,
      api_calls: apiMetrics.totalCalls,
      system_uptime: systemHealth.uptime,
      compliance_score: complianceMetrics.score
    },
    user_analytics: userMetrics,
    api_performance: apiMetrics,
    business_growth: businessMetrics,
    compliance_status: complianceMetrics,
    system_health: systemHealth,
    financial_overview: financialMetrics
  };
}

async function generateComplianceReport(startDate: string, filters: any) {
  const [
    complianceTracking,
    regulatoryAlerts,
    certifications,
    auditLogs
  ] = await Promise.all([
    getComplianceTrackingData(startDate),
    getRegulatoryAlertsData(startDate),
    getCertificationsData(),
    getAuditLogsData(startDate)
  ]);

  return {
    compliance_overview: {
      total_entities: complianceTracking.totalEntities,
      compliant: complianceTracking.compliant,
      pending: complianceTracking.pending,
      expired: complianceTracking.expired
    },
    regulatory_updates: regulatoryAlerts,
    certifications: certifications,
    audit_trail: auditLogs,
    risk_assessment: await assessComplianceRisks(complianceTracking)
  };
}

async function generateAPIPerformanceReport(startDate: string, filters: any) {
  const [
    apiConfigs,
    performanceMetrics,
    errorLogs,
    uptimeStats
  ] = await Promise.all([
    getAPIConfigurations(),
    getAPIPerformanceMetrics(startDate),
    getAPIErrorLogs(startDate),
    getAPIUptimeStats(startDate)
  ]);

  return {
    api_overview: {
      total_apis: apiConfigs.length,
      active_apis: apiConfigs.filter((api: any) => api.is_active).length,
      total_calls: performanceMetrics.totalCalls,
      avg_response_time: performanceMetrics.avgResponseTime
    },
    performance_metrics: performanceMetrics,
    error_analysis: errorLogs,
    uptime_statistics: uptimeStats,
    recommendations: await generateAPIRecommendations(performanceMetrics, errorLogs)
  };
}

async function generateUserAnalyticsReport(startDate: string, filters: any) {
  const [
    userStats,
    userEngagement,
    userRetention,
    userSegmentation
  ] = await Promise.all([
    getUserStatistics(startDate),
    getUserEngagement(startDate),
    getUserRetention(startDate),
    getUserSegmentation()
  ]);

  return {
    user_overview: userStats,
    engagement_metrics: userEngagement,
    retention_analysis: userRetention,
    user_segmentation: userSegmentation,
    growth_trends: calculateGrowthTrends(userStats)
  };
}

async function generateBusinessGrowthReport(startDate: string, filters: any) {
  const [
    companyGrowth,
    labGrowth,
    consultantGrowth,
    projectMetrics,
    revenueData
  ] = await Promise.all([
    getCompanyGrowthData(startDate),
    getLaboratoryGrowthData(startDate),
    getConsultantGrowthData(startDate),
    getProjectMetrics(startDate),
    getRevenueData(startDate)
  ]);

  return {
    growth_overview: {
      new_companies: companyGrowth.new,
      new_laboratories: labGrowth.new,
      new_consultants: consultantGrowth.new,
      active_projects: projectMetrics.active
    },
    company_analysis: companyGrowth,
    laboratory_analysis: labGrowth,
    consultant_analysis: consultantGrowth,
    project_analytics: projectMetrics,
    revenue_analysis: revenueData
  };
}

async function generateRegulatorySummaryReport(startDate: string, filters: any) {
  const [
    regulatoryAlerts,
    complianceChanges,
    fdaUpdates,
    anvisaUpdates
  ] = await Promise.all([
    getRegulatoryAlerts(startDate),
    getComplianceChanges(startDate),
    getFDAUpdates(startDate),
    getANVISAUpdates(startDate)
  ]);

  return {
    regulatory_overview: {
      total_alerts: regulatoryAlerts.length,
      high_priority: regulatoryAlerts.filter((alert: any) => alert.severity === 'high').length,
      compliance_changes: complianceChanges.length
    },
    regulatory_alerts: regulatoryAlerts,
    compliance_updates: complianceChanges,
    fda_updates: fdaUpdates,
    anvisa_updates: anvisaUpdates,
    impact_analysis: await analyzeRegulatoryImpact(regulatoryAlerts, complianceChanges)
  };
}

async function generateAIInsights(reportData: any, reportType: string) {
  const prompt = `
Generate executive insights for pharmaceutical platform ${reportType} report:

Report Data Summary:
${JSON.stringify(reportData, null, 2)}

Provide strategic insights including:
1. Key performance indicators analysis
2. Critical trends and patterns
3. Risk assessment and mitigation
4. Growth opportunities
5. Operational recommendations
6. Regulatory compliance insights
7. Technology optimization suggestions
8. Market positioning analysis

Focus on actionable insights for pharmaceutical industry executives.
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
          content: 'You are a pharmaceutical business intelligence expert specializing in strategic analysis and executive reporting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2500,
    }),
  });

  const data = await response.json();
  const insights = data.choices[0].message.content;

  return {
    analysis: insights,
    recommendations: extractRecommendations(insights),
    risks: extractRisks(insights),
    opportunities: extractOpportunities(insights)
  };
}

async function getReportTemplates() {
  const templates = [
    {
      id: 'comprehensive',
      name: 'Relatório Abrangente',
      description: 'Análise completa da plataforma incluindo usuários, APIs, compliance e negócios',
      sections: ['executive_summary', 'user_analytics', 'api_performance', 'compliance', 'business_growth']
    },
    {
      id: 'compliance',
      name: 'Relatório de Compliance',
      description: 'Foco em conformidade regulatória e certificações',
      sections: ['compliance_overview', 'regulatory_updates', 'certifications', 'audit_trail']
    },
    {
      id: 'api_performance',
      name: 'Performance das APIs',
      description: 'Análise detalhada do desempenho das integrações',
      sections: ['api_overview', 'performance_metrics', 'error_analysis', 'uptime_statistics']
    },
    {
      id: 'business_growth',
      name: 'Crescimento do Negócio',
      description: 'Métricas de crescimento e análise de mercado',
      sections: ['growth_overview', 'company_analysis', 'revenue_analysis', 'market_trends']
    }
  ];

  return new Response(
    JSON.stringify({
      success: true,
      templates: templates
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createReportTemplate(templateData: any) {
  const template = {
    id: generateTemplateId(),
    name: templateData.name,
    description: templateData.description,
    sections: templateData.sections,
    filters: templateData.filters,
    created_at: new Date().toISOString()
  };

  // Salvar template customizado
  await supabase.from('performance_metrics').insert({
    metric_name: 'custom_report_template',
    metric_value: 1,
    metric_unit: 'template',
    tags: template
  });

  return new Response(
    JSON.stringify({
      success: true,
      template: template
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper functions
function getStartDate(timeRange: string): string {
  const now = new Date();
  switch (timeRange) {
    case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    case '1y': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
}

function generateReportId(): string {
  return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateTemplateId(): string {
  return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getReportTitle(reportType: string): string {
  const titles = {
    comprehensive: 'Relatório Abrangente da Plataforma',
    compliance: 'Relatório de Compliance Regulatório',
    api_performance: 'Relatório de Performance das APIs',
    user_analytics: 'Análise de Usuários',
    business_growth: 'Relatório de Crescimento do Negócio',
    regulatory_summary: 'Sumário Regulatório'
  };
  
  return titles[reportType as keyof typeof titles] || 'Relatório Personalizado';
}

async function saveReport(report: any) {
  await supabase.from('performance_metrics').insert({
    metric_name: 'generated_report',
    metric_value: 1,
    metric_unit: 'report',
    tags: {
      report_id: report.id,
      report_type: report.type,
      generated_at: report.generated_at
    }
  });
}

function generateSummary(reportData: any): string {
  return `Relatório gerado com sucesso contendo análise abrangente dos dados da plataforma.`;
}

function extractRecommendations(insights: string): string[] {
  const lines = insights.split('\n');
  return lines.filter(line => 
    line.toLowerCase().includes('recommend') || 
    line.toLowerCase().includes('should') ||
    line.toLowerCase().includes('suggest')
  ).slice(0, 5);
}

function extractRisks(insights: string): string[] {
  const lines = insights.split('\n');
  return lines.filter(line => 
    line.toLowerCase().includes('risk') || 
    line.toLowerCase().includes('threat') ||
    line.toLowerCase().includes('concern')
  ).slice(0, 3);
}

function extractOpportunities(insights: string): string[] {
  const lines = insights.split('\n');
  return lines.filter(line => 
    line.toLowerCase().includes('opportunity') || 
    line.toLowerCase().includes('potential') ||
    line.toLowerCase().includes('growth')
  ).slice(0, 3);
}

// Data collection functions (simplified for brevity)
async function getUserMetrics(startDate: string) {
  const { data: users } = await supabase.from('profiles').select('*');
  const { data: newUsers } = await supabase.from('profiles').select('*').gte('created_at', startDate);
  
  return {
    total: users?.length || 0,
    new: newUsers?.length || 0,
    growth_rate: ((newUsers?.length || 0) / (users?.length || 1)) * 100
  };
}

async function getAPIMetrics(startDate: string) {
  const { data: metrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .gte('measured_at', startDate);
    
  return {
    totalCalls: metrics?.length || 0,
    avgResponseTime: 150, // Simulated
    errorRate: 2.5 // Simulated
  };
}

async function getBusinessMetrics(startDate: string) {
  const [companies, labs, consultants] = await Promise.all([
    supabase.from('companies').select('count').gte('created_at', startDate),
    supabase.from('laboratories').select('count').gte('created_at', startDate),
    supabase.from('consultants').select('count').gte('created_at', startDate)
  ]);

  return {
    new_companies: companies.data?.length || 0,
    new_laboratories: labs.data?.length || 0,
    new_consultants: consultants.data?.length || 0
  };
}

async function getComplianceMetrics(startDate: string) {
  const { data: compliance } = await supabase
    .from('compliance_tracking')
    .select('*')
    .gte('created_at', startDate);

  const compliantCount = compliance?.filter(c => c.status === 'compliant').length || 0;
  const total = compliance?.length || 1;

  return {
    score: Math.round((compliantCount / total) * 100),
    total: total,
    compliant: compliantCount
  };
}

async function getSystemHealthMetrics() {
  return {
    uptime: '99.9%',
    score: 95,
    status: 'healthy'
  };
}

async function getFinancialMetrics(startDate: string) {
  return {
    revenue: Math.floor(Math.random() * 100000) + 50000,
    growth: Math.floor(Math.random() * 20) + 5,
    transactions: Math.floor(Math.random() * 500) + 100
  };
}

// Additional placeholder functions for other data collection methods
async function getComplianceTrackingData(startDate: string) { return { totalEntities: 0, compliant: 0, pending: 0, expired: 0 }; }
async function getRegulatoryAlertsData(startDate: string) { return []; }
async function getCertificationsData() { return []; }
async function getAuditLogsData(startDate: string) { return []; }
async function assessComplianceRisks(data: any) { return []; }
async function getAPIConfigurations() { return []; }
async function getAPIPerformanceMetrics(startDate: string) { return { totalCalls: 0, avgResponseTime: 0 }; }
async function getAPIErrorLogs(startDate: string) { return []; }
async function getAPIUptimeStats(startDate: string) { return []; }
async function generateAPIRecommendations(performance: any, errors: any) { return []; }
async function getUserStatistics(startDate: string) { return {}; }
async function getUserEngagement(startDate: string) { return {}; }
async function getUserRetention(startDate: string) { return {}; }
async function getUserSegmentation() { return {}; }
async function calculateGrowthTrends(stats: any) { return {}; }
async function getCompanyGrowthData(startDate: string) { return { new: 0 }; }
async function getLaboratoryGrowthData(startDate: string) { return { new: 0 }; }
async function getConsultantGrowthData(startDate: string) { return { new: 0 }; }
async function getProjectMetrics(startDate: string) { return { active: 0 }; }
async function getRevenueData(startDate: string) { return {}; }
async function getRegulatoryAlerts(startDate: string) { return []; }
async function getComplianceChanges(startDate: string) { return []; }
async function getFDAUpdates(startDate: string) { return []; }
async function getANVISAUpdates(startDate: string) { return []; }
async function analyzeRegulatoryImpact(alerts: any, changes: any) { return {}; }
async function scheduleReport(reportType: string, filters: any, format: string) { return {}; }
async function exportData(filters: any, format: string) { return {}; }
async function generateReportInsights(reportType: string, filters: any, timeRange: string) { return {}; }
async function generatePDFReport(report: any) { return new Response('PDF generation not implemented'); }
async function generateExcelReport(report: any) { return new Response('Excel generation not implemented'); }