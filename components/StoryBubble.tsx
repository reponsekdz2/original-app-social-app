import React from 'react';
import type { Story } from '../types';

interface StoryBubbleProps {
  story: Story;
  onView: (story: Story) => void;
}

const StoryBubble: React.FC<StoryBubbleProps> = ({ story, onView }) => {
  return (
    <div className="flex flex-col items-center space-y-1 cursor-pointer" onClick={() => onView(story)}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
          <div className="bg-black rounded-full p-0.5">
            <img src={story.user.avatar} alt={story.user.username} className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </div>
      <p className="text-xs w-16 truncate text-center">{story.user.username}</p>
    </div>
  );
};

export default StoryBubble;
