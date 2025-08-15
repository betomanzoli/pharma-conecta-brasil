
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, FileCheck, AlertCircle } from 'lucide-react';
import { useAIDocumentAssistant } from '@/hooks/useAIDocumentAssistant';
import { useToast } from '@/hooks/use-toast';
import AgentHandoffButton from '../AgentHandoffButton';

const DocumentAssistantAgent = () => {
  const { generateDocument, loading } = useAIDocumentAssistant();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    doc_type: '',
    template_name: '',
    context: ''
  });
  const [document, setDocument] = useState<any>(null);

  const documentTypes = [
    { value: 'sop', label: 'SOP - Procedimento Operacional Padrão', icon: FileCheck },
    { value: 'capa', label: 'CAPA - Ação Corretiva/Preventiva', icon: AlertCircle },
    { value: 'stability_report', label: 'Relatório de Estabilidade', icon: FileText },
    { value: 'clinical_protocol', label: 'Protocolo Clínico', icon: FileText },
    { value: 'registration_dossier', label: 'Dossiê de Registro', icon: FileText },
    { value: 'quality_manual', label: 'Manual da Qualidade', icon: FileCheck },
    { value: 'validation_report', label: 'Relatório de Validação', icon: FileCheck },
    { value: 'risk_assessment', label: 'Avaliação de Risco', icon: AlertCircle }
  ];

  const templates = {
    sop: [
      'Controle de Qualidade de Matérias-Primas',
      'Limpeza e Sanitização de Equipamentos',
      'Manuseio de Desvios de Qualidade',
      'Calibração de Instrumentos',
      'Controle de Documentos'
    ],
    capa: [
      'Desvio em Especificação de Produto',
      'Falha em Equipamento Crítico',
      'Contaminação Microbiológica',
      'Erro em Rotulagem',
      'Não Conformidade em Auditoria'
    ],
    clinical_protocol: [
      'Estudo de Bioequivalência',
      'Fase I - Segurança',
      'Fase II - Eficácia',
      'Fase III - Comparativo',
      'Estudo Pós-Marketing'
    ]
  };

  const handleSubmit = async () => {
    if (!formData.doc_type) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione o tipo de documento",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await generateDocument({
        doc_type: formData.doc_type,
        template_name: formData.template_name,
        context: formData.context,
        fields: {
          company_name: 'Sua Empresa',
          date: new Date().toISOString().split('T')[0]
        }
      });

      if (result) {
        setDocument(result);
        toast({
          title: "Documento Gerado",
          description: "Template criado com sucesso"
        });
      }
    } catch (error) {
      console.error('Erro na geração:', error);
    }
  };

  const downloadDocument = () => {
    if (!document) return;

    const content = `# ${documentTypes.find(t => t.value === formData.doc_type)?.label}

${document.output_md}

---
*Gerado pelo Assistente de Documentação IA*
*Data: ${new Date().toLocaleDateString('pt-BR')}*`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.doc_type}_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado",
      description: "Documento salvo com sucesso"
    });
  };

  const selectedDocType = documentTypes.find(t => t.value === formData.doc_type);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Assistente de Documentação IA</h2>
            <p className="text-muted-foreground">
              Geração inteligente de documentos regulatórios e de qualidade
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Geração de Documento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo de Documento *</label>
                <Select value={formData.doc_type} onValueChange={(value) => setFormData({...formData, doc_type: value, template_name: ''})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {formData.doc_type && templates[formData.doc_type as keyof typeof templates] && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Template Específico</label>
                  <Select value={formData.template_name} onValueChange={(value) => setFormData({...formData, template_name: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates[formData.doc_type as keyof typeof templates].map((template) => (
                        <SelectItem key={template} value={template}>
                          {template}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Contexto Adicional</label>
                <Textarea
                  placeholder="Forneça informações específicas sobre o documento que precisa gerar..."
                  value={formData.context}
                  onChange={(e) => setFormData({...formData, context: e.target.value})}
                  rows={4}
                />
              </div>

              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                {loading ? 'Gerando...' : 'Gerar Documento'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipos de Documento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documentTypes.slice(0, 4).map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.value} className="flex items-center space-x-2 p-2 rounded-lg border">
                      <Icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{type.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {document && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documento Gerado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {selectedDocType && <selectedDocType.icon className="h-4 w-4" />}
                    <span className="text-sm font-medium">{selectedDocType?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className="bg-green-100 text-green-800">Concluído</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tamanho</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {Math.round(document.output_md.length / 1000)}KB
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Button onClick={downloadDocument} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Documento
                    </Button>
                    <AgentHandoffButton
                      sourceAgent="document_assistant"
                      targetAgents={['coordinator']}
                      agentOutputId={document.id}
                      outputData={{
                        document_type: formData.doc_type,
                        template_used: formData.template_name,
                        content: document.output_md
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {document && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle>Preview do Documento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                {document.output_md}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentAssistantAgent;
