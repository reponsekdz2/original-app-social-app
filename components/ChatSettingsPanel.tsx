import React from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';

interface ChatSettingsPanelProps {
  user: User;
  currentUser: User;
  onClose: () => void;
  onUpdateUserRelationship: (targetUser: User, action: 'mute' | 'unmute' | 'block' | 'unblock') => void;
  onReport: (user: User) => void;
  onViewProfile: (user: User) => void;
}

const ChatSettingsPanel: React.FC<ChatSettingsPanelProps> = ({ user, currentUser, onClose, onUpdateUserRelationship, onReport, onViewProfile }) => {
  const isMuted = currentUser.mutedUsers.includes(user.id);
  const isBlocked = currentUser.blockedUsers.includes(user.id);

  return (
    <div className="absolute inset-0 bg-black/50 z-10" onClick={onClose}>
      <div 
        className="absolute top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800 shadow-2xl p-4 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Details</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full">
                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
            </button>
        </div>
        
        <div onClick={() => onViewProfile(user)} className="flex flex-col items-center text-center mb-6 cursor-pointer">
            <img src={user.avatar} alt={user.username} className="w-20 h-20 rounded-full mb-2" />
            <p className="font-semibold flex items-center gap-1">{user.username} {user.isVerified && <VerifiedBadge />}</p>
            <p className="text-xs text-gray-400">{user.followers.length} followers</p>
        </div>

        <div className="space-y-2">
            <button onClick={() => onUpdateUserRelationship(user, isMuted ? 'unmute' : 'mute')} className="w-full text-left p-2 hover:bg-gray-800 rounded-md">
                {isMuted ? 'Unmute Messages' : 'Mute Messages'}
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-800 rounded-md">
                Search in Conversation
            </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
            <button onClick={() => { onUpdateUserRelationship(user, isBlocked ? 'unblock' : 'block'); onClose(); }} className="w-full text-left p-2 text-red-500 hover:bg-red-500/10 rounded-md">
                {isBlocked ? 'Unblock' : 'Block'}
            </button>
             <button onClick={() => { onReport(user); onClose(); }} className="w-full text-left p-2 text-red-500 hover:bg-red-500/10 rounded-md">
                Report
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSettingsPanel;