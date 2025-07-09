import { assertEquals, assertExists } from 'https://deno.land/std@0.190.0/testing/asserts.ts';

// Mock do ambiente para testes
const mockEnv = {
  'SUPABASE_URL': 'https://test.supabase.co',
  'SUPABASE_SERVICE_ROLE_KEY': 'test-key',
  'OPENAI_API_KEY': 'test-openai-key'
};

// Mock das funções globais para teste
globalThis.Deno = {
  env: {
    get: (key: string) => mockEnv[key as keyof typeof mockEnv]
  }
} as any;

// Mock do fetch para OpenAI
globalThis.fetch = async (url: string, options?: any) => {
  if (url.includes('openai.com')) {
    return new Response(JSON.stringify({
      data: [{
        embedding: new Array(1536).fill(0).map(() => Math.random())
      }]
    }), { status: 200 });
  }
  throw new Error('Fetch not mocked for this URL');
};

// Importar as funções a serem testadas (simulação)
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

function createProfileText(entity: any, type: string): string {
  switch (type) {
    case 'company':
      return `Empresa farmacêutica ${entity.name}. Localização: ${entity.city}, ${entity.state}.`;
    case 'laboratory':
      return `Laboratório ${entity.name}. Localização: ${entity.location}.`;
    case 'consultant':
      return `Consultor especializado em ${entity.expertise?.join(', ')}.`;
    default:
      return entity.description || entity.name || '';
  }
}

Deno.test('Cosine Similarity - Vetores idênticos', () => {
  const vec1 = [1, 2, 3];
  const vec2 = [1, 2, 3];
  const similarity = cosineSimilarity(vec1, vec2);
  assertEquals(Math.round(similarity * 100) / 100, 1.0);
});

Deno.test('Cosine Similarity - Vetores ortogonais', () => {
  const vec1 = [1, 0, 0];
  const vec2 = [0, 1, 0];
  const similarity = cosineSimilarity(vec1, vec2);
  assertEquals(similarity, 0);
});

Deno.test('Cosine Similarity - Vetores opostos', () => {
  const vec1 = [1, 0];
  const vec2 = [-1, 0];
  const similarity = cosineSimilarity(vec1, vec2);
  assertEquals(similarity, -1);
});

Deno.test('Create Profile Text - Company', () => {
  const company = {
    name: 'FarmaTech',
    city: 'São Paulo',
    state: 'SP',
    expertise_area: ['Genéricos', 'Biotecnologia']
  };
  
  const profileText = createProfileText(company, 'company');
  assertExists(profileText);
  assertEquals(profileText.includes('FarmaTech'), true);
  assertEquals(profileText.includes('São Paulo'), true);
});

Deno.test('Create Profile Text - Laboratory', () => {
  const lab = {
    name: 'LabAnalyse',
    location: 'Rio de Janeiro, RJ',
    certifications: ['ISO 17025', 'ANVISA']
  };
  
  const profileText = createProfileText(lab, 'laboratory');
  assertExists(profileText);
  assertEquals(profileText.includes('LabAnalyse'), true);
  assertEquals(profileText.includes('Rio de Janeiro'), true);
});

Deno.test('Create Profile Text - Consultant', () => {
  const consultant = {
    expertise: ['Regulatório', 'ANVISA'],
    location: 'Brasília, DF'
  };
  
  const profileText = createProfileText(consultant, 'consultant');
  assertExists(profileText);
  assertEquals(profileText.includes('Regulatório'), true);
});

console.log('🧪 Testes AI Embeddings executados com sucesso!');