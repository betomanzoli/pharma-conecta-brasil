
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const TechnicalRegulatory: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [productType, setProductType] = useState('');
  const [routeAdministration, setRouteAdministration] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [indication, setIndication] = useState('');
  const [targetRegions, setTargetRegions] = useState('Brasil');

  const [outputMd, setOutputMd] = useState<string>('');

  useEffect(() => { document.title = 'Técnico-Regulatório | PharmaConnect'; }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const regions = targetRegions.split(',').map(r => r.trim()).filter(Boolean);
      const { data, error } = await supabase.functions.invoke('ai-technical-regulatory', {
        body: {
          product_type: productType,
          route_administration: routeAdministration,
          dosage_form: dosageForm,
          active_ingredient: activeIngredient,
          indication,
          target_regions: regions,
          project_id: null,
        },
      });
      if (error) throw error;
      const md: string = data?.analysis || data?.output?.output_md || '';
      setOutputMd(md);
      toast({ title: 'Análise gerada', description: 'Resultado disponível abaixo.' });
    } catch (err: any) {
      toast({ title: 'Falha na análise', description: err?.message || 'Tente novamente.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Análise Técnico-Regulatória (IA)</h1>
          <p className="text-muted-foreground mb-6">Gere um parecer técnico-regulatório com base nas informações do produto.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Tipo de Produto</Label>
                    <Input value={productType} onChange={(e) => setProductType(e.target.value)} placeholder="Ex.: Medicamento genérico" />
                  </div>
                  <div>
                    <Label>Via de Administração</Label>
                    <Input value={routeAdministration} onChange={(e) => setRouteAdministration(e.target.value)} placeholder="Ex.: Oral, IV" />
                  </div>
                  <div>
                    <Label>Forma Farmacêutica</Label>
                    <Input value={dosageForm} onChange={(e) => setDosageForm(e.target.value)} placeholder="Ex.: Comprimido, Cápsula" />
                  </div>
                  <div>
                    <Label>Princípio Ativo</Label>
                    <Input value={activeIngredient} onChange={(e) => setActiveIngredient(e.target.value)} placeholder="Ex.: Ibuprofeno" />
                  </div>
                  <div>
                    <Label>Indicação</Label>
                    <Textarea value={indication} onChange={(e) => setIndication(e.target.value)} rows={3} placeholder="Indicação terapêutica" />
                  </div>
                  <div>
                    <Label>Regiões Alvo (separadas por vírgula)</Label>
                    <Input value={targetRegions} onChange={(e) => setTargetRegions(e.target.value)} placeholder="Brasil, EUA, Europa" />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Gerando...' : 'Gerar Análise'}
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

export default TechnicalRegulatory;
