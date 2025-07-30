
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, FileText, Users, Calendar, Target, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'Baixa' | 'Média' | 'Alta';
  duration: string;
  phases: string[];
  aiFeatures: string[];
  icon: any;
  color: string;
}

interface AIProjectTemplatesProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
}

const AIProjectTemplates: React.FC<AIProjectTemplatesProps> = ({ onSelectTemplate }) => {
  const { toast } = useToast();

  const templates: ProjectTemplate[] = [
    {
      id: 'pharma-rd',
      name: 'P&D Farmacêutico Inteligente',
      description: 'Template para projetos de pesquisa e desenvolvimento com IA integrada',
      category: 'Pesquisa & Desenvolvimento',
      complexity: 'Alta',
      duration: '12-18 meses',
      phases: ['Descoberta', 'Desenvolvimento', 'Testes Pré-clínicos', 'Validação'],
      aiFeatures: ['Análise preditiva de eficácia', 'Otimização de formulação', 'Monitoramento de riscos'],
      icon: Brain,
      color: 'bg-purple-500'
    },
    {
      id: 'regulatory-submission',
      name: 'Submissão Regulatória Assistida',
      description: 'Template para processos regulatórios com compliance automatizado',
      category: 'Regulatório',
      complexity: 'Média',
      duration: '6-9 meses',
      phases: ['Preparação', 'Documentação', 'Submissão', 'Acompanhamento'],
      aiFeatures: ['Verificação de compliance', 'Geração de documentos', 'Tracking regulatório'],
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      id: 'manufacturing-optimization',
      name: 'Otimização de Produção',
      description: 'Template para otimização de processos produtivos',
      category: 'Produção',
      complexity: 'Média',
      duration: '3-6 meses',
      phases: ['Análise', 'Otimização', 'Implementação', 'Validação'],
      aiFeatures: ['Análise de eficiência', 'Predição de qualidade', 'Otimização de recursos'],
      icon: Target,
      color: 'bg-green-500'
    },
    {
      id: 'partnership-project',
      name: 'Projeto Colaborativo',
      description: 'Template para projetos entre múltiplos parceiros',
      category: 'Colaboração',
      complexity: 'Baixa',
      duration: '2-4 meses',
      phases: ['Alinhamento', 'Execução', 'Integração', 'Entrega'],
      aiFeatures: ['Matching de parceiros', 'Governança inteligente', 'Comunicação otimizada'],
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Baixa': return 'bg-green-100 text-green-800';
      case 'Média': return 'bg-yellow-100 text-yellow-800';
      case 'Alta': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectTemplate = (template: ProjectTemplate) => {
    toast({
      title: "Template Selecionado",
      description: `Usando template: ${template.name}`
    });
    onSelectTemplate(template);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Templates de Projetos Inteligentes</h2>
        <p className="text-gray-600">Escolha um template otimizado para seu tipo de projeto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <div className={`p-3 rounded-lg ${template.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{template.category}</Badge>
                      <Badge className={getComplexityColor(template.complexity)}>
                        {template.complexity}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600">{template.description}</p>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2">Duração Estimada</h4>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{template.duration}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2">Fases do Projeto</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.phases.map((phase, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {phase}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center space-x-1">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span>Recursos de IA</span>
                  </h4>
                  <ul className="space-y-1">
                    {template.aiFeatures.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start space-x-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  onClick={() => handleSelectTemplate(template)}
                  className="w-full"
                  variant="outline"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="text-center py-8">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Template Personalizado</h3>
          <p className="text-gray-600 mb-4">
            Crie um template personalizado baseado nas suas necessidades específicas
          </p>
          <Button variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Criar Template Personalizado
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIProjectTemplates;
