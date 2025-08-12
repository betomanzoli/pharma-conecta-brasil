
import React from 'react';

const LOGO_URL = '/lovable-uploads/62acdd0f-0e04-46d4-9d01-0c39a5f1c80a.png';

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, className }) => {
  return (
    <div className={`flex items-center ${className || ''}`}>
      <img
        src={LOGO_URL}
        alt="PharmaConnect Brasil"
        className={`${compact ? 'h-8' : 'h-10'} w-auto`}
        loading="lazy"
      />
    </div>
  );
};

export default BrandLogo;
