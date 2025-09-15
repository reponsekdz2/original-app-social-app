import React, { useState } from 'react';
import type { Post as PostType } from '../types';
import Icon from './Icon';

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
    ? <path d="M11.645 20.91l-1.414-1.414a5 5 0 01-7.071-7.071l7.07-7.071 7.072 7.071a5 5 0 01-7.072 7.071l-1.414 1.414z" fill="currentColor" />
    : <path d="M11.645 20.91l-1.414-1.414a5 5 0 01-7.071-7.071l7.07-7.071 7.072 7.071a5 5 0 01-7.072 7.071l-1.414 1.414z" />;

  const saveIcon = post.savedByUser
    ? <path fill="currentColor" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    : <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />;
    
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
        <p className="font-semibold text-sm">{post.user.username}</p>
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
                    <Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.49.03.984.067 1.483.102.72.056 1.45.099 2.18.138 1.491.079 2.996.136 4.502.157 1.506.021 3.012-.036 4.502-.157.73-.039 1.46-.082 2.18-.138.499-.035.993-.071 1.483-.102.787-.058 1.575-.12 2.365-.194a3.003 3.003 0 002.707-3.227V6.741c0-1.6-1.123-2.994-2.707-3.227A48.344 48.344 0 0012 3c-2.392 0-4.744.175-7.043.514A3.003 3.003 0 002.25 6.741v6.018z" /></Icon>
                </button>
                 <button onClick={() => onShare(post)} className="text-white hover:text-gray-400">
                    <Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.05.588.08a2.25 2.25 0 011.588 3.472 2.25 2.25 0 01-3.472 1.588m1.884-5.14c.195.025.39.05.588.08a2.25 2.25 0 011.588 3.472 2.25 2.25 0 01-3.472 1.588m0 0l-1.884-5.14m1.884 5.14l-1.884-5.14" /></Icon>
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