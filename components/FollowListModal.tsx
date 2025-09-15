import React from 'react';
import type { User } from '../types';
import Icon from './Icon';
import VerifiedBadge from './VerifiedBadge';

interface FollowListModalProps {
  listType: 'followers' | 'following';
  users: User[];
  currentUserFollowing: string[];
  onUnfollow: (userId: string) => void;
  onClose: () => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ listType, users, currentUserFollowing, onUnfollow, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700 flex flex-col h-[60vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-700 text-center relative">
            <div className="w-6"></div>
            <h2 className="text-lg font-semibold capitalize">{listType}</h2>
            <button onClick={onClose}><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {users.length > 0 ? (
            <ul className="space-y-4">
            {users.map(user => (
              <li key={user.id} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.username} className="w-11 h-11 rounded-full object-cover" />
                    <div>
                        <p className="font-semibold text-sm flex items-center">{user.username} {user.isVerified && <VerifiedBadge className="w-4 h-4 ml-1" />}</p>
                        <p className="text-xs text-gray-400">{user.name}</p>
                    </div>
                </div>
                {listType === 'following' && (
                    <button 
                        onClick={() => onUnfollow(user.id)}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm py-1.5 px-4 rounded-md"
                    >
                        Following
                    </button>
                )}
                 {listType === 'followers' && currentUserFollowing.includes(user.id) && (
                     <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm py-1.5 px-4 rounded-md">
                        Following
                    </button>
                 )}
                  {listType === 'followers' && !currentUserFollowing.includes(user.id) && (
                     <button className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-1.5 px-4 rounded-md">
                        Follow
                    </button>
                 )}
              </li>
            ))}
          </ul>
          ) : (
             <p className="text-center text-gray-400 pt-8">No users to show.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;