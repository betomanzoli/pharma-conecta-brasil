
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAITechRegulatory } from '@/hooks/useAITechRegulatory';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import AgentHandoffButton from '@/components/ai/AgentHandoffButton';
import { Settings, Download } from 'lucide-react';

const TechnicalRegulatory = () => {
  const { analyzeTechRegulatory, loading } = useAITechRegulatory();
  const { sendToMasterChat } = useMasterChatBridge();

  const [productType, setProductType] = useState('');
  const [routeOrManufacturing, setRouteOrManufacturing] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [targetRegions, setTargetRegions] = useState('');
  const [clinicalStage, setClinicalStage] = useState('');
  const [referenceProduct, setReferenceProduct] = useState('');
  const [knownRisks, setKnownRisks] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);
  const [lastOutputId, setLastOutputId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Especialista Técnico-Regulatório IA | PharmaConnect Brasil';
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
      known_risks: knownRisks
    });
    
    if (res) {
      setOutputMd(res.output_md ?? null);
      setLastOutputId(res.id);
    }
  };

  const handleDownload = () => {
    if (outputMd) {
      const branded = `![PharmaConnect Brasil](/lovable-uploads/445e4223-5418-4de4-90fe-41c01a9dda35.png)\n\n` + outputMd;
      const blob = new Blob([branded], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `technical_regulatory_analysis_${productType.replace(/\s+/g, '_')}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-red-600 text-white">
                <Settings className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Especialista Técnico-Regulatório IA</h1>
                <p className="text-muted-foreground">
                  Análise técnica, compliance regulatório e pathway ANVISA/FDA/EMA
                </p>
              </div>
            </div>
            <Badge variant="secondary">Agente 2 - Technical & Regulatory</Badge>
          </div>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Análise Técnico-Regulatória</CardTitle>
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
                        <SelectItem value="small_molecule">Molécula Pequena</SelectItem>
                        <SelectItem value="biologic">Biológico</SelectItem>
                        <SelectItem value="biosimilar">Biossimilar</SelectItem>
                        <SelectItem value="generic">Genérico</SelectItem>
                        <SelectItem value="medical_device">Dispositivo Médico</SelectItem>
                        <SelectItem value="combination">Produto Combinado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="routeOrManufacturing">Rota/Manufatura</Label>
                    <Input 
                      id="routeOrManufacturing" 
                      value={routeOrManufacturing} 
                      onChange={(e) => setRouteOrManufacturing(e.target.value)}
                      placeholder="Ex: Síntese química, Fermentação, Cell culture..." 
                    />
                  </div>

                  <div>
                    <Label htmlFor="dosageForm">Forma Farmacêutica</Label>
                    <Select value={dosageForm} onValueChange={setDosageForm}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oral_solid">Oral Sólida</SelectItem>
                        <SelectItem value="oral_liquid">Oral Líquida</SelectItem>
                        <SelectItem value="injectable">Injetável</SelectItem>
                        <SelectItem value="topical">Tópica</SelectItem>
                        <SelectItem value="inhalation">Inalação</SelectItem>
                        <SelectItem value="transdermal">Transdérmica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="targetRegions">Regiões-alvo</Label>
                    <Input 
                      id="targetRegions" 
                      value={targetRegions} 
                      onChange={(e) => setTargetRegions(e.target.value)}
                      placeholder="Ex: Brasil (ANVISA), EUA (FDA), Europa (EMA)..." 
                    />
                  </div>

                  <div>
                    <Label htmlFor="clinicalStage">Estágio Clínico</Label>
                    <Select value={clinicalStage} onValueChange={setClinicalStage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estágio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preclinical">Pré-clínico</SelectItem>
                        <SelectItem value="phase1">Fase I</SelectItem>
                        <SelectItem value="phase2">Fase II</SelectItem>
                        <SelectItem value="phase3">Fase III</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="generic_study">Estudo Genérico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="referenceProduct">Produto de Referência</Label>
                    <Input 
                      id="referenceProduct" 
                      value={referenceProduct} 
                      onChange={(e) => setReferenceProduct(e.target.value)}
                      placeholder="Nome do produto de referência..." 
                    />
                  </div>

                  <div>
                    <Label htmlFor="knownRisks">Riscos Conhecidos</Label>
                    <Textarea 
                      id="knownRisks" 
                      value={knownRisks} 
                      onChange={(e) => setKnownRisks(e.target.value)}
                      placeholder="Descreva riscos técnicos e regulatórios conhecidos..." 
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Analisando...' : 'Analisar Viabilidade Técnico-Regulatória'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise Técnico-Regulatória</CardTitle>
              </CardHeader>
              <CardContent>
                {outputMd ? (
                  <>
                    <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto mb-4">
                      <pre className="whitespace-pre-wrap text-sm">{outputMd}</pre>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => sendToMasterChat(outputMd, { metadata: { module: 'technical_regulatory' } })}
                      >
                        Enviar para Chat
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {lastOutputId && (
                        <AgentHandoffButton
                          sourceAgent="technical_regulatory"
                          targetAgents={["document_assistant", "coordinator"]}
                          agentOutputId={lastOutputId}
                          outputData={{
                            product_type: productType,
                            technical_analysis: outputMd
                          }}
                        />
                      )}
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

export default TechnicalRegulatory;
