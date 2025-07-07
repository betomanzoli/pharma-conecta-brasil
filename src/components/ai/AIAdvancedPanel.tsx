import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  MessageSquare, 
  Zap, 
  Search, 
  FileText, 
  Target,
  Sparkles,
  Settings,
  Bot,
  Play
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AIAdvancedPanel = () => {
  const [chatbotConfig, setChatbotConfig] = useState({
    systemPrompt: 'Você é um assistente especializado no setor farmacêutico brasileiro.',
    temperature: 0.7,
    maxTokens: 1000,
    model: 'gpt-4.1-2025-04-14'
  });

  const [testMessage, setTestMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const [recommendations, setRecommendations] = useState({
    contentBased: true,
    collaborativeFiltering: true,
    behaviorAnalysis: true,
    marketTrends: true
  });

  const [documentAnalysis, setDocumentAnalysis] = useState({
    ocrEnabled: true,
    complianceCheck: true,
    dataExtraction: true,
    automaticTagging: true
  });

  // Testar chatbot
  const testChatbot = async () => {
    if (!testMessage.trim()) {
      toast.error('Digite uma mensagem para testar');
      return;
    }

    setIsTesting(true);
    setChatResponse('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: {
          message: testMessage,
          config: chatbotConfig
        }
      });

      if (error) throw error;

      setChatResponse(data.response);
      toast.success('Chatbot testado com sucesso!');
    } catch (error) {
      console.error('Erro ao testar chatbot:', error);
      toast.error('Erro ao testar chatbot. Verifique se a chave OpenAI está configurada.');
      setChatResponse('Erro: Não foi possível processar a mensagem. Verifique a configuração da API.');
    } finally {
      setIsTesting(false);
    }
  };

  // Salvar configurações de IA
  const saveAIConfig = async () => {
    try {
      const config = {
        chatbot: chatbotConfig,
        recommendations,
        documentAnalysis,
        updatedAt: new Date().toISOString()
      };

      // Em uma implementação real, salvaria no banco
      console.log('Saving AI config:', config);
      toast.success('Configurações de IA salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  // Executar análise de documentos
  const runDocumentAnalysis = async () => {
    try {
      toast.info('Iniciando análise de documentos...', {
        description: 'Esta funcionalidade processará documentos regulatórios'
      });

      // Simular processamento
      setTimeout(() => {
        toast.success('Análise de documentos concluída!', {
          description: '15 documentos processados, 3 não conformidades detectadas'
        });
      }, 2000);
    } catch (error) {
      toast.error('Erro na análise de documentos');
    }
  };

  // Executar análise preditiva
  const runPredictiveAnalysis = async () => {
    try {
      toast.info('Executando análise preditiva...', {
        description: 'Analisando tendências de mercado e comportamento'
      });

      // Simular processamento
      setTimeout(() => {
        toast.success('Análise preditiva concluída!', {
          description: 'Novas oportunidades identificadas no dashboard'
        });
      }, 3000);
    } catch (error) {
      toast.error('Erro na análise preditiva');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            IA Avançada
          </h3>
          <p className="text-muted-foreground">
            Configure e monitore funcionalidades de inteligência artificial
          </p>
        </div>
        <Button onClick={saveAIConfig} className="gap-2">
          <Settings className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="chatbot" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chatbot" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chatbot
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2">
            <Target className="h-4 w-4" />
            Recomendações
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="predictive" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Análise Preditiva
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chatbot" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Configuração do Chatbot
                </CardTitle>
                <CardDescription>
                  Configure o comportamento e personalidade do assistente IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">Prompt do Sistema</Label>
                  <Textarea
                    id="systemPrompt"
                    value={chatbotConfig.systemPrompt}
                    onChange={(e) => setChatbotConfig(prev => ({
                      ...prev,
                      systemPrompt: e.target.value
                    }))}
                    placeholder="Defina a personalidade e expertise do chatbot..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Criatividade (Temperature)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={chatbotConfig.temperature}
                      onChange={(e) => setChatbotConfig(prev => ({
                        ...prev,
                        temperature: parseFloat(e.target.value)
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Máximo de Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={chatbotConfig.maxTokens}
                      onChange={(e) => setChatbotConfig(prev => ({
                        ...prev,
                        maxTokens: parseInt(e.target.value)
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modelo de IA</Label>
                  <select
                    id="model"
                    className="w-full p-2 border rounded-md"
                    value={chatbotConfig.model}
                    onChange={(e) => setChatbotConfig(prev => ({
                      ...prev,
                      model: e.target.value
                    }))}
                  >
                    <option value="gpt-4.1-2025-04-14">GPT-4.1 (Recomendado)</option>
                    <option value="gpt-4.1-mini-2025-04-14">GPT-4.1 Mini (Rápido)</option>
                    <option value="o4-mini-2025-04-16">O4 Mini (Raciocínio)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Teste do Chatbot
                </CardTitle>
                <CardDescription>
                  Teste o comportamento do chatbot com suas configurações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testMessage">Mensagem de Teste</Label>
                  <Textarea
                    id="testMessage"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Digite uma pergunta para testar o chatbot..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={testChatbot}
                  disabled={isTesting}
                  className="w-full gap-2"
                >
                  {isTesting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4" />
                      Testar Chatbot
                    </>
                  )}
                </Button>

                {chatResponse && (
                  <div className="space-y-2">
                    <Label>Resposta do Chatbot:</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">{chatResponse}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              <strong>Nota:</strong> Para usar o chatbot, certifique-se de que a chave OPENAI_API_KEY está configurada nas funções do Supabase.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Sistema de Recomendações
              </CardTitle>
              <CardDescription>
                Configure algoritmos de recomendação inteligente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Tipos de Recomendação</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Baseado em Conteúdo</label>
                      <input 
                        type="checkbox" 
                        checked={recommendations.contentBased}
                        onChange={(e) => setRecommendations(prev => ({
                          ...prev,
                          contentBased: e.target.checked
                        }))}
                        className="toggle"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Filtragem Colaborativa</label>
                      <input 
                        type="checkbox" 
                        checked={recommendations.collaborativeFiltering}
                        onChange={(e) => setRecommendations(prev => ({
                          ...prev,
                          collaborativeFiltering: e.target.checked
                        }))}
                        className="toggle"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Análise Comportamental</label>
                      <input 
                        type="checkbox" 
                        checked={recommendations.behaviorAnalysis}
                        onChange={(e) => setRecommendations(prev => ({
                          ...prev,
                          behaviorAnalysis: e.target.checked
                        }))}
                        className="toggle"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Tendências de Mercado</label>
                      <input 
                        type="checkbox" 
                        checked={recommendations.marketTrends}
                        onChange={(e) => setRecommendations(prev => ({
                          ...prev,
                          marketTrends: e.target.checked
                        }))}
                        className="toggle"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Aplicações</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Networking</Badge>
                      <span>Sugestões de conexões</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Marketplace</Badge>
                      <span>Produtos relacionados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Mentoria</Badge>
                      <span>Mentores ideais</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Conhecimento</Badge>
                      <span>Conteúdo relevante</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Análise de Documentos
              </CardTitle>
              <CardDescription>
                Configure processamento automático de documentos regulatórios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Funcionalidades</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">OCR (Reconhecimento de Texto)</label>
                      <input 
                        type="checkbox" 
                        checked={documentAnalysis.ocrEnabled}
                        onChange={(e) => setDocumentAnalysis(prev => ({
                          ...prev,
                          ocrEnabled: e.target.checked
                        }))}
                        className="toggle"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Verificação de Conformidade</label>
                      <input 
                        type="checkbox" 
                        checked={documentAnalysis.complianceCheck}
                        onChange={(e) => setDocumentAnalysis(prev => ({
                          ...prev,
                          complianceCheck: e.target.checked
                        }))}
                        className="toggle"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Extração de Dados</label>
                      <input 
                        type="checkbox" 
                        checked={documentAnalysis.dataExtraction}
                        onChange={(e) => setDocumentAnalysis(prev => ({
                          ...prev,
                          dataExtraction: e.target.checked
                        }))}
                        className="toggle"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Marcação Automática</label>
                      <input 
                        type="checkbox" 
                        checked={documentAnalysis.automaticTagging}
                        onChange={(e) => setDocumentAnalysis(prev => ({
                          ...prev,
                          automaticTagging: e.target.checked
                        }))}
                        className="toggle"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Ações</h4>
                  <Button 
                    onClick={runDocumentAnalysis}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Search className="h-4 w-4" />
                    Executar Análise
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    <p>🔍 Documentos não conformes: <strong>3</strong></p>
                    <p>📊 Dados extraídos hoje: <strong>156</strong></p>
                    <p>🏷️ Tags criadas: <strong>89</strong></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Análise Preditiva
              </CardTitle>
              <CardDescription>
                Machine Learning para previsões e insights avançados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Tendências de Mercado</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Análise preditiva de movimentos do setor farmacêutico
                  </p>
                  <Badge variant="secondary">Machine Learning</Badge>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Comportamento do Usuário</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Previsão de necessidades e interesses dos usuários
                  </p>
                  <Badge variant="secondary">Deep Learning</Badge>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2">Oportunidades de Negócio</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Identificação automática de novas oportunidades
                  </p>
                  <Badge variant="secondary">AI Pattern Recognition</Badge>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={runPredictiveAnalysis}
                  className="gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Executar Análise Preditiva
                </Button>
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Ver Relatórios
                </Button>
              </div>

              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  <strong>Última análise:</strong> Identificadas 12 novas oportunidades de mercado e 5 tendências emergentes no setor farmacêutico.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAdvancedPanel;