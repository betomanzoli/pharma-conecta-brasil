
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, Search, Star } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';

const DocumentationAssistant = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  const templateCategories = [
    {
      name: 'Business Case & Estratégia',
      templates: [
        { name: 'BusinessCase_Full.md', description: 'Business case farmacêutico completo', rating: 4.9 },
        { name: 'SWOT_Full.md', description: 'Matriz SWOT especializada', rating: 4.8 },
        { name: 'Market_Framework_Full.md', description: 'Framework de análise de mercado', rating: 4.7 }
      ]
    },
    {
      name: 'Técnico & Regulatório',
      templates: [
        { name: 'TechnicalBusinessCase_Full.md', description: 'Business case técnico', rating: 4.8 },
        { name: 'RegulatoryAnalysis_Matrix_Full.md', description: 'Matriz de análise regulatória', rating: 4.9 },
        { name: 'ManufacturingQuality_Framework_Full.md', description: 'Framework manufatura & qualidade', rating: 4.6 }
      ]
    },
    {
      name: 'Gestão de Projetos',
      templates: [
        { name: 'ProjectManagement_Full.md', description: 'Project management completo', rating: 4.7 },
        { name: 'StakeholderMatrix_Full.md', description: 'Matriz de stakeholders', rating: 4.5 },
        { name: 'RegulatoryTimeline_Full.md', description: 'Timeline regulatório', rating: 4.8 }
      ]
    },
    {
      name: 'Documentação CTD',
      templates: [
        { name: 'Template_CTD_Full.md', description: 'CTD Common Technical Document', rating: 4.9 },
        { name: 'Template_CTD_Module2.md', description: 'CTD Módulo 2 - Resumos', rating: 4.7 },
        { name: 'Template_CTD_Module3.md', description: 'CTD Módulo 3 - Qualidade', rating: 4.8 }
      ]
    },
    {
      name: 'CAPA & Investigação',
      templates: [
        { name: 'Template_CAPA_Deviation.md', description: 'CAPA para desvios de processo', rating: 4.6 },
        { name: 'Template_CAPA_Investigation.md', description: 'CAPA para investigações', rating: 4.7 },
        { name: 'Template_CAPA_Customer.md', description: 'CAPA para reclamações de clientes', rating: 4.5 }
      ]
    },
    {
      name: 'SOPs & Qualidade',
      templates: [
        { name: 'Template_SOP_GMP.md', description: 'SOP conformidade GMP', rating: 4.8 },
        { name: 'Template_SOP_Quality.md', description: 'SOP controle de qualidade', rating: 4.7 },
        { name: 'Template_SOP_Validation.md', description: 'SOP validação de processos', rating: 4.6 }
      ]
    },
    {
      name: 'Relatórios Técnicos',
      templates: [
        { name: 'Template_Stability_Report.md', description: 'Relatório de estabilidade', rating: 4.8 },
        { name: 'Template_Validation_Report.md', description: 'Relatório de validação', rating: 4.7 },
        { name: 'Template_Clinical_Report.md', description: 'Relatório clínico', rating: 4.9 }
      ]
    }
  ];

  const downloadTemplate = async (templateName: string) => {
    try {
      const response = await fetch(`/templates/${templateName}`);
      if (!response.ok) throw new Error('Template não encontrado');
      
      const content = await response.text();
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = templateName;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Download concluído',
        description: `Template ${templateName} baixado com sucesso`,
      });
    } catch (error) {
      toast({
        title: 'Erro no download',
        description: 'Não foi possível baixar o template',
        variant: 'destructive'
      });
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Assistente de Documentação</h1>
                <p className="text-muted-foreground">
                  Templates profissionais para documentação farmacêutica
                </p>
              </div>
            </div>
            <Badge variant="secondary">Agente 4 - Documentation</Badge>
          </div>

          <Alert className="mb-6">
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Biblioteca de Templates:</strong> Acesse templates profissionais em formato 
              Markdown, prontos para customização e uso em projetos farmacêuticos.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            {templateCategories.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>{category.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.templates.map((template) => (
                      <Card key={template.name} className="border-2 hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium">
                              {template.name.replace('.md', '')}
                            </CardTitle>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-xs font-medium">{template.rating}</span>
                            </div>
                          </div>
                          <CardDescription className="text-xs">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button
                            onClick={() => downloadTemplate(template.name)}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Download className="h-3 w-3 mr-2" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Como Usar os Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">1. Download e Customização</h4>
                  <p className="text-sm text-muted-foreground">
                    Baixe o template desejado e abra em qualquer editor de Markdown ou texto. 
                    Substitua os campos entre [COLCHETES] pelas informações específicas do seu projeto.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Branding Automático</h4>
                  <p className="text-sm text-muted-foreground">
                    Todos os templates incluem automaticamente o logo PharmaConnect Brasil 
                    para manter a consistência visual em seus documentos.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Compliance Garantido</h4>
                  <p className="text-sm text-muted-foreground">
                    Templates seguem padrões ANVISA, FDA, EMA e ICH Guidelines, 
                    garantindo conformidade regulatória em seus documentos.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4. Versionamento</h4>
                  <p className="text-sm text-muted-foreground">
                    Mantenha controle de versão dos documentos e utilize os templates 
                    como base para documentação consistente entre projetos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default DocumentationAssistant;
