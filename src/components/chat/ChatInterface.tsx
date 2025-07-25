
import React, { useState, useEffect } from 'react';
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
  Search,
  Settings,
  Paperclip,
  Mic,
  Smile
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  message: string;
  user_id: string;
  chat_id: string;
  message_type: 'text' | 'ai_suggestion' | 'system';
  sent_at: string;
  metadata?: any;
  sender?: {
    first_name: string;
    last_name: string;
  };
}

interface Chat {
  id: string;
  participants: string[];
  chat_type: 'direct' | 'group' | 'ai_assistant';
  created_at: string;
  last_activity: string;
  last_message?: string;
  created_by: string;
  updated_at: string;
  chat_messages?: Message[];
}

const ChatInterface: React.FC = () => {
  const { profile } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (profile?.id) {
      fetchChats();
      setupRealtimeSubscription();
    }
  }, [profile?.id]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          chat_messages(
            id,
            message,
            user_id,
            sent_at,
            message_type
          )
        `)
        .contains('participants', [profile?.id])
        .order('last_activity', { ascending: false });

      if (error) throw error;

      const formattedChats = data?.map(chat => ({
        ...chat,
        last_message: chat.chat_messages?.[0]?.message || 'Sem mensagens'
      })) || [];

      setChats(formattedChats);
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
      toast.error('Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Erro ao carregar mensagens');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || sending) return;

    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('chat-system', {
        body: {
          action: 'send_message',
          chatId: selectedChat.id,
          userId: profile?.id,
          message: newMessage.trim()
        }
      });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  const startAIAssistant = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-system', {
        body: {
          action: 'create_chat',
          participants: [profile?.id, 'ai_assistant'],
          userId: profile?.id
        }
      });

      if (error) throw error;

      setSelectedChat(data);
      fetchChats();
      toast.success('Assistente de IA iniciado!');
    } catch (error) {
      console.error('Erro ao iniciar assistente:', error);
      toast.error('Erro ao iniciar assistente de IA');
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (selectedChat && newMessage.chat_id === selectedChat.id) {
            setMessages(prev => [...prev, newMessage]);
          }
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredChats = chats.filter(chat =>
    chat.last_message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.chat_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      {/* Lista de Chats */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Conversas</span>
            </CardTitle>
            <Button onClick={startAIAssistant} size="sm" variant="outline">
              <Bot className="h-4 w-4 mr-2" />
              IA
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            {filteredChats.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma conversa ainda</p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedChat?.id === chat.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium truncate">
                            {chat.chat_type === 'ai_assistant' ? 'Assistente de IA' : 
                             `Chat ${chat.chat_type}`}
                          </p>
                          <Badge variant={chat.chat_type === 'ai_assistant' ? 'default' : 'secondary'}>
                            {chat.chat_type === 'ai_assistant' ? 'IA' : 'Chat'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.last_message || 'Sem mensagens'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Área de Chat */}
      <Card className="lg:col-span-2">
        {selectedChat ? (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedChat.chat_type === 'ai_assistant' ? (
                    <Bot className="h-8 w-8 text-primary" />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground" />
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {selectedChat.chat_type === 'ai_assistant' ? 'Assistente de IA' : 
                       `Chat ${selectedChat.chat_type}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedChat.chat_type === 'ai_assistant' ? 'Sempre disponível' : 'Online'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <ScrollArea className="h-80 p-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma mensagem ainda</p>
                    <p className="text-sm">Envie a primeira mensagem!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.user_id === profile?.id;
                      const isAI = message.message_type === 'ai_suggestion';
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isAI
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {isAI && (
                              <div className="flex items-center space-x-1 mb-1">
                                <Bot className="h-3 w-3" />
                                <span className="text-xs font-medium">IA</span>
                              </div>
                            )}
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              isAI ? 'text-blue-600' :
                              isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {new Date(message.sent_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={sendMessage} 
                    disabled={!newMessage.trim() || sending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent>
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Selecione uma conversa</h3>
              <p>Escolha um chat da lista para começar a conversar</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatInterface;
