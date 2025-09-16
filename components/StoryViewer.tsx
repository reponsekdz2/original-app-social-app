import React, { useState, useEffect } from 'react';
// Fix: Add User import for props
import type { Story, User } from '../types.ts';
import Icon from './Icon.tsx';

// Fix: Update props to match usage in App.tsx, enabling future enhancements for multi-story navigation.
interface StoryViewerProps {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
  onViewProfile: (user: User) => void;
  onReply: (storyUser: User, content: string) => void;
  onShare: (story: Story) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, startIndex, onClose, onViewProfile, onReply, onShare }) => {
  const [storyIndex, setStoryIndex] = useState(startIndex);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  const story = stories[storyIndex];
  const currentStoryItem = story.stories[currentIndex];

  useEffect(() => {
    setProgress(0);
    // Reset item index when story user changes
    if (currentIndex !== 0 && stories[storyIndex].id !== story.id) {
        setCurrentIndex(0);
    }
  }, [storyIndex]);
  
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
  }, [currentIndex, storyIndex]);

  const handleNext = () => {
    if (currentIndex < story.stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (storyIndex < stories.length - 1) {
      setStoryIndex(storyIndex + 1);
      setCurrentIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (storyIndex > 0) {
      const prevStory = stories[storyIndex - 1];
      setStoryIndex(storyIndex - 1);
      setCurrentIndex(prevStory.stories.length - 1);
    }
  };
  
  const handleNextStory = () => {
    if (storyIndex < stories.length - 1) {
        setStoryIndex(storyIndex + 1);
        setCurrentIndex(0);
    }
  };

  const handlePrevStory = () => {
      if (storyIndex > 0) {
          setStoryIndex(storyIndex - 1);
          setCurrentIndex(0);
      }
  };
  
  const handleViewProfileAndClose = (user: User) => {
    onViewProfile(user);
    onClose();
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
        onReply(story.user, replyText);
        setReplyText('');
    }
  };

  const handleLike = () => {
      onReply(story.user, '❤️');
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 700); // Match animation duration
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
       {storyIndex > 0 && (
        <button onClick={handlePrevStory} className="absolute left-2 md:-left-12 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2">
            <Icon className="w-6 h-6 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon>
        </button>
       )}
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
            <img src={story.user.avatar} alt={story.user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => handleViewProfileAndClose(story.user)} />
            <p className="text-white font-semibold text-sm cursor-pointer" onClick={() => handleViewProfileAndClose(story.user)}>{story.user.username}</p>
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
            key={`${storyIndex}-${currentIndex}`}
            src={currentStoryItem.media} 
            className="w-full h-full object-contain" 
            autoPlay 
            onEnded={handleNext} 
            onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / e.currentTarget.duration * 100)}
          />
        )}
        
        {showLikeAnimation && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="animate-like-burst">
                    <Icon className="w-32 h-32 text-red-500" fill="currentColor">
                         <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </Icon>
                </div>
            </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-2">
            <input 
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                placeholder={`Reply to ${story.user.username}...`}
                className="w-full bg-black/50 border border-white/30 rounded-full py-2.5 px-4 focus:outline-none focus:ring-1 focus:ring-white"
            />
            {replyText ? (
                 <button onClick={handleSendReply} className="text-white font-semibold px-2">Send</button>
            ) : (
                <>
                    <button onClick={handleLike} className="p-2">
                        <Icon className="w-7 h-7 text-white"><path stroke="currentColor" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
                    </button>
                    <button onClick={() => onShare(story)} className="p-2">
                        <Icon className="w-7 h-7 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon>
                    </button>
                </>
            )}
        </div>

      </div>
       {storyIndex < stories.length - 1 && (
         <button onClick={handleNextStory} className="absolute right-2 md:-right-12 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2">
            <Icon className="w-6 h-6 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
        </button>
       )}
    </div>
  );
};

export default StoryViewer;