import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';

interface CallModalProps {
  user: User;
  status: 'outgoing' | 'active' | 'connecting';
  callType: 'video' | 'audio';
  onEndCall: () => void;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  isMuted: boolean;
  isCameraOff: boolean;
}

const CallModal: React.FC<CallModalProps> = (props) => {
  const { user, status, callType, onEndCall, localStream, remoteStream, onToggleMute, onToggleCamera, isMuted, isCameraOff } = props;
  const [duration, setDuration] = useState(0);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);


  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (status === 'active') {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);
  
  // Effect for handling outgoing call sound
  useEffect(() => {
    if (status === 'outgoing') {
      audioRef.current = new Audio('/assets/ringtone.mp3'); // Assuming this file exists
      audioRef.current.loop = true;
      audioRef.current.play().catch(e => console.error("Outgoing ringtone autoplay failed:", e));
    }

    // Cleanup: stop the sound if status changes or component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [status]);


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  const getStatusText = () => {
      switch(status) {
          case 'outgoing': return 'Ringing...';
          case 'connecting': return 'Connecting...';
          case 'active': return formatTime(duration);
      }
  }

  const showRemoteVideo = callType === 'video' && remoteStream && !isCameraOff;
  const showLocalVideo = callType === 'video' && localStream && !isCameraOff;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-between p-4 md:p-8 text-white">
      {/* Remote Video / Audio Avatar (Fullscreen Background) */}
      <div className="absolute top-0 left-0 w-full h-full object-cover z-0">
          {showRemoteVideo ? (
             <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <img src={user.avatar} alt={user.name} className="w-48 h-48 rounded-full opacity-50" />
            </div>
          )}
      </div>
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Local Video (Picture-in-Picture) */}
      <div className="absolute top-4 right-4 w-32 h-48 md:w-48 md:h-64 z-20 rounded-lg overflow-hidden border-2 border-white/50 bg-black">
        {showLocalVideo && (
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
      </div>

      <div className="relative z-20 text-center pt-8">
        <h2 className="text-3xl font-bold drop-shadow-lg">{user.name}</h2>
        <p className="text-lg text-gray-200 drop-shadow-md">{getStatusText()}</p>
      </div>
      
      <div className="relative z-20 flex items-center gap-4 md:gap-6">
        <button onClick={onToggleMute} className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-white text-black' : 'bg-white/20 backdrop-blur-md hover:bg-white/30'}`}>
          <Icon className="w-6 h-6 md:w-7 md:h-7">{isMuted ? <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 7.5v-1.5a6 6 0 00-6-6v-1.5a6 6 0 00-6 6v1.5m6 6v-1.5" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 7.5v-1.5a6 6 0 00-6-6v-1.5a6 6 0 00-6 6v1.5m6 6v-1.5" />}</Icon>
        </button>
        {callType === 'video' && (
            <button onClick={onToggleCamera} className={`p-4 rounded-full transition-colors ${isCameraOff ? 'bg-white text-black' : 'bg-white/20 backdrop-blur-md hover:bg-white/30'}`}>
              <Icon className="w-6 h-6 md:w-7 md:h-7">{isCameraOff ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />}</Icon>
            </button>
        )}
        <button onClick={onEndCall} className="p-4 bg-red-600 rounded-full hover:bg-red-700">
          <Icon className="w-6 h-6 md:w-7 md:h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L4.5 15m0 0h8.25m-8.25 0V6.75" /></Icon>
        </button>
      </div>
    </div>
  );
};

export default CallModal;