
import React, { useState } from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';
import FollowButton from './FollowButton.tsx';

interface WelcomeOnboardingModalProps {
  currentUser: User;
  suggestedUsers: User[];
  onClose: () => void;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
}

const WelcomeOnboardingModal: React.FC<WelcomeOnboardingModalProps> = ({ currentUser, suggestedUsers, onClose, onFollow, onUnfollow }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center border-b border-gray-700">
          <h2 className="text-2xl font-bold">Welcome, {currentUser.name}!</h2>
          <p className="text-gray-400 mt-2">To get started, follow some accounts to see their posts in your feed.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {suggestedUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                {/* Fix: Changed user.avatar to user.avatar_url */}
                <img src={user.avatar_url} alt={user.username} className="w-11 h-11 rounded-full" />
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                </div>
              </div>
              <FollowButton user={user} currentUser={currentUser} onFollow={onFollow} onUnfollow={onUnfollow} />
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700">
            <button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOnboardingModal;