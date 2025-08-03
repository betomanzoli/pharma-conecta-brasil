
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff,
  FileText,
  Brain,
  Globe,
  Zap,
  Heart,
  Settings,
  Download,
  Upload,
  Search,
  Calendar,
  Users
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
  actions?: Array<{
    type: string;
    label: string;
    action: () => void;
  }>;
  sources?: string[];
}

interface ChatContext {
  user_profile: any;
  recent_matches: any[];
  regulatory_updates: any[];
  market_intelligence: any[];
}

const MasterChatbot = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [context, setContext] = useState<ChatContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChatbot();
    loadChatHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChatbot = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('master-chatbot', {
        body: { 
          action: 'initialize',
          user_id: user?.id,
          user_type: profile?.user_type
        }
      });

      if (error) throw error;

      setContext(data?.context);
      
      // Mensagem de boas-vindas personalizada
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Olá ${profile?.first_name}! 👋 Sou seu Assistente Master de IA Farmacêutica. Posso ajudá-lo com:

🎯 **Matching Inteligente** - Encontrar parceiros perfeitos
📊 **Análise Regulatória** - Atualizações ANVISA, FDA, EMA
🔍 **Intelligence de Mercado** - Tendências e oportunidades
⚡ **Automações** - Criar workflows inteligentes
📋 **Compliance** - Verificar conformidade regulatória
🤝 **Negociações** - Assistir em processos comerciais

Como posso ajudá-lo hoje?`,
        timestamp: new Date(),
        sentiment: 'positive',
        actions: [
          {
            type: 'quick_match',
            label: '🎯 Buscar Parceiros',
            action: () => handleQuickAction('find_partners')
          },
          {
            type: 'regulatory_update',
            label: '📊 Ver Atualizações',
            action: () => handleQuickAction('regulatory_updates')
          },
          {
            type: 'market_analysis',
            label: '🔍 Análise de Mercado',
            action: () => handleQuickAction('market_analysis')
          }
        ]
      };

      setMessages([welcomeMessage]);

    } catch (error) {
      console.error('Error initializing chatbot:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('master-chatbot', {
        body: { 
          action: 'load_history',
          user_id: user?.id,
          limit: 50
        }
      });

      if (error) throw error;
      
      // Carregar histórico se existir
      if (data?.history && data.history.length > 0) {
        const historyMessages = data.history.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(prev => [...prev, ...historyMessages]);
      }

    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('master-chatbot', {
        body: { 
          action: 'chat',
          message,
          user_id: user?.id,
          context,
          conversation_history: messages.slice(-10) // Últimas 10 mensagens para contexto
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        sentiment: data.sentiment,
        actions: data.suggested_actions?.map((action: any) => ({
          ...action,
          action: () => handleSuggestedAction(action)
        })),
        sources: data.sources
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Executar ações automáticas se sugeridas
      if (data.auto_actions) {
        executeAutoActions(data.auto_actions);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date(),
        sentiment: 'negative'
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Erro no Chat",
        description: "Falha ao processar mensagem",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (actionType: string) => {
    const actionMessages = {
      find_partners: "Encontre parceiros compatíveis com meu perfil farmacêutico",
      regulatory_updates: "Quais são as últimas atualizações regulatórias relevantes para mim?",
      market_analysis: "Faça uma análise de mercado do setor farmacêutico brasileiro"
    };

    await sendMessage(actionMessages[actionType] || actionType);
  };

  const handleSuggestedAction = async (action: any) => {
    switch (action.type) {
      case 'create_automation':
        toast({
          title: "🤖 Automação Criada",
          description: `Workflow "${action.data?.name}" configurado com sucesso`,
        });
        break;
      case 'schedule_meeting':
        toast({
          title: "📅 Reunião Agendada",
          description: `Reunião marcada para ${action.data?.date}`,
        });
        break;
      case 'export_data':
        toast({
          title: "📊 Dados Exportados",
          description: `Relatório ${action.data?.type} está sendo preparado`,
        });
        break;
    }
  };

  const executeAutoActions = async (autoActions: any[]) => {
    for (const action of autoActions) {
      try {
        await supabase.functions.invoke('master-automation', {
          body: { 
            action: action.type,
            parameters: action.parameters,
            user_id: user?.id
          }
        });
        
        toast({
          title: "⚡ Ação Executada",
          description: action.description,
        });

      } catch (error) {
        console.error('Error executing auto action:', error);
      }
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Não Suportado",
        description: "Seu navegador não suporta reconhecimento de voz",
        variant: "destructive"
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '🤖';
    }
  };

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <span>Master AI Assistant</span>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className="bg-green-100 text-green-800 text-xs">
                <Heart className="h-3 w-3 mr-1" />
                Online
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                <Brain className="h-3 w-3 mr-1" />
                Multi-Modal
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 text-xs">
                <Globe className="h-3 w-3 mr-1" />
                Contextual
              </Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm">{getSentimentIcon(message.sentiment)}</span>
                    <span className={`text-xs font-medium ${getSentimentColor(message.sentiment)}`}>
                      AI Master
                    </span>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {message.actions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={action.action}
                        className="text-xs"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
                
                {message.sources && (
                  <div className="mt-2 text-xs opacity-75">
                    <div className="flex items-center space-x-1">
                      <Search className="h-3 w-3" />
                      <span>Fontes: {message.sources.join(', ')}</span>
                    </div>
                  </div>
                )}
                
                <div className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-gray-600">AI processando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem ou comando..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
              className="flex-1"
              disabled={isLoading}
            />
            
            <Button
              onClick={startVoiceInput}
              disabled={isLoading || isListening}
              variant="outline"
              size="sm"
            >
              {isListening ? (
                <MicOff className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Comando rápido: Digite "/" para ações especiais</span>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                IA Ativa
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MasterChatbot;
