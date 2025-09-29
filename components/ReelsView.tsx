
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Reel as ReelType, User } from '../types.ts';
import * as api from '../services/apiService.ts';
import Reel from './Reel.tsx';

interface ReelsViewProps {
  initialReels: ReelType[];
  currentUser: User;
  onLikeReel: (reelId: string) => void;
  onCommentOnReel: (reel: ReelType) => void;
  onShareReel: (reel: ReelType) => void;
}

const ReelsView: React.FC<ReelsViewProps> = ({ initialReels, currentUser, onLikeReel, onCommentOnReel, onShareReel }) => {
  const [reels, setReels] = useState<ReelType[]>(initialReels);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const loadMoreReels = useCallback(async () => {
    setIsLoading(true);
    try {
      // FIX: Pass page number to fetch next set of reels.
      const newReels = await api.getReels(page);
      if (newReels && newReels.length > 0) {
        setReels(prev => [...prev, ...newReels]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more reels", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const lastReelElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreReels();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMoreReels]);

  useEffect(() => {
      setReels(initialReels);
      setPage(2);
      setHasMore(initialReels.length > 0);
  }, [initialReels]);

  return (
    <div className="relative h-[calc(100vh-4rem)] md:h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide">
      {reels.map((reel, index) => (
        <div ref={index === reels.length - 1 ? lastReelElementRef : null} key={reel.id} className="h-full snap-start flex items-center justify-center">
          <Reel 
            reel={reel}
            currentUser={currentUser}
            onLike={() => onLikeReel(reel.id)}
            onComment={() => onCommentOnReel(reel)}
            onShare={() => onShareReel(reel)}
          />
        </div>
      ))}
      {isLoading && <div className="h-full snap-start flex items-center justify-center"><div className="sk-chase"><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div></div></div>}
    </div>
  );
};

export default ReelsView;