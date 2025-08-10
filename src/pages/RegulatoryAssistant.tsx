
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
const RegulatoryAssistant = () => {
  const { analyzeTechRegulatory, loading } = useAITechRegulatory();
  const { sendToMasterChat } = useMasterChatBridge();

  const [productType, setProductType] = useState('');
  const [routeOrManufacturing, setRouteOrManufacturing] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [targetRegions, setTargetRegions] = useState('Brasil');
  const [clinicalStage, setClinicalStage] = useState('');
  const [referenceProduct, setReferenceProduct] = useState('');
  const [knownRisks, setKnownRisks] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Técnico‑Regulatório IA | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/regulatorio';
    document.head.appendChild(link);

    // Prefill from Business Case handoff if available
    try {
      const raw = localStorage.getItem('handoff.regulatorio');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.product_type) setProductType(parsed.product_type);
        if (parsed?.target_regions) setTargetRegions(parsed.target_regions);
        localStorage.removeItem('handoff.regulatorio');
      }
    } catch {}

    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Análise técnico‑regulatória com IA: pathways ANVISA/FDA/EMA e riscos.';
    document.head.appendChild(meta);

    return () => { document.head.removeChild(link); document.head.removeChild(meta); };
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
          <h1 className="text-3xl font-bold mb-2">Técnico‑Regulatório IA</h1>
          <p className="text-muted-foreground mb-6">Avalie viabilidade técnica e caminhos regulatórios (ANVISA, FDA, EMA).</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="productType">Tipo de produto</Label>
                    <Input id="productType" value={productType} onChange={(e) => setProductType(e.target.value)} required placeholder="Ex: genérico oral, biológico, nutracêutico" />
                  </div>
                  <div>
                    <Label htmlFor="routeOrManufacturing">Rota/manufatura</Label>
                    <Input id="routeOrManufacturing" value={routeOrManufacturing} onChange={(e) => setRouteOrManufacturing(e.target.value)} placeholder="Ex: síntese química, fermentação, extração" />
                  </div>
                  <div>
                    <Label htmlFor="dosageForm">Forma farmacêutica</Label>
                    <Input id="dosageForm" value={dosageForm} onChange={(e) => setDosageForm(e.target.value)} placeholder="Ex: comprimido, cápsula, injetável" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetRegions">Regiões alvo</Label>
                      <Input id="targetRegions" value={targetRegions} onChange={(e) => setTargetRegions(e.target.value)} placeholder="Ex: Brasil, EUA, UE" />
                    </div>
                    <div>
                      <Label htmlFor="clinicalStage">Estágio clínico</Label>
                      <Input id="clinicalStage" value={clinicalStage} onChange={(e) => setClinicalStage(e.target.value)} placeholder="Ex: pré-clínico, Fase I/II/III" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="referenceProduct">Produto de referência</Label>
                    <Input id="referenceProduct" value={referenceProduct} onChange={(e) => setReferenceProduct(e.target.value)} placeholder="Se aplicável" />
                  </div>
                  <div>
                    <Label htmlFor="knownRisks">Riscos conhecidos</Label>
                    <Textarea id="knownRisks" value={knownRisks} onChange={(e) => setKnownRisks(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading}>{loading ? 'Gerando...' : 'Gerar Avaliação'}</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parecer IA</CardTitle>
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
                          const content = `Via agente: Técnico‑Regulatório IA\nProduto: ${productType || '-'}\nRegiões: ${targetRegions || '-'}\nEstágio: ${clinicalStage || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          sendToMasterChat(content, { metadata: { module: 'tech_regulatory' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
                      <Button
                        onClick={() => {
                          const content = `Via agente: Técnico‑Regulatório IA (novo chat)\nProduto: ${productType || '-'}\nRegiões: ${targetRegions || '-'}\nEstágio: ${clinicalStage || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          sendToMasterChat(content, { newThread: true, title: productType || 'Parecer regulatório', metadata: { module: 'tech_regulatory' } });
                        }}
                      >
                        Novo chat com este resultado
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

export default RegulatoryAssistant;
