
import React from 'react';

const LOGO_URL = '/lovable-uploads/4dbceddc-fe7b-4d92-b370-7b25ef46b02e.png';

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
