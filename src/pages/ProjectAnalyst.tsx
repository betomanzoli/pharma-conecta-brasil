
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

const ProjectAnalyst = () => {
  const { analyzeProject, loading } = useAIAgent();
  const { logAIEvent } = useAIEventLogger();
  const { redirectToChat } = useMasterChatBridge();
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [scope, setScope] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [risks, setRisks] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Analista de Projetos IA | PharmaConnect';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await logAIEvent({ source: 'master_ai_hub', action: 'init', message: `project_analysis:${title}` });
    const res = await analyzeProject({ title, objective, scope, stakeholders, risks });
    setOutputMd(res?.output_md ?? null);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Analista de Projetos IA</h1>
          <p className="text-muted-foreground mb-6">Análise detalhada de projetos farmacêuticos com IA.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título do Projeto</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="objective">Objetivo</Label>
                    <Textarea id="objective" value={objective} onChange={(e) => setObjective(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="scope">Escopo</Label>
                    <Textarea id="scope" value={scope} onChange={(e) => setScope(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="stakeholders">Stakeholders</Label>
                    <Textarea id="stakeholders" value={stakeholders} onChange={(e) => setStakeholders(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="risks">Riscos Identificados</Label>
                    <Textarea id="risks" value={risks} onChange={(e) => setRisks(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Analisando...' : 'Analisar Projeto'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise do Projeto</CardTitle>
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
                          const content = `Via agente: Analista de Projetos IA\nProjeto: ${title || '-'}\n\n${outputMd}`;
                          redirectToChat(content, { metadata: { module: 'project_analyst' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">A análise do projeto aparecerá aqui.</p>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProjectAnalyst;
