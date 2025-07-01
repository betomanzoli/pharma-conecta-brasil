
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Eye, 
  Clock, 
  TrendingUp,
  Pin
} from 'lucide-react';

interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  author: {
    name: string;
    avatar_url?: string;
  };
  replies_count: number;
  views_count: number;
  is_pinned: boolean;
  is_trending: boolean;
  last_activity: string;
  created_at: string;
}

interface ForumCardProps {
  topic: ForumTopic;
  onClick: (topicId: string) => void;
}

const ForumCard = ({ topic, onClick }: ForumCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'regulatory': return 'bg-blue-100 text-blue-800';
      case 'clinical': return 'bg-green-100 text-green-800';
      case 'manufacturing': return 'bg-purple-100 text-purple-800';
      case 'quality': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'regulatory': return 'Regulatório';
      case 'clinical': return 'Clínico';
      case 'manufacturing': return 'Fabricação';
      case 'quality': return 'Qualidade';
      default: return category;
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(topic.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={getCategoryColor(topic.category)}>
              {getCategoryLabel(topic.category)}
            </Badge>
            {topic.is_pinned && (
              <Pin className="h-4 w-4 text-blue-500" />
            )}
            {topic.is_trending && (
              <TrendingUp className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{topic.views_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{topic.replies_count}</span>
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {topic.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {topic.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={topic.author.avatar_url} alt={topic.author.name} />
              <AvatarFallback className="text-xs">
                {topic.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{topic.author.name}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{new Date(topic.last_activity).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForumCard;
