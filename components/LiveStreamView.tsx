import React, { useState, useEffect, useRef } from 'react';
import type { LiveStream, User } from '../types.ts';
import Icon from './Icon.tsx';
import { socketService } from '../services/socketService.ts';

interface LiveStreamViewProps {
  stream: LiveStream;
  currentUser: User;
  onClose: () => void;
}

interface LiveChatMessage {
    user: {
        id: string;
        username: string;
    };
    text: string;
}

const LiveStreamView: React.FC<LiveStreamViewProps> = ({ stream, currentUser, onClose }) => {
  const [comment, setComment] = useState('');
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Effect to manage the live video stream from the camera
  useEffect(() => {
    let activeStream: MediaStream;
    const startCameraStream = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            activeStream = mediaStream;
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera for live stream:", err);
            alert("Could not access camera. Please check permissions.");
            onClose(); // Close the modal if camera access fails
        }
    };

    startCameraStream();

    return () => {
        if (activeStream) {
            activeStream.getTracks().forEach(track => track.stop());
        }
    };
  }, [onClose]);

  // Effect to manage the live chat via sockets
  useEffect(() => {
    socketService.emit('join_stream', stream.id);

    const handleNewComment = (newComment: LiveChatMessage) => {
        setMessages(prev => [...prev.slice(-100), newComment]); // Keep last 100 messages
    };
    socketService.on('new_live_comment', handleNewComment);

    return () => {
        socketService.emit('leave_stream', stream.id);
        socketService.off('new_live_comment', handleNewComment);
    };
  }, [stream.id]);


  const handleSendComment = () => {
    if (comment.trim()) {
      const commentData: LiveChatMessage = {
        user: {
          id: currentUser.id,
          username: currentUser.username,
        },
        text: comment.trim(),
      };
      socketService.emit('live_comment', { streamId: stream.id, comment: commentData });
      setComment('');
    }
  };

  const isMyStream = stream.user.id === currentUser.id;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col md:flex-row">
      {/* Video Player Section */}
      <div className="flex-1 bg-gray-900 flex items-center justify-center relative" onClick={e => e.stopPropagation()}>
        <video ref={videoRef} autoPlay playsInline muted={isMyStream} className="max-h-full max-w-full w-full h-full object-cover" />
        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3 text-white">
                <img src={stream.user.avatar_url} alt={stream.user.username} className="w-12 h-12 rounded-full border-2 border-red-500" />
                <div>
                    <h2 className="font-bold text-lg">{stream.user.username}</h2>
                    <p className="text-sm text-gray-300">{stream.title}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-black/50 rounded-full text-white">
                  <Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon>
              </button>
          </div>
        </div>
         <div className="absolute top-20 left-4 text-white p-2 bg-black/50 rounded-lg text-sm flex items-center gap-4">
            <span className="flex items-center gap-1"><Icon className="w-4 h-4 text-red-500" fill="currentColor"><circle cx="12" cy="12" r="8" /></Icon> LIVE</span>
            <span className="flex items-center gap-1"><Icon className="w-4 h-4"><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663l.001.109m-11.964-4.663c0-1.113.285-2.16.786-3.07M3.75 9.128v.003c0 1.113.285-2.16.786-3.07M3.75 9.128v-.109a12.318 12.318 0 018.624-8.043 12.318 12.318 0 018.624 8.043l-.001.109c0 1.113-.285-2.16-.786-3.07m-11.964-4.663l.001-.109a6.375 6.375 0 0111.964 4.663l-.001.109" /></Icon> 1,234</span>
        </div>
      </div>
      {/* Chat Section */}
      <div className="w-full h-1/2 md:h-full md:w-96 bg-gray-900 border-l border-gray-800 flex flex-col" onClick={e => e.stopPropagation()}>
        <h3 className="p-4 border-b border-gray-800 font-bold text-lg text-center">Live Chat</h3>
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className="text-sm">
                <span className="font-semibold text-gray-400">{msg.user.username}: </span>
                <span>{msg.text}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 bg-gray-800 rounded-full p-1">
            <input 
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendComment()}
              placeholder="Comment..."
              className="w-full bg-transparent px-3 py-1 focus:outline-none"
            />
            <button onClick={handleSendComment} className="text-red-500 font-semibold p-2 rounded-full hover:bg-gray-700">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamView;