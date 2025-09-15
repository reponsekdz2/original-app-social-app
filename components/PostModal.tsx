

import React, { useState } from 'react';
import type { Post } from '../types';
import Icon from './Icon';

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, commentText: string) => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose, onLike, onComment }) => {
  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };
  
  const renderMedia = () => {
    if (post.mediaType === 'video') {
      return <video src={post.media} className="max-h-full max-w-full object-contain" controls autoPlay loop />;
    }
    return <img src={post.media} alt={`Post by ${post.user.username}`} className="max-h-full max-w-full object-contain" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white" onClick={onClose}>
        <Icon className="w-8 h-8"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></Icon>
      </button>
      <div className="bg-black w-full max-w-5xl h-full max-h-[90vh] flex overflow-hidden rounded-lg" onClick={(e) => e.stopPropagation()}>
        <div className="w-1/2 md:w-3/5 bg-black flex items-center justify-center">
          {renderMedia()}
        </div>
        <div className="w-1/2 md:w-2/5 flex flex-col border-l border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center">
              <img src={post.user.avatar} alt={post.user.username} className="w-10 h-10 rounded-full object-cover mr-3" />
              <p className="font-semibold text-sm">{post.user.username}</p>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-start mb-4">
              <img src={post.user.avatar} alt={post.user.username} className="w-10 h-10 rounded-full object-cover mr-3" />
              <div>
                <p className="text-sm">
                  <span className="font-semibold mr-1">{post.user.username}</span>
                  {post.caption}
                </p>
                <p className="text-xs text-gray-500 mt-1">{post.timestamp}</p>
              </div>
            </div>
            {post.comments.map(comment => (
              <div key={comment.id} className="flex items-start mb-4">
                <img src={comment.user.avatar} alt={comment.user.username} className="w-10 h-10 rounded-full object-cover mr-3" />
                <div>
                  <p className="text-sm">
                    <span className="font-semibold mr-1">{comment.user.username}</span>
                    {comment.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-4 mb-2">
              <button onClick={() => onLike(post.id)} className={`transition-colors ${post.likedByUser ? 'text-red-600' : 'text-white hover:text-gray-400'}`}>
                <Icon><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.247 15.247 0 01-1.344.688l-.022.012-.007.003h-.001ac.45.45 0 01.224.194l.428.746A12.986 12.986 0 002.49 18.073a9.703 9.703 0 01-1.423-5.523c0-2.343.886-4.555 2.343-6.21.378-.426.79-.81 1.234-1.139a.75.75 0 01.95.145l.022.033c.074.114.085.25.033.374a13.44 13.44 0 00-1.226 2.165 10.463 10.463 0 00-1.874 5.482.75.75 0 01-1.498-.059 11.963 11.963 0 011.807-5.834 14.98 14.98 0 012.24-4.04C6.182 4.137 7.91 3.5 9.782 3.5h.027a9.75 9.75 0 019.263 11.129 9.75 9.75 0 01-9.263 2.138 9.726 9.726 0 01-2.433-.668 13.725 13.725 0 01-2.288-1.505.75.75 0 01-.1-.965c.09-.234.34-.363.585-.272.246.09.4.332.31.567a12.228 12.228 0 001.947 1.256c.48.26.985.48 1.517.655a8.25 8.25 0 008.25-8.25 8.25 8.25 0 00-8.25-8.25H9.782c-1.536 0-3.02.48-4.25 1.336a13.483 13.483 0 00-3.43 3.653A11.25 11.25 0 00.75 12.553a11.25 11.25 0 002.043 6.95A14.48 14.48 0 0111.5 21.021h.145a.75.75 0 010 1.5h-.145c-2.441 0-4.816-.621-6.95-1.772a.75.75 0 01-.224-1.037l.428-.746a.45.45 0 01.224-.194z" /></Icon>
              </button>
            </div>
            <p className="font-semibold text-sm mb-2">{post.likes.toLocaleString()} likes</p>
             <form onSubmit={handleCommentSubmit} className="flex items-center border-t border-gray-800 pt-2">
                <input 
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="bg-transparent w-full focus:outline-none text-sm"
                />
                <button type="submit" className="text-red-500 hover:text-red-400 disabled:text-gray-600 disabled:opacity-50" disabled={!commentText.trim()}>
                    <Icon className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </Icon>
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;