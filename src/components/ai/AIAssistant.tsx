
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bot, Brain, FileText, Search, MessageCircle, Zap } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';

const AIAssistant = () => {
  const [activeAgent, setActiveAgent] = useState('regulatory');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const { toast } = useToast();
  const { search } = useKnowledgeBase();

  const agents = [
    {
      id: 'regulatory',
      name: 'Especialista Regulatório',
      icon: FileText,
      description: 'Análise técnica e regulatória farmacêutica',
      function: 'ai-technical-regulatory'
    },
    {
      id: 'business',
      name: 'Estrategista de Negócios',
      icon: Brain,
      description: 'Estratégias de mercado e oportunidades',
      function: 'ai-business-strategist'
    },
    {
      id: 'analyst',
      name: 'Analista de Projetos',
      icon: Search,
      description: 'Análise e gerenciamento de projetos',
      function: 'ai-project-analyst'
    },
    {
      id: 'coordinator',
      name: 'Coordenador Central',
      icon: Zap,
      description: 'Orquestração e síntese de resultados',
      function: 'ai-coordinator-orchestrator'
    }
  ];

  const handleAgentCall = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const currentAgent = agents.find(a => a.id === activeAgent);
      if (!currentAgent) throw new Error('Agente não encontrado');

      // Get knowledge context first
      let context = '';
      try {
        const searchResults = await search(prompt, 3);
        context = searchResults.map(r => r.content).join('\n\n');
      } catch (searchError) {
        console.log('Search context unavailable:', searchError);
      }

      const { data, error } = await supabase.functions.invoke(currentAgent.function, {
        body: {
          input: prompt,
          context,
          user_preferences: {
            industry: 'farmacêutico',
            region: 'brasil'
          }
        }
      });

      if (error) throw error;

      setResponse(data?.output?.output_md || 'Resposta gerada com sucesso');
      toast({
        title: "Resposta do agente IA",
        description: `${currentAgent.name} processou sua solicitação`
      });
    } catch (error: any) {
      toast({
        title: "Erro no agente IA",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = {
    regulatory: [
      'Analise os requisitos para registro de medicamento genérico no Brasil',
      'Quais são as principais mudanças na RDC 301/2019?',
      'Como funciona o processo de importação de insumos farmacêuticos?'
    ],
    business: [
      'Identifique oportunidades de mercado para medicamentos oncológicos',
      'Analise a viabilidade de parceria com laboratórios internacionais',
      'Quais são as tendências do mercado farmacêutico brasileiro?'
    ],
    analyst: [
      'Crie um cronograma para desenvolvimento de medicamento inovador',
      'Analise os riscos de um projeto de P&D farmacêutico',
      'Elabore KPIs para monitoramento de projeto regulatório'
    ],
    coordinator: [
      'Sintetize os resultados dos agentes anteriores',
      'Crie um plano executivo integrado',
      'Identifique próximos passos e responsabilidades'
    ]
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Bot className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Assistente de IA Especializado</h2>
        </div>
        <p className="text-gray-600">
          Sistema multi-agente para análise farmacêutica e regulatória
        </p>
      </div>

      <Tabs value={activeAgent} onValueChange={setActiveAgent}>
        <TabsList className="grid w-full grid-cols-4">
          {agents.map((agent) => (
            <TabsTrigger key={agent.id} value={agent.id} className="flex items-center space-x-2">
              <agent.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{agent.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {agents.map((agent) => (
          <TabsContent key={agent.id} value={agent.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <agent.icon className="h-5 w-5 text-blue-600" />
                  <span>{agent.name}</span>
                  <Badge variant="secondary">IA Especializada</Badge>
                </CardTitle>
                <p className="text-gray-600">{agent.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder={`Faça uma pergunta para o ${agent.name}...`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAgentCall()}
                  />
                  <Button onClick={handleAgentCall} disabled={loading}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {loading ? 'Processando...' : 'Enviar'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Prompts Rápidos:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {quickPrompts[agent.id as keyof typeof quickPrompts]?.map((quickPrompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setPrompt(quickPrompt)}
                        className="text-left justify-start h-auto p-3 whitespace-normal"
                      >
                        {quickPrompt}
                      </Button>
                    ))}
                  </div>
                </div>

                {response && (
                  <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Resposta do {agent.name}
                      </h4>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">
                          {response}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Status dos Agentes IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <agent.icon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{agent.name}</span>
                </div>
                <Badge variant="default">Ativo</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
