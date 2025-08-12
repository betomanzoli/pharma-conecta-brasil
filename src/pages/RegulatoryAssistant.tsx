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

const RegulatoryAssistant = () => {
  const { analyzeTechRegulatory, loading } = useAITechRegulatory();
  const { logAIEvent } = useAIEventLogger();
  const { redirectToChat } = useMasterChatBridge();
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [indication, setIndication] = useState('');
  const [questions, setQuestions] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Assistente Regulatório | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/assistente-regulatorio';
    document.head.appendChild(link);

    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Assistente regulatório com IA para o setor farmacêutico brasileiro.';
    document.head.appendChild(meta);

    return () => { 
      document.head.removeChild(link); 
      document.head.removeChild(meta);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await logAIEvent({ source: 'master_ai_hub', action: 'init', message: `regulatory:${productName}` });
    const res = await analyzeTechRegulatory({ 
      product_type: productType,
      dosage_form: indication,
      known_risks: questions
    });
    setOutputMd(res?.output_md ?? null);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Assistente Regulatório</h1>
          <p className="text-muted-foreground mb-6">Orientações regulatórias personalizadas para produtos farmacêuticos no Brasil.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Consulta Regulatória</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Nome do Produto</Label>
                    <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="productType">Tipo de Produto</Label>
                    <Input id="productType" value={productType} onChange={(e) => setProductType(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="indication">Indicação</Label>
                    <Textarea id="indication" value={indication} onChange={(e) => setIndication(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="questions">Questões Específicas</Label>
                    <Textarea id="questions" value={questions} onChange={(e) => setQuestions(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading}>{loading ? 'Analisando...' : 'Obter Orientação'}</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orientação Regulatória</CardTitle>
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
                          const content = `Via agente: Assistente Regulatório\nProduto: ${productName || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          redirectToChat(content, { metadata: { module: 'regulatory_assistant' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">A orientação regulatória aparecerá aqui após a análise.</p>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default RegulatoryAssistant;
