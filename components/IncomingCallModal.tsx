import React from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';

interface IncomingCallModalProps {
  user: User;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ user, onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-sm p-6 flex flex-col items-center text-center text-white animate-fade-in">
        <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-700" />
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-300 mb-8">Incoming Video Call...</p>

        <div className="flex w-full justify-around items-center">
          <div className="flex flex-col items-center">
            <button onClick={onDecline} className="bg-red-600 p-4 rounded-full hover:bg-red-700">
              <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L4.5 15m0 0h8.25m-8.25 0V6.75" /></Icon>
            </button>
            <span className="mt-2 text-sm">Decline</span>
          </div>
          <div className="flex flex-col items-center">
            <button onClick={onAccept} className="bg-green-600 p-4 rounded-full hover:bg-green-700">
              <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon>
            </button>
             <span className="mt-2 text-sm">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;