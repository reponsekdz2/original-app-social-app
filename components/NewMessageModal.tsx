import React, { useState } from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';

interface NewMessageModalProps {
  users: User[];
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ users, onClose, onSelectUser }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = searchTerm
        ? users.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : users;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white text-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-200 text-center relative">
          <h2 className="text-lg font-semibold">New Message</h2>
          <button className="absolute top-2 right-3 text-gray-500" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>
        <div className="p-4 border-b border-gray-200">
             <input
                type="text"
                placeholder="Search for a user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-300"
            />
        </div>
        <div className="overflow-y-auto flex-1">
          <ul className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <li key={user.id}>
                <button onClick={() => onSelectUser(user)} className="w-full flex items-center justify-between p-3 hover:bg-gray-100 text-left">
                   <div className="flex items-center gap-3">
                      <img src={user.avatar_url} alt={user.username} className="w-11 h-11 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-sm flex items-center">{user.username} {user.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />}</p>
                        <p className="text-xs text-gray-500">{user.name}</p>
                      </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;
