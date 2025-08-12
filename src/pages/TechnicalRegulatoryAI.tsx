
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAITechRegulatory } from '@/hooks/useAITechRegulatory';
import { useAIEventLogger } from '@/hooks/useAIEventLogger';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';

const TechnicalRegulatoryAI = () => {
  const { analyzeTechRegulatory, loading } = useAITechRegulatory();
  const { logAIEvent } = useAIEventLogger();
  const { sendToMasterChat } = useMasterChatBridge();

  const [productType, setProductType] = useState('');
  const [routeOrManufacturing, setRouteOrManufacturing] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [targetRegions, setTargetRegions] = useState('');
  const [clinicalStage, setClinicalStage] = useState('');
  const [referenceProduct, setReferenceProduct] = useState('');
  const [knownRisks, setKnownRisks] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Técnico-Regulatório IA | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/regulatorio';
    document.head.appendChild(link);

    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Análise técnico-regulatória com IA para ANVISA, FDA e EMA.';
    document.head.appendChild(meta);

    return () => { 
      document.head.removeChild(link); 
      document.head.removeChild(meta);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await logAIEvent({ 
      source: 'master_ai_hub', 
      action: 'init', 
      message: `tech_regulatory:${productType}` 
    });
    
    const res = await analyzeTechRegulatory({ 
      product_type: productType,
      route_or_manufacturing: routeOrManufacturing,
      dosage_form: dosageForm,
      target_regions: targetRegions,
      clinical_stage: clinicalStage,
      reference_product: referenceProduct,
      known_risks: knownRisks
    });
    
    setOutputMd(res?.output_md ?? null);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Técnico-Regulatório IA</h1>
          <p className="text-muted-foreground mb-6">
            Análise técnico-regulatória especializada para ANVISA, FDA e EMA.
          </p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="productType">Tipo de Produto *</Label>
                    <Select value={productType} onValueChange={setProductType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicamento-novo">Medicamento Novo</SelectItem>
                        <SelectItem value="generico">Genérico</SelectItem>
                        <SelectItem value="similar">Similar</SelectItem>
                        <SelectItem value="biosimilar">Biosimilar</SelectItem>
                        <SelectItem value="dispositivo-medico">Dispositivo Médico</SelectItem>
                        <SelectItem value="produto-biologico">Produto Biológico</SelectItem>
                        <SelectItem value="vacina">Vacina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="routeOrManufacturing">Via de Administração / Fabricação</Label>
                    <Input 
                      id="routeOrManufacturing" 
                      value={routeOrManufacturing} 
                      onChange={(e) => setRouteOrManufacturing(e.target.value)}
                      placeholder="Ex: Oral, Injetável, Estéril..." 
                    />
                  </div>

                  <div>
                    <Label htmlFor="dosageForm">Forma Farmacêutica</Label>
                    <Select value={dosageForm} onValueChange={setDosageForm}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprimido">Comprimido</SelectItem>
                        <SelectItem value="capsula">Cápsula</SelectItem>
                        <SelectItem value="solucao-injetavel">Solução Injetável</SelectItem>
                        <SelectItem value="pomada">Pomada/Creme</SelectItem>
                        <SelectItem value="suspensao">Suspensão</SelectItem>
                        <SelectItem value="xarope">Xarope</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="targetRegions">Regiões-alvo</Label>
                    <Input 
                      id="targetRegions" 
                      value={targetRegions} 
                      onChange={(e) => setTargetRegions(e.target.value)}
                      placeholder="Ex: Brasil (ANVISA), EUA (FDA), Europa (EMA)" 
                    />
                  </div>

                  <div>
                    <Label htmlFor="clinicalStage">Estágio Clínico</Label>
                    <Select value={clinicalStage} onValueChange={setClinicalStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estágio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pre-clinico">Pré-clínico</SelectItem>
                        <SelectItem value="fase-1">Fase I</SelectItem>
                        <SelectItem value="fase-2">Fase II</SelectItem>
                        <SelectItem value="fase-3">Fase III</SelectItem>
                        <SelectItem value="fase-4">Fase IV</SelectItem>
                        <SelectItem value="registro">Pronto para Registro</SelectItem>
                        <SelectItem value="pos-mercado">Pós-mercado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="referenceProduct">Produto de Referência</Label>
                    <Input 
                      id="referenceProduct" 
                      value={referenceProduct} 
                      onChange={(e) => setReferenceProduct(e.target.value)}
                      placeholder="Nome do produto de referência (se aplicável)" 
                    />
                  </div>

                  <div>
                    <Label htmlFor="knownRisks">Riscos Conhecidos</Label>
                    <Textarea 
                      id="knownRisks" 
                      value={knownRisks} 
                      onChange={(e) => setKnownRisks(e.target.value)}
                      placeholder="Descreva riscos técnicos ou regulatórios conhecidos..." 
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Analisando...' : 'Gerar Análise Técnico-Regulatória'}
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
                    <article className="prose prose-sm md:prose dark:prose-invert max-w-none whitespace-pre-wrap">
                      {outputMd}
                    </article>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const content = `Via agente: Técnico-Regulatório IA\nProduto: ${productType || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          sendToMasterChat(content, { metadata: { module: 'tech_regulatory' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
                      <Button
                        onClick={() => {
                          const content = `Via agente: Técnico-Regulatório IA (novo chat)\nProduto: ${productType || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          sendToMasterChat(content, { 
                            newThread: true, 
                            title: `Análise ${productType}` || 'Análise Regulatória', 
                            metadata: { module: 'tech_regulatory' } 
                          });
                        }}
                      >
                        Novo chat com este resultado
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    A análise técnico-regulatória aparecerá aqui após a geração.
                  </p>
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
