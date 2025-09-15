import React, { useState } from 'react';
import type { StoryItem } from '../types.ts';
import Icon from './Icon.tsx';

interface CreateHighlightModalProps {
  userStories: StoryItem[];
  onClose: () => void;
  onCreate: (title: string, stories: StoryItem[]) => void;
}

const CreateHighlightModal: React.FC<CreateHighlightModalProps> = ({ userStories, onClose, onCreate }) => {
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);
  const [title, setTitle] = useState('');

  const handleToggleStory = (storyId: string) => {
    setSelectedStoryIds(prev =>
      prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const handleCreate = () => {
    const selectedStories = userStories.filter(s => selectedStoryIds.includes(s.id));
    onCreate(title, selectedStories);
  };

  const isCreateDisabled = !title.trim() || selectedStoryIds.length === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">New Highlight</h2>
          <button className="absolute top-2 left-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
           <button onClick={handleCreate} disabled={isCreateDisabled} className="absolute top-2 right-3 text-red-500 font-semibold disabled:text-gray-500">
            Create
          </button>
        </div>
        <div className="p-4">
            <label htmlFor="highlight-title" className="text-sm font-medium text-gray-400 mb-1">Title</label>
             <input
              id="highlight-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Highlight name..."
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
            <p className="text-sm font-semibold mb-2">Select Stories</p>
            {userStories.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {userStories.map(story => {
                        const isSelected = selectedStoryIds.includes(story.id);
                        return (
                            <div key={story.id} className="relative aspect-[9/16] cursor-pointer" onClick={() => handleToggleStory(story.id)}>
                                {story.mediaType === 'image' ? (
                                    <img src={story.media} alt="story item" className="w-full h-full object-cover rounded-md" />
                                ) : (
                                    <video src={story.media} className="w-full h-full object-cover rounded-md" />
                                )}
                                <div className={`absolute inset-0 rounded-md transition-all ${isSelected ? 'bg-black/50 border-4 border-red-500' : 'bg-black/20'}`}></div>
                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center">
                                        <Icon className="w-3 h-3 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></Icon>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">You have no stories to create a highlight from.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default CreateHighlightModal;