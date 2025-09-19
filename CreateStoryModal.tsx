import React, { useState, useRef } from 'react';
import Icon from './components/Icon.tsx';

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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Upload State
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };
  
  const handleGenerateAI = async () => { /* ... remains the same */ };

  const handleSubmit = async () => {
    const formData = new FormData();
    
    if (mode === 'upload' && mediaFile) {
       formData.append('media', mediaFile);
    } else if (mode === 'ai' && generatedImage) {
      // In a real app, you might want to convert the base64 back to a blob/file before sending
      // For simplicity, we'll assume the backend can handle this (though we'll adjust backend to expect a file)
      // This part would need more robust handling in production
      console.log("AI image submission needs to be implemented via file upload");
      return;
    } else {
        return;
    }
    
    await onCreateStory(formData);
  };

  const isShareDisabled = (mode === 'upload' && !mediaFile) || (mode === 'ai' && !generatedImage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
           <button onClick={onClose}><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
          <h2 className="text-lg font-semibold">Create story</h2>
          <button onClick={handleSubmit} className="font-semibold text-red-500 hover:text-red-400 disabled:opacity-50" disabled={isShareDisabled}>Share</button>
        </div>
        
        <div className="p-4 flex-1 flex flex-col justify-between">
            {/* ... rest of the JSX is largely the same, but the logic now handles File objects */ }
            <div className="flex-1 my-4 flex items-center justify-center bg-black/50 rounded-md min-h-[300px]">
                {mode === 'upload' && !mediaPreview ? (
                     <div className="text-center">
                        <Icon className="mx-auto w-16 h-16 text-gray-500"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></Icon>
                        <p className="mt-2 text-lg">Select photo or video</p>
                        <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-sm">
                            Select From Computer
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
                    </div>
                ) : mode === 'upload' && mediaPreview ? (
                     mediaFile?.type.startsWith('video') ? (
                        <video src={mediaPreview} controls className="max-h-full max-w-full object-contain rounded-md" />
                    ) : (
                        <img src={mediaPreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
                    )
                ) : (
                    <div>AI Mode Placeholder</div>
                )}
            </div>
             {/* ... AI mode UI */}
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;