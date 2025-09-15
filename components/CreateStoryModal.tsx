import React, { useState, useRef } from 'react';
import Icon from './Icon.tsx';
// Fix: Add .ts extension to import to resolve module.
import type { StoryItem } from '../types.ts';
import { generateStoryImage } from '../services/geminiService.ts';

interface CreateStoryModalProps {
  onClose: () => void;
  onCreateStory: (storyItem: Omit<StoryItem, 'id'>) => void;
}

type CreateMode = 'upload' | 'ai';

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ onClose, onCreateStory }) => {
  const [mode, setMode] = useState<CreateMode>('upload');
  
  // AI State
  const [prompt, setPrompt] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Upload State
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setMediaType(type);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerateAI = async () => {
    if (!prompt.trim()) return;
    setIsLoadingAI(true);
    setErrorAI(null);
    setGeneratedImage(null);
    try {
      const imageB64 = await generateStoryImage(prompt);
      setGeneratedImage(imageB64);
    } catch (err: any) {
      setErrorAI(err.message || "Failed to generate image.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSubmit = () => {
    if (mode === 'upload' && mediaPreview && mediaType) {
       onCreateStory({
        media: mediaPreview,
        mediaType: mediaType,
        duration: mediaType === 'image' ? 7000 : 0, // duration is handled by video player for videos
      });
    } else if (mode === 'ai' && generatedImage) {
      onCreateStory({
        media: `data:image/jpeg;base64,${generatedImage}`,
        mediaType: 'image',
        duration: 7000,
      });
    }
  };

  const isShareDisabled = (mode === 'upload' && !mediaPreview) || (mode === 'ai' && !generatedImage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
           <button onClick={onClose}><Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon></button>
          <h2 className="text-lg font-semibold">Create story</h2>
          <button onClick={handleSubmit} className="font-semibold text-red-500 hover:text-red-400 disabled:opacity-50" disabled={isShareDisabled}>Share</button>
        </div>
        
        <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="flex border-b border-gray-700 mb-4">
                <button onClick={() => setMode('upload')} className={`flex-1 p-2 font-semibold text-center transition-colors text-sm ${mode === 'upload' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}>Upload</button>
                <button onClick={() => setMode('ai')} className={`flex-1 p-2 font-semibold text-center transition-colors text-sm ${mode === 'ai' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}>Generate with AI</button>
            </div>

            {/* Content Area */}
            <div className="flex-1 my-4 flex items-center justify-center bg-black/50 rounded-md min-h-[300px]">
                {mode === 'upload' && (
                    !mediaPreview ? (
                        <div className="text-center">
                            <Icon className="mx-auto w-16 h-16 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></Icon>
                            <p className="mt-2 text-lg">Select photo or video</p>
                            <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-sm">
                              Select From Computer
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
                        </div>
                    ) : (
                        mediaType === 'image' ? (
                            <img src={mediaPreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
                        ) : (
                            <video src={mediaPreview} controls className="max-h-full max-w-full object-contain rounded-md" />
                        )
                    )
                )}
                 {mode === 'ai' && (
                    generatedImage ? (
                         <img src={`data:image/jpeg;base64,${generatedImage}`} alt="Generated story" className="max-h-full max-w-full object-contain rounded-md" />
                    ) : isLoadingAI ? (
                        <div className="flex flex-col items-center text-gray-400">
                           <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           <p className="mt-2">Generating your story...</p>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 p-4">
                            <Icon className="w-12 h-12 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></Icon>
                            <p>Your generated image will appear here.</p>
                             {errorAI && <p className="text-red-500 text-xs mt-2">{errorAI}</p>}
                        </div>
                    )
                )}
            </div>

            {mode === 'ai' && (
                 <div className="space-y-2">
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A cat wearing sunglasses on a beach..." className="w-full h-20 bg-gray-800 border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none text-sm" disabled={isLoadingAI} />
                    <button onClick={handleGenerateAI} disabled={isLoadingAI || !prompt.trim()} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed">
                        {isLoadingAI ? 'Generating...' : 'Generate Story'}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;