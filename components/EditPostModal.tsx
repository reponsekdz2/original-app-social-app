import React, { useState } from 'react';
import type { Post } from '../types.ts';

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
  onSave: (postId: string, newCaption: string) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ post, onClose, onSave }) => {
  const [caption, setCaption] = useState(post.caption);
  const firstMedia = post.media[0];

  const handleSave = () => {
    onSave(post.id, caption);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-sm font-semibold">Cancel</button>
          <h2 className="text-lg font-semibold">Edit Post</h2>
          <button onClick={handleSave} className="font-semibold text-red-500 hover:text-red-400 disabled:opacity-50">Done</button>
        </div>
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-3/5 flex-shrink-0 bg-black flex items-center justify-center">
            {firstMedia.type === 'image' ? (
                <img src={firstMedia.url} alt="Post content" className="max-h-full max-w-full object-contain" />
            ) : (
                <video src={firstMedia.url} controls className="max-h-full max-w-full object-contain" />
            )}
          </div>
          <div className="w-full md:w-2/5 p-4 flex flex-col border-t md:border-t-0 md:border-l border-gray-700">
            <div className="flex items-center mb-4">
              <img src={post.user.avatar} alt={post.user.username} className="w-10 h-10 rounded-full mr-3" />
              <p className="font-semibold">{post.user.username}</p>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="w-full flex-1 bg-transparent focus:outline-none text-white resize-none"
              maxLength={2200}
              autoFocus
            />
            <div className="text-right text-xs text-gray-500 mt-2">{caption.length} / 2,200</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;