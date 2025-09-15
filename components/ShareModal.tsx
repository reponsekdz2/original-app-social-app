import React from 'react';
// Fix: Add .ts extension to import to resolve module.
import type { Post } from '../types.ts';
import Icon from './Icon.tsx';
// Fix: Add .ts extension to import to resolve module.
import { MOCK_USERS } from '../constants.ts';

interface ShareModalProps {
  post: Post | null;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  const usersToShareWith = MOCK_USERS.slice(1);

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
                className="w-full bg-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
        </div>
        <div className="max-h-[50vh] overflow-y-auto px-4 pb-4">
          <ul className="space-y-3">
            {usersToShareWith.map(user => (
              <li key={user.id} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.username} className="w-11 h-11 rounded-full object-cover" />
                    <span className="font-semibold text-sm">{user.username}</span>
                </div>
                 <button className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-1.5 px-4 rounded-md">
                    Send
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 border-t border-gray-700">
             <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-md">
                Copy Link
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;