
import React, { useState, useRef } from 'react';
import Icon from './Icon';
import type { Post, User } from '../types';

interface CreatePostModalProps {
  currentUser: User;
  onClose: () => void;
  onCreatePost: (post: Omit<Post, 'id' | 'likes' | 'likedByUser' | 'comments' | 'timestamp'>) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ currentUser, onClose, onCreatePost }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!imagePreview) return;
    const newPost = {
      user: currentUser,
      image: imagePreview,
      caption: caption,
    };
    onCreatePost(newPost);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Create new post</h2>
          <button onClick={handleSubmit} className="font-semibold text-red-500 hover:text-red-400">Share</button>
        </div>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className={`w-full md:w-3/5 flex-shrink-0 bg-black flex items-center justify-center ${imagePreview ? '' : 'p-8'}`}>
            {imagePreview ? (
              <img src={imagePreview} alt="Post preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="text-center">
                <Icon className="mx-auto w-24 h-24 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </Icon>
                <p className="mt-4 text-xl">Drag photos and videos here</p>
                <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
                  Select From Computer
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;