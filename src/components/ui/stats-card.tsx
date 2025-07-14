import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
  description?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
}

const variantStyles = {
  default: {
    card: 'bg-card border-border',
    icon: 'bg-muted text-muted-foreground',
    value: 'text-foreground',
    title: 'text-muted-foreground',
  },
  primary: {
    card: 'bg-primary-50 border-primary-200',
    icon: 'bg-primary-100 text-primary-600',
    value: 'text-primary-900',
    title: 'text-primary-700',
  },
  secondary: {
    card: 'bg-secondary-50 border-secondary-200',
    icon: 'bg-secondary-100 text-secondary-600',
    value: 'text-secondary-900',
    title: 'text-secondary-700',
  },
  accent: {
    card: 'bg-accent-50 border-accent-200',
    icon: 'bg-accent-100 text-accent-600',
    value: 'text-accent-900',
    title: 'text-accent-700',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  variant = 'default',
  className,
}) => {
  const styles = variantStyles[variant];

  return (
    <div className={cn(
      'p-6 rounded-lg border shadow-sm transition-all duration-200',
      'hover:shadow-pharma hover:-translate-y-0.5',
      styles.card,
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={cn('text-sm font-medium', styles.title)}>
            {title}
          </p>
          <p className={cn('text-2xl font-bold mt-2', styles.value)}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              {trend.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 text-secondary-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={cn(
                'text-sm font-medium',
                trend.direction === 'up' ? 'text-secondary-600' : 'text-red-600'
              )}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-muted-foreground">
                {trend.label}
              </span>
            </div>
          )}
          
          {description && (
            <p className="text-sm text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className={cn(
            'p-3 rounded-lg',
            styles.icon
          )}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};