
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

const DocumentationAssistantAI = () => {
  const { generateDocument, loading } = useAIAgent();
  const { logAIEvent } = useAIEventLogger();
  const { redirectToChat } = useMasterChatBridge();
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Assistente de Documentação IA | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/assistente-documentacao';
    document.head.appendChild(link);

    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Assistente de IA para geração de documentação regulatória farmacêutica.';
    document.head.appendChild(meta);

    return () => { 
      document.head.removeChild(link); 
      document.head.removeChild(meta);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentType || !productName) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha pelo menos o tipo de documento e nome do produto.',
        variant: 'destructive'
      });
      return;
    }

    await logAIEvent({ 
      source: 'master_ai_hub', 
      action: 'init', 
      message: `documentation:${documentType}:${productName}` 
    });
    
    const res = await generateDocument({ 
      document_type: documentType, 
      product_name: productName, 
      description, 
      requirements 
    });
    
    if (res?.output_md) {
      setOutputMd(res.output_md);
      toast({
        title: 'Sucesso',
        description: 'Documento gerado com sucesso!'
      });
    } else {
      toast({
        title: 'Aviso',
        description: 'Documento gerado, mas pode estar vazio. Verifique o resultado.',
        variant: 'destructive'
      });
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Assistente de Documentação IA</h1>
          <p className="text-muted-foreground mb-6">Gere documentação regulatória automatizada para produtos farmacêuticos.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Geração de Documento</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="documentType">Tipo de Documento</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de documento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dossie_anvisa">Dossiê ANVISA</SelectItem>
                        <SelectItem value="bula">Bula</SelectItem>
                        <SelectItem value="rotulo">Rótulo</SelectItem>
                        <SelectItem value="manual_qualidade">Manual de Qualidade</SelectItem>
                        <SelectItem value="pop">Procedimento Operacional Padrão</SelectItem>
                        <SelectItem value="validacao">Protocolo de Validação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="productName">Nome do Produto</Label>
                    <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="requirements">Requisitos Específicos</Label>
                    <Textarea id="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading}>{loading ? 'Gerando...' : 'Gerar Documento'}</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultado</CardTitle>
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
                          const content = `Via agente: Assistente de Documentação IA\nTipo: ${documentType || '-'}\nProduto: ${productName || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          redirectToChat(content, { metadata: { module: 'documentation_assistant' } });
                        }}
                      >
                        Enviar para chat
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

export default DocumentationAssistantAI;
