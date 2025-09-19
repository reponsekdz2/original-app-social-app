
import React, { useState, useEffect } from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';

interface CallModalProps {
  user: User;
  status: 'outgoing' | 'active';
  onEndCall: () => void;
}

const CallModal: React.FC<CallModalProps> = ({ user, status, onEndCall }) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (status === 'active') {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-between p-8 text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-300">
            {status === 'outgoing' ? 'Ringing...' : formatTime(duration)}
        </p>
      </div>
      
      <div className="relative">
        <img src={user.avatar} alt={user.username} className="w-48 h-48 rounded-full object-cover border-4 border-gray-700" />
      </div>

      <div className="flex items-center gap-6">
        <button onClick={() => setIsMuted(p => !p)} className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-white text-black' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
          <Icon className="w-7 h-7">{isMuted ? <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25