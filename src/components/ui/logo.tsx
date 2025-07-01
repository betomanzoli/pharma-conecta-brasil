
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'full' 
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  if (variant === 'icon') {
    return (
      <img
        src="/lovable-uploads/bd71d89e-d414-41cc-830c-6ef7f52861bd.png"
        alt="PharmaConnect Brasil"
        className={`${sizeClasses[size]} w-auto ${className}`}
      />
    );
  }

  if (variant === 'text') {
    return (
      <span className={`${textSizeClasses[size]} font-bold text-primary-600 font-poppins ${className}`}>
        PharmaConnect Brasil
      </span>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img
        src="/lovable-uploads/bd71d89e-d414-41cc-830c-6ef7f52861bd.png"
        alt="PharmaConnect Brasil"
        className={`${sizeClasses[size]} w-auto`}
      />
      <span className={`${textSizeClasses[size]} font-bold text-primary-600 font-poppins`}>
        PharmaConnect Brasil
      </span>
    </div>
  );
};

export default Logo;
