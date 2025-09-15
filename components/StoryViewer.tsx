import React, { useState, useEffect, useRef } from 'react';
import type { Story as StoryType, StoryItem } from '../types';
import Icon from './Icon';

interface StoryViewerProps {
  stories: StoryType[];
  startIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, startIndex, onClose }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(startIndex);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  const timerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentStory = stories[currentUserIndex];
  const currentItem = currentStory?.stories[currentItemIndex];

  const goToNextUser = () => {
    if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentItemIndex(0);
    } else {
      onClose();
    }
  };

  const goToPrevUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      setCurrentItemIndex(0);
    }
  };

  const goToNextItem = () => {
    if (currentItemIndex < currentStory.stories.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
    } else {
      goToNextUser();
    }
  };

  const goToPrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
    } else {
      goToPrevUser();
    }
  };

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVideoProgress(0);

    if (currentItem?.mediaType === 'image') {
      timerRef.current = window.setTimeout(goToNextItem, currentItem.duration);
    } else if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.error("Video autoplay failed", e));
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentItem, currentUserIndex]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
        const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setVideoProgress(progress);
    }
  };

  if (!currentStory || !currentItem) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Main Content */}
      <div className="relative w-full h-full max-w-[450px] max-h-screen aspect-[9/16] bg-gray-900" onClick={e => e.stopPropagation()}>
        {currentItem.mediaType === 'image' ? (
           <img src={currentItem.media} alt="" className="w-full h-full object-contain" />
        ) : (
            <video
                ref={videoRef}
                src={currentItem.media}
                className="w-full h-full object-contain"
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={goToNextItem}
                playsInline
                autoPlay
            />
        )}

        {/* Overlays */}
        <div className="absolute inset-0">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50">
            <div className="flex items-center gap-x-1 mb-2">
              {currentStory.stories.map((s, index) => (
                <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                   {index < currentItemIndex && <div className="h-full bg-white w-full"></div>}
                   {index === currentItemIndex && (
                     currentItem.mediaType === 'image' ? (
                       <div className="h-full bg-white progress-bar-fill" style={{ animationDuration: `${currentItem.duration}ms` }}></div>
                     ) : (
                       <div className="h-full bg-white" style={{ width: `${videoProgress}%`}}></div>
                     )
                   )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <img src={currentStory.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover mr-2" />
                    <p className="font-semibold text-sm">{currentStory.user.username}</p>
                </div>
                 <button onClick={onClose} className="text-white hover:text-gray-300" aria-label="Close stories">
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
                </button>
            </div>
          </div>
          
          {/* Item Navigation */}
          <div className="absolute inset-y-0 left-0 w-1/3" onClick={goToPrevItem}></div>
          <div className="absolute inset-y-0 right-0 w-2/3" onClick={goToNextItem}></div>
          
           {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 flex items-center gap-2">
            <input 
                type="text" 
                placeholder={`Reply to ${currentStory.user.username}...`}
                className="bg-transparent border border-white/50 rounded-full w-full px-4 py-2 text-sm placeholder:text-gray-300 focus:outline-none focus:border-white"
            />
             <button className="text-white p-2">
                <Icon className="w-7 h-7"><path d="M11.645 20.91l-1.414-1.414a5 5 0 01-7.071-7.071l7.07-7.071 7.072 7.071a5 5 0 01-7.072 7.071l-1.414 1.414z" /></Icon>
            </button>
            <button className="text-white p-2">
                <Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></Icon>
            </button>
          </div>
        </div>
      </div>
      
      {/* User Navigation Arrows */}
      {currentUserIndex > 0 && (
          <button onClick={goToPrevUser} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/80 z-20">
              <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon>
          </button>
      )}
      {currentUserIndex < stories.length - 1 && (
          <button onClick={goToNextUser} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2 hover:bg-black/80 z-20">
              <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
          </button>
      )}
    </div>
  );
};

export default StoryViewer;
