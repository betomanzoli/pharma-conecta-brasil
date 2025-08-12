
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, MessageSquare, Copy, Star } from 'lucide-react';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import { useToast } from '@/hooks/use-toast';

const PromptLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { redirectToChat } = useMasterChatBridge();
  const { toast } = useToast();

  const prompts = [
    {
      id: 'regulatory-analysis',
      title: 'Análise Regulatória Completa',
      description: 'Análise abrangente de requisitos regulatórios para novos produtos',
      category: 'Regulatório',
      difficulty: 'Avançado',
      rating: 4.8,
      usage: 156,
      prompt: `Realize uma análise regulatória completa para [PRODUTO] considerando:

1. Classificação regulatória (ANVISA, FDA, EMA)
2. Requisitos de documentação
3. Timeline de aprovação
4. Estudos necessários
5. Custos estimados
6. Riscos regulatórios
7. Estratégias de mitigação

Produto: [DESCREVA SEU PRODUTO]
Mercados alvo: [BRASIL/INTERNACIONAL]
Classe terapêutica: [ESPECIFIQUE]`
    },
    {
      id: 'business-case',
      title: 'Business Case Farmacêutico',
      description: 'Estrutura completa para desenvolvimento de business case',
      category: 'Estratégia',
      difficulty: 'Intermediário',
      rating: 4.6,
      usage: 203,
      prompt: `Desenvolva um business case completo para [OPORTUNIDADE] incluindo:

1. Resumo executivo
2. Análise de mercado e concorrência
3. Proposta de valor única
4. Modelo de negócio
5. Projeções financeiras (5 anos)
6. Análise de riscos
7. Cronograma de implementação
8. Recursos necessários
9. KPIs e métricas de sucesso

Oportunidade: [DESCREVA]
Investimento previsto: [VALOR]
Mercado alvo: [SEGMENTO]`
    },
    {
      id: 'market-intelligence',
      title: 'Inteligência de Mercado',
      description: 'Análise profunda de mercado e tendências farmacêuticas',
      category: 'Mercado',
      difficulty: 'Avançado',
      rating: 4.7,
      usage: 134,
      prompt: `Conduza uma análise de inteligência de mercado para [ÁREA TERAPÊUTICA]:

1. Tamanho de mercado (TAM, SAM, SOM)
2. Principais players e participação
3. Tendências emergentes
4. Análise de pipeline de concorrentes
5. Oportunidades de diferenciação
6. Barreiras de entrada
7. Projeções de crescimento
8. Fatores de risco e oportunidade

Área terapêutica: [ESPECIFIQUE]
Geografia: [BRASIL/GLOBAL]
Horizonte temporal: [1-5 ANOS]`
    },
    {
      id: 'partnership-strategy',
      title: 'Estratégia de Parcerias',
      description: 'Framework para identificação e desenvolvimento de parcerias',
      category: 'Parcerias',
      difficulty: 'Intermediário',
      rating: 4.5,
      usage: 89,
      prompt: `Desenvolva uma estratégia de parcerias para [OBJETIVO]:

1. Mapeamento de parceiros potenciais
2. Critérios de seleção
3. Modelos de parceria (joint venture, licensing, etc.)
4. Estrutura de negociação
5. Termos e condições chave
6. Métricas de sucesso
7. Gestão de relacionamento
8. Plano de implementação

Objetivo da parceria: [DESCREVA]
Tipo de parceiro procurado: [ESPECIFIQUE]
Recursos disponíveis: [DETALHE]`
    },
    {
      id: 'risk-assessment',
      title: 'Avaliação de Riscos Farmacêuticos',
      description: 'Análise sistemática de riscos em projetos farmacêuticos',
      category: 'Gestão',
      difficulty: 'Avançado',
      rating: 4.9,
      usage: 167,
      prompt: `Realize uma avaliação abrangente de riscos para [PROJETO]:

1. Identificação de riscos por categoria:
   - Regulatórios
   - Técnicos/Científicos
   - Comerciais
   - Financeiros
   - Operacionais

2. Análise de probabilidade e impacto
3. Matriz de riscos
4. Estratégias de mitigação
5. Planos de contingência
6. Indicadores de alerta precoce
7. Responsabilidades e governança
8. Monitoramento contínuo

Projeto: [DESCREVA]
Fase do projeto: [DESCOBERTA/DESENVOLVIMENTO/COMERCIALIZAÇÃO]
Investimento: [VALOR]`
    },
    {
      id: 'innovation-roadmap',
      title: 'Roadmap de Inovação',
      description: 'Planejamento estratégico de inovação farmacêutica',
      category: 'Inovação',
      difficulty: 'Avançado',
      rating: 4.4,
      usage: 92,
      prompt: `Crie um roadmap de inovação para [ÁREA DE FOCO]:

1. Análise do estado atual da inovação
2. Identificação de gaps tecnológicos
3. Mapeamento de tendências emergentes
4. Oportunidades de P&D
5. Timeline de desenvolvimento
6. Recursos e investimentos necessários
7. Parcerias estratégicas
8. Marcos e entregáveis
9. Métricas de inovação

Área de foco: [ESPECIFIQUE]
Horizonte temporal: [2-10 ANOS]
Orçamento disponível: [RANGE]`
    }
  ];

  const categories = ['Todos', 'Regulatório', 'Estratégia', 'Mercado', 'Parcerias', 'Gestão', 'Inovação'];

  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseInChat = (prompt: any) => {
    redirectToChat(prompt.prompt, {
      title: prompt.title,
      category: prompt.category,
      id: prompt.id
    });
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: 'Prompt copiado',
      description: 'O prompt foi copiado para a área de transferência'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Biblioteca de Prompts</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Prompts especializados para acelerar sua análise farmacêutica com IA
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-7">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs">
                    {prompt.category}
                  </Badge>
                  <Badge className={getDifficultyColor(prompt.difficulty)} variant="secondary">
                    {prompt.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{prompt.title}</CardTitle>
                <CardDescription>{prompt.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {prompt.rating}
                    </div>
                    <div>{prompt.usage} usos</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    <p className="line-clamp-3">{prompt.prompt}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleUseInChat(prompt)}
                      className="flex-1"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Usar no Chat
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCopyPrompt(prompt.prompt)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum prompt encontrado</h3>
            <p className="text-gray-500">Tente ajustar sua busca ou filtros</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptLibrary;
