import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAITechRegulatory } from '@/hooks/useAITechRegulatory';
import { useAIEventLogger } from '@/hooks/useAIEventLogger';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';

const TechnicalRegulatoryAI = () => {
  const { analyzeTechRegulatory, loading } = useAITechRegulatory();
  const { logAIEvent } = useAIEventLogger();
  const { redirectToChat } = useMasterChatBridge();
  const [productName, setProductName] = useState('');
  const [technicalData, setTechnicalData] = useState('');
  const [regulatoryContext, setRegulatoryContext] = useState('');
  const [specificQuestions, setSpecificQuestions] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Técnico Regulatório IA | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/tecnico-regulatorio';
    document.head.appendChild(link);

    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Análise técnico-regulatória com IA para produtos farmacêuticos no Brasil.';
    document.head.appendChild(meta);

    return () => { 
      document.head.removeChild(link); 
      document.head.removeChild(meta);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await logAIEvent({ source: 'master_ai_hub', action: 'init', message: `technical_regulatory:${productName}` });
    const res = await analyzeTechRegulatory({ 
      product_type: productName, 
      route_or_manufacturing: technicalData, 
      target_regions: regulatoryContext, 
      known_risks: specificQuestions 
    });
    setOutputMd(res?.output_md ?? null);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Técnico Regulatório IA</h1>
          <p className="text-muted-foreground mb-6">Análise técnico-regulatória especializada para produtos farmacêuticos.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Análise Técnico-Regulatória</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Nome do Produto</Label>
                    <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="technicalData">Dados Técnicos</Label>
                    <Textarea id="technicalData" value={technicalData} onChange={(e) => setTechnicalData(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="regulatoryContext">Contexto Regulatório</Label>
                    <Textarea id="regulatoryContext" value={regulatoryContext} onChange={(e) => setRegulatoryContext(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="specificQuestions">Questões Específicas</Label>
                    <Textarea id="specificQuestions" value={specificQuestions} onChange={(e) => setSpecificQuestions(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading}>{loading ? 'Analisando...' : 'Realizar Análise'}</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultado da Análise</CardTitle>
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
                          const content = `Via agente: Técnico Regulatório IA\nProduto: ${productName || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          redirectToChat(content, { metadata: { module: 'technical_regulatory' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">O resultado da análise aparecerá aqui após a geração.</p>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default TechnicalRegulatoryAI;
