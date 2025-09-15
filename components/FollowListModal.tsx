import React from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';

interface FollowListModalProps {
  title: 'Followers' | 'Following';
  users: User[];
  onClose: () => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ title, users, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700 flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="absolute top-2 right-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>
        <div className="overflow-y-auto">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-700">
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.username} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm">{user.username}</p>
                </div>
              </div>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold text-sm py-1.5 px-4 rounded-md">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
