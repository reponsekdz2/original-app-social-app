import React, { useRef, useEffect, useState } from 'react';
// Fix: Corrected import path for types
import type { Reel as ReelType, User } from '../types.ts';
import Reel from './Reel.tsx';
import Icon from './Icon.tsx';

interface ReelsViewProps {
  reels: ReelType[];
  currentUser: User;
  onLikeReel: (reelId: string) => void;
  onCommentOnReel: (reel: ReelType) => void;
  onShareReel: (reel: ReelType) => void;
}

const ReelsView: React.FC<ReelsViewProps> = ({ reels, currentUser, onLikeReel, onCommentOnReel, onShareReel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector('video');
          if (video) {
            if (entry.isIntersecting) {
              video.play().catch(e => console.log("Video autoplay failed:", e));
              const id = (entry.target as HTMLElement).dataset.reelId;
              if (id) {
                const index = reels.findIndex(r => r.id === id);
                if (index > -1) setCurrentIndex(index);
              }
            } else {
              video.pause();
            }
          }
        });
      },
      {
        threshold: 0.5, 
      }
    );

    const reelElements = containerRef.current?.querySelectorAll('.reel-container');
    if (reelElements) {
      reelElements.forEach((reel) => observer.observe(reel as Element));
    }

    return () => {
      if (reelElements) {
        reelElements.forEach((reel) => observer.unobserve(reel as Element));
      }
    };
  }, [reels]);

  const handleScrollTo = (index: number) => {
    if (containerRef.current) {
        const reelElements = containerRef.current.querySelectorAll('.reel-container');
        if (reelElements[index]) {
            reelElements[index].scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  const handleNext = () => {
      const nextIndex = (currentIndex + 1);
      if (nextIndex < reels.length) {
          handleScrollTo(nextIndex);
      }
  };

  const handlePrev = () => {
      const prevIndex = (currentIndex - 1);
      if (prevIndex >= 0) {
          handleScrollTo(prevIndex);
      }
  };

  return (
    <div className="relative h-[calc(100vh-theme(space.16))] md:h-[calc(100vh-4rem)]">
      <div ref={containerRef} className="h-full snap-y snap-mandatory overflow-y-auto scrollbar-hide flex flex-col items-center">
        {reels.map(reel => (
          <div key={reel.id} data-reel-id={reel.id} className="reel-container h-full w-full snap-start flex items-center justify-center flex-shrink-0">
            <div className="h-full w-full max-w-sm aspect-[9/16]">
              <Reel
                reel={reel}
                currentUser={currentUser}
                onLike={() => onLikeReel(reel.id)}
                onComment={() => onCommentOnReel(reel)}
                onShare={() => onShareReel(reel)}
              />
            </div>
          </div>
        ))}
      </div>
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10">
            {currentIndex > 0 && (
                <button 
                    onClick={handlePrev} 
                    aria-label="Previous reel" 
                    className="bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition-colors"
                >
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></Icon>
                </button>
            )}
            {currentIndex < reels.length - 1 && (
                <button 
                    onClick={handleNext} 
                    aria-label="Next reel" 
                    className="bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition-colors"
                >
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></Icon>
                </button>
            )}
        </div>
    </div>
  );
};

export default ReelsView;
