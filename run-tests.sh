#!/bin/bash

echo "🧪 Executando testes do PharmaConnect Brasil..."
echo "============================================="

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para executar testes
run_test() {
    local test_file=$1
    local test_name=$2
    
    echo -e "${YELLOW}Executando: $test_name${NC}"
    
    if deno test --allow-net --allow-env "$test_file"; then
        echo -e "${GREEN}✅ $test_name - PASSOU${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name - FALHOU${NC}"
        return 1
    fi
}

# Contador de testes
total_tests=0
passed_tests=0

# Executar testes das Edge Functions
echo "📋 Testando Edge Functions..."

if [ -f "supabase/functions/ai-embeddings/test.ts" ]; then
    ((total_tests++))
    if run_test "supabase/functions/ai-embeddings/test.ts" "AI Embeddings"; then
        ((passed_tests++))
    fi
fi

if [ -f "supabase/functions/ai-matching-enhanced/test.ts" ]; then
    ((total_tests++))
    if run_test "supabase/functions/ai-matching-enhanced/test.ts" "AI Matching Enhanced"; then
        ((passed_tests++))
    fi
fi

# Executar testes de integração
echo ""
echo "🔗 Testando Integração..."

if [ -f "tests/integration.test.ts" ]; then
    ((total_tests++))
    if run_test "tests/integration.test.ts" "Testes de Integração"; then
        ((passed_tests++))
    fi
fi

# Resumo final
echo ""
echo "============================================="
echo "📊 RESUMO DOS TESTES"
echo "============================================="
echo "Total de testes: $total_tests"
echo "Testes que passaram: $passed_tests"
echo "Testes que falharam: $((total_tests - passed_tests))"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    echo "O sistema de AI Matching está funcionando corretamente."
    exit 0
else
    echo -e "${RED}⚠️  ALGUNS TESTES FALHARAM${NC}"
    echo "Verifique os erros acima e corrija antes de fazer deploy."
    exit 1
fi