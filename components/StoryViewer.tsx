
import React, { useState, useEffect, useRef } from 'react';
// Fix: Corrected import path for types to be relative.
import type { Story, StoryItem, User } from '../types.ts';
import Icon from './Icon.tsx';

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onNextUser: () => void;
  onPrevUser: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialStoryIndex, onClose, onNextUser, onPrevUser }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialStoryIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<number>(0);

  const currentUserStory = stories[currentUserIndex];
  const currentStoryItem = currentUserStory?.stories[currentStoryIndex];

  const goToNextStory = () => {
    if (currentStoryIndex < currentUserStory.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      if (currentUserIndex < stories.length - 1) {
        onNextUser();
        setCurrentUserIndex(prev => prev + 1);
        setCurrentStoryIndex(0);
      } else {
        onClose();
      }
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else {
      if (currentUserIndex > 0) {
        onPrevUser();
        setCurrentUserIndex(prev => prev - 1);
        // Go to the last story of the previous user
        setCurrentStoryIndex(stories[currentUserIndex - 1].stories.length - 1);
      }
    }
  };
  
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    progressRef.current = 0;
    setProgress(0);

    if (currentStoryItem) {
        const duration = currentStoryItem.duration || 7000; // 7s default
        const interval = duration / 100;
        
        timerRef.current = setInterval(() => {
            progressRef.current += 1;
            setProgress(progressRef.current);
            if (progressRef.current >= 100) {
                goToNextStory();
            }
        }, interval);
    }

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStoryIndex, currentUserIndex, currentStoryItem]);


  if (!currentStoryItem) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-sm h-full max-h-screen aspect-[9/16] bg-gray-900 overflow-hidden">
        {/* Story Content */}
        {currentStoryItem.mediaType === 'video' ? (
          <video src={currentStoryItem.media} autoPlay onEnded={goToNextStory} className="w-full h-full object-cover" />
        ) : (
          <img src={currentStoryItem.media} alt="Story" className="w-full h-full object-cover" />
        )}

        {/* Overlay UI */}
        <div className="absolute inset-0">
          {/* Progress Bars */}
          <div className="absolute top-2 left-2 right-2 flex gap-1">
            {currentUserStory.stories.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full">
                <div 
                    className="h-1 bg-white rounded-full" 
                    style={{ width: `${index < currentStoryIndex ? 100 : (index === currentStoryIndex ? progress : 0)}%` }} 
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-5 left-4 flex items-center gap-3">
            <img src={currentUserStory.user.avatar} alt={currentUserStory.user.username} className="w-9 h-9 rounded-full" />
            <p className="font-semibold text-white text-shadow">{currentUserStory.user.username}</p>
          </div>
          
           {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-white p-2">
            <Icon className="w-7 h-7"><path d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>

          {/* Navigation */}
          <div className="absolute inset-0 flex justify-between">
             <button onClick={goToPrevStory} className="w-1/3 h-full"></button>
             <button onClick={goToNextStory} className="w-1/3 h-full"></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
