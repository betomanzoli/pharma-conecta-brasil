
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

const ProjectManagerAI = () => {
  const { analyzeProject, loading } = useAIAgent();
  const { logAIEvent } = useAIEventLogger();

  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [scope, setScope] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [risks, setRisks] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Gerente de Projetos IA | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/gerente-projetos';
    document.head.appendChild(link);

    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Gerador de Project Charter com IA para o setor farmacêutico brasileiro.';
    document.head.appendChild(meta);

    return () => { 
      document.head.removeChild(link); 
      document.head.removeChild(meta);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await logAIEvent({ source: 'master_ai_hub', action: 'init', message: `project_charter:${title}` });
    const res = await analyzeProject({ title, objective, scope, stakeholders, risks });
    setOutputMd(res?.output_md ?? null);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Gerente de Projetos IA</h1>
          <p className="text-muted-foreground mb-6">Gere Project Charter, cronograma de marcos e matriz de stakeholders.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Entrada do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
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
                    <Label htmlFor="risks">Riscos</Label>
                    <Textarea id="risks" value={risks} onChange={(e) => setRisks(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading}>{loading ? 'Gerando...' : 'Gerar Project Charter'}</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultado</CardTitle>
              </CardHeader>
              <CardContent>
                {outputMd ? (
                  <article className="prose prose-sm md:prose dark:prose-invert max-w-none whitespace-pre-wrap">
                    {outputMd}
                  </article>
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

export default ProjectManagerAI;
