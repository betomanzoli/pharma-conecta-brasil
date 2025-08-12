
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAIAgent } from '@/hooks/useAIAgent';
import { useAIEventLogger } from '@/hooks/useAIEventLogger';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';

const BusinessStrategistAI = () => {
  const { analyzeStrategy, loading } = useAIAgent();
  const { logAIEvent } = useAIEventLogger();
  const { redirectToChat } = useMasterChatBridge();
  const [company, setCompany] = useState('');
  const [market, setMarket] = useState('');
  const [goals, setGoals] = useState('');
  const [challenges, setChallenges] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Estrategista de Negócios IA | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/estrategista-negocios';
    document.head.appendChild(link);

    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Estrategista de negócios com IA para empresas farmacêuticas brasileiras.';
    document.head.appendChild(meta);

    return () => { 
      document.head.removeChild(link); 
      document.head.removeChild(meta);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await logAIEvent({ source: 'master_ai_hub', action: 'init', message: `strategy:${company}` });
    const res = await analyzeStrategy({ company, market, goals, challenges });
    setOutputMd(res?.output_md ?? null);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Estrategista de Negócios IA</h1>
          <p className="text-muted-foreground mb-6">Desenvolva estratégias de negócio para o mercado farmacêutico brasileiro.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Análise Estratégica</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="market">Mercado/Segmento</Label>
                    <Textarea id="market" value={market} onChange={(e) => setMarket(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="goals">Objetivos</Label>
                    <Textarea id="goals" value={goals} onChange={(e) => setGoals(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="challenges">Desafios</Label>
                    <Textarea id="challenges" value={challenges} onChange={(e) => setChallenges(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading}>{loading ? 'Analisando...' : 'Gerar Estratégia'}</Button>
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
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const content = `Via agente: Estrategista de Negócios IA\nEmpresa: ${company || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          redirectToChat(content, { metadata: { module: 'business_strategist' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
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

export default BusinessStrategistAI;
