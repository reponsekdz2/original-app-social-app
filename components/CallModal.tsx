
import React, { useState, useEffect } from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';

interface CallModalProps {
  user: User;
  onEndCall: () => void;
}

const CallModal: React.FC<CallModalProps> = ({ user, onEndCall }) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-between p-8 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-300">{formatTime(duration)}</p>
      </div>
      
      <div className="relative">
        <img src={user.avatar} alt={user.username} className="w-48 h-48 rounded-full object-cover border-4 border-gray-700" />
      </div>

      <div className="flex items-center gap-6">
        <button onClick={() => setIsMuted(p => !p)} className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-white text-black' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
          <Icon className="w-7 h-7">{isMuted ? <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />}</Icon>
        </button>
         <button onClick={onEndCall} className="bg-red-600 p-5 rounded-full hover:bg-red-700 transform scale-110">
          <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L4.5 15m0 0h8.25m-8.25 0V6.75" /></Icon>
        </button>
        <button onClick={() => setIsCameraOff(p => !p)} className={`p-4 rounded-full transition-colors ${isCameraOff ? 'bg-white text-black' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
           <Icon className="w-7 h-7">{isCameraOff ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25v-9a2.25 2.25 0 012.25-2.25h7.5" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />}</Icon>
        </button>
      </div>
    </div>
  );
};

export default CallModal;
