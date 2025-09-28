import React, { useState, useEffect, useRef } from 'react';
import type { User, LiveStream } from '../types.ts';
import Icon from './Icon.tsx';
import { socketService } from '../services/socketService.ts';

interface LiveStreamViewProps {
  stream: LiveStream;
  currentUser: User;
  onClose: () => void;
}

interface LiveComment {
    id: string;
    user: { username: string, avatar_url: string };
    text: string;
}

const LiveStreamView: React.FC<LiveStreamViewProps> = ({ stream, currentUser, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [comments, setComments] = useState<LiveComment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [isBroadcaster, setIsBroadcaster] = useState(stream.user.id === currentUser.id);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const setupStream = async () => {
            if (isBroadcaster) {
                try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    streamRef.current = mediaStream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                    // In a real app, you'd send this stream to a media server
                } catch (err) {
                    console.error("Error accessing camera for broadcast", err);
                    onClose(); // Close if camera fails
                }
            } else {
                // In a real app, you'd receive the stream from a media server
                console.log("Viewer mode: stream would be received here.");
            }
        };

        setupStream();
        
        socketService.emit('join_stream', stream.id);
        socketService.on('new_live_comment', (newComment: LiveComment) => {
            setComments(prev => [...prev, newComment]);
        });
        
        return () => {
            socketService.emit('leave_stream', stream.id);
            socketService.off('new_live_comment');
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };

    }, [stream.id, isBroadcaster, onClose]);

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            const newComment: LiveComment = {
                id: Date.now().toString(),
                user: { username: currentUser.username, avatar_url: currentUser.avatar_url },
                text: commentText,
            };
            socketService.emit('live_comment', { streamId: stream.id, comment: newComment });
            setCommentText('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="relative w-full h-full aspect-[9/16] bg-gray-900 overflow-hidden">
                <video ref={videoRef} autoPlay muted={isBroadcaster} playsInline className="w-full h-full object-cover" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <img src={stream.user.avatar_url} alt={stream.user.username} className="w-10 h-10 rounded-full" />
                             <div>
                                <p className="font-bold">{stream.user.username}</p>
                                <p className="text-sm text-gray-300">{stream.title}</p>
                             </div>
                        </div>
                         <div className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">LIVE</div>
                         <button onClick={onClose} className="p-2 bg-black/40 rounded-full">
                            <Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon>
                         </button>
                    </div>

                    <div className="absolute bottom-20 left-4 right-4 h-48 overflow-y-auto scrollbar-hide flex flex-col-reverse">
                        <div className="space-y-2">
                        {comments.map((comment) => (
                            <div key={comment.id} className="bg-black/40 p-2 rounded-lg text-sm flex items-start gap-2">
                                <img src={comment.user.avatar_url} alt={comment.user.username} className="w-6 h-6 rounded-full flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-gray-300">{comment.user.username}</span>
                                    <p>{comment.text}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                         <form onSubmit={handleSendComment} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-black/50 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                            <button type="submit" className="p-2 rounded-full bg-red-500 disabled:bg-gray-600" disabled={!commentText.trim()}>
                                <Icon className="w-6 h-6"><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveStreamView;