import React, { useState } from 'react';
import type { Post as PostType } from '../types';
import Icon from './Icon';
import VerifiedBadge from './VerifiedBadge';

interface PostProps {
  post: PostType;
  onLike: (postId: string) => void;
  onComment: (postId: string, commentText: string) => void;
  onViewPost: (post: PostType) => void;
  onSave: (postId: string) => void;
  onShare: (post: PostType) => void;
}

const Post: React.FC<PostProps> = ({ post, onLike, onComment, onViewPost, onSave, onShare }) => {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const likeIcon = post.likedByUser 
    ? <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    : <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />;

  const saveIcon = post.savedByUser
    ? <path fill="currentColor" d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
    : <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />;
    
  const renderMedia = () => {
    if (post.mediaType === 'video') {
      return <video src={post.media} className="w-full object-cover" controls autoPlay muted loop />;
    }
    return <img src={post.media} alt={`Post by ${post.user.username}`} className="w-full object-cover" />;
  };

  return (
    <div className="border-b border-gray-800 bg-black">
      <div className="flex items-center p-3">
        <img src={post.user.avatar} alt={post.user.username} className="w-8 h-8 rounded-full object-cover mr-3" />
        <p className="font-semibold text-sm flex items-center">{post.user.username} {post.user.isVerified && <VerifiedBadge className="w-4 h-4 ml-1" />}</p>
      </div>
      <div>
        {renderMedia()}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
                <button onClick={() => onLike(post.id)} className={`transition-colors ${post.likedByUser ? 'text-red-600' : 'text-white hover:text-gray-400'}`}>
                    <Icon className="w-7 h-7">{likeIcon}</Icon>
                </button>
                <button onClick={() => onViewPost(post)} className="text-white hover:text-gray-400">
                    <Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.006 3 11.5c0 2.252.992 4.31 2.623 5.76C6.96 18.658 9.366 19.5 12 19.5c.338 0 .672-.015 1-.045M12 20.25v-4.5" /></Icon>
                </button>
                 <button onClick={() => onShare(post)} className="text-white hover:text-gray-400">
                    <Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></Icon>
                 </button>
            </div>
             <button onClick={() => onSave(post.id)} className="text-white hover:text-gray-400">
                <Icon className="w-7 h-7">{saveIcon}</Icon>
            </button>
        </div>
        <p className="font-semibold text-sm mb-2">{post.likes.toLocaleString()} likes</p>
        <p className="text-sm mb-2">
          <span className="font-semibold mr-1">{post.user.username}</span>
          {post.caption}
        </p>
        {post.comments.length > 0 && (
          <button onClick={() => onViewPost(post)} className="text-sm text-gray-500 mb-2">
            View all {post.comments.length} comments
          </button>
        )}
         <form onSubmit={handleCommentSubmit} className="flex items-center pt-2">
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
  );
};

export default Post;