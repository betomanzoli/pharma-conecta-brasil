
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, Target, DollarSign, Users } from 'lucide-react';

const BusinessStrategist = () => {
  const [productName, setProductName] = useState('');
  const [marketDescription, setMarketDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysis(`
# Análise Estratégica de Negócios - ${productName}

## Oportunidades de Mercado
- Crescimento estimado de 15-20% nos próximos 3 anos
- Demanda crescente por soluções inovadoras
- Baixa penetração em mercados emergentes

## Análise SWOT
### Forças
- Inovação tecnológica
- Expertise regulatória
- Rede de distribuição estabelecida

### Fraquezas
- Alto custo inicial
- Dependência regulatória
- Concorrência acirrada

### Oportunidades
- Expansão internacional
- Parcerias estratégicas
- Novos segmentos de mercado

### Ameaças
- Mudanças regulatórias
- Entrada de novos players
- Pressão sobre preços

## Recomendações Estratégicas
1. Desenvolver parcerias com distribuidores locais
2. Investir em P&D para diferenciação
3. Criar programa de acesso ao mercado
4. Estabelecer pricing strategy competitiva
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
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 text-white">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Estrategista de Negócios IA</h1>
                <p className="text-muted-foreground">
                  Análise estratégica e oportunidades de mercado farmacêutico
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Análise de Mercado</span>
                </CardTitle>
                <CardDescription>
                  Forneça informações sobre o produto e mercado para análise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="product">Nome do Produto</Label>
                  <Input
                    id="product"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex: Novo medicamento oncológico"
                  />
                </div>
                <div>
                  <Label htmlFor="market">Descrição do Mercado</Label>
                  <Textarea
                    id="market"
                    value={marketDescription}
                    onChange={(e) => setMarketDescription(e.target.value)}
                    placeholder="Descreva o mercado-alvo, concorrentes, tamanho..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleAnalyze} disabled={loading || !productName} className="w-full">
                  {loading ? 'Analisando...' : 'Gerar Análise Estratégica'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultado da Análise</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>A análise estratégica aparecerá aqui</p>
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

export default BusinessStrategist;
