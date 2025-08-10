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
  Plus,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAIEventLogger } from '@/hooks/useAIEventLogger';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sources?: string[];
  related_questions?: string[];
}

interface ThreadSummary {
  id: string;
  title: string | null;
  updated_at: string;
  messages_count: number;
  last_message_preview: string | null;
}

const MasterChatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [lastSuggestion, setLastSuggestion] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { logAIEvent } = useAIEventLogger();

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

  const refreshThreads = async () => {
    if (!user) return;
    const { data, error } = await supabase.functions.invoke('master-chatbot', {
      body: { action: 'list_threads', user_id: user.id },
    });
    if (!error) setThreads(data?.threads || []);
  };

  const loadThreadMessages = async (tid: string) => {
    if (!user) return;
    const { data, error } = await supabase.functions.invoke('master-chatbot', {
      body: { action: 'list_messages', user_id: user.id, thread_id: tid },
    });
    if (error) return;
    const msgs: Message[] = (data?.messages || []).map((m: any, idx: number) => ({
      id: String(idx),
      content: m.content,
      sender: m.role === 'user' ? 'user' : 'assistant',
      timestamp: new Date(m.created_at),
    }));
    setMessages(msgs);
  };

  const createNewThread = async (seedTitle?: string, seedMessage?: string) => {
    if (!user) return;
    const { data, error } = await supabase.functions.invoke('master-chatbot', {
      body: { action: 'init_thread', user_id: user.id, title: seedTitle || 'Novo chat' },
    });
    if (error) return;
    setThreadId(data?.thread_id || null);
    await refreshThreads();
    setMessages([]);
    setLastSuggestion(null);
    if (seedMessage) {
      // Optionally send the seed message to kick off the new thread
      await sendMessage(seedMessage, data?.thread_id || null);
    }
  };

  const switchThread = async (tid: string) => {
    setThreadId(tid);
    setMessages([]);
    setLastSuggestion(null);
    await loadThreadMessages(tid);
  };

  const initializeChat = async () => {
    try {
      const { error } = await supabase.functions.invoke('master-chatbot', {
        body: { 
          action: 'initialize',
          user_id: user?.id
        }
      });

      if (error) throw error;

      // Criar (ou iniciar) uma thread persistente
      const { data: threadRes, error: threadErr } = await supabase.functions.invoke('master-chatbot', {
        body: {
          action: 'init_thread',
          user_id: user?.id,
          title: 'Chat Master AI'
        }
      });
      if (threadErr) throw threadErr;
      const tid = threadRes?.thread_id || null;
      setThreadId(tid);

      // Carregar lista de threads
      await refreshThreads();

      // Se houver histórico, carregue; senão, mostre welcome
      if (tid) {
        await loadThreadMessages(tid);
      }
      if ((messages?.length || 0) === 0) {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          content: `Olá! 👋 Sou seu Assistente Master especializado no setor farmacêutico brasileiro.

🎯 Posso ajudar com:
• Regulamentação ANVISA
• Networking e parcerias
• Análise de mercado
• Compliance
• Oportunidades de negócio
• Pesquisas técnicas

Agora com IA Perplexity para respostas atualizadas. Como posso ajudar hoje?`,
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }

      setIsInitialized(true);
      logAIEvent({ source: 'master_ai_hub', action: 'init', message: 'initialize' });
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: "Erro de Inicialização",
        description: "Não foi possível inicializar o chat. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async (message: string, forcedThreadId?: string | null) => {
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

    logAIEvent({ source: 'master_ai_hub', action: 'message', message });

    try {
      const { data, error } = await supabase.functions.invoke('master-chatbot', {
        body: {
          action: 'chat',
          message,
          user_id: user?.id,
          thread_id: forcedThreadId ?? threadId,
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

      if (data.thread_id && !threadId) {
        setThreadId(data.thread_id);
      }

      if (data.suggest_new_thread) {
        setLastSuggestion(data.suggested_prompt || null);
        toast({
          title: 'Sugestão: iniciar novo chat',
          description: 'O histórico está longo. Podemos abrir um novo chat para manter a performance.',
        });
      }

      logAIEvent({
        source: 'master_ai_hub',
        action: 'assistant_response',
        message: assistantMessage.content,
        metadata: {
          sources: assistantMessage.sources || [],
          related_questions: assistantMessage.related_questions || []
        }
      });

      if (data.sources && data.sources.length > 0) {
        toast({
          title: "Resposta com fontes",
          description: `Encontrei ${data.sources.length} fonte(s) relevante(s).`,
        });
      }

      // Atualiza lista de threads
      await refreshThreads();
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Verifique a configuração da API Perplexity.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({ title: 'Erro de Comunicação', description: 'Não foi possível processar sua mensagem.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelatedQuestion = (question: string) => {
    sendMessage(question);
  };

  const openSuggestedThread = async () => {
    if (!lastSuggestion) return;
    await createNewThread('Novo chat sugerido', lastSuggestion);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          <strong>Master AI Assistant:</strong> diálogo contínuo com contexto por thread. Sugestão automática de novo chat quando o histórico ficar pesado.
        </AlertDescription>
      </Alert>

      <Card className="h-[640px] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <CardTitle className="text-lg">Master AI Assistant</CardTitle>
                <Badge variant="secondary">Perplexity</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => createNewThread()}>
                  <Plus className="h-4 w-4 mr-1" /> Novo chat
                </Button>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={threadId || ''}
                  onChange={(e) => switchThread(e.target.value)}
                >
                  <option value="" disabled>Selecionar thread</option>
                  {threads.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title || 'Sem título'} • {t.messages_count}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {lastSuggestion && (
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs opacity-80 line-clamp-1">💡 Sugestão: {lastSuggestion}</p>
                <Button size="sm" onClick={openSuggestedThread}>Abrir novo chat com sugestão</Button>
              </div>
            )}
          </div>
          <CardDescription>
            Assistente especializado — Regulatório, parcerias e mercado farmacêutico brasileiro.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Lista de mensagens */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        {message.sender === 'user' ? (<User className="h-4 w-4" />) : (<Bot className="h-4 w-4" />)}
                        <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>
                      </div>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                  </div>

                  {message.related_questions && message.related_questions.length > 0 && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] space-y-2">
                        <p className="text-xs text-gray-600 font-medium">Perguntas relacionadas:</p>
                        <div className="space-y-1">
                          {message.related_questions.slice(0, 3).map((question, idx) => (
                            <Button key={idx} variant="ghost" size="sm" onClick={() => handleRelatedQuestion(question)} className="text-xs h-auto p-2 text-left justify-start hover:bg-blue-50" disabled={isLoading}>
                              💡 {question}
                            </Button>
                          ))
                          }
                        </div>
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
                onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(inputValue); }}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={() => sendMessage(inputValue)} disabled={isLoading || !inputValue.trim()} size="icon">
                {isLoading ? (<Loader2 className="h-4 w-4 animate-spin" />) : (<Send className="h-4 w-4" />)}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Pressione Enter para enviar • Histórico persistente por thread</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterChatbot;
