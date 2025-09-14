import React from 'react';
import type { Reel as ReelType } from '../types';
import Reel from './Reel';

interface ReelsViewProps {
    reels: ReelType[];
}

const ReelsView: React.FC<ReelsViewProps> = ({ reels }) => {
  return (
    <div className="relative w-full h-full flex justify-center bg-black">
      <div className="relative h-full w-full max-w-md overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {reels.map(reel => (
          <div key={reel.id} className="h-full w-full snap-start flex-shrink-0">
            <Reel reel={reel} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsView;