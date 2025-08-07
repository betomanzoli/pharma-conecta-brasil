
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Search,
  BarChart3,
  AlertTriangle,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sources?: string[];
  related_questions?: string[];
}

const MasterChatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user && !isInitialized) {
      initializeChat();
    }
  }, [user, isInitialized]);

  const initializeChat = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('master-chatbot', {
        body: { 
          action: 'initialize',
          user_id: user?.id
        }
      });

      if (error) throw error;

      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Olá! 👋 Sou seu Assistente Master especializado no setor farmacêutico brasileiro.

🎯 **Posso ajudá-lo com:**
• 📋 Informações sobre regulamentação ANVISA
• 🤝 Networking e parcerias farmacêuticas  
• 📊 Análise de mercado farmacêutico
• ⚖️ Questões de compliance regulatório
• 💼 Oportunidades de negócio
• 🔬 Pesquisas científicas e técnicas

✨ **Agora com IA aprimorada:** Uso a API Perplexity para fornecer informações atualizadas e precisas sobre o setor farmacêutico.

Como posso ajudá-lo hoje?`,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages([welcomeMessage]);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: "Erro de Inicialização",
        description: "Não foi possível inicializar o chat. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('master-chatbot', {
        body: {
          action: 'chat',
          message,
          user_id: user?.id,
          context: {}
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Desculpe, não consegui processar sua mensagem.',
        sender: 'assistant',
        timestamp: new Date(),
        sources: data.sources || [],
        related_questions: data.related_questions || []
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Mostrar toast de sucesso se houver fontes
      if (data.sources && data.sources.length > 0) {
        toast({
          title: "Resposta com fontes",
          description: `Encontrei ${data.sources.length} fonte(s) relevante(s) para sua pergunta.`,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Verifique se a chave da API Perplexity está configurada corretamente.',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erro de Comunicação",
        description: "Não foi possível processar sua mensagem. Verifique as configurações da API.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    
    const actionMessages = {
      'find_partners': 'Encontre parceiros farmacêuticos relevantes para minha empresa no Brasil',
      'regulatory_updates': 'Mostre as últimas atualizações regulatórias da ANVISA dos últimos 30 dias',
      'market_analysis': 'Faça uma análise atual do mercado farmacêutico brasileiro incluindo tendências e oportunidades'
    };

    const message = actionMessages[action as keyof typeof actionMessages] || action;
    await sendMessage(message);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleRelatedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>✅ Master AI Assistant Ativo:</strong> Assistente especializado com IA Perplexity para o setor farmacêutico.
          Agora com acesso a informações atualizadas e fontes confiáveis.
        </AlertDescription>
      </Alert>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Master AI Assistant</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                ✅ Ativo
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Perplexity AI
              </Badge>
            </div>
          </div>
          <CardDescription>
            Assistente especializado com IA avançada - Regulamentação, networking e mercado farmacêutico brasileiro
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Ações rápidas */}
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('find_partners')}
                disabled={isLoading}
                className="text-xs"
              >
                🎯 Buscar Parceiros
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('regulatory_updates')}
                disabled={isLoading}
                className="text-xs"
              >
                📊 Ver Atualizações
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction('market_analysis')}
                disabled={isLoading}
                className="text-xs"
              >
                🔍 Análise de Mercado
              </Button>
            </div>
          </div>

          {/* Mensagens */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-xs opacity-70">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                  </div>
                  
                  {/* Perguntas relacionadas */}
                  {message.related_questions && message.related_questions.length > 0 && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] space-y-2">
                        <p className="text-xs text-gray-600 font-medium">Perguntas relacionadas:</p>
                        <div className="space-y-1">
                          {message.related_questions.slice(0, 3).map((question, idx) => (
                            <Button
                              key={idx}
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRelatedQuestion(question)}
                              className="text-xs h-auto p-2 text-left justify-start hover:bg-blue-50"
                              disabled={isLoading}
                            >
                              💡 {question}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fontes */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%]">
                        <p className="text-xs text-gray-600 font-medium mb-1">
                          📚 Fontes consultadas: {message.sources.length}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          Informações verificadas
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Pesquisando informações atualizadas...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-6 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua pergunta sobre o setor farmacêutico brasileiro..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Pressione Enter para enviar • Powered by Perplexity AI com fontes verificadas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterChatbot;
