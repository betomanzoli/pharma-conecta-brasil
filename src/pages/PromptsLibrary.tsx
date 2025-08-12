
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import { Search, BookOpen, Briefcase, FileText, Shield, Zap } from 'lucide-react';

interface PromptItem {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  tags: string[];
}

const PromptsLibrary = () => {
  const { redirectToChat } = useMasterChatBridge();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const prompts: PromptItem[] = [
    {
      id: '1',
      title: 'Análise de Viabilidade Regulatória',
      description: 'Avalie a viabilidade regulatória de um novo produto farmacêutico',
      category: 'regulatory',
      prompt: 'Analise a viabilidade regulatória para [PRODUTO] considerando:\n- Classificação regulatória\n- Requisitos para registro\n- Timeline estimado\n- Principais desafios\n- Estratégia recomendada',
      tags: ['anvisa', 'regulatório', 'viabilidade']
    },
    {
      id: '2',
      title: 'Business Case Farmacêutico',
      description: 'Estruture um business case completo para oportunidades no setor',
      category: 'business',
      prompt: 'Crie um business case para [OPORTUNIDADE] incluindo:\n- Análise de mercado\n- Proposta de valor\n- Modelo financeiro\n- Análise de riscos\n- Cronograma de implementação\n- ROI esperado',
      tags: ['business', 'estratégia', 'financeiro']
    },
    {
      id: '3',
      title: 'Documentação CTD',
      description: 'Gere estrutura para documentação CTD (Common Technical Document)',
      category: 'documentation',
      prompt: 'Estruture a documentação CTD para [PRODUTO] com:\n- Módulo 1: Informações administrativas\n- Módulo 2: Resumos\n- Módulo 3: Qualidade\n- Módulo 4: Segurança não-clínica\n- Módulo 5: Eficácia clínica',
      tags: ['ctd', 'documentação', 'registro']
    },
    {
      id: '4',
      title: 'Análise SWOT Farmacêutica',
      description: 'Conduza análise SWOT específica para o setor farmacêutico',
      category: 'strategic',
      prompt: 'Realize análise SWOT para [EMPRESA/PRODUTO] considerando:\n- Forças: Capacidades internas, IP, expertise\n- Fraquezas: Limitações, gaps regulatórios\n- Oportunidades: Mercado, parcerias, tendências\n- Ameaças: Concorrência, mudanças regulatórias',
      tags: ['swot', 'estratégia', 'análise']
    },
    {
      id: '5',
      title: 'Planejamento de Estudos Clínicos',
      description: 'Estruture o planejamento completo de estudos clínicos',
      category: 'clinical',
      prompt: 'Planeje estudos clínicos para [INDICAÇÃO] incluindo:\n- Desenho do estudo\n- População alvo\n- Endpoints primários/secundários\n- Cronograma\n- Orçamento estimado\n- Considerações regulatórias',
      tags: ['clínico', 'estudos', 'planejamento']
    },
    {
      id: '6',
      title: 'Análise Competitiva',
      description: 'Análise detalhada da concorrência no mercado farmacêutico',
      category: 'competitive',
      prompt: 'Analise a concorrência para [ÁREA TERAPÊUTICA] considerando:\n- Principais players\n- Produtos em desenvolvimento\n- Estratégias de mercado\n- Posicionamento\n- Oportunidades de diferenciação',
      tags: ['competitivo', 'mercado', 'posicionamento']
    }
  ];

  const categories = [
    { id: 'all', label: 'Todos', icon: BookOpen },
    { id: 'regulatory', label: 'Regulatório', icon: Shield },
    { id: 'business', label: 'Negócios', icon: Briefcase },
    { id: 'documentation', label: 'Documentação', icon: FileText },
    { id: 'strategic', label: 'Estratégico', icon: Zap },
    { id: 'clinical', label: 'Clínico', icon: Search },
    { id: 'competitive', label: 'Competitivo', icon: Briefcase }
  ];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    document.title = 'Biblioteca de Prompts | PharmaConnect';
  }, []);

  const handleUsePrompt = (prompt: PromptItem) => {
    const content = `Prompt da biblioteca: ${prompt.title}\n\n${prompt.prompt}\n\n---\nPersonalize este prompt com suas informações específicas.`;
    redirectToChat(content, { 
      metadata: { 
        module: 'prompts_library',
        promptId: prompt.id,
        category: prompt.category 
      } 
    });
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Biblioteca de Prompts</h1>
            <p className="text-muted-foreground">
              Prompts especializados para o setor farmacêutico prontos para usar
            </p>
          </div>

          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{prompt.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleUsePrompt(prompt)}
                      className="w-full"
                      size="sm"
                    >
                      Usar Prompt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhum prompt encontrado com os critérios de busca.
              </p>
            </div>
          )}
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default PromptsLibrary;
