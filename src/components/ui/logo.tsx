
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-8 w-auto text-xl',
    md: 'h-12 w-auto text-2xl',
    lg: 'h-16 w-auto text-3xl'
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn(
        'bg-[#1565C0] text-white rounded-lg flex items-center justify-center font-bold',
        size === 'sm' && 'h-8 w-8 text-sm',
        size === 'md' && 'h-12 w-12 text-lg',
        size === 'lg' && 'h-16 w-16 text-xl'
      )}>
        PC
      </div>
      <span className={cn('font-bold text-[#1565C0]', sizeClasses[size])}>
        PharmaConnect
      </span>
    </div>
  );
};

export default Logo;
