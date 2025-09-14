// Fix: Create Reel component.
import React, { useRef, useState } from 'react';
import type { Reel as ReelType } from '../types';
import Icon from './Icon';

interface ReelProps {
  reel: ReelType;
}

const Reel: React.FC<ReelProps> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <div className="relative h-full w-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        onClick={handleVideoPress}
        className="w-full h-full object-cover"
        loop
        src={reel.video}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center" onClick={handleVideoPress}>
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
                <Icon className="w-8 h-8"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.247 15.247 0 01-1.344.688l-.022.012-.007.003h-.001ac.45.45 0 01.224.194l.428.746A12.986 12.986 0 002.49 18.073a9.703 9.703 0 01-1.423-5.523c0-2.343.886-4.555 2.343-6.21.378-.426.79-.81 1.234-1.139a.75.75 0 01.95.145l.022.033c.074.114.085.25.033.374a13.44 13.44 0 00-1.226 2.165 10.463 10.463 0 00-1.874 5.482.75.75 0 01-1.498-.059 11.963 11.963 0 011.807-5.834 14.98 14.98 0 012.24-4.04C6.182 4.137 7.91 3.5 9.782 3.5h.027a9.75 9.75 0 019.263 11.129 9.75 9.75 0 01-9.263 2.138 9.726 9.726 0 01-2.433-.668 13.725 13.725 0 01-2.288-1.505.75.75 0 01-.1-.965c.09-.234.34-.363.585-.272.246.09.4.332.31.567a12.228 12.228 0 001.947 1.256c.48.26.985.48 1.517.655a8.25 8.25 0 008.25-8.25 8.25 8.25 0 00-8.25-8.25H9.782c-1.536 0-3.02.48-4.25 1.336a13.483 13.483 0 00-3.43 3.653A11.25 11.25 0 00.75 12.553a11.25 11.25 0 002.043 6.95A14.48 14.48 0 0111.5 21.021h.145a.75.75 0 010 1.5h-.145c-2.441 0-4.816-.621-6.95-1.772a.75.75 0 01-.224-1.037l.428-.746a.45.45 0 01.224-.194z" /></Icon>
                <span className="text-sm font-semibold">{reel.likes.toLocaleString()}</span>
            </button>
            <button className="flex flex-col items-center">
                <Icon className="w-8 h-8"><path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 01-1.5 0V6.375a.375.375 0 00-.375-.375H3.375A.375.375 0 003 6.375v9.25c0 .207.168.375.375.375h17.25a.375.375 0 00.375-.375v-3.026a.75.75 0 011.5 0v3.026c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 15.625v-9.25zM12.75 6a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75z" clipRule="evenodd" /></Icon>
                <span className="text-sm font-semibold">{reel.comments.toLocaleString()}</span>
            </button>
       </div>
    </div>
  );
};

export default Reel;
