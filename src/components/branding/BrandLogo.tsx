
import React from 'react';

const LOGO_URL = '/lovable-uploads/4c0320c9-bdc7-4ed8-9f3c-ab7e411fada8.png';

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
        className={`${compact ? 'h-12' : 'h-16'} w-auto`}
        loading="lazy"
      />
    </div>
  );
};

export default BrandLogo;
