
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, FileText, MessageSquare, Download } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAIDocumentAssistant } from '@/hooks/useAIDocumentAssistant';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import { useToast } from '@/hooks/use-toast';

const DocumentationAssistantAI = () => {
  const [docType, setDocType] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [context, setContext] = useState('');
  const [fields, setFields] = useState({
    product_name: '',
    indication: '',
    dosage: '',
    route: '',
    contraindications: ''
  });
  const [result, setResult] = useState('');

  const { generateDocument, loading } = useAIDocumentAssistant();
  const { sendToMasterChat } = useMasterChatBridge();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!docType) {
      toast({ title: 'Erro', description: 'Selecione um tipo de documento', variant: 'destructive' });
      return;
    }

    const output = await generateDocument({
      doc_type: docType,
      template_name: templateName,
      fields,
      context
    });

    if (output?.output_md) {
      setResult(output.output_md);
    }
  };

  const handleSendToChat = () => {
    if (result) {
      sendToMasterChat(result, { 
        newThread: true, 
        title: `Documento: ${docType}` 
      });
    }
  };

  const handleDownload = () => {
    if (result) {
      const branded = `![PharmaConnect Brasil](/lovable-uploads/445e4223-5418-4de4-90fe-41c01a9dda35.png)\n\n` + result;
      const blob = new Blob([branded], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docType.replace(/\s+/g, '_')}.md`;
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
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 text-white">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Assistente de Documentação</h1>
                <p className="text-muted-foreground">
                  Gere documentos regulatórios com IA especializada
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulário */}
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Documento</CardTitle>
                <CardDescription>
                  Defina o tipo e parâmetros para geração automática
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="docType">Tipo de Documento</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="capa">CAPA (Common Application)</SelectItem>
                      <SelectItem value="sop">SOP (Standard Operating Procedure)</SelectItem>
                      <SelectItem value="ctd">CTD (Common Technical Document)</SelectItem>
                      <SelectItem value="dossier">Dossiê Regulatório</SelectItem>
                      <SelectItem value="validation">Protocolo de Validação</SelectItem>
                      <SelectItem value="stability">Estudo de Estabilidade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateName">Template (Opcional)</Label>
                  <Input
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Nome do template específico"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName">Nome do Produto</Label>
                  <Input
                    id="productName"
                    value={fields.product_name}
                    onChange={(e) => setFields({...fields, product_name: e.target.value})}
                    placeholder="Nome do produto farmacêutico"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="indication">Indicação</Label>
                  <Input
                    id="indication"
                    value={fields.indication}
                    onChange={(e) => setFields({...fields, indication: e.target.value})}
                    placeholder="Indicação terapêutica"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosagem</Label>
                    <Input
                      id="dosage"
                      value={fields.dosage}
                      onChange={(e) => setFields({...fields, dosage: e.target.value})}
                      placeholder="Ex: 500mg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="route">Via de Administração</Label>
                    <Input
                      id="route"
                      value={fields.route}
                      onChange={(e) => setFields({...fields, route: e.target.value})}
                      placeholder="Ex: Oral"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Contexto Adicional</Label>
                  <Textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Informações adicionais relevantes para o documento..."
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando Documento...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar Documento
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Resultado */}
            <Card>
              <CardHeader>
                <CardTitle>Documento Gerado</CardTitle>
                <CardDescription>
                  Resultado em formato Markdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSendToChat} variant="outline" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Enviar para Chat
                      </Button>
                      <Button onClick={handleDownload} variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Configure os parâmetros e clique em "Gerar Documento"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-6">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Assistente de Documentação:</strong> Esta IA é especializada em gerar 
              documentos regulatórios seguindo padrões ANVISA, FDA e EMA. Os documentos 
              gerados devem sempre ser revisados por especialistas antes do uso oficial.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DocumentationAssistantAI;
