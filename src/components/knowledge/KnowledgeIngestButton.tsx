
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Download, Plus } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';

const KnowledgeIngestButton = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceType, setSourceType] = useState('');
  const [loading, setLoading] = useState(false);
  const { ingest } = useKnowledgeBase();

  const handleIngest = async () => {
    if (!title || !content) return;
    
    setLoading(true);
    try {
      await ingest({
        title,
        content,
        source_url: sourceUrl || undefined,
        source_type: sourceType || 'manual'
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setSourceUrl('');
      setSourceType('');
    } catch (error) {
      console.error('Error ingesting content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = (templateName: string) => {
    const templateUrl = `/templates/${templateName}`;
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = templateName;
    link.click();
  };

  const availableTemplates = [
    'BusinessCase_Full.md',
    'Template_CTD_Module2.md',
    'Template_CTD_Module3.md',
    'Template_SOP_Validation.md',
    'Template_Validation_Report.md',
    'SWOT_Full.md',
    'RegulatoryTimeline_Full.md',
    'ProjectManagement_Full.md',
    'Market_Framework_Full.md',
    'TechnicalBusinessCase_Full.md'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Ingerir Novo Conteúdo</span>
          </CardTitle>
          <CardDescription>
            Adicione conteúdo à base de conhecimento para busca RAG
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Template Business Case Farmacêutico"
            />
          </div>

          <div>
            <Label htmlFor="sourceType">Tipo de Fonte</Label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="sop">SOP</SelectItem>
                <SelectItem value="guideline">Guideline</SelectItem>
                <SelectItem value="regulation">Regulamentação</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sourceUrl">URL da Fonte (opcional)</Label>
            <Input
              id="sourceUrl"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Cole o conteúdo em texto ou Markdown..."
              rows={8}
            />
          </div>

          <Button onClick={handleIngest} disabled={loading || !title || !content} className="w-full">
            {loading ? 'Processando...' : 'Ingerir Conteúdo'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Templates Disponíveis</span>
          </CardTitle>
          <CardDescription>
            Baixe templates prontos para usar na sua base de conhecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableTemplates.map((template) => (
              <div key={template} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">
                  {template.replace(/[_\.]/g, ' ').replace('.md', '')}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadTemplate(template)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeIngestButton;
