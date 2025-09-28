

import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon.tsx';
import type { User } from '../types.ts';
import { webRTCManager } from '../services/WebRTCManager.ts';

interface CallModalProps {
  user: User;
  status: 'calling' | 'connected';
  type: 'video' | 'audio';
  onHangUp: () => void;
  remoteStream: MediaStream | null;
}

const CallModal: React.FC<CallModalProps> = ({ user, status, type, onHangUp, remoteStream }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(type === 'audio');
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (status === 'connected') {
            timer = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [status]);
    
    useEffect(() => {
        if (localVideoRef.current && webRTCManager.localStream) {
            localVideoRef.current.srcObject = webRTCManager.localStream;
        }
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [webRTCManager.localStream, remoteStream]);
    
    const handleToggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        webRTCManager.toggleMute(newMutedState);
    };

    const handleToggleVideo = () => {
        if (type === 'audio' || isScreenSharing) return;
        const newVideoState = !isVideoOff;
        setIsVideoOff(newVideoState);
        webRTCManager.toggleVideo(newVideoState);
    };
    
    const handleToggleScreenShare = async () => {
        if (isScreenSharing) {
            await webRTCManager.stopScreenShare();
            setIsScreenSharing(false);
        } else {
            await webRTCManager.startScreenShare();
            setIsScreenSharing(true);
        }
    };
    
    const handleSwitchCamera = async () => {
        if (!isScreenSharing) {
            await webRTCManager.switchCamera();
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };
    
    const showRemoteVideo = status === 'connected' && remoteStream && type === 'video';

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center text-white p-4">
        <div className="absolute inset-0 flex items-center justify-center">
            {showRemoteVideo ? (
                 <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
                <div className="flex flex-col items-center">
                    <img src={user.avatar_url} alt={user.username} className="w-48 h-48 rounded-full border-4 border-gray-600 opacity-50 mb-4" />
                    <div className="text-center">
                        <p className="text-2xl font-bold">{user.username}</p>
                        <p className="text-lg text-gray-400">{status === 'calling' ? 'Calling...' : status === 'connected' ? 'Connected' : 'Connecting...'}</p>
                    </div>
                </div>
            )}
        </div>

      <div className="absolute top-4 left-4 text-left z-10 bg-black/30 p-2 rounded-lg">
          <h2 className="text-xl font-bold">In call with {user.username}</h2>
          <p className="text-gray-300">{formatDuration(callDuration)}</p>
      </div>

       <video ref={localVideoRef} autoPlay playsInline muted className={`absolute bottom-28 right-4 w-32 h-48 object-cover rounded-lg border-2 border-gray-500 z-20 transition-opacity ${isVideoOff || type === 'audio' ? 'opacity-0' : 'opacity-100'}`} />
    
      <div className="absolute bottom-10 flex items-center gap-4 z-10 bg-black/40 p-3 rounded-full">
        <button onClick={handleToggleMute} title={isMuted ? "Unmute" : "Mute"} className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700/80'}`}>
            <Icon className="w-6 h-6">{isMuted ? <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 7.5v-1.5a6 6 0 00-6-6v-1.5a6 6 0 00-6 6v1.5m6 6v-1.5m0-10.5v-1.5a6 6 0 00-6 6v1.5" />}</Icon>
        </button>
         <button onClick={handleToggleVideo} title={isVideoOff ? "Turn Video On" : "Turn Video Off"} disabled={type === 'audio' || isScreenSharing} className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-700/80'} disabled:opacity-50 disabled:cursor-not-allowed`}>
            <Icon className="w-6 h-6">{isVideoOff ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25zM21 4.875l-8.25 8.25m0 0l-8.25 8.25M12.75 13.125L21 21.375" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />}</Icon>
        </button>
         <button onClick={handleToggleScreenShare} title={isScreenSharing ? "Stop Sharing" : "Share Screen"} disabled={type === 'audio'} className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-500' : 'bg-gray-700/80'} disabled:opacity-50 disabled:cursor-not-allowed`}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></Icon>
        </button>
         <button onClick={handleSwitchCamera} title="Switch Camera" disabled={type === 'audio' || isScreenSharing} className="p-3 bg-gray-700/80 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.696a8.25 8.25 0 010 11.664m-11.664 0a8.25 8.25 0 010-11.664m11.664 0l-3.181-3.182a8.25 8.25 0 00-11.664 0l-3.181 3.182" /></Icon>
        </button>
        <button onClick={onHangUp} className="p-4 bg-red-600 rounded-full rotate-[135deg]">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></Icon>
        </button>
      </div>
    </div>
  );
};

export default CallModal;