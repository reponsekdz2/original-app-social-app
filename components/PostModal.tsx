import React, { useState } from 'react';
import type { Post } from '../types';
import Icon from './Icon';
import VerifiedBadge from './VerifiedBadge';

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, commentText: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose, onLike, onComment, onLikeComment }) => {
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

  const likeIcon = post.likedByUser 
    ? <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    : <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />;

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
              <p className="font-semibold text-sm flex items-center">{post.user.username} {post.user.isVerified && <VerifiedBadge className="w-4 h-4 ml-1" />}</p>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-start mb-4">
              <img src={post.user.avatar} alt={post.user.username} className="w-10 h-10 rounded-full object-cover mr-3" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold mr-1 flex items-center">{post.user.username} {post.user.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />}</span>
                  <span className="mt-1 block">{post.caption}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{post.timestamp}</p>
              </div>
            </div>
            {post.comments.map(comment => (
              <div key={comment.id} className="flex items-start mb-4 group">
                <img src={comment.user.avatar} alt={comment.user.username} className="w-10 h-10 rounded-full object-cover mr-3" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold mr-1 flex items-center">{comment.user.username} {comment.user.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />}</span>
                    <span className="mt-1 block">{comment.text}</span>
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
                    {comment.likes > 0 && <p className="text-xs text-gray-500 mt-1 font-semibold">{comment.likes} likes</p>}
                  </div>
                </div>
                <button onClick={() => onLikeComment(post.id, comment.id)} className={`p-1 opacity-0 group-hover:opacity-100 transition-opacity ${comment.likedByUser ? 'text-red-500' : 'text-gray-400'}`}>
                  <Icon className="w-4 h-4">{comment.likedByUser ? <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />}</Icon>
                </button>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-4 mb-2">
              <button onClick={() => onLike(post.id)} className={`transition-colors ${post.likedByUser ? 'text-red-600' : 'text-white hover:text-gray-400'}`}>
                <Icon className="w-7 h-7">{likeIcon}</Icon>
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