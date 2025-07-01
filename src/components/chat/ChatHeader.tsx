
import React from 'react';
import { Phone, Video, MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ChatHeaderProps {
  receiverName: string;
  receiverAvatar?: string;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  receiverName, 
  receiverAvatar, 
  onClose 
}) => {
  return (
    <div className="p-3 border-b bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={receiverAvatar} />
            <AvatarFallback className="bg-primary-100 text-primary-700">
              {receiverName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{receiverName}</h3>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              Online
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="hover:bg-primary-50">
            <Phone className="h-4 w-4 text-primary-600" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary-50">
            <Video className="h-4 w-4 text-primary-600" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary-50">
            <MoreHorizontal className="h-4 w-4 text-primary-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-50">
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
