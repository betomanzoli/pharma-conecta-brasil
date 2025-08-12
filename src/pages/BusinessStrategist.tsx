
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAIBusinessStrategist } from '@/hooks/useAIBusinessStrategist';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import AgentHandoffButton from '@/components/ai/AgentHandoffButton';
import { TrendingUp, Download } from 'lucide-react';

const BusinessStrategist = () => {
  const { analyzeBusinessCase, loading } = useAIBusinessStrategist();
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
  const [lastOutputId, setLastOutputId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Estrategista de Negócios IA | PharmaConnect Brasil';
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
      risks
    });
    
    if (res) {
      setOutputMd(res.output_md ?? null);
      setLastOutputId(res.id);
    }
  };

  const handleDownload = () => {
    if (outputMd) {
      const branded = `![PharmaConnect Brasil](/lovable-uploads/445e4223-5418-4de4-90fe-41c01a9dda35.png)\n\n` + outputMd;
      const blob = new Blob([branded], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `business_case_${opportunity.replace(/\s+/g, '_')}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 text-white">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Estrategista de Negócios IA</h1>
                <p className="text-muted-foreground">
                  Gere business cases estruturados e análises SWOT para oportunidades farmacêuticas
                </p>
              </div>
            </div>
            <Badge variant="secondary">Agente 1 - Business Strategy</Badge>
          </div>

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

                  <Button type="submit" disabled={loading} className="w-full">
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
                    <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto mb-4">
                      <pre className="whitespace-pre-wrap text-sm">{outputMd}</pre>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => sendToMasterChat(outputMd, { metadata: { module: 'business_strategist' } })}
                      >
                        Enviar para Chat
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {lastOutputId && (
                        <AgentHandoffButton
                          sourceAgent="business_strategist"
                          targetAgents={["technical_regulatory"]}
                          agentOutputId={lastOutputId}
                          outputData={{
                            opportunity,
                            product_type: productType,
                            target_market: targetMarket,
                            business_analysis: outputMd
                          }}
                        />
                      )}
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

export default BusinessStrategist;
