import React, { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAIDocumentAssistant } from '@/hooks/useAIDocumentAssistant';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
const DocumentationAssistant = () => {
  const { generateDocument, loading } = useAIDocumentAssistant();
  const [docType, setDocType] = useState('CTD');
  const [templateName, setTemplateName] = useState('Template_CTD_Full');
  const [context, setContext] = useState('');
  const [fieldsText, setFieldsText] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);
  const { sendToMasterChat } = useMasterChatBridge();
  useEffect(() => {
    document.title = 'Assistente de Documentação | PharmaConnect';
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = window.location.origin + '/ai/documentacao';
    document.head.appendChild(link);
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Assistente de documentação farmacêutica: CAPA, SOPs e CTD com validação.';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(link); document.head.removeChild(meta); };
  }, []);

  const parsedFields = useMemo(() => {
    const obj: Record<string, any> = {};
    fieldsText.split('\n').forEach((line) => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const k = line.slice(0, idx).trim();
        const v = line.slice(idx + 1).trim();
        if (k) obj[k] = v;
      }
    });
    return obj;
  }, [fieldsText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await generateDocument({
      doc_type: docType,
      template_name: templateName,
      context,
      fields: parsedFields,
    });
    setOutputMd(res?.output_md ?? null);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Assistente de Documentação</h1>
          <p className="text-muted-foreground mb-6">Preencha CAPA, SOPs e CTD com validação de conformidade.</p>

          <section className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Entrada</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="docType">Tipo</Label>
                      <Input id="docType" value={docType} onChange={(e) => setDocType(e.target.value)} placeholder="CTD, CAPA, SOP, Relatório" />
                    </div>
                    <div>
                      <Label htmlFor="template">Template</Label>
                      <Input id="template" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Template_CTD_Full" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="context">Contexto</Label>
                    <Textarea id="context" value={context} onChange={(e) => setContext(e.target.value)} placeholder="Descrição do projeto/produto, premissas, requisitos" />
                  </div>
                  <div>
                    <Label htmlFor="fields">Campos (chave: valor por linha)</Label>
                    <Textarea id="fields" value={fieldsText} onChange={(e) => setFieldsText(e.target.value)} placeholder="Responsável: Dr. Silva\nProduto: Genérico oral\nLinha: Sólidos" />
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
                          const content = `Via agente: Assistente de Documentação\nTipo: ${docType || '-'} • Template: ${templateName || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          sendToMasterChat(content, { metadata: { module: 'documentation' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
                      <Button
                        onClick={() => {
                          const content = `Via agente: Assistente de Documentação (novo chat)\nTipo: ${docType || '-'} • Template: ${templateName || '-'}\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          const title = `${docType} ${templateName}`.trim() || 'Documento';
                          sendToMasterChat(content, { newThread: true, title, metadata: { module: 'documentation' } });
                        }}
                      >
                        Novo chat com este resultado
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">O conteúdo em Markdown aparecerá aqui após a geração.</p>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DocumentationAssistant;
