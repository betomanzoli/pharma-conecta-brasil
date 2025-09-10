import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface WorkflowOutput {
  agent_type: string;
  output_md: string;
  status: string;
  kpis: any;
}

const AIWorkflow: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [outputs, setOutputs] = useState<WorkflowOutput[]>([]);
  const [coordinatorResult, setCoordinatorResult] = useState<string>('');
  
  // Form states
  const [productData, setProductData] = useState({
    product_type: 'Medicamento Novo',
    route_administration: 'Oral',
    dosage_form: 'Comprimido',
    active_ingredient: '',
    indication: '',
    target_regions: ['Brasil']
  });

  const [businessData, setBusinessData] = useState({
    target_market: 'SUS + Privado',
    competitive_landscape: '',
    pricing_strategy: 'Competitivo',
    market_size: ''
  });

  const [projectData, setProjectData] = useState({
    project_title: '',
    scope: '',
    objectives: '',
    stakeholders: '',
    timeline_months: 12,
    budget_range: 'R$ 1-5 milhões'
  });

  const [documentData, setDocumentData] = useState({
    document_type: 'Dossiê de Registro',
    product_category: 'Medicamento',
    template_name: 'CTD_Template',
    regulatory_requirements: 'RDC 200/2017'
  });

  const executeWorkflow = async () => {
    setLoading(true);
    setOutputs([]);
    setCoordinatorResult('');

    try {
      // 1. Executar Agente Regulatório
      toast({ title: 'Iniciando workflow', description: 'Executando análise regulatória...' });
      
      const { data: regulatoryData, error: regulatoryError } = await supabase.functions.invoke('ai-technical-regulatory', {
        body: productData
      });

      if (regulatoryError) throw regulatoryError;

      const regulatoryOutput: WorkflowOutput = {
        agent_type: 'Regulatório ANVISA',
        output_md: regulatoryData?.analysis || regulatoryData?.output?.output_md || 'Análise regulatória concluída',
        status: 'completed',
        kpis: regulatoryData?.output?.kpis || {}
      };

      setOutputs(prev => [...prev, regulatoryOutput]);

      // 2. Executar Agente de Negócios
      toast({ title: 'Workflow em andamento', description: 'Executando análise de mercado...' });

      const { data: businessResult, error: businessError } = await supabase.functions.invoke('ai-business-strategist', {
        body: businessData
      });

      if (businessError) throw businessError;

      const businessOutput: WorkflowOutput = {
        agent_type: 'Estrategista de Mercado',
        output_md: businessResult?.output?.output_md || 'Análise de mercado concluída',
        status: 'completed',
        kpis: businessResult?.output?.kpis || {}
      };

      setOutputs(prev => [...prev, businessOutput]);

      // 3. Executar Gerente de Projetos
      toast({ title: 'Workflow em andamento', description: 'Criando plano de projeto...' });

      const { data: projectResult, error: projectError } = await supabase.functions.invoke('ai-project-manager', {
        body: {
          ...projectData,
          regulatory_outputs: regulatoryOutput.output_md,
          business_outputs: businessOutput.output_md
        }
      });

      if (projectError) throw projectError;

      const projectOutput: WorkflowOutput = {
        agent_type: 'Gerente de Projetos',
        output_md: projectResult?.output?.output_md || 'Plano de projeto criado',
        status: 'completed',
        kpis: projectResult?.output?.kpis || {}
      };

      setOutputs(prev => [...prev, projectOutput]);

      // 4. Executar Gerador de Documentação
      toast({ title: 'Workflow em andamento', description: 'Gerando documentação...' });

      const { data: docResult, error: docError } = await supabase.functions.invoke('ai-document-generator', {
        body: documentData
      });

      if (docError) throw docError;

      const docOutput: WorkflowOutput = {
        agent_type: 'Gerador de Documentação',
        output_md: docResult?.output?.output_md || 'Documentação gerada',
        status: 'completed',
        kpis: docResult?.output?.kpis || {}
      };

      setOutputs(prev => [...prev, docOutput]);

      // 5. Executar Coordenador Central (Orquestração Final)
      toast({ title: 'Finalizando workflow', description: 'Coordenador realizando síntese executiva...' });

      const { data: coordinatorData, error: coordinatorError } = await supabase.functions.invoke('ai-coordinator-orchestrator', {
        body: {
          project_id: null,
          focus: 'exec_summary',
          priorities: [
            'Análise regulatória completa',
            'Viabilidade comercial validada', 
            'Cronograma de projeto definido',
            'Templates de documentação prontos'
          ]
        }
      });

      if (coordinatorError) throw coordinatorError;

      setCoordinatorResult(coordinatorData?.output?.output_md || 'Síntese executiva concluída');

      toast({ 
        title: 'Workflow concluído', 
        description: 'Todos os agentes executados e síntese final gerada com sucesso!' 
      });

    } catch (error: any) {
      console.error('Erro no workflow:', error);
      toast({ 
        title: 'Erro no workflow', 
        description: error?.message || 'Erro inesperado durante execução',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Workflow de IA Integrado</h1>
            <p className="text-muted-foreground">
              Execute o pipeline completo: Regulatório → Mercado → Projetos → Documentação → Orquestração Final
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Configuração do Workflow
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="product" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="product">Produto</TabsTrigger>
                    <TabsTrigger value="business">Mercado</TabsTrigger>
                    <TabsTrigger value="project">Projeto</TabsTrigger>
                    <TabsTrigger value="documents">Documentação</TabsTrigger>
                  </TabsList>

                  <TabsContent value="product" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Princípio Ativo</Label>
                        <Input
                          value={productData.active_ingredient}
                          onChange={(e) => setProductData(prev => ({ ...prev, active_ingredient: e.target.value }))}
                          placeholder="Ex: Paracetamol"
                        />
                      </div>
                      <div>
                        <Label>Indicação</Label>
                        <Input
                          value={productData.indication}
                          onChange={(e) => setProductData(prev => ({ ...prev, indication: e.target.value }))}
                          placeholder="Ex: Analgésico e antipirético"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="business" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Cenário Competitivo</Label>
                        <Textarea
                          value={businessData.competitive_landscape}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, competitive_landscape: e.target.value }))}
                          placeholder="Descreva o cenário competitivo..."
                        />
                      </div>
                      <div>
                        <Label>Tamanho do Mercado</Label>
                        <Input
                          value={businessData.market_size}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, market_size: e.target.value }))}
                          placeholder="Ex: R$ 500M anuais"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="project" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Título do Projeto</Label>
                        <Input
                          value={projectData.project_title}
                          onChange={(e) => setProjectData(prev => ({ ...prev, project_title: e.target.value }))}
                          placeholder="Ex: Registro de novo analgésico"
                        />
                      </div>
                      <div>
                        <Label>Stakeholders</Label>
                        <Input
                          value={projectData.stakeholders}
                          onChange={(e) => setProjectData(prev => ({ ...prev, stakeholders: e.target.value }))}
                          placeholder="Ex: P&D, Regulatório, Marketing"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Objetivos SMART</Label>
                      <Textarea
                        value={projectData.objectives}
                        onChange={(e) => setProjectData(prev => ({ ...prev, objectives: e.target.value }))}
                        placeholder="Defina objetivos específicos, mensuráveis, atingíveis..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tipo de Documento</Label>
                        <Input
                          value={documentData.document_type}
                          onChange={(e) => setDocumentData(prev => ({ ...prev, document_type: e.target.value }))}
                          placeholder="Ex: Dossiê de Registro, SOP, Checklist"
                        />
                      </div>
                      <div>
                        <Label>Requisitos Regulatórios</Label>
                        <Input
                          value={documentData.regulatory_requirements}
                          onChange={(e) => setDocumentData(prev => ({ ...prev, regulatory_requirements: e.target.value }))}
                          placeholder="Ex: RDC 200/2017, ICH Q1A"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 pt-4 border-t">
                  <Button 
                    onClick={executeWorkflow} 
                    disabled={loading} 
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Executando Workflow...
                      </>
                    ) : (
                      'Executar Pipeline Completo'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status dos Agentes */}
            {outputs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Status dos Agentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {outputs.map((output, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(output.status)}
                          <div>
                            <p className="font-medium">{output.agent_type}</p>
                            <Badge variant="secondary">
                              {output.status === 'completed' ? 'Concluído' : output.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resultados dos Agentes */}
            {outputs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Outputs dos Agentes Especializados</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="0" className="space-y-4">
                    <TabsList>
                      {outputs.map((output, index) => (
                        <TabsTrigger key={index} value={index.toString()}>
                          {output.agent_type}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {outputs.map((output, index) => (
                      <TabsContent key={index} value={index.toString()}>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm">
                            {output.output_md}
                          </pre>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Síntese Final do Orquestrador */}
            {coordinatorResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Síntese Executiva Final - Orquestrador
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-lg text-sm border-l-4 border-primary">
                      {coordinatorResult}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AIWorkflow;