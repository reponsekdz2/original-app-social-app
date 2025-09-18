import React from 'react';
import type { Reel } from '../types.ts';
import Icon from './Icon.tsx';

interface ReelGridProps {
  reels: Reel[];
  onViewReel: (reel: Reel) => void;
}

const ReelGrid: React.FC<ReelGridProps> = ({ reels, onViewReel }) => {
  if (reels.length === 0) {
    return <div className="text-center text-gray-500 p-8">No reels yet.</div>;
  }
  
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
      {reels.map(reel => (
        <div key={reel.id} className="relative aspect-[9/16] group cursor-pointer bg-black" onClick={() => onViewReel(reel)}>
          <video src={reel.video} className="w-full h-full object-cover rounded" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center rounded">
            <div className="text-white opacity-0 group-hover:opacity-100 flex items-center space-x-4">
              <span className="flex items-center font-bold text-sm"><Icon className="w-5 h-5 mr-1" fill="currentColor"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>{reel.likes}</span>
              <span className="flex items-center font-bold text-sm"><Icon className="w-5 h-5 mr-1" fill="currentColor"><path fillRule="evenodd" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.49.03.984.067 1.483.102.72.056 1.45.099 2.18.138 1.491.079 2.996.136 4.502.157 1.506.021 3.012-.036 4.502-.157.73-.039 1.46-.082 2.18-.138.499-.035.993-.071 1.483-.102.787-.058 1.575-.12 2.365-.194a3.003 3.003 0 002.707-3.227V6.741c0-1.6-1.123-2.994-2.707-3.227A48.344 48.344 0 0012 3c-2.392 0-4.744.175-7.043.514A3.003 3.003 0 002.25 6.741v6.018z" clipRule="evenodd" /></Icon>{reel.comments.length}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReelGrid;