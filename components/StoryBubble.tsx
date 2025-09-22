import React from 'react';
import type { Story } from '../types';

interface StoryBubbleProps {
  story: Story;
  onView: (story: Story) => void;
}

const StoryBubble: React.FC<StoryBubbleProps> = ({ story, onView }) => {
  const firstStory = story.stories[0];

  if (!firstStory) {
    return null; // Don't render if there are no stories
  }

  return (
    <div className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0 group" onClick={() => onView(story)}>
      <div className="relative transform group-hover:scale-105 transition-transform duration-300">
        <div className="w-28 h-40 rounded-xl p-0.5 animate-gradient-pulse">
          <div className="bg-black rounded-[10px] p-0.5 h-full w-full">
            {firstStory.mediaType === 'video' ? (
              <video
                src={firstStory.media}
                className="w-full h-full rounded-lg object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={firstStory.media}
                alt={story.user.username}
                className="w-full h-full rounded-lg object-cover"
              />
            )}
          </div>
        </div>
      </div>
      <p className="text-xs w-28 truncate text-center">{story.user.username}</p>
    </div>
  );
};

export default StoryBubble;