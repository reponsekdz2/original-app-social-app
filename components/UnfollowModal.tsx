
import React from 'react';
// Fix: Corrected import path for types to be relative.
import type { User } from '../types.ts';

interface UnfollowModalProps {
  user: User;
  onCancel: () => void;
  onConfirm: () => void;
}

const UnfollowModal: React.FC<UnfollowModalProps> = ({ user, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onCancel}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
          <p className="text-gray-300">
            If you change your mind, you'll have to request to follow @{user.username} again.
          </p>
        </div>
        <div className="flex flex-col border-t border-gray-700">
            <button 
                onClick={onConfirm}
                className="w-full py-3 text-red-500 font-bold text-sm hover:bg-red-500/10 border-b border-gray-700 transition-colors"
            >
                Unfollow
            </button>
            <button 
                onClick={onCancel}
                className="w-full py-3 text-sm hover:bg-gray-700/50 transition-colors"
            >
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default UnfollowModal;
