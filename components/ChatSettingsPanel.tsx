// Fix: Create the ChatSettingsPanel component.
import React from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';

interface ChatSettingsPanelProps {
  user: User;
  currentUser: User;
  onClose: () => void;
  onUpdateUserRelationship: (targetUser: User, action: 'mute' | 'unmute' | 'block' | 'unblock' | 'restrict' | 'unrestrict') => void;
}

const ChatSettingsPanel: React.FC<ChatSettingsPanelProps> = ({ user, currentUser, onClose, onUpdateUserRelationship }) => {
    const isMuted = currentUser.mutedUsers.includes(user.id);
    const isBlocked = currentUser.blockedUsers.includes(user.id);
    const isRestricted = currentUser.restrictedUsers.includes(user.id);

    return (
        <div className="absolute top-0 right-0 h-full w-80 bg-black border-l border-gray-800 z-10 p-4 transition-transform transform">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Details</h3>
            <button onClick={onClose}><Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        <div className="flex flex-col items-center">
            <img src={user.avatar} alt={user.username} className="w-20 h-20 rounded-full" />
            <p className="mt-2 font-semibold">{user.username}</p>
            <p className="text-xs text-gray-400">{user.name}</p>
        </div>
        <div className="mt-6 space-y-2">
            <button onClick={() => onUpdateUserRelationship(user, isMuted ? 'unmute' : 'mute')} className="w-full text-left p-2 hover:bg-gray-800 rounded-md">
                {isMuted ? 'Unmute messages' : 'Mute messages'}
            </button>
            <button onClick={() => onUpdateUserRelationship(user, isRestricted ? 'unrestrict' : 'restrict')} className="w-full text-left p-2 hover:bg-gray-800 rounded-md">
                {isRestricted ? 'Un-restrict' : 'Restrict'}
            </button>
            <button onClick={() => onUpdateUserRelationship(user, isBlocked ? 'unblock' : 'block')} className="w-full text-left p-2 text-red-500 hover:bg-gray-800 rounded-md">
                {isBlocked ? 'Unblock' : 'Block'}
            </button>
            <button className="w-full text-left p-2 text-red-500 hover:bg-gray-800 rounded-md">Report</button>
        </div>
        </div>
    );
};

export default ChatSettingsPanel;