
import React, { useState, useRef } from 'react';
import Icon from './Icon.tsx';
// Fix: Corrected import path for types
import type { User, Post, MediaItem as MediaItemType } from '../types.ts';
// Fix: Corrected import path for geminiService
import { generateCaption } from '../services/geminiService.ts';

type PostData = Omit<Post, 'id' | 'likes' | 'likedBy' | 'comments' | 'timestamp' | 'isSaved' | 'isLiked' | 'isArchived' | 'commentsDisabled'>;
type MediaItem = { url: string, type: 'image' | 'video' };


interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onCreatePost: (postData: PostData) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ currentUser, onClose, onCreatePost }) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newMediaItems: MediaItem[] = [];
      
      files.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
              newMediaItems.push({
                  url: reader.result as string,
                  type: file.type.startsWith('video/') ? 'video' : 'image',
              });
              // This is a bit of a hack to update state after all files are read.
              // A more robust solution might use Promise.all.
              if(newMediaItems.length === files.length) {
                setMedia(prev => [...prev, ...newMediaItems]);
              }
          };
          reader.readAsDataURL(file);
      });
    }
  };
  
  const handleRemoveMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
    if (currentMediaIndex >= media.length - 1) {
        setCurrentMediaIndex(Math.max(0, media.length - 2));
    }
  };

  const handleSubmit = () => {
    if (media.length === 0) return;
    const postMedia: MediaItemType[] = media.map(m => ({
        url: m.url,
        type: m.type
    }));
    const newPost: PostData = {
      user: currentUser,
      media: postMedia,
      caption: caption,
    };
    onCreatePost(newPost);
  };

  const handleGenerateCaption = async () => {
    const currentMedia = media[currentMediaIndex];
    if (!currentMedia || currentMedia.type !== 'image') return;

    setIsGenerating(true);
    try {
        const mimeType = currentMedia.url.substring(currentMedia.url.indexOf(":") + 1, currentMedia.url.indexOf(";"));
        const base64Data = currentMedia.url.substring(currentMedia.url.indexOf(",") + 1);

        const generated = await generateCaption(base64Data, mimeType);
        setCaption(generated);
    } catch (error) {
        console.error("Failed to generate caption:", error);
    } finally {
        setIsGenerating(false);
    }
  };
  
  const renderPreview = () => {
      const current = media[currentMediaIndex];
      if (!current) return null;
      if (current.type === 'video') {
          return <video src={current.url} controls className="max-h-full max-w-full object-contain" />;
      }
      return <img src={current.url} alt="Post preview" className="max-h-full max-w-full object-contain" />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Create new post</h2>
          <button onClick={handleSubmit} className="font-semibold text-red-500 hover:text-red-400 disabled:opacity-50" disabled={media.length === 0}>Share</button>
        </div>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className={`relative w-full md:w-3/5 flex-shrink-0 bg-black flex items-center justify-center ${media.length > 0 ? '' : 'p-8'}`}>
            {media.length > 0 ? (
                <>
                    {renderPreview()}
                    <button onClick={() => handleRemoveMedia(currentMediaIndex)} className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:bg-black/80"><Icon className="w-5 h-5"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></Icon></button>
                    {media.length > 1 && (
                        <>
                            {currentMediaIndex > 0 && <button onClick={() => setCurrentMediaIndex(p => p - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white hover:bg-black/80"><Icon className="w-5 h-5"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
                            {currentMediaIndex < media.length - 1 && <button onClick={() => setCurrentMediaIndex(p => p + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white hover:bg-black/80"><Icon className="w-5 h-5"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
                        </>
                    )}
                </>
            ) : (
              <div className="text-center">
                <Icon className="mx-auto w-24 h-24 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </Icon>
                <p className="mt-4 text-xl">Drag photos and videos here</p>
                <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
                  Select From Computer
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" multiple />
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
                disabled={isGenerating || media.length === 0 || media[currentMediaIndex].type !== 'image'}
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
