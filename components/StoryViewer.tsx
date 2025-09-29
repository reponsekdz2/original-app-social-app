
import React, { useState, useEffect, useRef } from 'react';
// Fix: Add .ts extension to types import
import type { Story, StoryItem, User } from '../types.ts';
import Icon from './Icon.tsx';

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onNextUser: () => void;
  onPrevUser: () => void;
  onReply: (story: Story, storyItem: StoryItem, text: string) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialStoryIndex, onClose, onNextUser, onPrevUser, onReply }) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialStoryIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<number>(0);

  const currentUserStory = stories[currentUserIndex];
  const currentStoryItem = currentUserStory?.items[currentStoryIndex];

  const goToNextStory = () => {
    if (currentStoryIndex < currentUserStory.items.length - 1) {
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
        setCurrentStoryIndex(stories[currentUserIndex - 1].items.length - 1);
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

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim() && currentStoryItem) {
      onReply(currentUserStory, currentStoryItem, replyText);
      setReplyText('');
      // Optionally show a "Sent" confirmation and move to the next story
      goToNextStory();
    }
  };


  if (!currentStoryItem) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-sm h-full max-h-screen aspect-[9/16] bg-gray-900 overflow-hidden">
        {/* Story Content */}
        {currentStoryItem.mediaType === 'video' ? (
          <video src={currentStoryItem.media_url} autoPlay onEnded={goToNextStory} className="w-full h-full object-cover" />
        ) : (
          <img src={currentStoryItem.media_url} alt="Story" className="w-full h-full object-cover" />
        )}

        {/* Overlay UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50 flex flex-col">
          {/* Progress Bars */}
          <div className="p-2">
            <div className="flex gap-1">
              {currentUserStory.items.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full">
                  <div 
                      className="h-1 bg-white rounded-full" 
                      style={{ width: `${index < currentStoryIndex ? 100 : (index === currentStoryIndex ? progress : 0)}%` }} 
                  />
                </div>
              ))}
            </div>
             {/* Header */}
            <div className="flex items-center gap-3 pt-2">
              <img src={currentUserStory.user.avatar_url} alt={currentUserStory.user.username} className="w-9 h-9 rounded-full" />
              <p className="font-semibold text-white text-shadow">{currentUserStory.user.username}</p>
                 <button onClick={onClose} className="ml-auto text-white p-2">
                    <Icon className="w-7 h-7"><path d="M6 18L18 6M6 6l12 12" /></Icon>
                </button>
            </div>
          </div>
          

          {/* Navigation */}
          <div className="absolute inset-0 top-16 flex justify-between">
             <button onClick={goToPrevStory} className="w-1/3 h-full"></button>
             <button onClick={goToNextStory} className="w-1/3 h-full"></button>
          </div>

           {/* Reply Input */}
            <div className="mt-auto p-4">
                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder={`Reply to ${currentUserStory.user.username}...`}
                        className="w-full bg-black/50 border border-white/50 rounded-full px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-white"
                        onClick={(e) => e.stopPropagation()} // Prevent nav
                    />
                    <button type="submit" className="text-white font-semibold disabled:text-gray-500 p-2" disabled={!replyText.trim()}>
                        Send
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
