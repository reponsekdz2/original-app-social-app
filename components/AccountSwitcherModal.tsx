

import React from 'react';
// Fix: Corrected import path for types to be relative.
import type { User } from '../types.ts';
import Icon from './Icon.tsx';

interface AccountSwitcherModalProps {
  accounts: User[];
  currentUser: User;
  onClose: () => void;
  onSwitchAccount: (accountId: string) => void;
  onAddAccount: () => void;
}

const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({ accounts, currentUser, onClose, onSwitchAccount, onAddAccount }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">Switch Accounts</h2>
          <button className="absolute top-2 right-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>
        <div className="py-2">
          {accounts.map(account => (
            <button key={account.id} onClick={() => onSwitchAccount(account.id)} className="w-full flex items-center justify-between p-3 hover:bg-gray-700">
              <div className="flex items-center gap-3">
                <img src={account.avatar} alt={account.username} className="w-11 h-11 rounded-full" />
                <span className="font-semibold">{account.username}</span>
              </div>
              {account.id === currentUser.id && (
                <Icon className="w-6 h-6 text-red-500" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></Icon>
              )}
            </button>
          ))}
        </div>
        <div className="border-t border-gray-700">
          <button onClick={onAddAccount} className="w-full p-3 hover:bg-gray-700 font-semibold text-red-500">
            Log in to an Existing Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSwitcherModal;
