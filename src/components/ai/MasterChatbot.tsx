
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
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
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
        content: `Olá! Sou seu Assistente Master especializado no setor farmacêutico brasileiro. 

Posso ajudá-lo com:
🎯 Informações sobre regulamentação ANVISA
🤝 Networking e parcerias farmacêuticas  
📊 Análise de mercado farmacêutico
⚖️ Questões de compliance regulatório
💼 Oportunidades de negócio

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
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Verifique se as chaves de API estão configuradas corretamente.',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erro de Comunicação",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    
    const actionMessages = {
      'find_partners': 'Encontre parceiros farmacêuticos para minha empresa',
      'regulatory_updates': 'Mostre as últimas atualizações regulatórias da ANVISA',
      'market_analysis': 'Faça uma análise do mercado farmacêutico atual'
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

  return (
    <div className="space-y-6">
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          <strong>Master AI Assistant:</strong> Assistente especializado com IA avançada para o setor farmacêutico.
          As respostas são geradas usando inteligência artificial e podem precisar de verificação.
        </AlertDescription>
      </Alert>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Master AI Assistant</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Farmacêutico BR
            </Badge>
          </div>
          <CardDescription>
            Assistente especializado em regulamentação, networking e mercado farmacêutico
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
                <div
                  key={message.id}
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
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Processando...</span>
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
                placeholder="Digite sua mensagem sobre o setor farmacêutico..."
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
              Pressione Enter para enviar • Powered by OpenAI
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Configuração Necessária:</strong> Para o funcionamento completo, 
          é necessário configurar a chave da API OpenAI nas configurações do Supabase.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MasterChatbot;
