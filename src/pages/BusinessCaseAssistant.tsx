
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAIBusinessStrategist } from '@/hooks/useAIBusinessStrategist';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import { useToast } from '@/hooks/use-toast';

const BusinessCaseAssistant = () => {
  const { analyzeBusinessCase, loading } = useAIBusinessStrategist();
  const { redirectToChat } = useMasterChatBridge();
  const { toast } = useToast();

  const [opportunity, setOpportunity] = useState('');
  const [productType, setProductType] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [differentiation, setDifferentiation] = useState('');
  const [investmentRange, setInvestmentRange] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [risks, setRisks] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Business Case Assistant | PharmaConnect';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await analyzeBusinessCase({
      opportunity,
      product_type: productType,
      target_market: targetMarket,
      competitors,
      differentiation,
      investment_range: investmentRange,
      timeframe,
      risks,
    });
    setOutputMd(res?.output_md ?? null);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Business Case Assistant</h1>
          <p className="text-muted-foreground mb-6">Gere business cases detalhados para oportunidades farmacêuticas.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Oportunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="opportunity">Oportunidade</Label>
                    <Textarea id="opportunity" value={opportunity} onChange={(e) => setOpportunity(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="productType">Tipo de Produto</Label>
                    <Input id="productType" value={productType} onChange={(e) => setProductType(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="targetMarket">Mercado Alvo</Label>
                    <Input id="targetMarket" value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="competitors">Concorrentes</Label>
                    <Textarea id="competitors" value={competitors} onChange={(e) => setCompetitors(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="differentiation">Diferenciação</Label>
                    <Textarea id="differentiation" value={differentiation} onChange={(e) => setDifferentiation(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="investmentRange">Faixa de Investimento</Label>
                    <Input id="investmentRange" value={investmentRange} onChange={(e) => setInvestmentRange(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="timeframe">Cronograma</Label>
                    <Input id="timeframe" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="risks">Riscos</Label>
                    <Textarea id="risks" value={risks} onChange={(e) => setRisks(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Analisando...' : 'Gerar Business Case'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Case Gerado</CardTitle>
              </CardHeader>
              <CardContent>
                {outputMd ? (
                  <>
                    <article className="prose prose-sm md:prose dark:prose-invert max-w-none whitespace-pre-wrap max-h-96 overflow-y-auto">
                      {outputMd}
                    </article>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const content = `Via agente: Business Case Assistant\nOportunidade: ${opportunity || '-'}\n\n${outputMd}`;
                          redirectToChat(content, { metadata: { module: 'business_case' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">O business case gerado aparecerá aqui.</p>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BusinessCaseAssistant;
