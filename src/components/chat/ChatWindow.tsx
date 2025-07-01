
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_name: string;
}

interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  receiverId, 
  receiverName, 
  receiverAvatar, 
  onClose 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, [receiverId]);

  const fetchMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data?.map(msg => ({
        ...msg,
        sender_name: msg.sender_id === user.id ? 'Você' : receiverName
      })) || [];

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const subscribeToMessages = () => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id}))`
      }, (payload) => {
        const newMsg = payload.new as any;
        const formattedMsg: Message = {
          ...newMsg,
          sender_name: newMsg.sender_id === user.id ? 'Você' : receiverName
        };
        setMessages(prev => [...prev, formattedMsg]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
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
    <Card className="w-80 h-96 flex flex-col shadow-xl border border-gray-200 bg-white rounded-lg overflow-hidden">
      <ChatHeader
        receiverName={receiverName}
        receiverAvatar={receiverAvatar}
        onClose={onClose}
      />
      
      <ChatMessages
        messages={messages}
        currentUserId={user?.id}
      />

      <ChatInput
        message={newMessage}
        onChange={setNewMessage}
        onSend={sendMessage}
        onKeyPress={handleKeyPress}
        loading={loading}
      />
    </Card>
  );
};

export default ChatWindow;
