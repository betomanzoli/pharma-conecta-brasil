
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Target, Briefcase } from 'lucide-react';
import { useAIAgent } from '@/hooks/useAIAgent';
import { useToast } from '@/hooks/use-toast';
import AgentHandoffButton from '../AgentHandoffButton';

const ProjectAnalystAgent = () => {
  const { analyzeProject, loading } = useAIAgent();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    scope: '',
    stakeholders: '',
    risks: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.objective.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e objetivo do projeto são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await analyzeProject(formData);
      if (result) {
        setAnalysis(result);
        toast({
          title: "Project Charter Gerado",
          description: "Análise de projeto concluída com sucesso"
        });
      }
    } catch (error) {
      console.error('Erro na análise:', error);
    }
  };

  const stakeholderTypes = [
    'Diretoria Executiva',
    'Gerência de P&D',
    'Assuntos Regulatórios',
    'Qualidade',
    'Produção',
    'Marketing',
    'Consultores Externos',
    'Órgãos Reguladores'
  ];

  const riskCategories = [
    'Técnico',
    'Regulatório', 
    'Financeiro',
    'Cronograma',
    'Mercado',
    'Qualidade',
    'Fornecimento',
    'Recursos Humanos'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Analista de Projetos IA</h2>
            <p className="text-muted-foreground">
              Criação de Project Charter e gerenciamento de projetos
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>Definição do Projeto</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Título do Projeto *</label>
                <Input
                  placeholder="Ex: Desenvolvimento de Medicamento Genérico XYZ"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Objetivo do Projeto *</label>
                <Textarea
                  placeholder="Descreva o objetivo principal e metas específicas..."
                  value={formData.objective}
                  onChange={(e) => setFormData({...formData, objective: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Escopo do Projeto</label>
                <Textarea
                  placeholder="Defina o que está incluído e excluído do projeto..."
                  value={formData.scope}
                  onChange={(e) => setFormData({...formData, scope: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Stakeholders</label>
                <Textarea
                  placeholder="Liste os principais stakeholders e suas responsabilidades..."
                  value={formData.stakeholders}
                  onChange={(e) => setFormData({...formData, stakeholders: e.target.value})}
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Riscos Identificados</label>
                <Textarea
                  placeholder="Descreva os principais riscos e preocupações..."
                  value={formData.risks}
                  onChange={(e) => setFormData({...formData, risks: e.target.value})}
                  rows={2}
                />
              </div>

              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                <Target className="h-4 w-4 mr-2" />
                {loading ? 'Gerando...' : 'Gerar Project Charter'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipos de Stakeholders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stakeholderTypes.map((type, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categorias de Risco</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {riskCategories.map((risk, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {risk}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Métricas do Projeto</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Complexidade</span>
                    <Badge className="bg-blue-100 text-blue-800">Média</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duração Estimada</span>
                    <Badge className="bg-green-100 text-green-800">18 meses</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Nível de Risco</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Moderado</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Stakeholders</span>
                    <Badge className="bg-purple-100 text-purple-800">8 grupos</Badge>
                  </div>
                  <div className="mt-4">
                    <AgentHandoffButton
                      sourceAgent="project_analyst"
                      targetAgents={['document_assistant', 'coordinator']}
                      agentOutputId={analysis.id}
                      outputData={{
                        project_charter: analysis.output_md,
                        complexity: 'medium',
                        duration: '18_months',
                        stakeholder_count: 8
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {analysis && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle>Project Charter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                {analysis.output_md}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectAnalystAgent;
