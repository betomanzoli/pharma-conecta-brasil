
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAICoordinator } from '@/hooks/useAICoordinator';
import { useToast } from '@/hooks/use-toast';

const Coordination: React.FC = () => {
  const { coordinate, loading } = useAICoordinator();
  const { toast } = useToast();

  const [focus, setFocus] = useState('exec_summary');
  const [prioritiesText, setPrioritiesText] = useState('Alto: CTD módulo 3; Médio: CAPA desvio 12; Baixo: Revisar SOP GMP');
  const [outputMd, setOutputMd] = useState<string>('');

  useEffect(() => { document.title = 'Coordenação (Agente 5) | PharmaConnect'; }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priorities = prioritiesText.split(';').map(p => p.trim()).filter(Boolean);
    const res = await coordinate({ focus, priorities });
    if (res?.output_md) {
      setOutputMd(res.output_md);
      toast({ title: 'Plano de coordenação', description: 'Resumo e ações disponíveis abaixo.' });
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Coordenador Central (IA)</h1>
          <p className="text-muted-foreground mb-6">Integra outputs dos agentes e prioriza ações.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Foco</Label>
                    <Input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="exec_summary, risks, kpis..." />
                  </div>
                  <div>
                    <Label>Prioridades (separe por ;)</Label>
                    <Textarea value={prioritiesText} onChange={(e) => setPrioritiesText(e.target.value)} rows={3} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Gerando...' : 'Gerar Plano'}
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

export default Coordination;
