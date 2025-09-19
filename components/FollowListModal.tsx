import React from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import FollowButton from './FollowButton.tsx';

interface FollowListModalProps {
  title: 'Followers' | 'Following';
  users: User[];
  currentUser: User;
  onClose: () => void;
  onViewProfile: (user: User) => void;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ title, users, currentUser, onClose, onViewProfile, onFollow, onUnfollow }) => {

  const handleViewProfileAndClose = (user: User) => {
    onViewProfile(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700 flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="absolute top-2 right-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>
        <div className="overflow-y-auto">
          {users.map(user => {
            const isCurrentUser = user.id === currentUser.id;
            return (
              <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-700">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewProfileAndClose(user)}>
                  <img src={user.avatar} alt={user.username} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm flex items-center">{user.username} {user.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />}</p>
                    <p className="text-xs text-gray-400">{user.name}</p>
                  </div>
                </div>
                {!isCurrentUser && (
                    <FollowButton 
                      user={user} 
                      currentUser={currentUser} 
                      onFollow={onFollow} 
                      onUnfollow={onUnfollow} 
                    />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
