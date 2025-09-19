
import React from 'react';
// Fix: Corrected import path for types to be relative.
import type { StoryHighlight } from '../types.ts';

interface ProfileHighlightProps {
  highlight: StoryHighlight;
}

const ProfileHighlight: React.FC<ProfileHighlightProps> = ({ highlight }) => {
  return (
    <div className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0">
      <div className="relative group">
        <div className="w-28 h-40 rounded-xl p-0.5 bg-gradient-to-tr from-gray-700 to-gray-800">
          <div className="bg-black rounded-[10px] p-0.5 h-full w-full">
            <img src={highlight.cover} alt={highlight.title} className="w-full h-full rounded-lg object-cover" />
          </div>
        </div>
      </div>
      <p className="text-xs w-28 truncate text-center">{highlight.title}</p>
    </div>
  );
};

export default ProfileHighlight;
