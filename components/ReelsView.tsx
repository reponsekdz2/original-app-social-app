import React, { useRef, useEffect } from 'react';
import type { Reel as ReelType } from '../types';
import Reel from './Reel';

interface ReelsViewProps {
  reels: ReelType[];
}

const ReelsView: React.FC<ReelsViewProps> = ({ reels }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector('video');
          if (video) {
            if (entry.isIntersecting) {
              video.play().catch(e => console.log("Video autoplay failed:", e));
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

    const reels = containerRef.current?.querySelectorAll('.reel-container');
    if (reels) {
      reels.forEach((reel) => observer.observe(reel as Element));
    }

    return () => {
      if (reels) {
        reels.forEach((reel) => observer.unobserve(reel as Element));
      }
    };
  }, [reels]);

  return (
    <div ref={containerRef} className="h-[calc(100vh-theme(space.16))] md:h-[calc(100vh-4rem)] snap-y snap-mandatory overflow-y-auto scrollbar-hide flex flex-col items-center">
      {reels.map(reel => (
        <div key={reel.id} className="reel-container h-full w-full snap-start flex items-center justify-center flex-shrink-0">
          <div className="h-full w-full max-w-sm aspect-[9/16]">
            <Reel reel={reel} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReelsView;
