// Fix: Create Reel component.
// Fix: Add useEffect to the import from React.
import React, { useRef, useState, useEffect } from 'react';
// Fix: Add .ts extension to import to resolve module.
import type { Reel as ReelType } from '../types.ts';
import Icon from './Icon.tsx';

interface ReelProps {
  reel: ReelType;
}

const Reel: React.FC<ReelProps> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

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
            <button className="flex flex-col items-center">
                <Icon className="w-8 h-8"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
                <span className="text-sm font-semibold">{reel.likes.toLocaleString()}</span>
            </button>
            <button className="flex flex-col items-center">
                <Icon className="w-8 h-8"><path fillRule="evenodd" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.49.03.984.067 1.483.102.72.056 1.45.099 2.18.138 1.491.079 2.996.136 4.502.157 1.506.021 3.012-.036 4.502-.157.73-.039 1.46-.082 2.18-.138.499-.035.993-.071 1.483-.102.787-.058 1.575-.12 2.365-.194a3.003 3.003 0 002.707-3.227V6.741c0-1.6-1.123-2.994-2.707-3.227A48.344 48.344 0 0012 3c-2.392 0-4.744.175-7.043.514A3.003 3.003 0 002.25 6.741v6.018z" clipRule="evenodd" /></Icon>
                <span className="text-sm font-semibold">{reel.comments.toLocaleString()}</span>
            </button>
       </div>
    </div>
  );
};

export default Reel;
