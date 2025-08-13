
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
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-20',
    xl: 'h-24'
  };

  if (variant === 'icon' || variant === 'full') {
    return (
      <img
        src="/lovable-uploads/62acdd0f-0e04-46d4-9d01-0c39a5f1c80a.png"
        alt="PharmaConnect Brasil"
        className={`${sizeClasses[size]} w-auto ${className}`}
      />
    );
  }

  if (variant === 'text') {
    return (
      <span className={`text-xl font-bold text-primary-600 font-poppins ${className}`}>
        PharmaConnect Brasil
      </span>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img
        src="/lovable-uploads/62acdd0f-0e04-46d4-9d01-0c39a5f1c80a.png"
        alt="PharmaConnect Brasil"
        className={`${sizeClasses[size]} w-auto`}
      />
    </div>
  );
};

export default Logo;
