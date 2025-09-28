import React from 'react';
import type { Conversation, User } from '../types.ts';
import Icon from './Icon.tsx';

interface ChatSettingsPanelProps {
  conversation: Conversation;
  currentUser: User;
  onClose: () => void;
  onUpdateUserRelationship: (targetUserId: string, action: 'block' | 'mute') => void;
  onReport: (user: User) => void;
  onViewProfile: (user: User) => void;
  onUpdateSettings: (settings: any) => void; // e.g., theme, nicknames
}

const ChatSettingsPanel: React.FC<ChatSettingsPanelProps> = ({ conversation, currentUser, onClose, onUpdateUserRelationship, onReport, onViewProfile }) => {
  const otherUser = conversation.participants.find(p => p.id !== currentUser.id);

  if (!otherUser) return null; // Should not happen in 1-on-1 chats

  return (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}>
      <div 
        className="absolute top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-700 p-4 space-y-4 animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Chat Details</h3>
          <button onClick={onClose} className="p-1"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        
        <div className="text-center">
            <img src={otherUser.avatar_url} alt={otherUser.username} className="w-20 h-20 rounded-full mx-auto" />
            <p className="font-semibold mt-2">{otherUser.username}</p>
        </div>

        <div className="space-y-2">
            <button onClick={() => onViewProfile(otherUser)} className="w-full text-left p-2 hover:bg-gray-800 rounded-md">View Profile</button>
            <button onClick={() => onUpdateUserRelationship(otherUser.id, 'mute')} className="w-full text-left p-2 hover:bg-gray-800 rounded-md">Mute Notifications</button>
            <button onClick={() => onUpdateUserRelationship(otherUser.id, 'block')} className="w-full text-left p-2 text-red-500 hover:bg-red-500/10 rounded-md">Block</button>
            <button onClick={() => onReport(otherUser)} className="w-full text-left p-2 text-red-500 hover:bg-red-500/10 rounded-md">Report</button>
        </div>
      </div>
    </div>
  );
};

export default ChatSettingsPanel;
