import React, { useRef, useState, useEffect } from 'react';
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
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const volumeTimeoutRef = useRef<number | null>(null);

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
  
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.play().catch(e => console.log("Autoplay failed", e));
        setIsPlaying(true);
        videoRef.current.volume = volume;
        videoRef.current.muted = isMuted;
    }
  }, []);

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if(videoRef.current) {
        videoRef.current.muted = newMutedState;
    }
    if(newMutedState) setVolume(0);
    if(!newMutedState && volume === 0) setVolume(0.5);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (videoRef.current) {
          videoRef.current.volume = newVolume;
          videoRef.current.muted = newVolume === 0;
      }
      setIsMuted(newVolume === 0);
  };
  
  const showVolumeControl = () => {
    setShowVolume(true);
    if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
    volumeTimeoutRef.current = window.setTimeout(() => setShowVolume(false), 3000);
  };

  return (
    <div className="relative h-full w-full bg-black rounded-lg overflow-hidden" onMouseEnter={showVolumeControl} onMouseLeave={() => setShowVolume(false)}>
      <video
        ref={videoRef}
        onClick={handleVideoPress}
        className="w-full h-full object-cover"
        loop
        playsInline
        src={reel.video_url}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40" onClick={handleVideoPress}>
          <Icon className="w-16 h-16 text-white/70"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.538 0 3.286L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></Icon>
        </div>
      )}
      
      <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
        <div></div> {/* Top spacer */}
        <div className="flex items-end gap-4">
            <div className="flex-1 text-white z-10 pointer-events-auto">
                <div className="flex items-center gap-2 mb-2">
                    <img src={reel.user.avatar_url} alt={reel.user.username} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                    <p className="font-semibold">{reel.user.username}</p>
                    <button className="text-xs font-semibold border border-white px-3 py-1 rounded-md ml-2 hover:bg-white/20">Follow</button>
                </div>
                <p className="text-sm">{reel.caption}</p>
            </div>
             <div className="flex flex-col items-center gap-5 text-white z-10 pointer-events-auto">
                <button onClick={onLike} className="flex flex-col items-center">
                    <Icon className={`w-8 h-8 ${isLiked ? 'text-blue-500' : ''}`} fill={isLiked ? 'currentColor' : 'none'}><path stroke="currentColor" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
                    <span className="text-sm font-semibold mt-1">{reel.likes.toLocaleString()}</span>
                </button>
                <button onClick={onComment} className="flex flex-col items-center">
                    <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25z" /></Icon>
                    <span className="text-sm font-semibold mt-1">{reel.comments.length.toLocaleString()}</span>
                </button>
                <button onClick={onShare} className="flex flex-col items-center">
                    <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon>
                    <span className="text-sm font-semibold mt-1">{reel.shares.toLocaleString()}</span>
                </button>
           </div>
        </div>
      </div>
      
      <div className={`absolute bottom-4 left-4 z-20 flex items-center gap-2 transition-opacity duration-300 ${showVolume ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={handleMuteToggle} className="p-2 bg-black/50 rounded-full pointer-events-auto">
            <Icon className="w-5 h-5 text-white">
                {isMuted || volume === 0 ? <path d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /> : <path d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />}
            </Icon>
        </button>
        <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={isMuted ? 0 : volume} 
            onChange={handleVolumeChange}
            className="w-20 pointer-events-auto accent-white"
        />
      </div>
    </div>
  );
};

export default Reel;