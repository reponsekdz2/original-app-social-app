import React, { useState, useEffect } from 'react';
import type { User } from '../types.ts';
import UnfollowModal from './UnfollowModal.tsx';

interface FollowButtonProps {
  user: User;
  currentUser: User;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ user, currentUser, onFollow, onUnfollow, className = '' }) => {
  const [isFollowing, setIsFollowing] = useState(currentUser.following?.some(u => u.id === user.id) || false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  
  useEffect(() => {
    // This allows the button to update if the currentUser prop changes (e.g., after a global state update)
    setIsFollowing(currentUser.following?.some(u => u.id === user.id) || false);
  }, [currentUser.following, user.id]);

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(true);
    onFollow(user.id);
  };

  const handleUnfollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.isPrivate) {
        setShowUnfollowModal(true);
    } else {
        setIsFollowing(false);
        onUnfollow(user.id);
    }
  };

  const confirmUnfollow = () => {
    setIsFollowing(false);
    onUnfollow(user.id);
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
          className={`text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-4 rounded-md ${className}`}
        >
          Following
        </button>
      ) : (
        <button
          onClick={handleFollow}
          className={`text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-md ${className}`}
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