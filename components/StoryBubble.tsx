
import React from 'react';
import type { Story } from '../types';

interface StoryBubbleProps {
  story: Story;
  onView: (story: Story) => void;
}

const StoryBubble: React.FC<StoryBubbleProps> = ({ story, onView }) => {
  const borderClass = story.viewed
    ? 'border-gray-700'
    : 'bg-gradient-to-r from-red-500 via-red-600 to-red-700';

  return (
    <button onClick={() => onView(story)} className="flex flex-col items-center space-y-1 flex-shrink-0 focus:outline-none">
      <div className={`p-0.5 rounded-full ${borderClass}`}>
        <div className="bg-black p-0.5 rounded-full">
          <img
            src={story.user.avatar}
            alt={story.user.username}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
      </div>
      <p className="text-xs text-gray-300 truncate w-20 text-center">{story.user.username}</p>
    </button>
  );
};

export default StoryBubble;