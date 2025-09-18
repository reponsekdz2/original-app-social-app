import React, { useState, useEffect } from 'react';
// Fix: Add .ts extension to types import
import type { User } from '../types.ts';
// Fix: Add .tsx extension to Icon import
import Icon from './Icon.tsx';

interface CallModalProps {
  user: User;
  type: 'audio' | 'video';
  onClose: () => void;
}

const CallModal: React.FC<CallModalProps> = ({ user, type, onClose }) => {
  const [callStatus, setCallStatus] = useState('Calling...');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(type === 'audio');

  useEffect(() => {
    // Simulate call connection
    const timer = setTimeout(() => {
      setCallStatus('00:03'); // Start a mock timer
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4" onClick={onClose}>
      <div className="flex flex-col items-center justify-center flex-1 text-white">
        <img src={user.avatar} alt={user.username} className="w-40 h-40 rounded-full object-cover border-4 border-gray-700 shadow-lg mb-4" />
        <h2 className="text-4xl font-bold">{user.username}</h2>
        <p className="text-gray-400 mt-2 text-lg">{callStatus}</p>
      </div>
      
      <div className="absolute bottom-10 flex items-center gap-6">
        <button 
          onClick={() => setIsMuted(p => !p)} 
          className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
        >
          <Icon className="w-7 h-7">
            {isMuted ? <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />}
          </Icon>
        </button>
        
        {type === 'video' && (
           <button 
              onClick={() => setIsCameraOff(p => !p)} 
              className={`p-4 rounded-full transition-colors ${isCameraOff ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
           >
              <Icon className="w-7 h-7">
                {isCameraOff ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l-3.75-3.75m0 0L8.25 3m3.75 3.75L3 3m12.75 3.75L3 16.5m12.75-3.75v-3.375c0-.621-.504-1.125-1.125-1.125h-3.75c-.621 0-1.125.504-1.125 1.125v9.75c0 .621.504 1.125 1.125 1.125h3.75c.621 0 1.125-.504 1.125-1.125V15m-1.125-4.5h-3.75" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />}
              </Icon>
          </button>
        )}
        
        <button 
          onClick={onClose} 
          className="p-5 bg-red-600 text-white rounded-full hover:bg-red-700 transform hover:scale-110 transition-all"
        >
          <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" transform="rotate(-135 12 12)" /></Icon>
        </button>
      </div>
    </div>
  );
};

export default CallModal;