
import React, { useState } from 'react';
// Fix: Corrected import path for types
import type { Post, User, Reel, Story } from '../types.ts';
import Icon from './Icon.tsx';

interface ShareModalProps {
  content: Post | Reel | Story | null;
  users: User[];
  onClose: () => void;
  onSendShare: (recipient: User) => void;
  onCopyLink: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ content, users, onClose, onSendShare, onCopyLink }) => {
  const [sentToUsers, setSentToUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  if (!content) return null;

  const handleSend = (user: User) => {
    onSendShare(user);
    setSentToUsers(prev => [...prev, user.id]);
  };

  const filteredUsers = searchTerm
    ? users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    : users;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">Share</h2>
           <button className="absolute top-2 right-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>
        <div className="p-4">
             <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
        </div>
        <div className="max-h-[50vh] overflow-y-auto px-4 pb-4">
          <ul className="space-y-3">
            {filteredUsers.map(user => {
              const isSent = sentToUsers.includes(user.id);
              return (
                <li key={user.id} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.username} className="w-11 h-11 rounded-full object-cover" />
                      <span className="font-semibold text-sm">{user.username}</span>
                  </div>
                   <button 
                      onClick={() => handleSend(user)}
                      disabled={isSent}
                      className={`font-semibold text-sm py-1.5 px-4 rounded-md transition-colors ${
                        isSent
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                  >
                      {isSent ? 'Sent' : 'Send'}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-4 border-t border-gray-700">
             <button onClick={onCopyLink} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-md">
                Copy Link
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
