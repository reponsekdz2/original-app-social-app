
import React, { useState, useEffect } from 'react';
import type { User } from '../types.ts';
import * as api from '../services/apiService.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';

interface BlockedUsersViewProps {
  onUnblockUser: (user: User) => void;
  onBack: () => void;
}

const BlockedUsersView: React.FC<BlockedUsersViewProps> = ({ onUnblockUser, onBack }) => {
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      setIsLoading(true);
      try {
        const users = await api.getBlockedUsers();
        setBlockedUsers(users);
      } catch (error) {
        console.error("Failed to fetch blocked users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlockedUsers();
  }, []);

  const handleUnblock = (user: User) => {
    onUnblockUser(user);
    setBlockedUsers(prev => prev.filter(u => u.id !== user.id));
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
          <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
        </button>
        <h1 className="text-2xl font-bold">Blocked Accounts</h1>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Once you block someone, that person can no longer see things you post on your timeline, tag you, invite you to events or groups, start a conversation with you, or add you as a friend. This does not include apps, games or groups you both participate in.
      </p>

      <div className="bg-gray-900 rounded-lg border border-gray-800">
        {isLoading ? (
          <p className="p-4 text-center text-gray-400">Loading...</p>
        ) : blockedUsers.length > 0 ? (
          <ul className="divide-y divide-gray-800">
            {blockedUsers.map(user => (
              <li key={user.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={user.avatar_url} alt={user.username} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm flex items-center">{user.username} {user.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />}</p>
                    <p className="text-xs text-gray-400">{user.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleUnblock(user)} 
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm py-1.5 px-4 rounded-md transition-colors"
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-8 text-center text-gray-500">You haven't blocked anyone.</p>
        )}
      </div>
    </div>
  );
};

export default BlockedUsersView;
