import React from 'react';
import type { User, Conversation } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import ToggleSwitch from './ToggleSwitch.tsx';

interface ChatSettingsPanelProps {
  conversation: Conversation;
  currentUser: User;
  onClose: () => void;
  onUpdateUserRelationship: (targetUser: User, action: 'block' | 'unblock' | 'mute' | 'unmute') => void;
  onReport: (user: User) => void;
  onViewProfile: (user: User) => void;
  onUpdateSettings: (settings: Partial<Conversation['settings']>) => void;
}

const THEME_COLORS = [
    { name: 'default', style: 'bg-gray-800' },
    { name: 'sunset', style: 'bg-gradient-to-br from-orange-500 to-red-600' },
    { name: 'ocean', style: 'bg-gradient-to-br from-blue-400 to-teal-500' },
    { name: 'nebula', style: 'bg-gradient-to-br from-purple-600 to-indigo-800' },
];

const ChatSettingsPanel: React.FC<ChatSettingsPanelProps> = (props) => {
    const { conversation, currentUser, onClose, onUpdateUserRelationship, onReport, onViewProfile, onUpdateSettings } = props;
    const otherUser = !conversation.isGroup ? conversation.participants.find(p => p.id !== currentUser.id) : null;

    const isBlocked = otherUser ? currentUser.blockedUsers.includes(otherUser.id) : false;
    const isMuted = otherUser ? currentUser.mutedUsers.includes(otherUser.id) : false;

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
        
        <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-2">
                {conversation.isGroup ? (
                    <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                        <Icon className="w-10 h-10 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM3.75 18.75a3 3 0 002.72-4.682A9.095 9.095 0 0018 18.72m0 0a9 9 0 00-9-9 9 9 0 00-9 9m18 0h-3.375a9.06 9.06 0 00-1.5-3.375m-1.5 3.375a9.06 9.06 0 01-1.5-3.375m0 0a9 9 0 01-9-9" /></Icon>
                    </div>
                ) : (
                    <img src={otherUser?.avatar} alt={otherUser?.username} className="w-20 h-20 rounded-full" />
                )}
            </div>
            <p className="font-semibold flex items-center gap-1">{conversation.name || otherUser?.username} {otherUser?.isVerified && <VerifiedBadge />}</p>
            <p className="text-xs text-gray-400">{conversation.isGroup ? `${conversation.participants.length} members` : 'Personal Account'}</p>
        </div>
        
        <div className="space-y-4 border-t border-b border-gray-700 py-4">
             <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold text-sm">Vanish Mode</p>
                    <p className="text-xs text-gray-400">Messages disappear when seen.</p>
                </div>
                <ToggleSwitch enabled={conversation.settings.vanish_mode_enabled} setEnabled={(val) => onUpdateSettings({ vanish_mode_enabled: val })} />
            </div>
            {!conversation.isGroup && otherUser && (
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-sm">Mute Notifications</p>
                    </div>
                    <ToggleSwitch enabled={isMuted} setEnabled={() => onUpdateUserRelationship(otherUser, isMuted ? 'unmute' : 'mute')} />
                </div>
            )}
            <div>
                <p className="font-semibold text-sm mb-2">Change Theme</p>
                <div className="flex items-center justify-between">
                    {THEME_COLORS.map(theme => (
                        <button key={theme.name} onClick={() => onUpdateSettings({ theme: theme.name })} className={`w-10 h-10 rounded-full ${theme.style} border-2 ${conversation.settings.theme === theme.name ? 'border-white' : 'border-transparent'}`}></button>
                    ))}
                </div>
            </div>
        </div>
        
        {!conversation.isGroup && otherUser && (
             <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                <button onClick={() => { onUpdateUserRelationship(otherUser, isBlocked ? 'unblock' : 'block'); onClose(); }} className="w-full text-left p-2 text-red-500 hover:bg-red-500/10 rounded-md">
                    {isBlocked ? 'Unblock' : 'Block'}
                </button>
                 <button onClick={() => { onReport(otherUser); onClose(); }} className="w-full text-left p-2 text-red-500 hover:bg-red-500/10 rounded-md">
                    Report
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatSettingsPanel;
