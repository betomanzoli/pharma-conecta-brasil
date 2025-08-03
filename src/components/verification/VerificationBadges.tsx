
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Star, Award } from 'lucide-react';

interface VerificationBadgesProps {
  badges: Array<{
    id: string;
    badge_type: string;
    badge_name: string;
    badge_description?: string;
    badge_color: string;
    earned_at: string;
    expires_at?: string;
    is_active: boolean;
  }>;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const VerificationBadges: React.FC<VerificationBadgesProps> = ({ 
  badges, 
  size = 'md',
  showTooltip = false 
}) => {
  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'verified_company':
        return <CheckCircle className="h-3 w-3" />;
      case 'anvisa_registered':
        return <Shield className="h-3 w-3" />;
      case 'certified_lab':
        return <Award className="h-3 w-3" />;
      case 'expert_consultant':
        return <Star className="h-3 w-3" />;
      case 'premium_member':
        return <Star className="h-3 w-3" />;
      default:
        return <CheckCircle className="h-3 w-3" />;
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'sm':
        return 'text-xs px-1.5 py-0.5';
      case 'lg':
        return 'text-sm px-3 py-1';
      default:
        return 'text-xs px-2 py-1';
    }
  };

  if (!badges || badges.length === 0) {
    return null;
  }

  const activeBadges = badges.filter(badge => badge.is_active);

  return (
    <div className="flex flex-wrap gap-1">
      {activeBadges.map((badge) => (
        <Badge
          key={badge.id}
          variant="secondary"
          className={`flex items-center space-x-1 ${getSizeClass(size)}`}
          style={{ 
            backgroundColor: badge.badge_color + '20',
            color: badge.badge_color,
            borderColor: badge.badge_color + '40'
          }}
          title={showTooltip ? badge.badge_description : undefined}
        >
          {getBadgeIcon(badge.badge_type)}
          <span>{badge.badge_name}</span>
        </Badge>
      ))}
    </div>
  );
};

export default VerificationBadges;
