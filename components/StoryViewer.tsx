

import React, { useState, useEffect, useRef } from 'react';
import type { Story } from '../types';
import Icon from './Icon';

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Fix: The return type of setTimeout in the browser is `number`, not `NodeJS.Timeout`.
  const timerRef = useRef<number | null>(null);

  const goToNext = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex >= story.stories.length - 1) {
        onClose();
        return prevIndex;
      }
      return prevIndex + 1;
    });
  };

  const goToPrev = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex <= 0) {
        return 0;
      }
      return prevIndex - 1;
    });
  };

  // Fix: Use window.setTimeout and window.clearTimeout to ensure the browser's timer implementation is used, which returns a number.
  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    const currentStoryItem = story.stories[currentIndex];
    if(currentStoryItem) {
        timerRef.current = window.setTimeout(goToNext, currentStoryItem.duration);
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, story]);

  const currentStoryItem = story.stories[currentIndex];

  if (!currentStoryItem) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="relative w-full h-full max-w-md max-h-screen" onClick={e => e.stopPropagation()}>
        <img 
            src={currentStoryItem.image} 
            alt={`Story by ${story.user.username}`} 
            className="w-full h-full object-contain"
        />

        <div className="absolute top-0 left-0 right-0 p-4">
            <div className="flex items-center gap-x-1 mb-2">
                {story.stories.map((s, index) => (
                    <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                       {index < currentIndex && <div className="h-full bg-white w-full"></div>}
                       {index === currentIndex && (
                         <div 
                           className="h-full bg-white progress-bar-fill"
                           style={{ animationDuration: `${s.duration}ms` }}
                         ></div>
                       )}
                    </div>
                ))}
            </div>
            <div className="flex items-center">
                <img src={story.user.avatar} alt={story.user.username} className="w-8 h-8 rounded-full object-cover mr-2" />
                <p className="font-semibold text-sm">{story.user.username}</p>
            </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-20"
          aria-label="Close stories"
        >
          <Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
        </button>

        <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={goToPrev}></div>
        <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={goToNext}></div>

      </div>
    </div>
  );
};

export default StoryViewer;