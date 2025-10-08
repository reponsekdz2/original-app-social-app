import React, { useState } from 'react';
import type { Post as PostType, User, Comment as CommentType } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import { formatTimestamp } from './utils.tsx';
import * as api from '../services/apiService.ts';

interface PostModalProps {
  post: PostType;
  currentUser: User;
  onClose: () => void;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (post: PostType) => void;
  onOptions: (post: PostType) => void;
  onViewProfile: (user: User) => void;
  onViewLikes: (users: User[]) => void;
}

const PostModal: React.FC<PostModalProps> = (props) => {
  const { post, currentUser, onClose, onLike, onSave, onComment, onShare, onOptions, onViewProfile, onViewLikes } = props;

  const [commentText, setCommentText] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const isLiked = post.likedBy.some(u => u.id === currentUser.id);
  const isSaved = post.isSaved;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleLikeComment = async (commentId: string) => {
      console.log(`Liking comment ${commentId}`);
      await api.likeComment(commentId);
  };
  
  const handleNextMedia = () => setCurrentMediaIndex(prev => Math.min(prev + 1, post.media.length - 1));
  const handlePrevMedia = () => setCurrentMediaIndex(prev => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-0 md:p-4" onClick={onClose}>
      <div className="bg-white text-gray-900 w-full h-full md:max-w-5xl md:h-full md:max-h-[90vh] flex flex-col md:flex-row md:rounded-lg shadow-2xl animate-modal-intro" onClick={e => e.stopPropagation()}>
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative md:rounded-l-lg">
           {post.media.map((media, index) => (
                <div key={media.id} className={`absolute inset-0 transition-opacity duration-300 ${index === currentMediaIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {media.type === 'video' 
                    ? <video src={media.url} controls autoPlay className="w-full h-full object-contain" />
                    : <img src={media.url} alt={`Post by ${post.user.username}`} className="w-full h-full object-contain" />
                    }
                </div>
            ))}
            {post.media.length > 1 && (
                <>
                    {currentMediaIndex > 0 && <button onClick={handlePrevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 text-white"><Icon className="w-6 h-6"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
                    {currentMediaIndex < post.media.length - 1 && <button onClick={handleNextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 text-white"><Icon className="w-6 h-6"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
                </>
            )}
        </div>
        
        <div className="w-full md:w-2/5 flex flex-col">
          <header className="flex items-center p-4 border-b border-gray-200">
            <img src={post.user.avatar_url} alt={post.user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => onViewProfile(post.user)}/>
            <span className="font-semibold text-sm ml-3 cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.username}</span>
            {post.user.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />}
            <button onClick={() => onOptions(post)} className="ml-auto p-1"><Icon className="w-5 h-5"><path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></Icon></button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-start gap-3">
              <img src={post.user.avatar_url} alt={post.user.username} className="w-9 h-9 rounded-full" />
              <p className="text-sm"><span className="font-semibold">{post.user.username}</span> {post.caption}</p>
            </div>
            {post.comments.map(comment => (
              <div key={comment.id} className="flex items-start gap-3 group">
                <img src={comment.user.avatar_url} alt={comment.user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => onViewProfile(comment.user)} />
                <div className="flex-1">
                  <p className="text-sm"><span className="font-semibold cursor-pointer" onClick={() => onViewProfile(comment.user)}>{comment.user.username}</span> {comment.text}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{formatTimestamp(comment.timestamp)}</span>
                    {comment.likes > 0 && <span>{comment.likes} likes</span>}
                    <button className="font-semibold">Reply</button>
                  </div>
                </div>
                <button onClick={() => handleLikeComment(comment.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon className="w-4 h-4 text-gray-400 hover:text-gray-800"><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
                </button>
              </div>
            ))}
          </div>

          <footer className="p-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-4">
              <button onClick={() => onLike(post.id)}><Icon className={`w-7 h-7 ${isLiked ? 'text-blue-600' : ''}`} fill={isLiked ? 'currentColor' : 'none'}><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon></button>
              <button><Icon className="w-7 h-7"><path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25zM12 16.5a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5H12zM15.375 12a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5h6.75z" /></Icon></button>
              <button onClick={() => onShare(post)}><Icon className="w-7 h-7"><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon></button>
              <button onClick={() => onSave(post.id)} className="ml-auto"><Icon className="w-7 h-7" fill={isSaved ? 'currentColor' : 'none'}><path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></Icon></button>
            </div>
            {post.likes > 0 && <button onClick={() => onViewLikes(post.likedBy)} className="font-semibold text-sm">{post.likes.toLocaleString()} likes</button>}
            <p className="text-xs text-gray-500 uppercase">{formatTimestamp(post.timestamp)}</p>
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 border-t border-gray-200 pt-3">
              <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." className="bg-transparent w-full focus:outline-none text-sm"/>
              <button type="submit" className="text-blue-600 font-semibold text-sm disabled:text-gray-400" disabled={!commentText.trim()}>Post</button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PostModal;