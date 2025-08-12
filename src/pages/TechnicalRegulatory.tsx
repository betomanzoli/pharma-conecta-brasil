
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const TechnicalRegulatory = () => {
  const [productType, setProductType] = useState('');
  const [regulatoryBody, setRegulatoryBody] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysis(`
# Análise Técnico-Regulatória - ${productType}

## Estratégia Regulatória Recomendada
### Órgão: ${regulatoryBody}

## Classificação do Produto
- Categoria: Medicamento ${productType}
- Via regulatória: Registro por comparabilidade
- Tempo estimado: 12-18 meses

## Documentação Necessária
### CTD Módulo 1 (Regional)
- Formulário de petição
- Bula e rotulagem
- Informações administrativas

### CTD Módulo 2 (Resumos)
- Resumo de qualidade
- Resumo não-clínico
- Resumo clínico

### CTD Módulo 3 (Qualidade)
- Substância ativa
- Produto farmacêutico
- Materiais de embalagem

## Cronograma de Submissão
1. **Mês 1-3**: Preparação da documentação
2. **Mês 4**: Submissão inicial
3. **Mês 5-6**: Screening ANVISA
4. **Mês 7-12**: Análise técnica
5. **Mês 13-15**: Questionamentos e respostas
6. **Mês 16-18**: Decisão final

## Marcos Críticos
- ✅ Definição da estratégia regulatória
- ⚠️ Preparação do dossiê CTD
- ⚠️ Validação analítica
- ⚠️ Estudos de estabilidade
- ⚠️ Inspeção GMP (se aplicável)

## Riscos Identificados
- Questionamentos sobre comparabilidade
- Exigência de estudos adicionais
- Problemas na cadeia de suprimentos
- Mudanças na legislação

## Próximos Passos
1. Validar estratégia com especialistas
2. Iniciar preparação do dossiê
3. Agendar reunião pré-submissão
4. Preparar plano de respostas
      `);
    } catch (error) {
      console.error('Error analyzing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Técnico-Regulatório IA</h1>
                <p className="text-muted-foreground">
                  Compliance ANVISA e estratégia regulatória
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Informações do Produto</span>
                </CardTitle>
                <CardDescription>
                  Dados necessários para análise regulatória
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="productType">Tipo de Produto</Label>
                  <Select value={productType} onValueChange={setProductType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="generico">Medicamento Genérico</SelectItem>
                      <SelectItem value="similar">Medicamento Similar</SelectItem>
                      <SelectItem value="novo">Medicamento Novo</SelectItem>
                      <SelectItem value="biologico">Medicamento Biológico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="regulatory">Órgão Regulatório</Label>
                  <Select value={regulatoryBody} onValueChange={setRegulatoryBody}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o órgão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ANVISA">ANVISA (Brasil)</SelectItem>
                      <SelectItem value="FDA">FDA (EUA)</SelectItem>
                      <SelectItem value="EMA">EMA (Europa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descrição do Produto</Label>
                  <Textarea
                    id="description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Descreva o produto, indicações, forma farmacêutica..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleAnalyze} disabled={loading || !productType} className="w-full">
                  {loading ? 'Analisando...' : 'Gerar Estratégia Regulatória'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estratégia Regulatória</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>A estratégia regulatória aparecerá aqui</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default TechnicalRegulatory;
