
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Clock, CheckCircle } from 'lucide-react';
import { useAIDocumentAssistant } from '@/hooks/useAIDocumentAssistant';

const DocumentationAssistant = () => {
  const [docType, setDocType] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [context, setContext] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const { generateDocument, loading } = useAIDocumentAssistant();

  const handleGenerate = async () => {
    const result = await generateDocument({
      doc_type: docType,
      template_name: templateName,
      context: context,
      fields: {}
    });
    
    if (result?.output_md) {
      setGeneratedDoc(result.output_md);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${templateName || 'documento'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Assistente de Documentação IA</h1>
                <p className="text-muted-foreground">
                  Geração automática de documentos farmacêuticos
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Configuração do Documento</span>
                </CardTitle>
                <CardDescription>
                  Selecione o tipo e forneça o contexto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="docType">Tipo de Documento</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sop">SOP (Procedimento Operacional)</SelectItem>
                      <SelectItem value="validation_protocol">Protocolo de Validação</SelectItem>
                      <SelectItem value="ctd_module">Módulo CTD</SelectItem>
                      <SelectItem value="business_case">Business Case</SelectItem>
                      <SelectItem value="risk_assessment">Avaliação de Risco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="templateName">Nome do Template</Label>
                  <Input
                    id="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Ex: SOP_Validacao_Processos"
                  />
                </div>
                <div>
                  <Label htmlFor="context">Contexto e Requisitos</Label>
                  <Textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Descreva o contexto, requisitos específicos, produto..."
                    rows={6}
                  />
                </div>
                <Button onClick={handleGenerate} disabled={loading || !docType} className="w-full">
                  {loading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Gerando Documento...
                    </>
                  ) : (
                    'Gerar Documento'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Documento Gerado</CardTitle>
                  {generatedDoc && (
                    <Button onClick={handleDownload} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedDoc ? (
                  <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                      {generatedDoc}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>O documento gerado aparecerá aqui</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DocumentationAssistant;
