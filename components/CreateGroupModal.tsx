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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">New Group Chat</h2>
          <button className="absolute top-2 left-3" onClick={onClose}>Cancel</button>
          <button onClick={handleCreate} disabled={isLoading || !groupName.trim() || selectedUserIds.length === 0} className="absolute top-2 right-3 text-red-500 font-semibold disabled:text-gray-500">Create</button>
        </div>
        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full bg-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
         <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search followers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredFollowers.map(user => {
            const isSelected = selectedUserIds.includes(user.id);
            return (
              <div key={user.id} onClick={() => handleToggleUser(user.id)} className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
                  <p>{user.username}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'bg-red-500 border-red-500' : 'border-gray-500'}`}>
                    {isSelected && <Icon className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></Icon>}
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
