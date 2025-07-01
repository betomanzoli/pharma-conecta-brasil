
import React, { useRef, useEffect } from 'react';
import { CardContent } from '@/components/ui/card';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_name: string;
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId?: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <CardContent className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isCurrentUser={message.sender_id === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </CardContent>
  );
};

export default ChatMessages;
