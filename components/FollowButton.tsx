import React, { useState } from 'react';
import type { User } from '../types.ts';

interface FollowButtonProps {
  user: User;
  currentUser: User;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ user, currentUser, onFollow, onUnfollow, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isFollowing = currentUser.following.some(u => u.id === user.id);
  const baseClasses = 'text-center font-semibold text-sm py-1.5 px-4 rounded-md transition-colors';
  const widthClass = className.includes('w-') ? '' : 'w-24';

  if (isFollowing) {
    return (
      <button 
        onClick={() => onUnfollow(user)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${baseClasses} ${widthClass} ${className} ${
          isHovered 
            ? 'bg-red-500/20 text-red-500 border border-red-500/50' 
            : 'bg-gray-800 hover:bg-gray-700'
        }`}
      >
        {isHovered ? 'Unfollow' : 'Following'}
      </button>
    );
  }

  return (
    <button 
      onClick={() => onFollow(user)}
      className={`${baseClasses} ${widthClass} ${className} bg-white hover:bg-gray-200 text-black`}
    >
      Follow
    </button>
  );
};

export default FollowButton;