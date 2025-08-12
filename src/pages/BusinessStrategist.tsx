
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type AnalysisType = 'business_case' | 'swot_analysis' | 'market_analysis' | 'competitive_analysis';

const BusinessStrategist: React.FC = () => {
  const { toast } = useToast();
  const [analysisType, setAnalysisType] = useState<AnalysisType>('business_case');

  // Campos simples para compor product_data
  const [productType, setProductType] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [differentiation, setDifferentiation] = useState('');

  const [outputMd, setOutputMd] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = 'Estrategista de Negócios | PharmaConnect'; }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const product_data = {
        product_type: productType,
        target_market: targetMarket,
        competitors,
        differentiation,
      };
      const { data, error } = await supabase.functions.invoke('ai-business-strategist', {
        body: { analysis_type: analysisType, product_data, project_id: null },
      });
      if (error) throw error;
      const md: string = data?.analysis || data?.output?.output_md || '';
      setOutputMd(md);
      toast({ title: 'Análise gerada', description: 'Resultado disponível abaixo.' });
    } catch (err: any) {
      toast({ title: 'Falha na análise', description: err?.message || 'Tente novamente.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Estrategista de Negócios (IA)</h1>
          <p className="text-muted-foreground mb-6">Gere business case, SWOT, análise de mercado ou competitiva.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Tipo de Análise</Label>
                    <Select value={analysisType} onValueChange={(v) => setAnalysisType(v as AnalysisType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business_case">Business Case</SelectItem>
                        <SelectItem value="swot_analysis">SWOT</SelectItem>
                        <SelectItem value="market_analysis">Análise de Mercado</SelectItem>
                        <SelectItem value="competitive_analysis">Análise Competitiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tipo de Produto</Label>
                    <Input value={productType} onChange={(e) => setProductType(e.target.value)} placeholder="Ex.: Genérico oral" />
                  </div>
                  <div>
                    <Label>Mercado Alvo</Label>
                    <Input value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)} placeholder="Ex.: Brasil, classe terapêutica X" />
                  </div>
                  <div>
                    <Label>Competidores</Label>
                    <Textarea value={competitors} onChange={(e) => setCompetitors(e.target.value)} rows={3} placeholder="Liste os principais competidores" />
                  </div>
                  <div>
                    <Label>Diferenciação</Label>
                    <Textarea value={differentiation} onChange={(e) => setDifferentiation(e.target.value)} rows={3} placeholder="Proposta de valor, diferenciais" />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Gerando...' : 'Gerar Análise'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultado</CardTitle>
              </CardHeader>
              <CardContent>
                {outputMd ? (
                  <article className="prose prose-sm md:prose dark:prose-invert max-w-none whitespace-pre-wrap max-h-96 overflow-y-auto p-4 bg-muted rounded-lg">
                    {outputMd}
                  </article>
                ) : (
                  <p className="text-muted-foreground">O resultado aparecerá aqui.</p>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BusinessStrategist;
