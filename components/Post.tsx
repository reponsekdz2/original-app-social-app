import React, { useState } from 'react';
import type { Post as PostType, User } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';

interface PostProps {
  post: PostType;
  onLike: (postId: string) => void;
  onComment: (postId:string, commentText: string) => void;
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

  return (
    <article className="border-b border-gray-800">
      <div className="flex items-center p-3">
        <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full object-cover" />
        <p className="font-semibold ml-3 mr-1">{post.user.username}</p>
        {post.user.isVerified && <VerifiedBadge className="w-4 h-4" />}
        <span className="text-gray-500 text-sm ml-2">· {post.timestamp}</span>
      </div>
      
      <div className="relative">
        {post.mediaType === 'video' ? (
          <video src={post.media} controls className="w-full" />
        ) : (
          <img src={post.media} alt="Post content" className="w-full" />
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-4 mb-2">
            <button onClick={() => onLike(post.id)} className="flex items-center gap-1">
                <Icon className={`w-7 h-7 hover:text-gray-400 ${post.isLiked ? 'text-red-500' : ''}`} fill={post.isLiked ? 'currentColor' : 'none'}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </Icon>
            </button>
             <button onClick={() => onViewPost(post)} className="flex items-center gap-1">
                <Icon className="w-7 h-7 hover:text-gray-400 transform -scale-x-100"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.49.03.984.067 1.483.102.72.056 1.45.099 2.18.138 1.491.079 2.996.136 4.502.157 1.506.021 3.012-.036 4.502-.157.73-.039 1.46-.082 2.18-.138.499-.035.993-.071 1.483-.102.787-.058 1.575-.12 2.365-.194a3.003 3.003 0 002.707-3.227V6.741c0-1.6-1.123-2.994-2.707-3.227A48.344 48.344 0 0012 3c-2.392 0-4.744.175-7.043.514A3.003 3.003 0 002.25 6.741v6.018z" /></Icon>
            </button>
             <button onClick={() => onShare(post)} className="flex items-center gap-1">
                <Icon className="w-7 h-7 hover:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></Icon>
            </button>
            <button onClick={() => onSave(post.id)} className="ml-auto">
                <Icon className="w-7 h-7 hover:text-gray-400" fill={post.isSaved ? 'currentColor' : 'none'}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </Icon>
            </button>
        </div>
        <p className="font-semibold text-sm mb-1">{post.likes.toLocaleString()} likes</p>
        <p className="text-sm">
          <span className="font-semibold mr-2">{post.user.username}</span>
          {post.caption}
        </p>
        {post.comments.length > 0 && (
          <button onClick={() => onViewPost(post)} className="text-sm text-gray-500 my-1">
            View all {post.comments.length} comments
          </button>
        )}
        <form onSubmit={handleCommentSubmit} className="mt-2">
          <input 
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-transparent focus:outline-none text-sm"
          />
        </form>
      </div>
    </article>
  );
};

export default Post;
