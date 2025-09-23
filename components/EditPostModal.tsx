



import React, { useState } from 'react';
import type { Post } from '../types.ts';
import Icon from './Icon.tsx';

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
  onSave: (updatedPost: Post) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose, onSave }) => {
  const [caption, setCaption] = useState(post.caption);
  const [location, setLocation] = useState(post.location || '');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleSave = () => {
    onSave({
      ...post,
      caption,
      location,
    });
  };

  const handleNextMedia = () => setCurrentMediaIndex(prev => Math.min(prev + 1, post.media.length - 1));
  const handlePrevMedia = () => setCurrentMediaIndex(prev => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-white text-sm">Cancel</button>
          <h2 className="text-lg font-semibold">Edit Info</h2>
          <button onClick={handleSave} className="font-semibold text-red-500 hover:text-red-400 text-sm">Done</button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          <div className="w-full md:w-1/2 aspect-square bg-black relative flex items-center justify-center">
             {post.media.map((media, index) => (
                <div key={media.id} className={`absolute inset-0 transition-opacity duration-300 ${index === currentMediaIndex ? 'opacity-100' : 'opacity-0'}`}>
                    {media.type === 'image' 
                    ? <img src={media.url} alt={`Post by ${post.user.username}`} className="w-full h-full object-contain" />
                    : <video src={media.url} controls className="w-full h-full object-contain" />
                    }
                </div>
            ))}
            {post.media.length > 1 && (
                <>
                    {currentMediaIndex > 0 && <button onClick={handlePrevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1"><Icon className="w-5 h-5"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
                    {currentMediaIndex < post.media.length - 1 && <button onClick={handleNextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1"><Icon className="w-5 h-5"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
                </>
            )}
          </div>

          <div className="w-full md:w-1/2 p-4 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              {/* Fix: Changed post.user.avatar to post.user.avatar_url */}
              <img src={post.user.avatar_url} alt={post.user.username} className="w-9 h-9 rounded-full" />
              <span className="font-semibold">{post.user.username}</span>
            </div>
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="w-full h-40 bg-transparent focus:outline-none resize-none"
            />
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

export default EditPostModal;