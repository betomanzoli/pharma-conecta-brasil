
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const KnowledgeIngestButton = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const manualTemplates = [
    'BusinessCase_Full.md',
    'SWOT_Full.md', 
    'Market_Framework_Full.md',
    'TechnicalBusinessCase_Full.md',
    'RegulatoryAnalysis_Matrix_Full.md',
    'ManufacturingQuality_Framework_Full.md',
    'ProjectManagement_Full.md',
    'StakeholderMatrix_Full.md',
    'RegulatoryTimeline_Full.md',
    'Template_CTD_Full.md',
    'Template_CAPA_Deviation.md',
    'Template_CAPA_Investigation.md',
    'Template_CAPA_Customer.md',
    'Template_SOP_GMP.md',
    'Template_SOP_Quality.md',
    'Template_SOP_Validation.md',
    'Template_Stability_Report.md',
    'Template_Validation_Report.md',
    'Template_Clinical_Report.md',
    'Template_CTD_Module2.md',
    'Template_CTD_Module3.md'
  ];

  const ingestManualContent = async () => {
    setLoading(true);
    setStatus('idle');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      let successCount = 0;
      let errorCount = 0;

      for (const templateName of manualTemplates) {
        try {
          // Fetch template content
          const response = await fetch(`/templates/${templateName}`);
          if (!response.ok) {
            console.warn(`Template ${templateName} not found`);
            errorCount++;
            continue;
          }

          const content = await response.text();
          
          // Create knowledge source
          const { data: source, error: sourceError } = await supabase
            .from('knowledge_sources')
            .insert({
              user_id: user.id,
              title: templateName.replace('.md', '').replace('_', ' '),
              source_type: 'manual',
              source_url: `/templates/${templateName}`,
              metadata: {
                category: getTemplateCategory(templateName),
                template_type: templateName,
                agent_relevance: getAgentRelevance(templateName)
              }
            })
            .select()
            .single();

          if (sourceError) throw sourceError;

          // Create knowledge chunks (split by sections)
          const sections = content.split('\n## ').filter(section => section.trim());
          
          for (let i = 0; i < sections.length; i++) {
            const chunkContent = i === 0 ? sections[i] : `## ${sections[i]}`;
            
            const { error: chunkError } = await supabase
              .from('knowledge_chunks')
              .insert({
                user_id: user.id,
                source_id: source.id,
                content: chunkContent.substring(0, 8000), // Limit chunk size
                chunk_index: i,
                metadata: {
                  section_title: extractSectionTitle(chunkContent),
                  word_count: chunkContent.split(' ').length
                }
              });

            if (chunkError) throw chunkError;
          }

          successCount++;
        } catch (error) {
          console.error(`Error ingesting ${templateName}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        setStatus('success');
        toast({
          title: 'Conteúdo ingerido com sucesso',
          description: `${successCount} templates adicionados à base de conhecimento`,
        });
      } else {
        setStatus('error');
        toast({
          title: 'Erro na ingestão',
          description: 'Não foi possível adicionar o conteúdo',
          variant: 'destructive'
        });
      }

    } catch (error) {
      console.error('Error in manual ingestion:', error);
      setStatus('error');
      toast({
        title: 'Erro na ingestão',
        description: 'Falha ao processar templates',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getTemplateCategory = (templateName: string): string => {
    if (templateName.includes('BusinessCase') || templateName.includes('SWOT') || templateName.includes('Market')) {
      return 'business_strategy';
    }
    if (templateName.includes('Technical') || templateName.includes('Regulatory') || templateName.includes('Manufacturing')) {
      return 'technical_regulatory';
    }
    if (templateName.includes('Project') || templateName.includes('Stakeholder')) {
      return 'project_management';
    }
    if (templateName.includes('CTD') || templateName.includes('CAPA') || templateName.includes('SOP')) {
      return 'documentation';
    }
    return 'general';
  };

  const getAgentRelevance = (templateName: string): string[] => {
    const agents = [];
    if (templateName.includes('BusinessCase') || templateName.includes('SWOT') || templateName.includes('Market')) {
      agents.push('business_strategist');
    }
    if (templateName.includes('Technical') || templateName.includes('Regulatory') || templateName.includes('Manufacturing')) {
      agents.push('technical_regulatory');
    }
    if (templateName.includes('Project') || templateName.includes('Stakeholder')) {
      agents.push('project_analyst');
    }
    if (templateName.includes('CTD') || templateName.includes('CAPA') || templateName.includes('SOP')) {
      agents.push('document_assistant');
    }
    return agents;
  };

  const extractSectionTitle = (content: string): string => {
    const lines = content.split('\n');
    const titleLine = lines.find(line => line.startsWith('##') || line.startsWith('#'));
    return titleLine ? titleLine.replace(/^#+\s*/, '') : 'Untitled Section';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Ingerir Conteúdo do Manual</span>
        </CardTitle>
        <CardDescription>
          Adicione todos os templates e documentos do manual à base de conhecimento para busca RAG
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Este processo irá adicionar à base de conhecimento:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>21 templates profissionais</li>
              <li>Business cases e frameworks SWOT</li>
              <li>Documentação técnico-regulatória</li>
              <li>Templates CTD, CAPA e SOPs</li>
              <li>Relatórios de estabilidade e validação</li>
            </ul>
          </div>

          <Button 
            onClick={ingestManualContent}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Processando Templates...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Conteúdo Ingerido
              </>
            ) : status === 'error' ? (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Tentar Novamente
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Ingerir Conteúdo Manual
              </>
            )}
          </Button>

          {status === 'success' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                ✅ Templates adicionados com sucesso! Agora você pode fazer buscas inteligentes 
                na base de conhecimento usando RAG.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeIngestButton;
