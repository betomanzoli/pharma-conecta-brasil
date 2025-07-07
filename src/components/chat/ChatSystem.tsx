import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Search, 
  User, 
  Circle,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  sender: {
    first_name: string;
    last_name: string;
  };
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  last_message?: Message;
  unread_count: number;
  is_online: boolean;
}

const ChatSystem: React.FC = () => {
  const { profile } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchContacts();
      setupRealtimeSubscription();
    }
  }, [profile?.id]);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id);
      markMessagesAsRead(selectedContact.id);
    }
  }, [selectedContact]);

  const fetchContacts = async () => {
    try {
      // Buscar mensagens do usuário
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('sender_id, receiver_id, created_at, content')
        .or(`sender_id.eq.${profile?.id},receiver_id.eq.${profile?.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Coletar IDs únicos de contatos
      const contactIds = new Set<string>();
      messagesData?.forEach((message) => {
        const contactId = message.sender_id === profile?.id ? message.receiver_id : message.sender_id;
        contactIds.add(contactId);
      });

      if (contactIds.size === 0) {
        setContacts([]);
        return;
      }

      // Buscar perfis dos contatos
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, user_type')
        .in('id', Array.from(contactIds));

      if (profilesError) throw profilesError;

      // Processar contatos com última mensagem
      const contactsMap = new Map<string, Contact>();
      
      profilesData?.forEach((profile) => {
        const lastMessage = messagesData?.find(msg => 
          msg.sender_id === profile.id || msg.receiver_id === profile.id
        );

        contactsMap.set(profile.id, {
          id: profile.id,
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          user_type: profile.user_type || '',
          last_message: lastMessage ? {
            id: '',
            content: lastMessage.content,
            sender_id: lastMessage.sender_id,
            receiver_id: lastMessage.receiver_id,
            created_at: lastMessage.created_at,
            sender: {
              first_name: profile.first_name || '',
              last_name: profile.last_name || ''
            }
          } : undefined,
          unread_count: 0,
          is_online: Math.random() > 0.5, // Simulado por enquanto
        });
      });

      setContacts(Array.from(contactsMap.values()));
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      toast.error('Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    try {
      // Buscar mensagens da conversa
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('id, content, sender_id, receiver_id, created_at')
        .or(`and(sender_id.eq.${profile?.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${profile?.id})`)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Buscar perfis dos usuários envolvidos
      const userIds = [profile?.id, contactId].filter(Boolean) as string[];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Montar mensagens com dados dos remetentes
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      const formattedMessages: Message[] = messagesData?.map((msg) => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        receiver_id: msg.receiver_id,
        created_at: msg.created_at,
        sender: {
          first_name: profilesMap.get(msg.sender_id)?.first_name || '',
          last_name: profilesMap.get(msg.sender_id)?.last_name || ''
        }
      })) || [];

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      toast.error('Erro ao carregar mensagens');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || sending) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          sender_id: profile?.id,
          receiver_id: selectedContact.id,
        });

      if (error) throw error;

      setNewMessage('');
      
      // A mensagem será adicionada via realtime
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  const markMessagesAsRead = async (contactId: string) => {
    // Implementar marcação como lida quando necessário
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${profile?.id},receiver_id.eq.${profile?.id})`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Atualizar mensagens se estiver na conversa ativa
          if (selectedContact && 
              (newMessage.sender_id === selectedContact.id || 
               newMessage.receiver_id === selectedContact.id)) {
            setMessages(prev => [...prev, newMessage]);
          }

          // Atualizar lista de contatos
          fetchContacts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredContacts = contacts.filter(contact =>
    `${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Lista de Contatos */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Conversas</span>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar contatos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            {filteredContacts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma conversa ainda</p>
              </div>
            ) : (
              <div className="space-y-0">
                {filteredContacts.map((contact, index) => (
                  <div key={contact.id}>
                    <div
                      className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback>
                              {contact.first_name?.[0]}{contact.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          {contact.is_online && (
                            <Circle className="absolute -bottom-1 -right-1 h-3 w-3 text-green-500 fill-current" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">
                              {contact.first_name} {contact.last_name}
                            </p>
                            {contact.last_message && (
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(contact.last_message.created_at), {
                                  addSuffix: true,
                                  locale: ptBR
                                })}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {contact.last_message?.content || 'Sem mensagens'}
                            </p>
                            {contact.unread_count > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {contact.unread_count}
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {contact.user_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {index < filteredContacts.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Área de Conversa */}
      <Card className="lg:col-span-2">
        {selectedContact ? (
          <>
            {/* Header da Conversa */}
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedContact.first_name?.[0]}{selectedContact.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {selectedContact.first_name} {selectedContact.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.is_online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Mensagens */}
            <CardContent className="p-0">
              <ScrollArea className="h-80 p-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma mensagem ainda</p>
                    <p className="text-sm">Envie a primeira mensagem!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender_id === profile?.id;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}
                            >
                              {formatDistanceToNow(new Date(message.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              {/* Input de Mensagem */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={sending}
                  />
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
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Selecione uma conversa</h3>
              <p>Escolha um contato da lista para iniciar uma conversa</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatSystem;