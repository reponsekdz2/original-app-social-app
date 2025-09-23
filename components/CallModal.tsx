
import React, { useState } from 'react';
import Icon from './Icon.tsx';
import type { User } from '../types.ts';

interface CallModalProps {
  user: User;
  onHangUp: () => void;
}

const CallModal: React.FC<CallModalProps> = ({ user, onHangUp }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-white p-4">
      <div className="absolute top-4 left-4 text-left">
          <h2 className="text-2xl font-bold">In call with {user.username}</h2>
          <p className="text-gray-400">00:12</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <img src={user.avatar_url} alt={user.username} className="w-48 h-48 rounded-full border-4 border-gray-600" />
      </div>

      <div className="absolute bottom-10 flex items-center gap-6">
        <button onClick={() => setIsMuted(p => !p)} className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'}`}>
            <Icon className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 7.5v-1.5a6 6 0 00-6-6v-1.5a6 6 0 00-6 6v1.5m6 6v-1.5m0-10.5v-1.5a6 6 0 00-6 6v1.5" />
                {isMuted && <path d="M4 4l16 16" strokeWidth="2" />}
            </Icon>
        </button>
         <button onClick={() => setIsVideoOff(p => !p)} className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-700'}`}>
            <Icon className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                 {isVideoOff && <path d="M4 4l16 16" strokeWidth="2" />}
            </Icon>
        </button>
        <button onClick={onHangUp} className="p-4 bg-red-600 rounded-full rotate-[135deg]">
            <Icon className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
            </Icon>
        </button>
      </div>
    </div>
  );
};

export default CallModal;
