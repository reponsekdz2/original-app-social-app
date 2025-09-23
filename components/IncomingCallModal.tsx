
import React from 'react';
import Icon from './Icon.tsx';
import type { User } from '../types.ts';

interface IncomingCallModalProps {
  caller: User;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({ caller, onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-white">
      <img src={caller.avatar_url} alt={caller.username} className="w-32 h-32 rounded-full mb-4 border-4 border-gray-600 animate-pulse" />
      <h2 className="text-2xl font-bold">{caller.username} is calling...</h2>
      
      <div className="absolute bottom-10 flex items-center gap-16">
        <button onClick={onDecline} className="flex flex-col items-center gap-2">
            <div className="p-4 bg-red-600 rounded-full rotate-[135deg]"><Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></Icon></div>
            <span>Decline</span>
        </button>
        <button onClick={onAccept} className="flex flex-col items-center gap-2">
            <div className="p-4 bg-green-600 rounded-full"><Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></Icon></div>
            <span>Accept</span>
        </button>
      </div>
    </div>
  );
};

export default IncomingCallModal;
