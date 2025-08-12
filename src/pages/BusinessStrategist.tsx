
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, Target, DollarSign, Users } from 'lucide-react';
import { useAIBusinessStrategist } from '@/hooks/useAIBusinessStrategist';
import { useToast } from '@/hooks/use-toast';

const BusinessStrategist = () => {
  const [productName, setProductName] = useState('');
  const [marketDescription, setMarketDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const { analyzeBusinessCase, loading } = useAIBusinessStrategist();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    try {
      const result = await analyzeBusinessCase({
        opportunity: productName,
        product_type: 'Produto farmacêutico',
        target_market: marketDescription,
        competitors: '',
        differentiation: '',
        investment_range: '',
        timeframe: '',
        risks: ''
      });
      
      if (result?.output_md) {
        setAnalysis(result.output_md);
      } else {
        toast({
          title: "Erro na análise",
          description: "Conteúdo vazio retornado. Verifique os dados ou tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao analisar:', error);
      toast({
        title: "Erro inesperado",
        description: "Falha na comunicação com o servidor.",
        variant: "destructive"
      });
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
