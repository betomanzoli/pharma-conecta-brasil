import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Users, 
  Star,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface EnhancedCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'trending' | 'featured';
  showBadge?: boolean;
  badgeText?: string;
  trending?: boolean;
  featured?: boolean;
  premium?: boolean;
  rating?: number;
  views?: number;
  lastUpdated?: string;
  onAction?: () => void;
  actionText?: string;
  actionIcon?: React.ComponentType<any>;
  externalLink?: string;
  animated?: boolean;
  gradient?: boolean;
  glow?: boolean;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  title,
  description,
  children,
  className,
  variant = 'default',
  showBadge = false,
  badgeText,
  trending = false,
  featured = false,
  premium = false,
  rating,
  views,
  lastUpdated,
  onAction,
  actionText = 'Ver mais',
  actionIcon: ActionIcon = ArrowRight,
  externalLink,
  animated = false,
  gradient = false,
  glow = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return 'border-gradient-to-r from-purple-200 to-pink-200 bg-gradient-to-br from-purple-50 to-pink-50';
      case 'trending':
        return 'border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50';
      case 'featured':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50';
      default:
        return '';
    }
  };

  const getGlowStyles = () => {
    if (!glow) return '';
    
    switch (variant) {
      case 'premium':
        return 'shadow-lg shadow-purple-200/50';
      case 'trending':
        return 'shadow-lg shadow-orange-200/50';
      case 'featured':
        return 'shadow-lg shadow-blue-200/50';
      default:
        return 'shadow-lg shadow-gray-200/50';
    }
  };

  const renderBadges = () => {
    const badges = [];
    
    if (trending) {
      badges.push(
        <Badge key="trending" variant="secondary" className="bg-orange-100 text-orange-800">
          <TrendingUp className="h-3 w-3 mr-1" />
          Trending
        </Badge>
      );
    }
    
    if (featured) {
      badges.push(
        <Badge key="featured" variant="secondary" className="bg-blue-100 text-blue-800">
          <Sparkles className="h-3 w-3 mr-1" />
          Destaque
        </Badge>
      );
    }
    
    if (premium) {
      badges.push(
        <Badge key="premium" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          Premium
        </Badge>
      );
    }
    
    if (showBadge && badgeText) {
      badges.push(
        <Badge key="custom" variant="outline">
          {badgeText}
        </Badge>
      );
    }
    
    return badges;
  };

  const renderMetrics = () => {
    const metrics = [];
    
    if (rating) {
      metrics.push(
        <div key="rating" className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{rating.toFixed(1)}</span>
        </div>
      );
    }
    
    if (views) {
      metrics.push(
        <div key="views" className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{views.toLocaleString()}</span>
        </div>
      );
    }
    
    if (lastUpdated) {
      metrics.push(
        <div key="updated" className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{lastUpdated}</span>
        </div>
      );
    }
    
    return metrics;
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200',
        getVariantStyles(),
        getGlowStyles(),
        animated && 'hover:scale-105 hover:-translate-y-1',
        gradient && 'bg-gradient-to-br from-white to-gray-50',
        className
      )}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg font-semibold leading-tight">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-sm">
                {description}
              </CardDescription>
            )}
          </div>
          
          {renderBadges().length > 0 && (
            <div className="flex flex-wrap gap-1 ml-4">
              {renderBadges()}
            </div>
          )}
        </div>
        
        {renderMetrics().length > 0 && (
          <div className="flex items-center space-x-4">
            {renderMetrics()}
          </div>
        )}
      </CardHeader>
      
      {children && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
      
      {(onAction || externalLink) && (
        <CardContent className="pt-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            {externalLink ? (
              <Button 
                variant="outline" 
                size="sm"
                className="group"
                asChild
              >
                <a 
                  href={externalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  {actionText}
                  <ExternalLink className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onAction}
                className="group"
              >
                {actionText}
                <ActionIcon className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default EnhancedCard;