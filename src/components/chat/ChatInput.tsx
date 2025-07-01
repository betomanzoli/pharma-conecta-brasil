
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  message: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  loading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  onChange,
  onSend,
  onKeyPress,
  loading
}) => {
  return (
    <div className="p-3 border-t bg-white">
      <div className="flex space-x-2">
        <Input
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={loading}
          className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
        />
        <Button
          onClick={onSend}
          disabled={loading || !message.trim()}
          size="sm"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
