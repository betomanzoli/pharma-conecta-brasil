import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logStep = (step: string, details?: any) => {
  console.log(`[${new Date().toISOString()}] ${step}`, details || '');
};

// Definições de segmentação industrial farmacêutica
const PHARMACEUTICAL_SEGMENTS = {
  laboratories: {
    bqv: {
      name: 'Laboratórios de Bioequivalência (BQV)',
      description: 'Estudos de bioequivalência e biodisponibilidade',
      specializations: ['bioequivalencia', 'biodisponibilidade', 'farmacocinetica', 'clinica'],
      certifications: ['ANVISA_BQV', 'GCP', 'GLP'],
      equipments: ['cromatografia', 'espectrometria', 'dissolution_tester']
    },
    eqfar: {
      name: 'Laboratórios de Equivalência Farmacêutica (EqFar)',
      description: 'Testes de equivalência farmacêutica e perfil de dissolução',
      specializations: ['equivalencia_farmaceutica', 'perfil_dissolucao', 'controle_qualidade'],
      certifications: ['ANVISA_EQFAR', 'ISO17025', 'BPL'],
      equipments: ['dissolution_apparatus', 'hplc', 'ftir', 'uv_vis']
    },
    clinical_research: {
      name: 'Organizações de Pesquisa Clínica (CRO)',
      description: 'Pesquisa clínica e desenvolvimento de medicamentos',
      specializations: ['pesquisa_clinica', 'fase_i', 'fase_ii', 'fase_iii', 'regulatory_affairs'],
      certifications: ['GCP', 'ISO14155', 'ANVISA_CRO'],
      services: ['protocolo_clinico', 'monitoramento', 'farmacovigilancia', 'bioestatistica']
    },
    analytical: {
      name: 'Laboratórios Analíticos',
      description: 'Análises físico-químicas e microbiológicas',
      specializations: ['analise_fisico_quimica', 'microbiologia', 'estabilidade', 'impurezas'],
      certifications: ['ISO17025', 'BPL', 'ANVISA_TERCEIRIZADA'],
      equipments: ['hplc', 'gc_ms', 'ftir', 'microbiologia']
    }
  },
  suppliers: {
    raw_materials: {
      name: 'Fornecedores de Matérias-Primas',
      description: 'Princípios ativos e excipientes farmacêuticos',
      categories: ['principios_ativos', 'excipientes', 'materiais_embalagem'],
      certifications: ['FDA_DMF', 'CEP', 'GMP', 'ISO9001'],
      specializations: ['api_synthesis', 'excipient_manufacturing', 'custom_synthesis']
    },
    equipment: {
      name: 'Fabricantes de Equipamentos',
      description: 'Equipamentos para produção farmacêutica',
      categories: ['producao', 'embalagem', 'controle_qualidade', 'utilidades'],
      specializations: ['tableting', 'coating', 'granulation', 'freeze_drying'],
      certifications: ['GMP_compliance', 'CE_marking', 'FDA_510k']
    },
    packaging: {
      name: 'Fornecedores de Embalagens',
      description: 'Materiais de embalagem farmacêutica',
      categories: ['embalagem_primaria', 'embalagem_secundaria', 'rotulos'],
      specializations: ['blister', 'ampolas', 'frascos', 'serialization'],
      certifications: ['GMP', 'ISO15378', 'FDA_food_contact']
    }
  },
  consultants: {
    regulatory: {
      name: 'Consultores Regulatórios',
      description: 'Assuntos regulatórios e registro de medicamentos',
      specializations: ['registro_medicamentos', 'anvisa_petitions', 'fda_submissions', 'variations'],
      certifications: ['RAC', 'RAPS', 'ANVISA_certified'],
      services: ['dossier_preparation', 'regulatory_strategy', 'compliance_audit']
    },
    quality: {
      name: 'Consultores de Qualidade',
      description: 'Sistema de qualidade e validação',
      specializations: ['sistema_qualidade', 'validacao', 'qualificacao', 'gmp_audit'],
      certifications: ['ASQ_CQE', 'ISPE', 'PDA'],
      services: ['validation_master_plan', 'process_validation', 'cleaning_validation']
    },
    manufacturing: {
      name: 'Consultores de Produção',
      description: 'Processos produtivos e scale-up',
      specializations: ['scale_up', 'process_optimization', 'technology_transfer', 'lean_manufacturing'],
      certifications: ['Six_Sigma', 'Lean', 'APV'],
      services: ['process_design', 'equipment_selection', 'facility_design']
    }
  },
  regulatory_bodies: {
    anvisa: {
      name: 'ANVISA',
      description: 'Agência Nacional de Vigilância Sanitária',
      services: ['registro_medicamentos', 'inspecoes', 'farmacovigilancia', 'boas_praticas'],
      contact_points: ['gerencia_geral_medicamentos', 'gerencia_inspecao', 'nuvig']
    },
    working_groups: {
      name: 'Grupos de Trabalho',
      description: 'Grupos técnicos e comitês especializados',
      categories: ['farmacotecnica', 'farmacovigilancia', 'pesquisa_clinica', 'inspecao'],
      participants: ['industria', 'academia', 'reguladores', 'sociedades_cientificas']
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Industrial Segmentation - Starting request');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { action, entityType, entityId, segmentFilter, matchingCriteria } = await req.json();
    logStep('Request parameters', { action, entityType, segmentFilter });

    let results = {};

    switch (action) {
      case 'get_segments':
        results = await getIndustrialSegments(segmentFilter);
        break;
      case 'classify_entity':
        results = await classifyEntity(supabase, entityType, entityId);
        break;
      case 'find_specialized_matches':
        results = await findSpecializedMatches(supabase, matchingCriteria);
        break;
      case 'get_segment_requirements':
        results = await getSegmentRequirements(segmentFilter);
        break;
      case 'validate_certifications':
        results = await validateCertifications(supabase, entityId, segmentFilter);
        break;
      default:
        throw new Error('Invalid action');
    }

    logStep('Industrial segmentation completed', { action, resultsCount: Object.keys(results).length });

    return new Response(JSON.stringify({
      success: true,
      action,
      results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('Error in industrial segmentation', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getIndustrialSegments(filter?: string) {
  logStep('Getting industrial segments', { filter });
  
  if (filter && PHARMACEUTICAL_SEGMENTS[filter as keyof typeof PHARMACEUTICAL_SEGMENTS]) {
    return {
      segment: filter,
      details: PHARMACEUTICAL_SEGMENTS[filter as keyof typeof PHARMACEUTICAL_SEGMENTS]
    };
  }
  
  return {
    all_segments: PHARMACEUTICAL_SEGMENTS,
    segment_count: Object.keys(PHARMACEUTICAL_SEGMENTS).length
  };
}

async function classifyEntity(supabase: any, entityType: string, entityId: string) {
  logStep('Classifying entity', { entityType, entityId });
  
  // Buscar entidade no banco
  let entityData;
  let tableName = '';
  
  switch (entityType) {
    case 'laboratory':
      tableName = 'laboratories';
      break;
    case 'company':
      tableName = 'companies';
      break;
    case 'consultant':
      tableName = 'consultants';
      break;
    default:
      throw new Error('Invalid entity type');
  }
  
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', entityId)
    .single();
    
  if (error) throw error;
  entityData = data;
  
  // Classificar baseado nos dados
  const classification = classifyByAttributes(entityData, entityType);
  
  // Salvar classificação
  await supabase
    .from(`${tableName}`)
    .update({
      industrial_segment: classification.segment,
      subsegment: classification.subsegment,
      specializations: classification.specializations,
      updated_at: new Date().toISOString()
    })
    .eq('id', entityId);
    
  return {
    entity_id: entityId,
    entity_type: entityType,
    classification,
    recommended_matches: classification.recommended_matches
  };
}

function classifyByAttributes(entityData: any, entityType: string) {
  logStep('Classifying by attributes', { entityType });
  
  const certifications = entityData.certifications || [];
  const specializations = entityData.expertise_area || entityData.specialty || [];
  const equipment = entityData.equipment_list || [];
  
  let segment = '';
  let subsegment = '';
  let recommendedMatches: string[] = [];
  
  if (entityType === 'laboratory') {
    // Classificar laboratórios
    if (certifications.includes('ANVISA_BQV') || specializations.includes('bioequivalencia')) {
      segment = 'laboratories';
      subsegment = 'bqv';
      recommendedMatches = ['pharmaceutical_companies', 'regulatory_consultants'];
    } else if (certifications.includes('ANVISA_EQFAR') || specializations.includes('equivalencia_farmaceutica')) {
      segment = 'laboratories';
      subsegment = 'eqfar';
      recommendedMatches = ['pharmaceutical_companies', 'generic_manufacturers'];
    } else if (certifications.includes('GCP') || specializations.includes('pesquisa_clinica')) {
      segment = 'laboratories';
      subsegment = 'clinical_research';
      recommendedMatches = ['pharmaceutical_companies', 'biotech_companies'];
    } else {
      segment = 'laboratories';
      subsegment = 'analytical';
      recommendedMatches = ['pharmaceutical_companies', 'contract_manufacturers'];
    }
  } else if (entityType === 'company') {
    // Classificar empresas
    if (specializations.includes('principios_ativos') || specializations.includes('api_manufacturing')) {
      segment = 'suppliers';
      subsegment = 'raw_materials';
      recommendedMatches = ['pharmaceutical_companies', 'analytical_labs'];
    } else if (specializations.includes('equipamentos') || specializations.includes('manufacturing_equipment')) {
      segment = 'suppliers';
      subsegment = 'equipment';
      recommendedMatches = ['pharmaceutical_companies', 'contract_manufacturers'];
    } else {
      segment = 'companies';
      subsegment = 'pharmaceutical';
      recommendedMatches = ['laboratories', 'suppliers', 'consultants'];
    }
  } else if (entityType === 'consultant') {
    // Classificar consultores
    if (specializations.includes('regulatory') || specializations.includes('assuntos_regulatorios')) {
      segment = 'consultants';
      subsegment = 'regulatory';
      recommendedMatches = ['pharmaceutical_companies', 'laboratories'];
    } else if (specializations.includes('qualidade') || specializations.includes('quality_assurance')) {
      segment = 'consultants';
      subsegment = 'quality';
      recommendedMatches = ['pharmaceutical_companies', 'manufacturing_sites'];
    } else {
      segment = 'consultants';
      subsegment = 'manufacturing';
      recommendedMatches = ['pharmaceutical_companies', 'equipment_suppliers'];
    }
  }
  
  return {
    segment,
    subsegment,
    specializations,
    confidence_score: calculateConfidenceScore(certifications, specializations, equipment),
    recommended_matches: recommendedMatches
  };
}

function calculateConfidenceScore(certifications: string[], specializations: string[], equipment: string[]): number {
  let score = 0;
  
  // Certificações aumentam confiança
  score += certifications.length * 20;
  
  // Especializações específicas aumentam confiança
  score += specializations.length * 15;
  
  // Equipamentos específicos aumentam confiança
  score += equipment.length * 10;
  
  // Normalizar para 0-100
  return Math.min(100, score);
}

async function findSpecializedMatches(supabase: any, criteria: any) {
  logStep('Finding specialized matches', criteria);
  
  const { entityType, segment, subsegment, location, capabilities } = criteria;
  
  // Buscar matches baseado na segmentação industrial
  const matches = [];
  
  // Buscar laboratórios especializados
  if (segment === 'laboratories' || !segment) {
    const { data: labs } = await supabase
      .from('laboratories')
      .select('*')
      .ilike('specializations', `%${subsegment || ''}%`)
      .ilike('location', `%${location || ''}%`)
      .limit(10);
      
    matches.push(...(labs || []).map((lab: any) => ({
      ...lab,
      entity_type: 'laboratory',
      match_reason: `Laboratório especializado em ${subsegment || 'análises farmacêuticas'}`
    })));
  }
  
  // Buscar fornecedores especializados
  if (segment === 'suppliers' || !segment) {
    const { data: companies } = await supabase
      .from('companies')
      .select('*')
      .contains('expertise_area', [subsegment])
      .ilike('city', `%${location || ''}%`)
      .limit(10);
      
    matches.push(...(companies || []).map((company: any) => ({
      ...company,
      entity_type: 'supplier',
      match_reason: `Fornecedor especializado em ${subsegment || 'produtos farmacêuticos'}`
    })));
  }
  
  // Buscar consultores especializados
  if (segment === 'consultants' || !segment) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_type', 'consultant')
      .limit(10);
      
    matches.push(...(profiles || []).map((profile: any) => ({
      ...profile,
      entity_type: 'consultant',
      match_reason: `Consultor especializado em ${subsegment || 'consultoria farmacêutica'}`
    })));
  }
  
  // Calcular scores de compatibilidade
  const scoredMatches = matches.map(match => ({
    ...match,
    compatibility_score: calculateCompatibilityScore(match, criteria),
    segment_alignment: calculateSegmentAlignment(match, criteria)
  }));
  
  // Ordenar por score
  scoredMatches.sort((a, b) => b.compatibility_score - a.compatibility_score);
  
  return {
    matches: scoredMatches.slice(0, 20),
    total_found: scoredMatches.length,
    search_criteria: criteria
  };
}

function calculateCompatibilityScore(match: any, criteria: any): number {
  let score = 0;
  
  // Alinhamento de segmento
  if (match.industrial_segment === criteria.segment) score += 30;
  if (match.subsegment === criteria.subsegment) score += 25;
  
  // Localização
  if (match.location?.toLowerCase().includes(criteria.location?.toLowerCase() || '')) score += 20;
  
  // Capacidades
  const matchCapabilities = match.specializations || match.expertise_area || [];
  const requiredCapabilities = criteria.capabilities || [];
  const capabilityMatch = requiredCapabilities.filter((cap: string) => 
    matchCapabilities.some((mc: string) => mc.toLowerCase().includes(cap.toLowerCase()))
  ).length;
  score += (capabilityMatch / Math.max(1, requiredCapabilities.length)) * 25;
  
  return Math.min(100, score);
}

function calculateSegmentAlignment(match: any, criteria: any): string {
  const segment = match.industrial_segment || 'unknown';
  const subsegment = match.subsegment || 'general';
  
  if (segment === criteria.segment && subsegment === criteria.subsegment) {
    return 'perfect';
  } else if (segment === criteria.segment) {
    return 'good';
  } else {
    return 'partial';
  }
}

async function getSegmentRequirements(segment: string) {
  logStep('Getting segment requirements', { segment });
  
  const segmentData = PHARMACEUTICAL_SEGMENTS[segment as keyof typeof PHARMACEUTICAL_SEGMENTS];
  if (!segmentData) {
    throw new Error('Invalid segment');
  }
  
  return {
    segment,
    requirements: segmentData,
    compliance_checklist: generateComplianceChecklist(segment),
    recommended_certifications: getRecommendedCertifications(segment)
  };
}

function generateComplianceChecklist(segment: string): string[] {
  const checklists = {
    laboratories: [
      'Certificações ANVISA válidas',
      'Sistema de qualidade implementado',
      'Calibração de equipamentos em dia',
      'Pessoal qualificado e treinado',
      'Contratos de terceirização formalizados'
    ],
    suppliers: [
      'Registro na ANVISA como fornecedor',
      'Certificados de análise atualizados',
      'Sistema de rastreabilidade implementado',
      'Auditorias de qualidade realizadas',
      'Logística adequada para produtos farmacêuticos'
    ],
    consultants: [
      'Certificações profissionais válidas',
      'Experiência comprovada no setor',
      'Conhecimento da regulamentação atualizada',
      'Histórico de projetos bem-sucedidos',
      'Seguro de responsabilidade profissional'
    ]
  };
  
  return checklists[segment as keyof typeof checklists] || [];
}

function getRecommendedCertifications(segment: string): string[] {
  const certifications = {
    laboratories: ['ISO17025', 'BPL', 'GCP', 'ANVISA_TERCEIRIZADA'],
    suppliers: ['GMP', 'ISO9001', 'FDA_DMF', 'CEP'],
    consultants: ['RAC', 'RAPS', 'ASQ_CQE', 'Six_Sigma']
  };
  
  return certifications[segment as keyof typeof certifications] || [];
}

async function validateCertifications(supabase: any, entityId: string, segment: string) {
  logStep('Validating certifications', { entityId, segment });
  
  // Buscar entidade
  const { data: entity } = await supabase
    .from('companies')
    .select('certifications, name')
    .eq('id', entityId)
    .single();
    
  if (!entity) {
    throw new Error('Entity not found');
  }
  
  const requiredCerts = getRecommendedCertifications(segment);
  const entityCerts = entity.certifications || [];
  
  const validation = {
    entity_name: entity.name,
    segment,
    required_certifications: requiredCerts,
    current_certifications: entityCerts,
    missing_certifications: requiredCerts.filter(cert => !entityCerts.includes(cert)),
    compliance_score: (entityCerts.filter((cert: string) => requiredCerts.includes(cert)).length / requiredCerts.length) * 100,
    recommendations: []
  };
  
  // Gerar recomendações
  if (validation.missing_certifications.length > 0) {
    validation.recommendations.push(`Obter certificações faltantes: ${validation.missing_certifications.join(', ')}`);
  }
  
  if (validation.compliance_score < 50) {
    validation.recommendations.push('Revisar estratégia de certificações para o segmento');
  }
  
  return validation;
}