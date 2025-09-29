import React, { useState } from 'react';
import type { Conversation, User } from '../types.ts';
import Icon from './Icon.tsx';
import * as api from '../services/apiService.ts';

interface ChatSettingsPanelProps {
  conversation: Conversation;
  currentUser: User;
  allUsers?: User[];
  onClose: () => void;
  onUpdateUserRelationship: (targetUserId: string, action: 'block' | 'mute') => void;
  onReport: (user: User) => void;
  onViewProfile: (user: User) => void;
  onUpdateSettings: (conversationId: string, settings: { name?: string, addUserIds?: string[] }) => void;
}

const ChatSettingsPanel: React.FC<ChatSettingsPanelProps> = (props) => {
  const { conversation, currentUser, allUsers = [], onClose, onUpdateUserRelationship, onReport, onViewProfile, onUpdateSettings } = props;
  
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [groupName, setGroupName] = useState(conversation.name || '');
  
  const otherUser = !conversation.isGroup ? conversation.participants.find(p => p.id !== currentUser.id) : null;

  const handleUpdateName = () => {
    if (groupName.trim() && groupName !== conversation.name) {
        onUpdateSettings(conversation.id, { name: groupName });
    }
  };

  const handleAddMembers = (userIds: string[]) => {
      onUpdateSettings(conversation.id, { addUserIds: userIds });
      setIsAddingMembers(false);
  };

  const AddMembersComponent: React.FC<{ onAdd: (userIds: string[]) => void; onBack: () => void; }> = ({ onAdd, onBack }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const availableUsers = allUsers.filter(u => !conversation.participants.some(p => p.id === u.id));

    return (
        <div className="absolute inset-0 bg-gray-900 flex flex-col p-4">
            <button onClick={onBack}>Back</button>
            <div className="flex-1 overflow-y-auto">
                {availableUsers.map(u => <div key={u.id} onClick={() => setSelectedIds(p => p.includes(u.id) ? p.filter(id => id !== u.id) : [...p, u.id])}>{u.username} {selectedIds.includes(u.id) && '✓'}</div>)}
            </div>
            <button onClick={() => onAdd(selectedIds)}>Add Members</button>
        </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}>
      <div 
        className="absolute top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-700 p-4 space-y-4 animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Details</h3>
          <button onClick={onClose} className="p-1"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>

        {isAddingMembers ? <AddMembersComponent onAdd={handleAddMembers} onBack={() => setIsAddingMembers(false)} /> : (
            <>
            {conversation.isGroup ? (
                 <div className="space-y-4">
                    <input type="text" value={groupName} onChange={e => setGroupName(e.target.value)} onBlur={handleUpdateName} className="w-full bg-gray-800 p-2 rounded-md" />
                    <p className="font-semibold">Members</p>
                    <div className="max-h-48 overflow-y-auto">
                        {conversation.participants.map(p => <p key={p.id}>{p.username}</p>)}
                    </div>
                    <button onClick={() => setIsAddingMembers(true)}>Add Members</button>
                 </div>
            ) : (
                <>
                <div className="text-center">
                    <img src={otherUser?.avatar_url} alt={otherUser?.username} className="w-20 h-20 rounded-full mx-auto" />
                    <p className="font-semibold mt-2">{otherUser?.username}</p>
                </div>
                 <div className="space-y-2">
                    <button onClick={() => onViewProfile(otherUser!)} className="w-full text-left p-2 hover:bg-gray-800 rounded-md">View Profile</button>
                    <button onClick={() => onUpdateUserRelationship(otherUser!.id, 'mute')} className="w-full text-left p-2 hover:bg-gray-800 rounded-md">Mute Notifications</button>
                    <button onClick={() => onUpdateUserRelationship(otherUser!.id, 'block')} className="w-full text-left p-2 text-red-500 hover:bg-red-500/10 rounded-md">Block</button>
                    <button onClick={() => onReport(otherUser!)} className="w-full text-left p-2 text-red-500 hover:bg-red-500/10 rounded-md">Report</button>
                </div>
                </>
            )}
            </>
        )}
        
      </div>
    </div>
  );
};

export default ChatSettingsPanel;