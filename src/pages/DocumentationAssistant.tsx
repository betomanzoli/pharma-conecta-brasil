
import React, { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useAIDocumentAssistant } from '@/hooks/useAIDocumentAssistant';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import { useToast } from '@/hooks/use-toast';

const DocumentationAssistant = () => {
  const { generateDocument, loading } = useAIDocumentAssistant();
  const [docType, setDocType] = useState('CTD');
  const [templateName, setTemplateName] = useState('Template_CTD_Full');
  const [context, setContext] = useState('');
  const [fieldsText, setFieldsText] = useState('');
  const [outputMd, setOutputMd] = useState<string | null>(null);
  const [complianceScore, setComplianceScore] = useState<number | null>(null);
  const { sendToMasterChat } = useMasterChatBridge();
  const { toast } = useToast();

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

  const documentTemplates = {
    'CTD': [
      { value: 'Template_CTD_Full', label: 'CTD Completo', description: 'Common Technical Document completo para registro' },
      { value: 'Template_CTD_Module2', label: 'CTD Módulo 2', description: 'Sumários de qualidade, não-clínico e clínico' },
      { value: 'Template_CTD_Module3', label: 'CTD Módulo 3', description: 'Informações de qualidade farmacêutica' }
    ],
    'CAPA': [
      { value: 'Template_CAPA_Deviation', label: 'CAPA - Desvio', description: 'Ação corretiva e preventiva para desvios' },
      { value: 'Template_CAPA_Investigation', label: 'CAPA - Investigação', description: 'CAPA para investigações de qualidade' },
      { value: 'Template_CAPA_Customer', label: 'CAPA - Cliente', description: 'CAPA para reclamações de clientes' }
    ],
    'SOP': [
      { value: 'Template_SOP_GMP', label: 'SOP - GMP', description: 'Procedimento operacional padrão GMP' },
      { value: 'Template_SOP_Quality', label: 'SOP - Qualidade', description: 'SOP para controle de qualidade' },
      { value: 'Template_SOP_Validation', label: 'SOP - Validação', description: 'SOP para processos de validação' }
    ],
    'Relatório': [
      { value: 'Template_Stability_Report', label: 'Relatório de Estabilidade', description: 'Relatório de estudos de estabilidade' },
      { value: 'Template_Validation_Report', label: 'Relatório de Validação', description: 'Relatório de validação de processos' },
      { value: 'Template_Clinical_Report', label: 'Relatório Clínico', description: 'Relatório de estudos clínicos' }
    ]
  };

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

  const calculateComplianceScore = (docType: string, fields: Record<string, any>, content: string) => {
    const requiredFields = {
      'CTD': ['Responsável', 'Produto', 'Indicação'],
      'CAPA': ['Responsável', 'Tipo de Desvio', 'Ação Corretiva'],
      'SOP': ['Responsável', 'Processo', 'Departamento'],
      'Relatório': ['Responsável', 'Tipo de Estudo', 'Data de Início']
    };

    const required = requiredFields[docType as keyof typeof requiredFields] || [];
    const providedFields = Object.keys(fields);
    const fieldScore = (providedFields.filter(f => required.includes(f)).length / required.length) * 50;
    const contentScore = content.length > 100 ? 50 : (content.length / 100) * 50;
    
    return Math.round(fieldScore + contentScore);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await generateDocument({
      doc_type: docType,
      template_name: templateName,
      context,
      fields: parsedFields,
    });
    
    if (res?.output_md) {
      setOutputMd(res.output_md);
      const score = calculateComplianceScore(docType, parsedFields, res.output_md);
      setComplianceScore(score);
    }
  };

  const handleExportPDF = () => {
    if (!outputMd) return;
    
    // Create a simple HTML version for PDF export
    const htmlContent = `
      <html>
        <head>
          <title>${docType} - ${templateName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1, h2, h3 { color: #333; }
            .header { border-bottom: 2px solid #0066cc; padding-bottom: 10px; margin-bottom: 20px; }
            .compliance { background: #f0f9ff; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${docType} - ${templateName}</h1>
            <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          ${complianceScore !== null ? `
            <div class="compliance">
              <strong>Score de Conformidade: ${complianceScore}%</strong>
            </div>
          ` : ''}
          <div>${outputMd.replace(/\n/g, '<br>')}</div>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docType}_${templateName}_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Documento exportado",
      description: "O documento foi exportado em formato HTML",
    });
  };

  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertCircle className="h-4 w-4 text-yellow-600" />;
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
                      <Label htmlFor="docType">Tipo de Documento</Label>
                      <Select value={docType} onValueChange={(value) => {
                        setDocType(value);
                        setTemplateName(documentTemplates[value as keyof typeof documentTemplates]?.[0]?.value || '');
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(documentTemplates).map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="template">Template</Label>
                      <Select value={templateName} onValueChange={setTemplateName}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {documentTemplates[docType as keyof typeof documentTemplates]?.map((template) => (
                            <SelectItem key={template.value} value={template.value}>
                              <div className="flex flex-col">
                                <span>{template.label}</span>
                                <span className="text-xs text-muted-foreground">{template.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="context">Contexto</Label>
                    <Textarea 
                      id="context" 
                      value={context} 
                      onChange={(e) => setContext(e.target.value)} 
                      placeholder="Descrição do projeto/produto, premissas, requisitos"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fields">Campos Obrigatórios (chave: valor por linha)</Label>
                    <Textarea 
                      id="fields" 
                      value={fieldsText} 
                      onChange={(e) => setFieldsText(e.target.value)} 
                      placeholder="Responsável: Dr. Silva&#10;Produto: Genérico oral&#10;Linha: Sólidos"
                      rows={4}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Gerando...' : 'Gerar Documento'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Resultado
                  {complianceScore !== null && (
                    <div className="flex items-center space-x-2">
                      {getComplianceIcon(complianceScore)}
                      <Badge variant="outline" className={getComplianceColor(complianceScore)}>
                        {complianceScore}% Conformidade
                      </Badge>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {complianceScore !== null && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Score de Conformidade</span>
                      <span className={`text-sm font-bold ${getComplianceColor(complianceScore)}`}>
                        {complianceScore}%
                      </span>
                    </div>
                    <Progress value={complianceScore} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Insuficiente</span>
                      <span>Adequado</span>
                      <span>Excelente</span>
                    </div>
                  </div>
                )}

                {outputMd ? (
                  <>
                    <article className="prose prose-sm md:prose dark:prose-invert max-w-none whitespace-pre-wrap mb-4 max-h-96 overflow-y-auto p-4 bg-muted rounded-lg">
                      {outputMd}
                    </article>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={handleExportPDF}>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar HTML
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const content = `Via agente: Assistente de Documentação\nTipo: ${docType || '-'} • Template: ${templateName || '-'}\nScore de Conformidade: ${complianceScore}%\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          sendToMasterChat(content, { metadata: { module: 'documentation' } });
                        }}
                      >
                        Enviar para chat
                      </Button>
                      <Button
                        onClick={() => {
                          const content = `Via agente: Assistente de Documentação (novo chat)\nTipo: ${docType || '-'} • Template: ${templateName || '-'}\nScore de Conformidade: ${complianceScore}%\n\n${outputMd || '(sem resultado — enviando contexto)'}\n`;
                          const title = `${docType} ${templateName}`.trim() || 'Documento';
                          sendToMasterChat(content, { newThread: true, title, metadata: { module: 'documentation' } });
                        }}
                      >
                        Novo chat com este resultado
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">O conteúdo em Markdown aparecerá aqui após a geração.</p>
                  </div>
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
