import React, { useState, useRef } from 'react';
import Icon from './Icon.tsx';
import { generateCaption } from '../services/geminiService.ts';

interface CreatePostModalProps {
  onClose: () => void;
  onCreatePost: (formData: FormData) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onCreatePost }) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setMediaFiles(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setMediaPreviews(previews);
    }
  };
  
  const handleRemoveMedia = (index: number) => {
    setMediaFiles(files => files.filter((_, i) => i !== index));
    setMediaPreviews(previews => previews.filter((_, i) => i !== index));
  }

  const handleGenerateCaption = async () => {
    if (mediaFiles.length === 0) return;
    setIsGenerating(true);
    try {
      const file = mediaFiles[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const newCaption = await generateCaption(base64Data, file.type);
        setCaption(newCaption);
        setIsGenerating(false);
      };
    } catch (err) {
      console.error("Failed to generate caption", err);
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (mediaFiles.length === 0) return;
    
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('location', location);
    mediaFiles.forEach(file => {
        formData.append('media', file);
    });
    
    onCreatePost(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose}><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
          <h2 className="text-lg font-semibold">Create new post</h2>
          <button onClick={handleSubmit} className="font-semibold text-red-500 hover:text-red-400" disabled={mediaFiles.length === 0}>Share</button>
        </div>
        
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          <div className="w-full md:w-1/2 aspect-square flex items-center justify-center bg-black/50 relative">
            {mediaPreviews.length > 0 ? (
                <>
                    <img src={mediaPreviews[0]} alt="Preview" className="max-h-full max-w-full object-contain" />
                    <button onClick={() => handleRemoveMedia(0)} className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80">
                        <Icon className="w-4 h-4"><path d="M6 18L18 6M6 6l12 12" /></Icon>
                    </button>
                </>
            ) : (
              <div className="text-center">
                <Icon className="mx-auto w-16 h-16 text-gray-500"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></Icon>
                <p className="mt-2 text-lg">Select photos and videos</p>
                <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-sm">
                  Select From Computer
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept="image/*,video/*" />
              </div>
            )}
          </div>
          
          <div className="w-full md:w-1/2 p-4 flex flex-col">
            <div className="relative">
                <textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="w-full h-32 bg-transparent focus:outline-none resize-none"
                />
                {mediaPreviews.length > 0 && (
                    <button onClick={handleGenerateCaption} disabled={isGenerating} className="absolute bottom-2 right-2 text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 disabled:opacity-50">
                        {isGenerating ? "Generating..." : "✨ Generate with AI"}
                    </button>
                )}
            </div>
            <input
              type="text"
              placeholder="Add location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-transparent border-t border-b border-gray-700 py-2 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
