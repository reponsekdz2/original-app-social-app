import React, { useState } from 'react';
import type { User } from '../types.ts';
import UnfollowModal from './UnfollowModal.tsx';

interface FollowButtonProps {
  user: User;
  currentUser: User;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ user, currentUser, onFollow, onUnfollow, className = '' }) => {
  const [isFollowing, setIsFollowing] = useState(currentUser.following?.some(u => u.id === user.id) || false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Optimistic update
    setIsFollowing(true);
    onFollow(user);
  };

  const handleUnfollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.isPrivate) {
        setShowUnfollowModal(true);
    } else {
        // Optimistic update
        setIsFollowing(false);
        onUnfollow(user);
    }
  };

  const confirmUnfollow = () => {
    // Optimistic update
    setIsFollowing(false);
    onUnfollow(user);
    setShowUnfollowModal(false);
  }

  if (user.id === currentUser.id) {
    return null;
  }

  return (
    <>
      {isFollowing ? (
        <button
          onClick={handleUnfollow}
          className={`text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-white py-1 px-4 rounded-md ${className}`}
        >
          Following
        </button>
      ) : (
        <button
          onClick={handleFollow}
          className={`text-sm font-semibold bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md ${className}`}
        >
          Follow
        </button>
      )}
      {showUnfollowModal && (
          <UnfollowModal 
            user={user} 
            onCancel={() => setShowUnfollowModal(false)}
            onConfirm={confirmUnfollow}
          />
      )}
    </>
  );
};

export default FollowButton;
