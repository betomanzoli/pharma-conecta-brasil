
import React from 'react';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_name: string;
}

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  return (
    <div
      className={`flex ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[70%] px-3 py-2 rounded-lg shadow-sm ${
          isCurrentUser
            ? 'bg-primary-600 text-white rounded-br-sm'
            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <span className={`text-xs mt-1 block ${
          isCurrentUser ? 'text-primary-100' : 'text-gray-500'
        }`}>
          {new Date(message.created_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
