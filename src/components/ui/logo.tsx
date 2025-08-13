
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'icon' 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20'
  };

  return (
    <img
      src="/lovable-uploads/9c96c4a3-866a-4e28-a69f-55d561dad6e5.png"
      alt="PharmaConnect Brasil"
      className={`${sizeClasses[size]} w-auto ${className}`}
    />
  );
};

export default Logo;
