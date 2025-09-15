import React, { useState } from 'react';
import Icon from './Icon';
import type { StoryItem } from '../types';
import { generateStoryImage } from '../services/geminiService';

interface CreateStoryModalProps {
  onClose: () => void;
  onCreateStory: (storyItem: Omit<StoryItem, 'id'>) => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ onClose, onCreateStory }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageB64 = await generateStoryImage(prompt);
      setGeneratedImage(imageB64);
    } catch (err: any) {
      setError(err.message || "Failed to generate image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!generatedImage) return;
    const newStoryItem = {
      image: `data:image/jpeg;base64,${generatedImage}`,
      duration: 7000,
    };
    onCreateStory(newStoryItem);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
           <button onClick={onClose}><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
          <h2 className="text-lg font-semibold">Create story with AI</h2>
          <button onClick={handleSubmit} className="font-semibold text-red-500 hover:text-red-400 disabled:opacity-50" disabled={!generatedImage}>Share</button>
        </div>
        
        <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
                 <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Describe the story you want to create</label>
                 <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A cat wearing sunglasses on a beach..."
                    className="w-full h-24 bg-gray-800 border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                    disabled={isLoading}
                />
            </div>
           
            <div className="flex-1 my-4 flex items-center justify-center bg-black/50 rounded-md min-h-[200px]">
                {isLoading && (
                     <div className="flex flex-col items-center text-gray-400">
                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2">Generating your story...</p>
                    </div>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {generatedImage && (
                    <img src={`data:image/jpeg;base64,${generatedImage}`} alt="Generated story" className="max-h-full max-w-full object-contain rounded-md" />
                )}
                 {!isLoading && !error && !generatedImage && (
                    <div className="text-center text-gray-500">
                        <Icon className="w-12 h-12 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.5 21.75l-.398-1.188a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.188-.398a2.25 2.25 0 001.423-1.423L16.5 15.75l.398 1.188a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.188.398a2.25 2.25 0 00-1.423 1.423z" /></Icon>
                        <p>Your generated image will appear here.</p>
                    </div>
                 )}
            </div>

            <button 
                onClick={handleGenerate} 
                disabled={isLoading || !prompt.trim()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generating...' : 'Generate Story'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;
