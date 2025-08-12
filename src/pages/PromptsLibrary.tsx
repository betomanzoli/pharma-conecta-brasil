
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import { useAIEventLogger } from '@/hooks/useAIEventLogger';
import { useToast } from '@/hooks/use-toast';
import { Search, Send, Copy, Star } from 'lucide-react';

const PromptsLibrary = () => {
  const { redirectToChat } = useMasterChatBridge();
  const { logAIEvent } = useAIEventLogger();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const prompts = [
    {
      id: 1,
      title: 'Análise de Dossiê ANVISA',
      category: 'Regulatório',
      prompt: 'Analise o dossiê para registro de medicamento na ANVISA considerando: 1) Qualidade farmacêutica do produto, 2) Segurança e eficácia clínica, 3) Conformidade com RDC 200/2017, 4) Documentação técnica necessária. Forneça um checklist detalhado e identifique possíveis gaps.',
      tags: ['ANVISA', 'Dossiê', 'Registro'],
      rating: 4.8
    },
    {
      id: 2,
      title: 'Validação de Processo Farmacêutico',
      category: 'Qualidade',
      prompt: 'Desenvolva um protocolo de validação de processo para [PRODUTO] considerando: 1) Parâmetros críticos de processo, 2) Especificações de qualidade, 3) Plano de amostragem, 4) Critérios de aceitação conforme ICH Q7. Inclua cronograma e responsabilidades.',
      tags: ['Validação', 'ICH Q7', 'Processo'],
      rating: 4.9
    },
    {
      id: 3,
      title: 'Estratégia de Entrada no Mercado',
      category: 'Negócios',
      prompt: 'Desenvolva uma estratégia de entrada no mercado brasileiro para [PRODUTO FARMACÊUTICO] incluindo: 1) Análise competitiva, 2) Segmentação de mercado, 3) Pricing strategy, 4) Canais de distribuição, 5) Timeline regulatório, 6) Projeções financeiras. Considere particularidades do SUS.',
      tags: ['Mercado', 'Estratégia', 'SUS'],
      rating: 4.7
    },
    {
      id: 4,
      title: 'Auditoria de Qualidade GMP',
      category: 'Qualidade',
      prompt: 'Prepare um checklist completo para auditoria GMP em indústria farmacêutica seguindo: 1) RDC 301/2019, 2) ICH Q7, 3) Sistemas de qualidade, 4) Controle de documentos, 5) Qualificação de equipamentos, 6) Validação de limpeza. Priorize não conformidades críticas.',
      tags: ['GMP', 'Auditoria', 'RDC 301'],
      rating: 4.6
    },
    {
      id: 5,
      title: 'Plano de Farmacovigilância',
      category: 'Regulatório',
      prompt: 'Elabore um plano de farmacovigilância para [MEDICAMENTO] conforme: 1) RDC 4/2009, 2) Identificação de riscos, 3) Medidas de minimização, 4) Sistema de notificação, 5) Relatórios periódicos, 6) Comunicação com ANVISA. Inclua SOPs essenciais.',
      tags: ['Farmacovigilância', 'RDC 4', 'Segurança'],
      rating: 4.8
    },
    {
      id: 6,
      title: 'Business Case para P&D',
      category: 'Negócios',
      prompt: 'Construa um business case robusto para projeto de P&D farmacêutico incluindo: 1) Análise de mercado e necessidades médicas, 2) Viabilidade técnica e regulatória, 3) Projeção de investimentos e retorno, 4) Análise de riscos, 5) Milestone e timeline, 6) Estratégia de propriedade intelectual.',
      tags: ['P&D', 'Business Case', 'ROI'],
      rating: 4.9
    }
  ];

  const filteredPrompts = prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUsePrompt = async (prompt: any) => {
    await logAIEvent({
      source: 'prompt_library',
      action: 'use_prompt',
      message: `Used prompt: ${prompt.title}`
    });

    redirectToChat(prompt.prompt, {
      title: prompt.title,
      category: prompt.category,
      metadata: { source: 'prompt_library', prompt_id: prompt.id }
    });

    toast({
      title: 'Prompt enviado para o chat',
      description: `"${prompt.title}" foi carregado no Master AI Assistant`
    });
  };

  const handleCopyPrompt = (prompt: any) => {
    navigator.clipboard.writeText(prompt.prompt);
    toast({
      title: 'Prompt copiado',
      description: 'O prompt foi copiado para a área de transferência'
    });
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <main className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Biblioteca de Prompts</h1>
            <p className="text-muted-foreground">
              Prompts especializados para o setor farmacêutico brasileiro
            </p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar prompts por título, categoria ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{prompt.title}</CardTitle>
                      <Badge variant="outline" className="mb-2">
                        {prompt.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{prompt.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {prompt.prompt.substring(0, 150)}...
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {prompt.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleUsePrompt(prompt)}
                      className="flex-1"
                      size="sm"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Usar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyPrompt(prompt)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum prompt encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os termos de busca ou explore categorias diferentes
              </p>
            </div>
          )}
        </main>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default PromptsLibrary;
