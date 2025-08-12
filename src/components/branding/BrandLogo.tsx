
import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, className }) => {
  return (
    <div className={`flex items-center ${className || ''}`}>
      <img
        src="/lovable-uploads/9c96c4a3-866a-4e28-a69f-55d561dad6e5.png"
        alt="PharmaConnect Brasil"
        className={`${compact ? 'h-12' : 'h-16'} w-auto`}
        loading="lazy"
      />
    </div>
  );
};

export default BrandLogo;
