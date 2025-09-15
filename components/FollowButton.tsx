import React, { useState } from 'react';
import type { User } from '../types.ts';

interface FollowButtonProps {
  user: User;
  currentUser: User;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ user, currentUser, onFollow, onUnfollow }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isFollowing = currentUser.following.some(u => u.id === user.id);

  if (isFollowing) {
    return (
      <button 
        onClick={() => onUnfollow(user)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-24 text-center font-semibold text-sm py-1.5 px-4 rounded-md transition-colors ${
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
      className="w-24 text-center bg-white hover:bg-gray-200 text-black text-sm font-semibold py-1.5 px-4 rounded-md"
    >
      Follow
    </button>
  );
};

export default FollowButton;