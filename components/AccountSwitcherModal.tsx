import React from 'react';
import type { User } from '../types';
import Icon from './Icon';

interface AccountSwitcherModalProps {
  users: User[];
  currentUser: User;
  onClose: () => void;
  onSwitchUser: (user: User) => void;
}

const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({ users, currentUser, onClose, onSwitchUser }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700 text-center">
          <h2 className="text-lg font-semibold">Switch Accounts</h2>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          <ul>
            {users.map(user => (
              <li key={user.id}>
                <button 
                  onClick={() => onSwitchUser(user)}
                  className="flex items-center w-full p-4 hover:bg-gray-700 transition-colors"
                >
                  <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover mr-4" />
                  <span className="font-semibold">{user.username}</span>
                  {user.id === currentUser.id && (
                    <Icon className="w-6 h-6 text-red-500 ml-auto"><path fillRule="evenodd" d="M12.53 3.47a.75.75 0 00-1.06 0L6.22 8.72a.75.75 0 001.06 1.06L12 5.06l9.72 9.72a.75.75 0 101.06-1.06L12.53 3.47z" clipRule="evenodd" /></Icon>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountSwitcherModal;
