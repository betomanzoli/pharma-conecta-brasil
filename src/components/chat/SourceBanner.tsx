
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bot } from 'lucide-react';

interface SourceBannerProps {
  source?: string;
  category?: string;
  metadata?: Record<string, any>;
}

const SourceBanner: React.FC<SourceBannerProps> = ({ source, category, metadata }) => {
  if (!source && !metadata?.module) return null;

  const displaySource = source || metadata?.module || 'Agente IA';

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 rounded-md p-2 mb-2">
      <Bot className="h-3 w-3" />
      <ArrowRight className="h-3 w-3" />
      <span>Via: {displaySource}</span>
      {category && (
        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>
      )}
    </div>
  );
};

export default SourceBanner;
