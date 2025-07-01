
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  BookOpen,
  Video,
  FileImage,
  Star
} from 'lucide-react';

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'guide' | 'template';
  category: string;
  author: string;
  downloads: number;
  views: number;
  rating: number;
  created_at: string;
  file_size?: string;
  duration?: string;
  is_premium: boolean;
}

interface KnowledgeCardProps {
  item: KnowledgeItem;
  onView: (itemId: string) => void;
  onDownload: (itemId: string) => void;
}

const KnowledgeCard = ({ item, onView, onDownload }: KnowledgeCardProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'guide': return <BookOpen className="h-5 w-5" />;
      case 'template': return <FileImage className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'document': return 'Documento';
      case 'video': return 'Vídeo';
      case 'guide': return 'Guia';
      case 'template': return 'Template';
      default: return type;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'regulatory': return 'bg-blue-100 text-blue-800';
      case 'clinical': return 'bg-green-100 text-green-800';
      case 'manufacturing': return 'bg-purple-100 text-purple-800';
      case 'quality': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getTypeIcon(item.type)}
            <Badge variant="outline">
              {getTypeLabel(item.type)}
            </Badge>
            <Badge className={getCategoryColor(item.category)}>
              {item.category}
            </Badge>
            {item.is_premium && (
              <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                Premium
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{item.rating}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {item.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Por {item.author}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{item.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="h-4 w-4" />
              <span>{item.downloads}</span>
            </div>
            {item.file_size && (
              <span>{item.file_size}</span>
            )}
            {item.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{item.duration}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(item.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Visualizar
          </Button>
          <Button
            size="sm"
            onClick={() => onDownload(item.id)}
            className="flex-1 bg-[#1565C0] hover:bg-[#1565C0]/90"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeCard;
