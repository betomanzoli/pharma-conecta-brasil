
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAIAgent } from '@/hooks/useAIAgent';
import { useToast } from '@/hooks/use-toast';

const ProjectAnalyst: React.FC = () => {
  const { analyzeProject, loading } = useAIAgent();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [scope, setScope] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [risks, setRisks] = useState('');
  const [outputMd, setOutputMd] = useState<string>('');

  useEffect(() => {
    document.title = 'Analista de Projetos | PharmaConnect';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await analyzeProject({ title, objective, scope, stakeholders, risks });
    if (res?.output_md) {
      setOutputMd(res.output_md);
      toast({ title: 'Análise gerada', description: 'Project Charter disponível abaixo.' });
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Analista de Projetos (IA)</h1>
          <p className="text-muted-foreground mb-6">Gere um Project Charter objetivo com base nas entradas abaixo.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Projeto X" />
                  </div>
                  <div>
                    <Label htmlFor="objective">Objetivo</Label>
                    <Textarea id="objective" value={objective} onChange={(e) => setObjective(e.target.value)} rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="scope">Escopo</Label>
                    <Textarea id="scope" value={scope} onChange={(e) => setScope(e.target.value)} rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="stakeholders">Stakeholders</Label>
                    <Textarea id="stakeholders" value={stakeholders} onChange={(e) => setStakeholders(e.target.value)} rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="risks">Riscos</Label>
                    <Textarea id="risks" value={risks} onChange={(e) => setRisks(e.target.value)} rows={3} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Gerando...' : 'Gerar Project Charter'}
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

export default ProjectAnalyst;
