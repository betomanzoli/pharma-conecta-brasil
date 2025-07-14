import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: {
      container: 'p-6',
      icon: 'h-8 w-8',
      title: 'text-base',
      description: 'text-sm',
      spacing: 'space-y-3',
    },
    md: {
      container: 'p-8',
      icon: 'h-12 w-12',
      title: 'text-lg',
      description: 'text-base',
      spacing: 'space-y-4',
    },
    lg: {
      container: 'p-12',
      icon: 'h-16 w-16',
      title: 'text-xl',
      description: 'text-lg',
      spacing: 'space-y-6',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      classes.container,
      classes.spacing,
      className
    )}>
      {Icon && (
        <div className={cn(
          'rounded-full bg-muted p-4 mb-2',
          'border border-border'
        )}>
          <Icon className={cn(classes.icon, 'text-muted-foreground')} />
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className={cn(
          'font-semibold text-foreground',
          classes.title
        )}>
          {title}
        </h3>
        
        {description && (
          <p className={cn(
            'text-muted-foreground max-w-md',
            classes.description
          )}>
            {description}
          </p>
        )}
      </div>

      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'default'}
          size={size === 'lg' ? 'lg' : 'default'}
          className="mt-2"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};