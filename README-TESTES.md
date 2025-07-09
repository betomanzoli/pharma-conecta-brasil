# 🧪 Sistema de Testes - PharmaConnect Brasil

## Visão Geral

Este documento descreve o sistema de testes implementado para validar as funcionalidades críticas do PharmaConnect Brasil, especialmente o **AI Matching Engine** que é o coração da plataforma.

## Estrutura de Testes

### 1. Testes Unitários das Edge Functions

#### AI Embeddings (`supabase/functions/ai-embeddings/test.ts`)
- ✅ Testa cálculos de similaridade de cosseno
- ✅ Valida criação de textos de perfil
- ✅ Verifica formatação de dados para diferentes tipos de usuário

#### AI Matching Enhanced (`supabase/functions/ai-matching-enhanced/test.ts`)
- ✅ Testa cálculos de compatibilidade reais
- ✅ Valida cenários de alta e baixa compatibilidade
- ✅ Verifica estrutura de resposta da API

### 2. Testes de Integração (`tests/integration.test.ts`)
- ✅ Testa fluxo completo de matching
- ✅ Valida tratamento de erros
- ✅ Verifica conversão de dados frontend-backend
- ✅ Testa headers CORS

## Como Executar os Testes

### Pré-requisitos
```bash
# Instalar Deno (se não estiver instalado)
curl -fsSL https://deno.land/x/install/install.sh | sh

# Dar permissão de execução ao script
chmod +x run-tests.sh
```

### Executar Todos os Testes
```bash
./run-tests.sh
```

### Executar Testes Individuais
```bash
# Testes AI Embeddings
deno test --allow-net --allow-env supabase/functions/ai-embeddings/test.ts

# Testes AI Matching
deno test --allow-net --allow-env supabase/functions/ai-matching-enhanced/test.ts

# Testes de Integração
deno test --allow-net --allow-env tests/integration.test.ts
```

## Cobertura de Testes

### ✅ Funcionalidades Testadas
- **Similaridade de Cosseno**: Cálculos matemáticos para compatibilidade
- **Criação de Perfis**: Transformação de dados em texto para embeddings
- **Cálculo de Compatibilidade**: Algoritmo principal de matching
- **Validação de Entrada**: Verificação de dados de entrada
- **Tratamento de Erros**: Cenários de falha e recuperação
- **Integração Frontend-Backend**: Conversão de formatos de dados

### 🔄 Cenários de Teste

#### Alta Compatibilidade (Score > 90%)
- Mesma localização
- Especialidades totalmente compatíveis
- Certificações ANVISA
- Capacidade disponível

#### Compatibilidade Média (Score 50-90%)
- Localização no mesmo estado
- Algumas especialidades compatíveis
- Certificações parciais

#### Baixa Compatibilidade (Score < 50%)
- Localizações diferentes
- Especialidades incompatíveis
- Sem certificações relevantes

## Validação de Qualidade

### Métricas de Qualidade
- **Precisão**: Matches relevantes devem ter score > 70%
- **Cobertura**: Sistema deve encontrar pelo menos 3 matches por busca
- **Performance**: Resposta em menos de 5 segundos
- **Consistência**: Mesma entrada deve gerar resultados similares

### Critérios de Aprovação
- ✅ Todos os testes unitários passando
- ✅ Testes de integração funcionando
- ✅ Cálculos matemáticos precisos
- ✅ Tratamento de erros robusto

## Próximos Passos

### Testes Avançados (Planejados)
1. **Testes de Performance**
   - Carga com 1000+ perfis simultâneos
   - Tempo de resposta sob pressão
   - Uso de memória e CPU

2. **Testes de Regressão**
   - Comparação de resultados após mudanças
   - Validação de compatibilidade com versões anteriores

3. **Testes de ML**
   - Validação de modelos de embeddings
   - Testes com dados reais vs. sintéticos
   - Métricas de qualidade do matching

### Automação
- Integração com CI/CD
- Execução automática a cada deploy
- Relatórios de cobertura automáticos

## Troubleshooting

### Problemas Comuns

#### Erro de API Key OpenAI
```bash
# Configurar variável de ambiente
export OPENAI_API_KEY="sua-chave-aqui"
```

#### Testes falhando por timeout
```bash
# Aumentar timeout do Deno
deno test --allow-net --allow-env --timeout=30000
```

#### Erro de permissões
```bash
# Dar todas as permissões necessárias
deno test --allow-all
```

## Contribuindo

Para adicionar novos testes:

1. **Criar arquivo de teste** na mesma pasta da funcionalidade
2. **Seguir padrão de nomenclatura**: `*.test.ts`
3. **Incluir no script** `run-tests.sh`
4. **Documentar cenários** testados

### Exemplo de Novo Teste
```typescript
Deno.test('Nova Funcionalidade - Cenário Específico', async () => {
  // Arrange
  const input = { /* dados de entrada */ };
  
  // Act
  const result = await minhaFuncao(input);
  
  // Assert
  assertEquals(result.success, true);
  assertExists(result.data);
});
```

---

**🎯 Objetivo**: Garantir que o AI Matching Engine funcione corretamente antes de ir para produção, proporcionando matches precisos e relevantes para os usuários da plataforma farmacêutica.