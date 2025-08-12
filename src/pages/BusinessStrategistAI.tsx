
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAIBusinessStrategist } from '@/hooks/useAIBusinessStrategist';
import { useAIEventLogger } from '@/hooks/useAIEventLogger';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';

const BusinessStrategistAI = () => {
  const { analyzeBusinessCase, loading } = useAIBusinessStrategist();
  const { logAIEvent } = useAIEventLogger();
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

  useEffect(() => {
    document.title = 'Estrategista de Negócios IA | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/estrategista';
    document.head.appendChild(link);

    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Gerador de Business Case e análise SWOT com IA para o setor farmacêutico brasileiro.';
    document.head.appendChild(meta);

    return () => { 
      document.head.removeChild(link); 
      document.head.removeChild(meta);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await logAIEvent({ 
      source: 'master_ai_hub', 
      action: 'init', 
      message: `business_case:${opportunity}` 
    });
    
    const res = await analyzeBusinessCase({ 
      opportunity, 
      product_type: productType,
      target_market: targetMarket,
      competitors,
      differentiation,
      investment_range: investmentRange,
      timeframe,
      risks
    });
    
    setOutputMd(res?.output_md ?? null);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Estrategista de Negócios IA</h1>
          <p className="text-muted-foreground mb-6">
            Gere business cases estruturados e análises SWOT para oportunidades farmacêuticas.
          </p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Oportunidade de Negócio</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="opportunity">Oportunidade *</Label>
                    <Textarea 
                      id="opportunity" 
                      value={opportunity} 
                      onChange={(e) => setOpportunity(e.target.value)}
                      placeholder="Descreva a oportunidade de negócio..." 
                      required 
                    />
                  </div>

                  <div>
                    <Label htmlFor="productType">Tipo de Produto</Label>
                    <Select value={productType} onValueChange={setProductType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicamento">Medicamento</SelectItem>
                        <SelectItem value="generico">Genérico</SelectItem>
                        <SelectItem value="similar">Similar</SelectItem>
                        <SelectItem value="dispositivo">Dispositivo Médico</SelectItem>
                        <SelectItem value="cosmético">Cosmético</SelectItem>
                        <SelectItem value="suplemento">Suplemento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="targetMarket">Mercado-alvo</Label>
                    <Input 
                      id="targetMarket" 
                      value={targetMarket} 
                      onChange={(e) => setTargetMarket(e.target.value)}
                      placeholder="Ex: Diabetes tipo 2, idosos..." 
                    />
                  </div>

                  <div>
                    <Label htmlFor="competitors">Concorrentes</Label>
                    <Textarea 
                      id="competitors" 
                      value={competitors} 
                      onChange={(e) => setCompetitors(e.target.value)}
                      placeholder="Liste os principais concorrentes..." 
                    />
                  </div>

                  <div>
                    <Label htmlFor="differentiation">Diferenciação</Label>
                    <Textarea 
                      id="differentiation" 
                      value={differentiation} 
                      onChange={(e) => setDifferentiation(e.target.value)}
                      placeholder="Como se diferencia dos concorrentes..." 
                    />
                  </div>

                  <div>
                    <Label htmlFor="investmentRange">Faixa de Investimento</Label>
                    <Select value={investmentRange} onValueChange={setInvestmentRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a faixa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixo">Baixo (até R$ 100k)</SelectItem>
                        <SelectItem value="medio">Médio (R$ 100k - 1M)</SelectItem>
                        <SelectItem value="alto">Alto (R$ 1M - 10M)</SelectItem>
                        <SelectItem value="muito-alto">Muito Alto (acima de R$ 10M)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeframe">Prazo</Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o prazo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="curto">Curto (6-12 meses)</SelectItem>
                        <SelectItem value="medio">Médio (1-3 anos)</SelectItem>
                        <SelectItem value="longo">Longo (3+ anos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="risks">Riscos Identificados</Label>
                    <Textarea 
                      id="risks" 
                      value={risks} 
                      onChange={(e) => setRisks(e.target.value)}
                      placeholder="Liste os principais riscos..." 
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Analisando...' : 'Gerar Business Case'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Case & SWOT</CardTitle>
              </CardHeader>
              <CardContent>
                {outputMd ? (
                  <>
                    <article className="prose prose-sm md:prose dark:prose-invert max-w-none whitespace-pre-wrap">
                      {outputMd}
                    </article>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const content = `Via agente: Estrategista de Negócios IA\nOportunidade: ${opportunity || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          sendToMasterChat(content, { metadata: { module: 'business_strategist' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
                      <Button
                        onClick={() => {
                          const content = `Via agente: Estrategista de Negócios IA (novo chat)\nOportunidade: ${opportunity || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          sendToMasterChat(content, { 
                            newThread: true, 
                            title: opportunity || 'Business Case', 
                            metadata: { module: 'business_strategist' } 
                          });
                        }}
                      >
                        Novo chat com este resultado
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    O business case e análise SWOT aparecerão aqui após a geração.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default BusinessStrategistAI;
