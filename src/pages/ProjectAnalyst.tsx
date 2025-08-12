
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAIAgent } from '@/hooks/useAIAgent';
import { useAIEventLogger } from '@/hooks/useAIEventLogger';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import { useToast } from '@/hooks/use-toast';

const ProjectAnalyst = () => {
  const { analyzeProject, loading } = useAIAgent();
  const { logAIEvent } = useAIEventLogger();
  const { redirectToChat } = useMasterChatBridge();
  const { toast } = useToast();
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [scope, setScope] = useState('');
  const [objectives, setObjectives] = useState('');
  const [constraints, setConstraints] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Analista de Projetos IA | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/analista-projetos';
    document.head.appendChild(link);

    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Analista de projetos com IA para o setor farmacêutico brasileiro.';
    document.head.appendChild(meta);

    return () => { 
      document.head.removeChild(link); 
      document.head.removeChild(meta);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName || !projectType) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha pelo menos o nome e tipo do projeto.',
        variant: 'destructive'
      });
      return;
    }

    await logAIEvent({ 
      source: 'master_ai_hub', 
      action: 'init', 
      message: `project_analysis:${projectType}:${projectName}` 
    });
    
    const res = await analyzeProject({ 
      title: projectName,
      objective: objectives,
      scope,
      stakeholders: '',
      risks: constraints
    });
    
    if (res?.output_md) {
      setOutputMd(res.output_md);
      toast({
        title: 'Sucesso',
        description: 'Análise do projeto gerada com sucesso!'
      });
    } else {
      toast({
        title: 'Aviso',
        description: 'Análise gerada, mas pode estar vazia. Verifique o resultado.',
        variant: 'destructive'
      });
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Analista de Projetos IA</h1>
          <p className="text-muted-foreground mb-6">Analise e otimize projetos farmacêuticos com inteligência artificial.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="projectName">Nome do Projeto</Label>
                    <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="projectType">Tipo de Projeto</Label>
                    <Select value={projectType} onValueChange={setProjectType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de projeto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pesquisa_desenvolvimento">P&D</SelectItem>
                        <SelectItem value="registro_produto">Registro de Produto</SelectItem>
                        <SelectItem value="validacao_processo">Validação de Processo</SelectItem>
                        <SelectItem value="melhoria_qualidade">Melhoria de Qualidade</SelectItem>
                        <SelectItem value="expansao_fabrica">Expansão de Fábrica</SelectItem>
                        <SelectItem value="compliance_regulatorio">Compliance Regulatório</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="scope">Escopo</Label>
                    <Textarea id="scope" value={scope} onChange={(e) => setScope(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="objectives">Objetivos</Label>
                    <Textarea id="objectives" value={objectives} onChange={(e) => setObjectives(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="constraints">Restrições/Riscos</Label>
                    <Textarea id="constraints" value={constraints} onChange={(e) => setConstraints(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading}>{loading ? 'Analisando...' : 'Analisar Projeto'}</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultado da Análise</CardTitle>
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
                          const content = `Via agente: Analista de Projetos IA\nProjeto: ${projectName || '-'}\nTipo: ${projectType || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          redirectToChat(content, { metadata: { module: 'project_analyst' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">O resultado da análise aparecerá aqui após a geração.</p>
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
