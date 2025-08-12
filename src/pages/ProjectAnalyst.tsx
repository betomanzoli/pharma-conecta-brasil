
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Calendar, Download, Workflow } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import { useToast } from '@/hooks/use-toast';
import AgentHandoffButton from '@/components/ai/AgentHandoffButton';

const ProjectAnalyst = () => {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [objectives, setObjectives] = useState('');
  const [scope, setScope] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');
  const [risks, setRisks] = useState('');
  const [regulatoryMilestones, setRegulatoryMilestones] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastOutputId, setLastOutputId] = useState<string | null>(null);

  const { sendToMasterChat } = useMasterChatBridge();
  const { toast } = useToast();

  const generateProjectCharter = async () => {
    if (!projectName || !projectType) {
      toast({ title: 'Erro', description: 'Nome e tipo do projeto são obrigatórios', variant: 'destructive' });
      return;
    }

    setLoading(true);
    
    try {
      // Simular geração de project charter (substituir por chamada real à API)
      const projectCharter = `
# Project Charter - ${projectName}

![PharmaConnect Brasil](/lovable-uploads/445e4223-5418-4de4-90fe-41c01a9dda35.png)

## 1. Informações Básicas
- **Nome do Projeto**: ${projectName}
- **Tipo**: ${projectType}
- **Data de Criação**: ${new Date().toLocaleDateString('pt-BR')}

## 2. Objetivos SMART
${objectives || 'A definir'}

## 3. Escopo do Projeto
${scope || 'A definir'}

## 4. Stakeholders Principais
${stakeholders || 'A definir'}

## 5. Cronograma de Alto Nível
${timeline || 'A definir'}

## 6. Orçamento Estimado
${budget || 'A definir'}

## 7. Marcos Regulatórios
${regulatoryMilestones || 'A definir'}

## 8. Principais Riscos
${risks || 'A definir'}

## 9. Critérios de Sucesso
- Aprovação dos stakeholders principais
- Cumprimento do cronograma regulatório
- Aderência ao orçamento (±10%)
- Compliance com BPF/GMP

## 10. Próximos Passos
1. Aprovação formal do charter
2. Formação da equipe de projeto
3. Detalhamento da EAP
4. Início da fase de planejamento
`;

      setResult(projectCharter);
      // Simular ID de output (substituir por ID real da API)
      setLastOutputId(`project-${Date.now()}`);
      
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao gerar project charter', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const blob = new Blob([result], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `project_charter_${projectName.replace(/\s+/g, '_')}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Analista de Projetos IA</h1>
                <p className="text-muted-foreground">
                  Project Charter, análise de viabilidade e gestão de stakeholders
                </p>
              </div>
            </div>
            <Badge variant="secondary">Agente 3 - Project Management</Badge>
          </div>

          <Tabs defaultValue="charter" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="charter">Project Charter</TabsTrigger>
              <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
              <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            </TabsList>

            <TabsContent value="charter">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuração do Projeto</CardTitle>
                    <CardDescription>
                      Defina as informações básicas para gerar o Project Charter
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Nome do Projeto *</Label>
                      <Input
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Ex: Desenvolvimento de Genérico XYZ"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectType">Tipo de Projeto *</Label>
                      <Select value={projectType} onValueChange={setProjectType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="generico">Desenvolvimento Genérico</SelectItem>
                          <SelectItem value="inlicensing">In-licensing</SelectItem>
                          <SelectItem value="biologico">Desenvolvimento Biológico</SelectItem>
                          <SelectItem value="tech-transfer">Tech Transfer</SelectItem>
                          <SelectItem value="registro">Registro Regulatório</SelectItem>
                          <SelectItem value="lancamento">Lançamento de Produto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="objectives">Objetivos SMART</Label>
                      <Textarea
                        id="objectives"
                        value={objectives}
                        onChange={(e) => setObjectives(e.target.value)}
                        placeholder="Objetivos específicos, mensuráveis, atingíveis, relevantes e temporais..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scope">Escopo do Projeto</Label>
                      <Textarea
                        id="scope"
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                        placeholder="O que está incluído e excluído do projeto..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeline">Cronograma Macro</Label>
                      <Textarea
                        id="timeline"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        placeholder="Principais marcos e datas..."
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Orçamento Estimado</Label>
                      <Input
                        id="budget"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Ex: R$ 2.5 milhões"
                      />
                    </div>

                    <Button 
                      onClick={generateProjectCharter} 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Gerando Charter...
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Gerar Project Charter
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Charter Gerado</CardTitle>
                    <CardDescription>
                      Documento estruturado em formato Markdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {result ? (
                      <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={() => sendToMasterChat(result)} variant="outline">
                            Enviar para Chat
                          </Button>
                          <Button onClick={handleDownload} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          {lastOutputId && (
                            <AgentHandoffButton
                              sourceAgent="project_analyst"
                              targetAgents={["business_strategist", "technical_regulatory"]}
                              agentOutputId={lastOutputId}
                              outputData={{
                                project_name: projectName,
                                project_type: projectType,
                                charter: result
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Configure o projeto e clique em "Gerar Project Charter"</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cronograma">
              <Card>
                <CardHeader>
                  <CardTitle>Cronograma Regulatório</CardTitle>
                  <CardDescription>
                    Marcos regulatórios e timeline estimado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="regulatoryMilestones">Marcos Regulatórios</Label>
                    <Textarea
                      id="regulatoryMilestones"
                      value={regulatoryMilestones}
                      onChange={(e) => setRegulatoryMilestones(e.target.value)}
                      placeholder="Ex: Submissão ANVISA, Aprovação FDA, Inspeção GMP..."
                      rows={4}
                    />
                  </div>
                  <Alert>
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      Timeline regulatório típico: ANVISA (6-18 meses), FDA (10-12 meses), EMA (210 dias)
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stakeholders">
              <Card>
                <CardHeader>
                  <CardTitle>Gestão de Stakeholders</CardTitle>
                  <CardDescription>
                    Identificação e análise dos stakeholders do projeto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stakeholders">Stakeholders Principais</Label>
                    <Textarea
                      id="stakeholders"
                      value={stakeholders}
                      onChange={(e) => setStakeholders(e.target.value)}
                      placeholder="Liste stakeholders internos e externos, seus interesses e influência..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="risks">Principais Riscos</Label>
                    <Textarea
                      id="risks"
                      value={risks}
                      onChange={(e) => setRisks(e.target.value)}
                      placeholder="Identifique riscos técnicos, regulatórios, comerciais e de timeline..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <Workflow className="h-4 w-4" />
            <AlertDescription>
              <strong>Analista de Projetos IA:</strong> Este agente especializa-se na criação de 
              project charters, cronogramas regulatórios e gestão de stakeholders para projetos 
              farmacêuticos complexos.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProjectAnalyst;
