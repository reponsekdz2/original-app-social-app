import React, { useState } from 'react';
import type { User, Conversation } from '../types.ts';
import Icon from './Icon.tsx';
import * as api from '../services/apiService.ts';

interface CreateGroupModalProps {
  followers: User[];
  onClose: () => void;
  onCreateGroup: (newGroup: Conversation) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ followers, onClose, onCreateGroup }) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const filteredFollowers = searchTerm
    ? followers.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    : followers;
    
  const handleCreate = async () => {
    if (isLoading || !groupName.trim() || selectedUserIds.length === 0) return;
    setIsLoading(true);
    try {
        const newGroup = await api.createGroupChat(groupName, selectedUserIds);
        onCreateGroup(newGroup);
        onClose();
    } catch (error) {
        console.error("Failed to create group", error);
        // Handle error display
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white text-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-200 text-center relative">
          <h2 className="text-lg font-semibold">New Group Chat</h2>
          <button className="absolute top-3 left-3 text-sm text-gray-600" onClick={onClose}>Cancel</button>
          <button onClick={handleCreate} disabled={isLoading || !groupName.trim() || selectedUserIds.length === 0} className="absolute top-3 right-3 text-blue-600 font-semibold disabled:text-gray-400 text-sm">
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full bg-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-300"
          />
        </div>
         <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search followers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-300"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredFollowers.map(user => {
            const isSelected = selectedUserIds.includes(user.id);
            return (
              <div key={user.id} onClick={() => handleToggleUser(user.id)} className="flex items-center justify-between p-3 hover:bg-gray-100 cursor-pointer">
                <div className="flex items-center gap-3">
                  <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full" />
                  <p>{user.username}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>
                    {isSelected && <Icon className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></Icon>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
