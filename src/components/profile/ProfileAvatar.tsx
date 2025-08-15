
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  user: {
    email?: string;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

const ProfileAvatar = ({ user, size = 'md' }: ProfileAvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={user.avatar_url} alt="Profile" />
      <AvatarFallback>{getInitials()}</AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
