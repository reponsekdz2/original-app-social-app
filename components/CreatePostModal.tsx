

import React, { useState, useRef } from 'react';
import Icon from './Icon.tsx';
// Fix: Add .ts extension to import to resolve module.
import type { User } from '../types.ts';
import { generateCaption } from '../services/geminiService.ts';

type PostData = {
    user: User;
    media: string;
    mediaType: 'image' | 'video';
    caption: string;
};

interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onCreatePost: (postData: PostData) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ currentUser, onClose, onCreatePost }) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMediaFile(file);
      
      if (file.type.startsWith('video/')) {
        setMediaType('video');
      } else {
        setMediaType('image');
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!mediaPreview || !mediaType) return;
    const newPost: PostData = {
      user: currentUser,
      media: mediaPreview,
      mediaType: mediaType,
      caption: caption,
    };
    onCreatePost(newPost);
  };

  const handleGenerateCaption = async () => {
    if (!mediaPreview || mediaType !== 'image') return;

    setIsGenerating(true);
    try {
        const mimeType = mediaPreview.substring(mediaPreview.indexOf(":") + 1, mediaPreview.indexOf(";"));
        const base64Data = mediaPreview.substring(mediaPreview.indexOf(",") + 1);

        const generated = await generateCaption(base64Data, mimeType);
        setCaption(generated);
    } catch (error) {
        console.error("Failed to generate caption:", error);
    } finally {
        setIsGenerating(false);
    }
  };
  
  const renderPreview = () => {
      if (!mediaPreview) return null;
      if (mediaType === 'video') {
          return <video src={mediaPreview} controls className="max-h-full max-w-full object-contain" />;
      }
      return <img src={mediaPreview} alt="Post preview" className="max-h-full max-w-full object-contain" />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Create new post</h2>
          <button onClick={handleSubmit} className="font-semibold text-red-500 hover:text-red-400 disabled:opacity-50" disabled={!mediaPreview}>Share</button>
        </div>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className={`w-full md:w-3/5 flex-shrink-0 bg-black flex items-center justify-center ${mediaPreview ? '' : 'p-8'}`}>
            {mediaPreview ? (
              renderPreview()
            ) : (
              <div className="text-center">
                <Icon className="mx-auto w-24 h-24 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </Icon>
                <p className="mt-4 text-xl">Drag photos and videos here</p>
                <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
                  Select From Computer
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
              </div>
            )}
          </div>
          <div className="w-full md:w-2/5 p-4 flex flex-col border-t md:border-t-0 md:border-l border-gray-700">
            <div className="flex items-center mb-4">
              <img src={currentUser.avatar} alt={currentUser.username} className="w-10 h-10 rounded-full mr-3" />
              <p className="font-semibold">{currentUser.username}</p>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full h-48 bg-transparent focus:outline-none text-white resize-none"
              maxLength={2200}
            />
            <div className="text-right text-xs text-gray-500 mb-4">{caption.length} / 2,200</div>
             <button 
                onClick={handleGenerateCaption}
                disabled={isGenerating || !mediaPreview || mediaType !== 'image'}
                className="flex items-center justify-center gap-2 w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm"
              >
                 {isGenerating ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                 ) : (
                    "✨ Generate with AI"
                 )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;