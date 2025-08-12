import React from 'react';

const LOGO_URL = '/lovable-uploads/445e4223-5418-4de4-90fe-41c01a9dda35.png';

interface BrandLogoProps {
  compact?: boolean;
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, className }) => {
  return (
    <div className={`flex items-center ${className || ''}`}>
      <img
        src={LOGO_URL}
        alt="PharmaConnect Brasil logo"
        className={`${compact ? 'h-6' : 'h-8'} w-auto`}
        loading="lazy"
      />
      {!compact && (
        <span className="ml-2 font-semibold">PharmaConnect Brasil</span>
      )}
    </div>
  );
};

export default BrandLogo;
