
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAIBusinessStrategist } from '@/hooks/useAIBusinessStrategist';
import { useAITechRegulatory } from '@/hooks/useAITechRegulatory';
import { useAIAgent } from '@/hooks/useAIAgent';
import { useAICoordinator } from '@/hooks/useAICoordinator';
import { Link } from 'react-router-dom';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
const BusinessCaseAssistant = () => {
  const { analyzeBusinessCase, loading } = useAIBusinessStrategist();
  const { analyzeTechRegulatory } = useAITechRegulatory();
  const { analyzeProject } = useAIAgent();
  const { coordinate } = useAICoordinator();
  const { sendToMasterChat } = useMasterChatBridge();
  const [opportunity, setOpportunity] = useState('');
  const [productType, setProductType] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [differentiation, setDifferentiation] = useState('');
  const [investmentRange, setInvestmentRange] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [risks, setRisks] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);
  const [autoHandoff, setAutoHandoff] = useState(false);

  useEffect(() => {
    document.title = 'Estrategista IA – Business Case | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/estrategista';
    document.head.appendChild(link);
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Business case farmacêutico com IA: SWOT, mercado e ROI.';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(link); document.head.removeChild(meta); };
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

    if (autoHandoff) {
      try {
        await analyzeTechRegulatory({
          product_type: productType,
          target_regions: targetMarket || 'Brasil',
        });
      } catch {}
      try {
        await analyzeProject({
          title: opportunity || `Projeto ${productType || 'Farmacêutico'}`,
          objective: differentiation || '',
          scope: '',
          stakeholders: '',
          risks,
        });
      } catch {}
      try {
        await coordinate({ focus: 'exec_summary', priorities: ['cronograma', 'riscos'] });
      } catch {}
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Estrategista IA – Business Case</h1>
          <p className="text-muted-foreground mb-6">Gere business case, SWOT e insights de mercado com IA.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="opportunity">Oportunidade</Label>
                    <Textarea id="opportunity" value={opportunity} onChange={(e) => setOpportunity(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="productType">Tipo de produto/serviço</Label>
                    <Input id="productType" value={productType} onChange={(e) => setProductType(e.target.value)} placeholder="Ex: genérico oral, biológico, nutracêutico" />
                  </div>
                  <div>
                    <Label htmlFor="targetMarket">Mercado-alvo</Label>
                    <Input id="targetMarket" value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)} placeholder="Ex: Brasil, LATAM" />
                  </div>
                  <div>
                    <Label htmlFor="competitors">Concorrentes</Label>
                    <Textarea id="competitors" value={competitors} onChange={(e) => setCompetitors(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="differentiation">Diferenciais</Label>
                    <Textarea id="differentiation" value={differentiation} onChange={(e) => setDifferentiation(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="investmentRange">Faixa de investimento</Label>
                      <Input id="investmentRange" value={investmentRange} onChange={(e) => setInvestmentRange(e.target.value)} placeholder="Ex: R$ 1–3 mi" />
                    </div>
                    <div>
                      <Label htmlFor="timeframe">Prazo estimado</Label>
                      <Input id="timeframe" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} placeholder="Ex: 12–18 meses" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="risks">Riscos</Label>
                    <Textarea id="risks" value={risks} onChange={(e) => setRisks(e.target.value)} />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="autoHandoff" checked={autoHandoff} onCheckedChange={setAutoHandoff} />
                      <Label htmlFor="autoHandoff">Auto‑handoff (Regulatório → Projeto → Coordenador)</Label>
                    </div>
                    <Button type="submit" disabled={loading}>{loading ? 'Gerando...' : 'Gerar Análise'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultado</CardTitle>
              </CardHeader>
              <CardContent>
                {outputMd ? (
                  <>
                    <article className="prose prose-sm md:prose dark:prose-invert max-w-none whitespace-pre-wrap">
                      {outputMd}
                    </article>
                    <div className="mt-4 space-y-3">
                      <Link
                        to="/ai/regulatorio"
                        onClick={() => {
                          try {
                            localStorage.setItem('handoff.regulatorio', JSON.stringify({
                              product_type: productType || '',
                              target_regions: targetMarket || 'Brasil',
                            }));
                          } catch {}
                        }}
                        className="inline-block"
                        aria-label="Continuar análise técnico‑regulatória"
                      >
                        <Button variant="secondary">Handoff para Validador Técnico‑Regulatório</Button>
                      </Link>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const content = `Via agente: Estrategista IA – Business Case\nOportunidade: ${opportunity || '-'}\nProduto: ${productType || '-'}\nMercado: ${targetMarket || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                            sendToMasterChat(content, { metadata: { module: 'business_case' } });
                          }}
                        >
                          Enviar para chat
                        </Button>
                        <Button
                          onClick={() => {
                            const content = `Via agente: Estrategista IA – Business Case (novo chat)\nOportunidade: ${opportunity || '-'}\nProduto: ${productType || '-'}\nMercado: ${targetMarket || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                            sendToMasterChat(content, { newThread: true, title: opportunity || 'Business Case', metadata: { module: 'business_case' } });
                          }}
                        >
                          Novo chat com este resultado
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">O resultado em Markdown aparecerá aqui após a geração.</p>
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
