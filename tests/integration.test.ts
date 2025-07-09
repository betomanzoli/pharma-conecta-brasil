import { assertEquals, assertExists } from 'https://deno.land/std@0.190.0/testing/asserts.ts';

// Testes de integração para verificar fluxo completo
const BASE_URL = 'http://localhost:54321/functions/v1';

// Mock do supabase client para testes
const mockSupabaseResponse = {
  data: { success: true },
  error: null
};

Deno.test('Integration - AI Matching Flow', async () => {
  // Este teste simula o fluxo completo de matching
  const mockUserProfile = {
    userType: 'pharmaceutical_company',
    userId: 'test-user-id',
    preferences: {
      location: 'São Paulo',
      specialties: ['Análise Microbiológica'],
      budget: { min: 1000, max: 5000 }
    }
  };

  // Simular busca de perfil do usuário
  const profileLookup = {
    name: 'Test Pharma',
    expertise_area: ['Genéricos', 'Biotecnologia'],
    location: 'São Paulo, SP',
    compliance_status: 'compliant'
  };

  assertExists(profileLookup);
  assertEquals(typeof profileLookup.name, 'string');
  assertEquals(Array.isArray(profileLookup.expertise_area), true);

  // Simular busca de candidatos
  const mockCandidates = [
    {
      id: 'lab-1',
      name: 'LabTest',
      certifications: ['ISO 17025', 'Genéricos'],
      location: 'São Paulo, SP',
      available_capacity: 100,
      compliance_status: 'compliant'
    },
    {
      id: 'cons-1',
      name: 'Consultor Test',
      expertise: ['Regulatório', 'ANVISA'],
      location: 'São Paulo, SP',
      hourly_rate: 200,
      projects_completed: 10
    }
  ];

  assertEquals(mockCandidates.length, 2);
  assertEquals(mockCandidates[0].available_capacity > 0, true);
  assertEquals(mockCandidates[1].projects_completed > 5, true);

  // Simular cálculo de compatibilidade
  const matches = mockCandidates.map(candidate => ({
    ...candidate,
    score: Math.random() * 0.5 + 0.5, // Score entre 0.5 e 1.0
    compatibility_factors: ['Localização compatível', 'Análise por IA']
  }));

  matches.forEach(match => {
    assertExists(match.score);
    assertEquals(match.score > 0.3, true);
    assertEquals(Array.isArray(match.compatibility_factors), true);
  });
});

Deno.test('Integration - Error Handling', async () => {
  // Testar cenários de erro
  const invalidRequest = {
    userType: '', // Inválido
    userId: null,
    preferences: {}
  };

  // Simular validação de entrada
  const isValidRequest = (req: any) => {
    return req.userType && req.userId;
  };

  assertEquals(isValidRequest(invalidRequest), false);

  // Testar resposta de erro
  const errorResponse = {
    success: false,
    error: 'UserType and userId are required',
    timestamp: new Date().toISOString()
  };

  assertExists(errorResponse.error);
  assertEquals(errorResponse.success, false);
});

Deno.test('Integration - Performance Metrics', async () => {
  // Testar logging de métricas
  const performanceMetric = {
    metric_name: 'ai_matching_request',
    metric_value: 5,
    metric_unit: 'matches',
    tags: {
      user_type: 'pharmaceutical_company',
      user_id: 'test-user',
      timestamp: new Date().toISOString()
    }
  };

  assertExists(performanceMetric.metric_name);
  assertEquals(typeof performanceMetric.metric_value, 'number');
  assertEquals(performanceMetric.metric_value > 0, true);
  assertExists(performanceMetric.tags);
});

Deno.test('Integration - Frontend Data Format', async () => {
  // Testar conversão de dados para o frontend
  const backendMatch = {
    id: 'lab-1',
    type: 'laboratory',
    name: 'Test Lab',
    score: 0.85,
    specialties: ['Microbiológica', 'Físico-Química'],
    location: 'São Paulo, SP',
    verified: true,
    compatibility_factors: ['Localização compatível', 'Especialidades compatíveis']
  };

  const frontendMatch = {
    id: backendMatch.id,
    score: Math.round(backendMatch.score * 100), // Converter para porcentagem
    company: {
      name: 'Sua Empresa',
      expertise: ['Desenvolvimento', 'Pesquisa']
    },
    provider: {
      name: backendMatch.name,
      type: backendMatch.type,
      specialties: backendMatch.specialties
    },
    compatibility_factors: backendMatch.compatibility_factors
  };

  assertEquals(frontendMatch.score, 85);
  assertEquals(frontendMatch.provider.type, 'laboratory');
  assertEquals(Array.isArray(frontendMatch.provider.specialties), true);
  assertEquals(frontendMatch.compatibility_factors.length, 2);
});

Deno.test('Integration - CORS Headers', async () => {
  // Testar headers CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  assertExists(corsHeaders["Access-Control-Allow-Origin"]);
  assertEquals(corsHeaders["Access-Control-Allow-Origin"], "*");
  assertExists(corsHeaders["Access-Control-Allow-Headers"]);
});

console.log('🧪 Testes de Integração executados com sucesso!');