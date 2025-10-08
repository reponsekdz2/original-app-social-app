

import React from 'react';
// Fix: Add .ts extension to types import
import type { Story } from '../types.ts';

interface StoryBubbleProps {
  story: Story;
  onView: (story: Story) => void;
}

const StoryBubble: React.FC<StoryBubbleProps> = ({ story, onView }) => {
  const firstStory = story.items[0];

  if (!firstStory) {
    return null; // Don't render if there are no stories
  }
  
  const borderClass = story.for_close_friends_only ? 'animate-green-gradient-pulse' : 'animate-gradient-pulse';

  return (
    <div className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0 group w-24 sm:w-28" onClick={() => onView(story)}>
      <div className="relative transform group-hover:scale-105 transition-transform duration-300">
        <div className={`w-24 h-36 sm:w-28 sm:h-40 rounded-xl p-0.5 ${borderClass}`}>
          <div className="bg-white rounded-[10px] p-0.5 h-full w-full">
            {firstStory.mediaType === 'video' ? (
              <video
                src={firstStory.media_url}
                className="w-full h-full rounded-lg object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={firstStory.media_url}
                alt={story.user.username}
                className="w-full h-full rounded-lg object-cover"
              />
            )}
          </div>
        </div>
      </div>
      <p className="text-xs w-full truncate text-center text-gray-800">{story.user.username}</p>
    </div>
  );
};

export default StoryBubble;