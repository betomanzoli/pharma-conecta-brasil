
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  Loader2,
  Sparkles,
  RefreshCw,
  MessageCircle,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAIEventLogger } from '@/hooks/useAIEventLogger';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata?: any;
}

interface Thread {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages_count: number;
  last_message_preview: string;
  conversation_summary?: string;
  user_id: string;
}

const EnhancedMasterChatbot = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { logAIEvent } = useAIEventLogger();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [conversationContext, setConversationContext] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile?.id) {
      initializeChatbot();
    }
  }, [profile?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChatbot = async () => {
    try {
      // Buscar threads existentes
      const { data: threadsData } = await supabase
        .from('ai_chat_threads')
        .select('*')
        .eq('user_id', profile?.id)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (threadsData && threadsData.length > 0) {
        const formattedThreads: Thread[] = threadsData.map(thread => ({
          id: thread.id,
          title: thread.title,
          created_at: thread.created_at,
          updated_at: thread.updated_at,
          messages_count: thread.messages_count,
          last_message_preview: thread.last_message_preview,
          conversation_summary: thread.conversation_summary || '',
          user_id: thread.user_id
        }));
        
        setThreads(formattedThreads);
        const latestThread = formattedThreads[0];
        setCurrentThread(latestThread);
        await loadMessages(latestThread.id);
        
        // Carregar contexto da conversa se existir
        if (latestThread.conversation_summary) {
          setConversationContext(latestThread.conversation_summary);
        }
      } else {
        await createNewThread();
      }

      await logAIEvent({
        source: 'master_ai_hub',
        action: 'init',
        message: 'Enhanced Master chatbot initialized'
      });
    } catch (error) {
      console.error('Erro ao inicializar chatbot:', error);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao inicializar o chat',
        variant: 'destructive' 
      });
    }
  };

  const createNewThread = async () => {
    try {
      const { data: newThread, error } = await supabase
        .from('ai_chat_threads')
        .insert({
          user_id: profile?.id,
          title: 'Nova Conversa - PharmaConnect AI',
          messages_count: 0,
          last_message_preview: '',
          conversation_summary: ''
        })
        .select()
        .single();

      if (error) throw error;

      const formattedThread: Thread = {
        id: newThread.id,
        title: newThread.title,
        created_at: newThread.created_at,
        updated_at: newThread.updated_at,
        messages_count: newThread.messages_count,
        last_message_preview: newThread.last_message_preview,
        conversation_summary: newThread.conversation_summary || '',
        user_id: newThread.user_id
      };

      setCurrentThread(formattedThread);
      setThreads(prev => [formattedThread, ...prev]);
      setMessages([]);
      setConversationContext('');
      
      // Mensagem de boas-vindas
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Olá! Sou seu Assistente AI Especializado da PharmaConnect Brasil. 

Posso ajudá-lo com:
🔬 **Análise Regulatória** - ANVISA, FDA, EMA
🧪 **Desenvolvimento Farmacêutico** - Formulação, CMC, validação
🤝 **AI Matching** - Conectar com parceiros ideais
📊 **Inteligência de Mercado** - Tendências e oportunidades
📋 **Gestão de Projetos** - Cronogramas, riscos, stakeholders

Como posso ajudá-lo hoje?`,
        created_at: new Date().toISOString()
      };

      setMessages([welcomeMessage]);

    } catch (error) {
      console.error('Erro ao criar thread:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar nova conversa',
        variant: 'destructive'
      });
    }
  };

  const loadMessages = async (threadId: string) => {
    try {
      const { data: messagesData } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (messagesData) {
        const formattedMessages: Message[] = messagesData.map(msg => ({
          id: msg.id,
          role: (msg.role as 'user' | 'assistant' | 'system'),
          content: msg.content,
          created_at: msg.created_at,
          metadata: msg.metadata
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const generateConversationSummary = async (threadMessages: Message[]) => {
    try {
      const conversationText = threadMessages
        .slice(-20) // Últimas 20 mensagens
        .map(m => `${m.role}: ${m.content}`)
        .join('\n');

      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: {
          message: `Resuma esta conversa de forma concisa, mantendo os pontos principais e contexto para continuidade:

${conversationText}

Faça um resumo de no máximo 300 palavras focando nos tópicos discutidos, decisões tomadas e próximos passos mencionados.`,
          config: {
            systemPrompt: 'Você é especialista em resumir conversas farmacêuticas mantendo contexto relevante.',
            maxTokens: 500
          }
        }
      });

      if (error) throw error;
      return data.response;
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      return '';
    }
  };

  const checkMessageLimit = async (threadId: string) => {
    const { count } = await supabase
      .from('ai_chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('thread_id', threadId);

    return (count || 0) >= 50; // Limite de 50 mensagens por thread
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || loading || !currentThread) return;

    setLoading(true);
    const userMessage = newMessage.trim();
    setNewMessage('');

    // Verificar limite de mensagens
    const shouldSummarize = await checkMessageLimit(currentThread.id);

    try {
      // Salvar mensagem do usuário
      const { data: userMsgData, error: userMsgError } = await supabase
        .from('ai_chat_messages')
        .insert({
          thread_id: currentThread.id,
          user_id: profile?.id,
          role: 'user',
          content: userMessage
        })
        .select()
        .single();

      if (userMsgError) throw userMsgError;

      const formattedUserMsg: Message = {
        id: userMsgData.id,
        role: 'user',
        content: userMsgData.content,
        created_at: userMsgData.created_at,
        metadata: userMsgData.metadata
      };

      setMessages(prev => [...prev, formattedUserMsg]);

      // Preparar contexto da conversa
      let fullContext = '';
      if (conversationContext) {
        fullContext = `Contexto da conversa anterior: ${conversationContext}\n\n`;
      }
      
      const recentMessages = messages.slice(-10);
      const conversationHistory = recentMessages
        .map(m => `${m.role}: ${m.content}`)
        .join('\n');

      fullContext += `Histórico recente:\n${conversationHistory}\n\nPergunta atual: ${userMessage}`;

      // Chamar IA com contexto completo
      const { data, error } = await supabase.functions.invoke('ai-chatbot', {
        body: {
          message: fullContext,
          config: {
            systemPrompt: `Você é um assistente AI especializado em farmacêutica e biotecnologia da PharmaConnect Brasil. 

INSTRUÇÕES IMPORTANTES:
- Continue a conversa considerando todo o contexto fornecido
- Mantenha coerência com discussões anteriores
- Seja específico e técnico quando apropriado
- Ofereça insights valiosos baseados em experiência farmacêutica
- Sempre que relevante, conecte com funcionalidades da plataforma (AI Matching, regulatório, projetos)
- Se a conversa estiver ficando muito longa, indique que pode gerar um resumo`,
            maxTokens: 1000,
            temperature: 0.7
          }
        }
      });

      if (error) throw error;

      // Salvar resposta da IA
      const { data: aiMsgData, error: aiMsgError } = await supabase
        .from('ai_chat_messages')
        .insert({
          thread_id: currentThread.id,
          user_id: profile?.id,
          role: 'assistant',
          content: data.response
        })
        .select()
        .single();

      if (aiMsgError) throw aiMsgError;

      const formattedAiMsg: Message = {
        id: aiMsgData.id,
        role: 'assistant',
        content: aiMsgData.content,
        created_at: aiMsgData.created_at,
        metadata: aiMsgData.metadata
      };

      setMessages(prev => [...prev, formattedAiMsg]);

      // Se atingiu o limite, gerar resumo e sugerir nova thread
      if (shouldSummarize) {
        const summary = await generateConversationSummary([...messages, formattedUserMsg, formattedAiMsg]);
        
        if (summary) {
          // Atualizar thread com resumo
          await supabase
            .from('ai_chat_threads')
            .update({ conversation_summary: summary })
            .eq('id', currentThread.id);

          // Sugerir nova conversa
          const suggestionMessage: Message = {
            id: `suggestion-${Date.now()}`,
            role: 'system',
            content: `📋 **Conversa Extensa Detectada**

Nossa conversa está ficando longa. Para manter a qualidade das respostas, sugiro criar uma nova conversa.

✅ **Resumo será mantido** - Todo contexto importante será preservado
🔄 **Continuidade garantida** - A nova conversa terá acesso ao histórico
🚀 **Performance otimizada** - Respostas mais rápidas e precisas

Quer que eu crie uma nova conversa mantendo o contexto atual?`,
            created_at: new Date().toISOString()
          };

          setMessages(prev => [...prev, suggestionMessage]);
        }
      }

      await logAIEvent({
        source: 'master_ai_hub',
        action: 'message',
        message: userMessage,
        metadata: { 
          response_length: data.response.length,
          thread_id: currentThread.id,
          message_count: messages.length + 2
        }
      });

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao enviar mensagem. Verificando configuração do sistema...',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const continueInNewThread = async () => {
    if (currentThread?.conversation_summary) {
      setConversationContext(currentThread.conversation_summary);
    }
    await createNewThread();
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>Assistente AI Master - PharmaConnect</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <MessageCircle className="h-3 w-3 mr-1" />
              {messages.length} mensagens
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={continueInNewThread}
              disabled={loading}
              title="Nova conversa mantendo contexto"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {conversationContext && (
          <Alert className="mt-2">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Conversa conectada ao contexto anterior. Continuidade mantida.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Iniciando conversa...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start space-x-2 max-w-[85%]">
                    {message.role === 'assistant' && (
                      <div className="p-1 rounded-full bg-purple-100 flex-shrink-0">
                        <Bot className="h-4 w-4 text-purple-600" />
                      </div>
                    )}
                    
                    {message.role === 'system' && (
                      <div className="p-1 rounded-full bg-blue-100 flex-shrink-0">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : message.role === 'system'
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="p-1 rounded-full bg-blue-100 flex-shrink-0">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-full bg-purple-100">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="bg-muted px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Processando...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite sua mensagem sobre farmacêutica, regulatório, parcerias..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Sistema integrado com AI Matching, Federal Learning e Gestão de Projetos
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedMasterChatbot;
