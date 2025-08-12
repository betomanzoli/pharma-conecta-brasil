
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAITechRegulatory } from '@/hooks/useAITechRegulatory';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import { useToast } from '@/hooks/use-toast';

const RegulatoryAssistant = () => {
  const { analyzeTechRegulatory, loading } = useAITechRegulatory();
  const { redirectToChat } = useMasterChatBridge();
  const { toast } = useToast();

  const [productType, setProductType] = useState('');
  const [routeOrManufacturing, setRouteOrManufacturing] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [targetRegions, setTargetRegions] = useState('');
  const [clinicalStage, setClinicalStage] = useState('');
  const [referenceProduct, setReferenceProduct] = useState('');
  const [knownRisks, setKnownRisks] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Assistente Regulatório | PharmaConnect';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await analyzeTechRegulatory({
      product_type: productType,
      route_or_manufacturing: routeOrManufacturing,
      dosage_form: dosageForm,
      target_regions: targetRegions,
      clinical_stage: clinicalStage,
      reference_product: referenceProduct,
      known_risks: knownRisks,
    });
    setOutputMd(res?.output_md ?? null);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Assistente Regulatório</h1>
          <p className="text-muted-foreground mb-6">Análise técnico-regulatória para produtos farmacêuticos.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="productType">Tipo de Produto</Label>
                    <Input id="productType" value={productType} onChange={(e) => setProductType(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="routeOrManufacturing">Via de Administração/Fabricação</Label>
                    <Input id="routeOrManufacturing" value={routeOrManufacturing} onChange={(e) => setRouteOrManufacturing(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="dosageForm">Forma Farmacêutica</Label>
                    <Input id="dosageForm" value={dosageForm} onChange={(e) => setDosageForm(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="targetRegions">Regiões Alvo</Label>
                    <Input id="targetRegions" value={targetRegions} onChange={(e) => setTargetRegions(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="clinicalStage">Estágio Clínico</Label>
                    <Input id="clinicalStage" value={clinicalStage} onChange={(e) => setClinicalStage(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="referenceProduct">Produto de Referência</Label>
                    <Input id="referenceProduct" value={referenceProduct} onChange={(e) => setReferenceProduct(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="knownRisks">Riscos Conhecidos</Label>
                    <Textarea id="knownRisks" value={knownRisks} onChange={(e) => setKnownRisks(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Analisando...' : 'Gerar Análise Regulatória'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise Regulatória</CardTitle>
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
                          const content = `Via agente: Assistente Regulatório\nProduto: ${productType || '-'}\n\n${outputMd}`;
                          redirectToChat(content, { metadata: { module: 'regulatory' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">A análise regulatória aparecerá aqui.</p>
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
