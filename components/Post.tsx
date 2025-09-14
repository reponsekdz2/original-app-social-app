
import React, { useState } from 'react';
import type { Post as PostType } from '../types';
import Icon from './Icon';

interface PostProps {
  post: PostType;
  onLike: (postId: string) => void;
  onComment: (postId: string, commentText: string) => void;
  onViewPost: (post: PostType) => void;
}

const Post: React.FC<PostProps> = ({ post, onLike, onComment, onViewPost }) => {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };
  
  return (
    <article className="bg-black border border-gray-800 rounded-lg mb-6">
      <div className="flex items-center p-4">
        <img src={post.user.avatar} alt={post.user.username} className="w-10 h-10 rounded-full object-cover mr-3" />
        <p className="font-semibold text-sm">{post.user.username}</p>
      </div>

      <img src={post.image} alt={`Post by ${post.user.username}`} className="w-full object-cover" />

      <div className="p-4">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={() => onLike(post.id)} className={`transition-colors ${post.likedByUser ? 'text-red-600' : 'text-white hover:text-gray-400'}`}>
            <Icon>
                {post.likedByUser ? (
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.247 15.247 0 01-1.344.688l-.022.012-.007.003h-.001ac.45.45 0 01.224.194l.428.746A12.986 12.986 0 002.49 18.073a9.703 9.703 0 01-1.423-5.523c0-2.343.886-4.555 2.343-6.21.378-.426.79-.81 1.234-1.139a.75.75 0 01.95.145l.022.033c.074.114.085.25.033.374a13.44 13.44 0 00-1.226 2.165 10.463 10.463 0 00-1.874 5.482.75.75 0 01-1.498-.059 11.963 11.963 0 011.807-5.834 14.98 14.98 0 012.24-4.04C6.182 4.137 7.91 3.5 9.782 3.5h.027a9.75 9.75 0 019.263 11.129 9.75 9.75 0 01-9.263 2.138 9.726 9.726 0 01-2.433-.668 13.725 13.725 0 01-2.288-1.505.75.75 0 01-.1-.965c.09-.234.34-.363.585-.272.246.09.4.332.31.567a12.228 12.228 0 001.947 1.256c.48.26.985.48 1.517.655a8.25 8.25 0 008.25-8.25 8.25 8.25 0 00-8.25-8.25H9.782c-1.536 0-3.02.48-4.25 1.336a13.483 13.483 0 00-3.43 3.653A11.25 11.25 0 00.75 12.553a11.25 11.25 0 002.043 6.95A14.48 14.48 0 0111.5 21.021h.145a.75.75 0 010 1.5h-.145c-2.441 0-4.816-.621-6.95-1.772a.75.75 0 01-.224-1.037l.428-.746a.45.45 0 01.224-.194z" />
                ) : (
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.247 15.247 0 01-1.344.688l-.022.012-.007.003h-.001a.75.75 0 01.224-1.037l.428-.746a.45.45 0 00-.224-.194l-2.034-1.173a.75.75 0 01-.144-1.303l.006-.003c.1-.058.22-.078.332-.044a4.914 4.914 0 004.897-1.123 4.914 4.914 0 001.123-4.897c.034-.112.014-.232-.044-.332l-.003-.006a.75.75 0 01.776-.89l2.454.409a.75.75 0 01.665.665l.409 2.454a.75.75 0 01-.89.776l-.006-.003c-.1.058-.22.078-.332.044a4.914 4.914 0 00-4.897 1.123 4.914 4.914 0 00-1.123 4.897c-.034.112-.014.232.044.332l.003.006a.75.75 0 01-.144 1.303l-2.034 1.173a.45.45 0 00.224.194l.428.746a.75.75 0 01-.224 1.037h-.001z" />
                )}
            </Icon>
          </button>
          <button onClick={() => onViewPost(post)} className="text-white hover:text-gray-400 transition-colors">
            <Icon><path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 01-1.5 0V6.375a.375.375 0 00-.375-.375H3.375A.375.375 0 003 6.375v9.25c0 .207.168.375.375.375h17.25a.375.375 0 00.375-.375v-3.026a.75.75 0 011.5 0v3.026c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 15.625v-9.25zM12.75 6a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0v-6a.75.75 0 01.75-.75z" clipRule="evenodd" /></Icon>
          </button>
          <button className="text-white hover:text-gray-400 transition-colors">
            <Icon><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></Icon>
          </button>
          <button className="text-white hover:text-gray-400 transition-colors ml-auto">
            <Icon><path d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m3.75-1.5a3.75 3.75 0 00-3.75 3.75v12.344l4.28-2.258a.75.75 0 01.64 0l4.28 2.258V6a3.75 3.75 0 00-3.75-3.75h-1.72z" /></Icon>
          </button>
        </div>
        
        <p className="font-semibold text-sm mb-2">{post.likes.toLocaleString()} likes</p>
        
        <p className="text-sm mb-2">
            <span className="font-semibold mr-1">{post.user.username}</span>
            {post.caption}
        </p>

        {post.comments.length > 0 && (
          <button onClick={() => onViewPost(post)} className="text-sm text-gray-500 mb-2 hover:text-gray-300">
            View all {post.comments.length} comments
          </button>
        )}
        <p className="text-gray-500 text-xs uppercase">{post.timestamp}</p>
      </div>

      <div className="border-t border-gray-800 px-4 py-2">
        <form onSubmit={handleCommentSubmit} className="flex items-center">
            <input 
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="bg-transparent w-full focus:outline-none text-sm"
            />
            <button type="submit" className="text-red-500 font-semibold text-sm hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed" disabled={!commentText.trim()}>
                Post
            </button>
        </form>
      </div>

    </article>
  );
};

export default Post;
