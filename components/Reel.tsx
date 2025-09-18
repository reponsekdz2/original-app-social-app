
// Fix: Create Reel component.
// Fix: Add useEffect to the import from React.
import React, { useRef, useState, useEffect } from 'react';
// Fix: Corrected import path for types
import type { Reel as ReelType, User } from '../types.ts';
import Icon from './Icon.tsx';

interface ReelProps {
  reel: ReelType;
  currentUser: User;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

const Reel: React.FC<ReelProps> = ({ reel, currentUser, onLike, onComment, onShare }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const isLiked = reel.likedBy.some(u => u.id === currentUser.id);


  const handleVideoPress = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
    // Start playing when it comes into view
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Autoplay failed", e));
        setIsPlaying(true);
    }
  }, []);


  return (
    <div className="relative h-full w-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        onClick={handleVideoPress}
        className="w-full h-full object-cover"
        loop
        playsInline
        src={reel.video}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" onClick={handleVideoPress}>
          <Icon className="w-16 h-16 text-white/70"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></Icon>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/50">
        <div className="flex items-center mb-2">
          <img src={reel.user.avatar} alt={reel.user.username} className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-white" />
          <p className="font-semibold">{reel.user.username}</p>
        </div>
        <p className="text-sm">{reel.caption}</p>
      </div>
       <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-4 text-white">
            <button onClick={onLike} className="flex flex-col items-center">
                <Icon className={`w-8 h-8 ${isLiked ? 'text-red-500' : ''}`} fill={isLiked ? 'currentColor' : 'none'}>
                    <path stroke="currentColor" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </Icon>
                <span className="text-sm font-semibold">{reel.likes.toLocaleString()}</span>
            </button>
            <button onClick={onComment} className="flex flex-col items-center">
                <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25zM12 16.5a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5H12zM15.375 12a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5h6.75z" /></Icon>
                <span className="text-sm font-semibold">{reel.comments.length.toLocaleString()}</span>
            </button>
            <button onClick={onShare} className="flex flex-col items-center">
                <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon>
                <span className="text-sm font-semibold">{reel.shares.toLocaleString()}</span>
            </button>
       </div>
    </div>
  );
};

export default Reel;
