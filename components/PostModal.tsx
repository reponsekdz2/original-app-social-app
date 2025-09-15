import React from 'react';
import type { Post } from '../types.ts';
import Icon from './Icon.tsx';

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex" onClick={(e) => e.stopPropagation()}>
        <div className="w-3/5 bg-black flex items-center justify-center">
            {post.mediaType === 'video' ? (
                <video src={post.media} controls autoPlay className="max-h-full max-w-full" />
            ) : (
                <img src={post.media} alt="Post content" className="max-h-full max-w-full object-contain" />
            )}
        </div>
        <div className="w-2/5 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex items-center">
            <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full" />
            <p className="font-semibold ml-3">{post.user.username}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-start">
              <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full" />
              <p className="ml-3 text-sm">
                <span className="font-semibold mr-2">{post.user.username}</span>
                {post.caption}
              </p>
            </div>
            {post.comments.map(comment => (
              <div key={comment.id} className="flex items-start">
                <img src={comment.user.avatar} alt={comment.user.username} className="w-9 h-9 rounded-full" />
                <p className="ml-3 text-sm">
                    <span className="font-semibold mr-2">{comment.user.username}</span>
                    {comment.text}
                    <span className="text-gray-500 text-xs block mt-1">{comment.timestamp}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-700">
            <p className="font-semibold text-sm mb-2">{post.likes.toLocaleString()} likes</p>
            <input 
              type="text"
              placeholder="Add a comment..."
              className="w-full bg-transparent focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>
       <button onClick={onClose} className="absolute top-4 right-4 text-white">
        <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
      </button>
    </div>
  );
};

export default PostModal;
