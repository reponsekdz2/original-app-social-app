import React from 'react';
// Fix: Add .ts extension to import to resolve module.
import type { StoryHighlight } from '../types.ts';

interface HighlightBubbleProps {
  highlight: StoryHighlight;
}

const HighlightBubble: React.FC<HighlightBubbleProps> = ({ highlight }) => {
  return (
    <div className="flex flex-col items-center space-y-1 cursor-pointer flex-shrink-0">
      <div className="w-16 h-16 rounded-full p-0.5 bg-gray-700">
        <div className="bg-black rounded-full p-0.5">
          <img src={highlight.cover} alt={highlight.title} className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
      <p className="text-xs w-16 truncate text-center">{highlight.title}</p>
    </div>
  );
};

export default HighlightBubble;