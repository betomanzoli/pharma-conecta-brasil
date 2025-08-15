
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bot, Brain, FileText, Search, MessageCircle, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { isDemoMode, demoData } from '@/utils/demoMode';

const AIAssistant = () => {
  const [activeAgent, setActiveAgent] = useState('regulatory');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const { toast } = useToast();
  const isDemo = isDemoMode();

  const agents = [
    {
      id: 'regulatory',
      name: 'Especialista Regulatório',
      icon: FileText,
      description: 'Análise técnica e regulatória farmacêutica',
      function: 'ai-technical-regulatory',
      status: isDemo ? 'active' : 'checking'
    },
    {
      id: 'business',
      name: 'Estrategista de Negócios',
      icon: Brain,
      description: 'Estratégias de mercado e oportunidades',
      function: 'ai-business-strategist',
      status: isDemo ? 'active' : 'checking'
    },
    {
      id: 'analyst',
      name: 'Analista de Projetos',
      icon: Search,
      description: 'Análise e gerenciamento de projetos',
      function: 'ai-project-analyst',
      status: isDemo ? 'active' : 'checking'
    },
    {
      id: 'coordinator',
      name: 'Coordenador Central',
      icon: Zap,
      description: 'Orquestração e síntese de resultados',
      function: 'ai-coordinator-orchestrator',
      status: isDemo ? 'active' : 'checking'
    }
  ];

  const handleAgentCall = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite uma pergunta ou solicitação",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const currentAgent = agents.find(a => a.id === activeAgent);
      if (!currentAgent) throw new Error('Agente não encontrado');

      if (isDemo) {
        // Simular resposta para modo demo
        setTimeout(() => {
          const demoResponses = {
            regulatory: `# Análise Regulatória

Com base na sua solicitação: "${prompt}"

## Principais Considerações ANVISA:
- Documentação técnica necessária conforme RDC 301/2019
- Prazo estimado: 60-90 dias para análise
- Taxa de aprovação: 85% para documentação completa

## Próximos Passos:
1. Preparar dossiê técnico
2. Submeter protocolo ANVISA
3. Acompanhar análise técnica

*Resposta gerada em modo demonstração*`,
            business: `# Análise de Oportunidade de Negócio

Solicitação analisada: "${prompt}"

## Oportunidades Identificadas:
- Mercado potencial: R$ 150M
- Crescimento anual: 12%
- Concorrência: Média intensidade

## Recomendações Estratégicas:
1. Investimento inicial: R$ 2-5M
2. Prazo de retorno: 18-24 meses
3. Parcerias recomendadas: Distribuidores regionais

*Resposta gerada em modo demonstração*`,
            analyst: `# Project Charter

Projeto analisado: "${prompt}"

## Estrutura do Projeto:
- Duração estimada: 18 meses
- Equipe necessária: 8-12 profissionais
- Orçamento: R$ 3-7M

## Principais Riscos:
1. Regulatórios: Médio
2. Técnicos: Baixo
3. Mercado: Alto

*Resposta gerada em modo demonstração*`,
            coordinator: `# Plano de Coordenação

Coordenação solicitada: "${prompt}"

## Síntese dos Agentes:
- Aprovação regulatória: 85% probabilidade
- Viabilidade comercial: Alta
- Complexidade técnica: Média

## Ações Prioritárias:
1. Iniciar documentação ANVISA
2. Validar mercado alvo
3. Formar equipe técnica

*Resposta gerada em modo demonstração*`
          };

          setResponse(demoResponses[activeAgent as keyof typeof demoResponses] || 'Resposta simulada gerada.');
          setLoading(false);
          toast({
            title: "Resposta Simulada",
            description: "Dados demonstrativos gerados com sucesso"
          });
        }, 2000);
        return;
      }

      // Chamar edge function real
      const { data, error } = await supabase.functions.invoke(currentAgent.function, {
        body: {
          input: prompt,
          context: '',
          user_preferences: {
            industry: 'farmacêutico',
            region: 'brasil'
          }
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Erro na comunicação: ${error.message}`);
      }

      if (data?.output?.output_md) {
        setResponse(data.output.output_md);
        toast({
          title: "Resposta do agente IA",
          description: `${currentAgent.name} processou sua solicitação`
        });
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    ) catch (error: any) {
      console.error('AI Assistant error:', error);
      toast({
        title: "Erro no agente IA",
        description: error.message || 'Tente novamente em alguns momentos',
        variant: "destructive"
      });
      
      // Fallback para modo demo em caso de erro
      setResponse(`Erro ao conectar com o agente. Certifique-se de que as configurações estão corretas.

**Solicitação:** ${prompt}

Para testar a funcionalidade, ative o modo Demo no topo da página.`);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = {
    regulatory: [
      'Como registrar um medicamento genérico na ANVISA?',
      'Quais documentos são necessários para RDC 301/2019?',
      'Prazo médio para aprovação de registro farmacêutico?'
    ],
    business: [
      'Oportunidades no mercado de medicamentos oncológicos',
      'Viabilidade de parceria com laboratórios internacionais',
      'Tendências do mercado farmacêutico brasileiro 2024'
    ],
    analyst: [
      'Cronograma para desenvolvimento de medicamento inovador',
      'Análise de riscos em projeto de P&D farmacêutico',
      'KPIs para monitoramento de projeto regulatório'
    ],
    coordinator: [
      'Sintetizar resultados de análises anteriores',
      'Criar plano executivo integrado',
      'Próximos passos e responsabilidades do projeto'
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
        {isDemo && (
          <div className="mt-2">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Modo Demonstração - Dados Simulados
            </Badge>
          </div>
        )}
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
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <agent.icon className="h-5 w-5 text-blue-600" />
                    <span>{agent.name}</span>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                    {agent.status === 'active' ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ativo
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Verificando
                      </>
                    )}
                  </Badge>
                </CardTitle>
                <p className="text-gray-600">{agent.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder={`Faça uma pergunta para o ${agent.name}...`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && handleAgentCall()}
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
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-3 rounded border">
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
                <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                  {agent.status === 'active' ? 'Ativo' : 'Verificando'}
                </Badge>
              </div>
            ))}
          </div>
          
          {!isDemo && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Para funcionalidade completa, certifique-se de que as chaves de API estão configuradas corretamente no Supabase.
                Ou use o modo Demo para testar a interface.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
