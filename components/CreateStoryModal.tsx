
import React, { useState, useRef } from 'react';
import Icon from './Icon.tsx';
import * as api from '../services/apiService';

interface CreateStoryModalProps {
  onClose: () => void;
  onCreateStory: (formData: FormData) => void;
}

type CreateMode = 'upload' | 'ai';

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ onClose, onCreateStory }) => {
  const [mode, setMode] = useState<CreateMode>('upload');

  // AI State
  const [prompt, setPrompt] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null); // base64 string

  // Upload State
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
      setGeneratedImage(null); // Clear AI image if a file is uploaded
    }
  };
  
  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error("Invalid base64 string");
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleGenerateAI = async () => {
    if (!prompt.trim() || isLoadingAI) return;
    setIsLoadingAI(true);
    setErrorAI(null);
    setGeneratedImage(null);
    setMediaFile(null);
    setMediaPreview(null);
    try {
        const { image } = await api.generateStoryImage(prompt);
        setGeneratedImage(`data:image/png;base64,${image}`);
    } catch (err) {
        setErrorAI('Failed to generate image. Please try another prompt.');
    } finally {
        setIsLoadingAI(false);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (mode === 'upload' && mediaFile) {
        formData.append('media', mediaFile);
    } else if (mode === 'ai' && generatedImage) {
        const file = base64ToFile(generatedImage, `ai-story-${Date.now()}.png`);
        formData.append('media', file);
    } else {
        return; // No media to upload
    }
    await onCreateStory(formData);
  };

  const isShareDisabled = (mode === 'upload' && !mediaFile) || (mode === 'ai' && !generatedImage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
           <button onClick={onClose}><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
          <h2 className="text-lg font-semibold">Create story</h2>
          <button onClick={handleSubmit} className="font-semibold text-red-500 hover:text-red-400 disabled:opacity-50" disabled={isShareDisabled}>Share</button>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-center border-b border-gray-700 mb-4">
                <button onClick={() => setMode('upload')} className={`px-4 py-2 text-sm font-semibold ${mode === 'upload' ? 'border-b-2 border-white' : 'text-gray-400'}`}>Upload</button>
                <button onClick={() => setMode('ai')} className={`px-4 py-2 text-sm font-semibold ${mode === 'ai' ? 'border-b-2 border-white' : 'text-gray-400'}`}>AI Generate</button>
            </div>
            
            <div className="flex-1 flex items-center justify-center bg-black/50 rounded-md min-h-[300px] aspect-[9/16] relative">
                {mode === 'upload' && !mediaPreview && (
                     <div className="text-center">
                        <Icon className="mx-auto w-16 h-16 text-gray-500"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></Icon>
                        <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-sm">
                            Select From Computer
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
                    </div>
                )}
                {mode === 'upload' && mediaPreview && (
                     mediaFile?.type.startsWith('video') ? (
                        <video src={mediaPreview} controls className="max-h-full max-w-full object-contain rounded-md" />
                    ) : (
                        <img src={mediaPreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
                    )
                )}

                {mode === 'ai' && (
                    <>
                        {isLoadingAI && <div className="text-center">Generating...</div>}
                        {errorAI && <p className="text-red-400 text-sm p-4">{errorAI}</p>}
                        {generatedImage && <img src={generatedImage} alt="AI Generated Story" className="max-h-full max-w-full object-contain rounded-md" />}
                        {!isLoadingAI && !generatedImage && <p className="text-gray-400 p-4 text-center">Describe the image you want to create.</p>}
                    </>
                )}
            </div>

            {mode === 'ai' && (
                <div className="mt-4 flex gap-2">
                    <input 
                        type="text" 
                        value={prompt} 
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g. A cat astronaut on the moon"
                        className="w-full bg-gray-700 p-2 rounded-md text-sm"
                        disabled={isLoadingAI}
                    />
                    <button onClick={handleGenerateAI} disabled={isLoadingAI || !prompt.trim()} className="px-4 bg-red-600 rounded-md text-sm font-semibold disabled:bg-gray-600">
                        {isLoadingAI ? '...' : 'Generate'}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;
