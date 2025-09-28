import React from 'react';
import type { Reel as ReelType, User } from '../types.ts';
import Reel from './Reel.tsx';

interface ReelsViewProps {
  reels: ReelType[];
  currentUser: User;
  onLikeReel: (reelId: string) => void;
  onCommentOnReel: (reel: ReelType) => void;
  onShareReel: (reel: ReelType) => void;
}

const ReelsView: React.FC<ReelsViewProps> = ({ reels, currentUser, onLikeReel, onCommentOnReel, onShareReel }) => {
  return (
    <div className="relative h-[calc(100vh-4rem)] md:h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide">
      {reels.map(reel => (
        <div key={reel.id} className="h-full snap-start flex items-center justify-center">
          <Reel 
            reel={reel}
            currentUser={currentUser}
            onLike={() => onLikeReel(reel.id)}
            onComment={() => onCommentOnReel(reel)}
            onShare={() => onShareReel(reel)}
          />
        </div>
      ))}
    </div>
  );
};

export default ReelsView;
