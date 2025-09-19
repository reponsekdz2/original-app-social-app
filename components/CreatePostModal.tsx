
import React, { useState, useRef } from 'react';
import Icon from './Icon.tsx';

interface CreatePostModalProps {
  onClose: () => void;
  onCreatePost: (formData: FormData) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onCreatePost }) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setMediaFiles(files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    mediaFiles.forEach(file => formData.append('media', file));
    formData.append('caption', caption);
    formData.append('location', location);
    onCreatePost(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-white text-sm">Cancel</button>
          <h2 className="text-lg font-semibold">Create new post</h2>
          <button onClick={handleSubmit} disabled={mediaFiles.length === 0} className="font-semibold text-red-500 hover:text-red-400 text-sm disabled:opacity-50">Share</button>
        </div>
        
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          <div className="w-full md:w-1/2 aspect-square bg-black flex items-center justify-center">
            {previews.length > 0 ? (
                <img src={previews[0]} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : (
                <div className="text-center">
                    <Icon className="mx-auto w-16 h-16 text-gray-500"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></Icon>
                    <p className="mt-2 text-lg">Drag photos and videos here</p>
                    <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-sm">
                        Select From Computer
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept="image/*,video/*" />
                </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-4 flex flex-col border-t md:border-t-0 md:border-l border-gray-700">
             <textarea 
                placeholder="Write a caption..." 
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none flex-1 resize-none"
             />
             <div className="border-y border-gray-700 py-2">
                 <input 
                    type="text" 
                    placeholder="Add location" 
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-transparent text-sm focus:outline-none"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
