
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Copy, 
  Star, 
  Tag, 
  Lightbulb,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
  Beaker
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  phase: string;
  tags: string[];
  rating: number;
  usage_count: number;
}

const PromptsLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();
  const { sendToMasterChat } = useMasterChatBridge();

  const prompts: Prompt[] = [
    {
      id: '1',
      title: 'Análise de Mercado Farmacêutico',
      description: 'Prompt para análise competitiva e oportunidades de mercado',
      content: 'Analise o mercado farmacêutico para [PRODUTO] considerando: 1) Concorrentes diretos e indiretos 2) Tamanho do mercado e crescimento 3) Barreiras de entrada 4) Oportunidades identificadas 5) Riscos e ameaças. Forneça dados quantitativos quando possível.',
      category: 'business',
      phase: 'planejamento',
      tags: ['mercado', 'competitivo', 'oportunidades'],
      rating: 4.8,
      usage_count: 142
    },
    {
      id: '2',
      title: 'Estratégia Regulatória ANVISA',
      description: 'Prompt para desenvolver estratégia de submissão à ANVISA',
      content: 'Desenvolva uma estratégia regulatória para submissão à ANVISA considerando: 1) Classificação do produto [TIPO_PRODUTO] 2) Via regulatória mais adequada 3) Documentos necessários 4) Timeline estimado 5) Marcos críticos 6) Potenciais obstáculos e mitigações.',
      category: 'regulatory',
      phase: 'desenvolvimento',
      tags: ['anvisa', 'estratégia', 'submissão'],
      rating: 4.9,
      usage_count: 89
    },
    {
      id: '3',
      title: 'Project Charter Farmacêutico',
      description: 'Template para criação de charter de projetos farmacêuticos',
      content: 'Crie um Project Charter para [NOME_PROJETO] incluindo: 1) Objetivos SMART 2) Escopo detalhado 3) Stakeholders chave 4) Marcos principais 5) Orçamento estimado 6) Riscos identificados 7) Critérios de sucesso 8) Cronograma macro.',
      category: 'project',
      phase: 'iniciação',
      tags: ['charter', 'planejamento', 'stakeholders'],
      rating: 4.7,
      usage_count: 156
    },
    {
      id: '4',
      title: 'Protocolo de Estabilidade',
      description: 'Prompt para elaboração de protocolos de estabilidade',
      content: 'Elabore um protocolo de estabilidade para [PRODUTO] considerando: 1) Condições de armazenamento (ICH) 2) Pontos de tempo 3) Parâmetros analíticos 4) Critérios de aceitação 5) Estatística aplicada 6) Plano de amostragem.',
      category: 'technical',
      phase: 'desenvolvimento',
      tags: ['estabilidade', 'protocolo', 'ich'],
      rating: 4.6,
      usage_count: 73
    },
    {
      id: '5',
      title: 'Dossiê CTD Módulo 2',
      description: 'Estrutura para elaboração do Módulo 2 do CTD',
      content: 'Estruture o Módulo 2 (Resumos) do CTD para [PRODUTO] incluindo: 1) Resumo de qualidade 2) Resumo não-clínico 3) Resumo clínico 4) Discussão de benefício-risco 5) Referências bibliográficas. Siga formato ICH M4.',
      category: 'documentation',
      phase: 'submissão',
      tags: ['ctd', 'módulo2', 'ich'],
      rating: 4.8,
      usage_count: 94
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: Tag },
    { id: 'business', name: 'Estratégia de Negócios', icon: TrendingUp },
    { id: 'regulatory', name: 'Regulatório', icon: FileText },
    { id: 'project', name: 'Gestão de Projetos', icon: Users },
    { id: 'technical', name: 'Técnico', icon: Beaker },
    { id: 'documentation', name: 'Documentação', icon: FileText }
  ];

  const phases = ['planejamento', 'desenvolvimento', 'submissão', 'pós-marketing'];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copiado!', description: 'Prompt copiado para a área de transferência' });
  };

  const sendPromptToChat = (prompt: Prompt) => {
    sendToMasterChat(prompt.content, { 
      newThread: true, 
      title: `Prompt: ${prompt.title}` 
    });
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
                <Lightbulb className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Biblioteca de Prompts</h1>
                <p className="text-muted-foreground">
                  Prompts especializados por fase do projeto farmacêutico
                </p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar prompts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-auto">
                  <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full lg:w-auto">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <TabsTrigger key={category.id} value={category.id} className="text-xs">
                          <Icon className="h-3 w-3 mr-1" />
                          {category.name}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Prompts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="h-fit">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{prompt.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {prompt.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1 ml-4">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{prompt.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline">{prompt.phase}</Badge>
                    {prompt.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <p className="text-sm whitespace-pre-wrap">{prompt.content}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Usado {prompt.usage_count} vezes
                    </span>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(prompt.content)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => sendPromptToChat(prompt)}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Usar no Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nenhum prompt encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </CardContent>
            </Card>
          )}

          <Alert className="mt-6">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Biblioteca de Prompts:</strong> Cada prompt foi criado por especialistas 
              para fases específicas de projetos farmacêuticos. Personalize os campos entre 
              [COLCHETES] antes de usar.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default PromptsLibrary;
