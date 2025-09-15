import React, { useState, useEffect } from 'react';
import type { Story } from '../types.ts';
import Icon from './Icon.tsx';

interface StoryViewerProps {
  story: Story;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentStoryItem = story.stories[currentIndex];

  useEffect(() => {
    setProgress(0);
    if (currentStoryItem.mediaType === 'image') {
      const timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            return 100;
          }
          return p + (100 / (currentStoryItem.duration / 100));
        });
      }, 100);

      const timeout = setTimeout(() => {
        handleNext();
      }, currentStoryItem.duration);

      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }
  }, [currentIndex, story]);

  const handleNext = () => {
    if (currentIndex < story.stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-sm h-full max-h-screen aspect-[9/16]">
        <div className="absolute top-4 left-2 right-2 flex gap-1 z-10">
          {story.stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-white" 
                    style={{ width: `${index < currentIndex ? 100 : index === currentIndex ? progress : 0}%` }}
                />
            </div>
          ))}
        </div>
        
        <div className="absolute top-8 left-4 z-10 flex items-center gap-2">
            <img src={story.user.avatar} alt={story.user.username} className="w-9 h-9 rounded-full" />
            <p className="text-white font-semibold text-sm">{story.user.username}</p>
        </div>

        <button onClick={onClose} className="absolute top-2 right-2 z-10 text-white p-2">
          <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
        </button>
        
        <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full w-1/3" />
        <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full w-1/3" />

        {currentStoryItem.mediaType === 'image' ? (
          <img src={currentStoryItem.media} className="w-full h-full object-contain" />
        ) : (
          <video 
            src={currentStoryItem.media} 
            className="w-full h-full object-contain" 
            autoPlay 
            onEnded={handleNext} 
            onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / e.currentTarget.duration * 100)}
          />
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
