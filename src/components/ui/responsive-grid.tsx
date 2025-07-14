import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const gapClasses = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { default: 1, md: 2, lg: 3 },
  gap = 'md',
  className,
}) => {
  const getColumnClasses = () => {
    const classes = [];
    
    if (columns.default) classes.push(`grid-cols-${columns.default}`);
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    if (columns['2xl']) classes.push(`2xl:grid-cols-${columns['2xl']}`);
    
    return classes.join(' ');
  };

  return (
    <div className={cn(
      'grid',
      getColumnClasses(),
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

interface ResponsiveStackProps {
  children: React.ReactNode;
  direction?: {
    default?: 'row' | 'col';
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
  };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = { default: 'col', md: 'row' },
  gap = 'md',
  align = 'start',
  justify = 'start',
  className,
}) => {
  const getDirectionClasses = () => {
    const classes = [];
    
    if (direction.default) classes.push(`flex-${direction.default}`);
    if (direction.sm) classes.push(`sm:flex-${direction.sm}`);
    if (direction.md) classes.push(`md:flex-${direction.md}`);
    if (direction.lg) classes.push(`lg:flex-${direction.lg}`);
    
    return classes.join(' ');
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return (
    <div className={cn(
      'flex',
      getDirectionClasses(),
      gapClasses[gap],
      alignClasses[align],
      justifyClasses[justify],
      className
    )}>
      {children}
    </div>
  );
};