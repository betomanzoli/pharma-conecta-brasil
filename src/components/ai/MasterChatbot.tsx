
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  Loader2,
  Sparkles,
  RefreshCw
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
}

const MasterChatbot = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { logAIEvent } = useAIEventLogger();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentThread, setCurrentThread] = useState<Thread | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
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
      const { data: threadsData } = await supabase.functions.invoke('master-chatbot', {
        body: { 
          action: 'list_threads', 
          user_id: profile?.id 
        }
      });

      if (threadsData?.threads) {
        setThreads(threadsData.threads);
        
        // Se existe thread, usar a primeira
        if (threadsData.threads.length > 0) {
          const thread = threadsData.threads[0];
          setCurrentThread(thread);
          await loadMessages(thread.id);
        } else {
          // Criar nova thread
          await createNewThread();
        }
      } else {
        await createNewThread();
      }

      await logAIEvent({
        source: 'master_ai_hub',
        action: 'init',
        message: 'Master chatbot initialized'
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
      const { data } = await supabase.functions.invoke('master-chatbot', {
        body: { 
          action: 'init_thread', 
          user_id: profile?.id,
          title: 'Nova Conversa'
        }
      });

      if (data?.thread_id) {
        const newThread: Thread = {
          id: data.thread_id,
          title: 'Nova Conversa',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          messages_count: 0,
          last_message_preview: ''
        };
        
        setCurrentThread(newThread);
        setThreads(prev => [newThread, ...prev]);
        setMessages([]);
      }
    } catch (error) {
      console.error('Erro ao criar thread:', error);
    }
  };

  const loadMessages = async (threadId: string) => {
    try {
      const { data } = await supabase.functions.invoke('master-chatbot', {
        body: { 
          action: 'get_messages', 
          thread_id: threadId,
          user_id: profile?.id 
        }
      });

      if (data?.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || loading || !currentThread) return;

    setLoading(true);
    const userMessage = newMessage.trim();
    setNewMessage('');

    // Adicionar mensagem do usuário localmente
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const { data, error } = await supabase.functions.invoke('master-chatbot', {
        body: { 
          action: 'chat', 
          user_id: profile?.id,
          thread_id: currentThread.id,
          message: userMessage
        }
      });

      if (error) throw error;

      if (data?.assistant_message) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.assistant_message,
          created_at: new Date().toISOString(),
          metadata: data.metadata
        };

        setMessages(prev => {
          // Remover mensagem temporária e adicionar ambas as mensagens
          const filtered = prev.filter(m => m.id !== tempUserMessage.id);
          return [...filtered, 
            { ...tempUserMessage, id: `user-${Date.now()}` }, 
            assistantMessage
          ];
        });

        await logAIEvent({
          source: 'master_ai_hub',
          action: 'message',
          message: userMessage,
          metadata: { response_length: data.assistant_message.length }
        });
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao enviar mensagem',
        variant: 'destructive' 
      });
      
      // Remover mensagem temporária em caso de erro
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
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

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>Assistente AI Master</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {currentThread ? `Thread: ${currentThread.id.slice(0, 8)}` : 'Carregando...'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={createNewThread}
              disabled={loading}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Olá! Sou seu assistente AI especializado em farmacêutica.</p>
              <p className="text-sm">Como posso ajudá-lo hoje?</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    {message.role === 'assistant' && (
                      <div className="p-1 rounded-full bg-purple-100">
                        <Bot className="h-4 w-4 text-purple-600" />
                      </div>
                    )}
                    
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="p-1 rounded-full bg-blue-100">
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
                        <span className="text-sm">Pensando...</span>
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
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MasterChatbot;
