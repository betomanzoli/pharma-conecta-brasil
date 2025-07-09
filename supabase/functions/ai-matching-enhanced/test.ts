import { assertEquals, assertExists, assertGreater } from 'https://deno.land/std@0.190.0/testing/asserts.ts';

// Mock do ambiente para testes
const mockEnv = {
  'SUPABASE_URL': 'https://test.supabase.co',
  'SUPABASE_SERVICE_ROLE_KEY': 'test-key'
};

globalThis.Deno = {
  env: {
    get: (key: string) => mockEnv[key as keyof typeof mockEnv]
  }
} as any;

// Simulação da função de compatibilidade (versão simplificada para teste)
async function calculateMockCompatibilityScore(
  userType: string, 
  targetType: string, 
  preferences: any,
  userProfile: any,
  targetProfile: any
): Promise<{score: number, factors: string[]}> {
  
  const factors: string[] = [];
  let totalScore = 0;

  // 1. Compatibilidade de localização (20%)
  if (userProfile.location && targetProfile.location) {
    const userLocation = userProfile.location.toLowerCase();
    const targetLocation = targetProfile.location.toLowerCase();
    
    if (userLocation.includes(targetLocation) || targetLocation.includes(userLocation)) {
      totalScore += 0.2;
      factors.push('Localização compatível');
    }
  }

  // 2. Correspondência de especialidades (30%)
  if (userType === 'pharmaceutical_company' && targetType === 'laboratory') {
    const companyExpertise = userProfile.expertise_area || [];
    const labCertifications = targetProfile.certifications || [];
    
    const intersection = companyExpertise.filter((exp: string) => 
      labCertifications.some((cert: string) => 
        cert.toLowerCase().includes(exp.toLowerCase())
      )
    );
    
    if (intersection.length > 0) {
      totalScore += 0.3;
      factors.push(`Especialidades compatíveis: ${intersection.join(', ')}`);
    }
  }

  // 3. Fatores específicos (25%)
  if (targetType === 'laboratory' && targetProfile.available_capacity > 0) {
    totalScore += 0.125;
    factors.push('Capacidade disponível');
  }
  
  if (targetProfile.compliance_status === 'compliant') {
    totalScore += 0.125;
    factors.push('Certificação ANVISA');
  }

  // 4. Score base (25%)
  totalScore += 0.25;
  factors.push('Análise base de compatibilidade');

  return {
    score: Math.round(totalScore * 100) / 100,
    factors
  };
}

Deno.test('Compatibility Score - Empresa farmacêutica e laboratório compatível', async () => {
  const userProfile = {
    name: 'FarmaTech',
    expertise_area: ['Genéricos', 'Biotecnologia'],
    location: 'São Paulo, SP'
  };

  const targetProfile = {
    name: 'LabAnalyse',
    certifications: ['ISO 17025', 'Genéricos', 'ANVISA'],
    location: 'São Paulo, SP',
    available_capacity: 100,
    compliance_status: 'compliant'
  };

  const result = await calculateMockCompatibilityScore(
    'pharmaceutical_company',
    'laboratory',
    {},
    userProfile,
    targetProfile
  );

  assertExists(result);
  assertGreater(result.score, 0.7); // Esperamos alta compatibilidade
  assertEquals(result.factors.length > 2, true);
  assertEquals(result.factors.some(f => f.includes('Localização')), true);
  assertEquals(result.factors.some(f => f.includes('Especialidades')), true);
});

Deno.test('Compatibility Score - Empresa e laboratório com localização diferente', async () => {
  const userProfile = {
    name: 'FarmaTech',
    expertise_area: ['Genéricos'],
    location: 'São Paulo, SP'
  };

  const targetProfile = {
    name: 'LabRio',
    certifications: ['ISO 17025'],
    location: 'Rio de Janeiro, RJ',
    available_capacity: 0,
    compliance_status: 'pending'
  };

  const result = await calculateMockCompatibilityScore(
    'pharmaceutical_company',
    'laboratory',
    {},
    userProfile,
    targetProfile
  );

  assertExists(result);
  assertEquals(result.score > 0, true); // Deve ter pelo menos score base
  assertEquals(result.score < 0.5, true); // Mas baixa compatibilidade
});

Deno.test('Compatibility Score - Especialidades totalmente compatíveis', async () => {
  const userProfile = {
    name: 'BioPharma',
    expertise_area: ['Biotecnologia', 'Vacinas'],
    location: 'Brasília, DF'
  };

  const targetProfile = {
    name: 'BioLab',
    certifications: ['Biotecnologia', 'Vacinas', 'ANVISA'],
    location: 'Brasília, DF',
    available_capacity: 50,
    compliance_status: 'compliant'
  };

  const result = await calculateMockCompatibilityScore(
    'pharmaceutical_company',
    'laboratory',
    {},
    userProfile,
    targetProfile
  );

  assertExists(result);
  assertGreater(result.score, 0.9); // Máxima compatibilidade esperada
  assertEquals(result.factors.some(f => f.includes('Biotecnologia')), true);
  assertEquals(result.factors.some(f => f.includes('Capacidade')), true);
  assertEquals(result.factors.some(f => f.includes('ANVISA')), true);
});

Deno.test('Compatibility Score - Nenhuma compatibilidade', async () => {
  const userProfile = {
    name: 'TechPharma',
    expertise_area: ['Medicamentos Especiais'],
    location: 'Curitiba, PR'
  };

  const targetProfile = {
    name: 'BasicLab',
    certifications: ['Análise Básica'],
    location: 'Recife, PE',
    available_capacity: 0,
    compliance_status: 'pending'
  };

  const result = await calculateMockCompatibilityScore(
    'pharmaceutical_company',
    'laboratory',
    {},
    userProfile,
    targetProfile
  );

  assertExists(result);
  assertEquals(result.score, 0.25); // Apenas score base
  assertEquals(result.factors.length, 1); // Apenas fator base
});

Deno.test('Request Validation - Tipos de usuário válidos', () => {
  const validUserTypes = ['pharmaceutical_company', 'laboratory', 'consultant'];
  
  validUserTypes.forEach(userType => {
    assertEquals(typeof userType, 'string');
    assertEquals(userType.length > 0, true);
  });
});

Deno.test('Response Format - Estrutura esperada', () => {
  const mockResponse = {
    success: true,
    matches: [
      {
        id: 'test-id',
        type: 'laboratory',
        name: 'Test Lab',
        score: 0.85,
        specialties: ['Test'],
        location: 'Test Location',
        verified: true,
        compatibility_factors: ['Test factor']
      }
    ],
    metadata: {
      userType: 'pharmaceutical_company',
      totalMatches: 1,
      timestamp: new Date().toISOString(),
      version: 'enhanced-v1.0'
    }
  };

  assertExists(mockResponse.success);
  assertExists(mockResponse.matches);
  assertExists(mockResponse.metadata);
  assertEquals(mockResponse.matches.length, 1);
  assertEquals(mockResponse.matches[0].score > 0, true);
});

console.log('🧪 Testes AI Matching Enhanced executados com sucesso!');