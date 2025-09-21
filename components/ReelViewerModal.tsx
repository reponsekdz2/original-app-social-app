import React from 'react';
import type { Reel as ReelType, User } from '../types';
import Reel from './Reel.tsx';
import Icon from './Icon.tsx';

interface ReelViewerModalProps {
  reel: ReelType;
  currentUser: User;
  onClose: () => void;
  onLikeReel: (reelId: string) => void;
  onCommentOnReel: (reel: ReelType) => void;
  onShareReel: (reel: ReelType) => void;
}

const ReelViewerModal: React.FC<ReelViewerModalProps> = (props) => {
    const { reel, currentUser, onClose, onLikeReel, onCommentOnReel, onShareReel } = props;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-0 md:p-4" onClick={onClose}>
             <button className="absolute top-4 right-4 text-white z-10 p-2 bg-black/30 rounded-full" onClick={onClose}>
                <Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon>
            </button>
            <div 
                className="relative h-full w-full max-w-sm aspect-[9/16] shadow-xl"
                onClick={e => e.stopPropagation()}
            >
               <Reel
                    reel={reel}
                    currentUser={currentUser}
                    onLike={() => onLikeReel(reel.id)}
                    onComment={() => onCommentOnReel(reel)}
                    onShare={() => onShareReel(reel)}
                />
            </div>
        </div>
    );
};

export default ReelViewerModal;