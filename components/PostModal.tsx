import React, { useState } from 'react';
import type { Post, User, Comment as CommentType } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import { formatTimestamp } from './utils.tsx';

interface PostModalProps {
  post: Post;
  currentUser: User;
  onClose: () => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (post: Post) => void;
  onViewProfile: (user: User) => void;
  onOptions: (post: Post) => void;
}

const PostModal: React.FC<PostModalProps> = (props) => {
  const { post, currentUser, onClose, onToggleLike, onToggleSave, onComment, onShare, onViewProfile, onOptions } = props;
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentText, setCommentText] = useState('');

  const isLiked = post.likedBy.some(u => u.id === currentUser.id);

  const handleNextMedia = () => setCurrentMediaIndex(p => Math.min(p + 1, post.media.length - 1));
  const handlePrevMedia = () => setCurrentMediaIndex(p => Math.max(p - 1, 0));
  
  const handleCommentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(commentText.trim()) {
          onComment(post.id, commentText);
          setCommentText('');
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <button className="absolute top-4 right-4 text-white z-10" onClick={onClose}>
            <Icon className="w-8 h-8"><path d="M6 18L18 6M6 6l12 12" /></Icon>
        </button>
        <div className="bg-black w-full max-w-5xl h-full max-h-[90vh] flex rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
            {/* Media Section */}
            <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative rounded-l-lg">
                {post.media.map((item, index) => (
                    <div key={item.id} className={`absolute inset-0 transition-opacity duration-300 ${index === currentMediaIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {item.type === 'video' 
                            ? <video src={item.url} controls className="w-full h-full object-contain" />
                            : <img src={item.url} alt="Post media" className="w-full h-full object-contain" />
                        }
                    </div>
                ))}
                 {post.media.length > 1 && (
                    <>
                        {currentMediaIndex > 0 && <button onClick={handlePrevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white"><Icon className="w-5 h-5"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
                        {currentMediaIndex < post.media.length - 1 && <button onClick={handleNextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white"><Icon className="w-5 h-5"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
                    </>
                )}
            </div>

            {/* Info and Comments Section */}
            <div className="hidden md:flex w-2/5 flex-col border-l border-gray-800 bg-gray-900 rounded-r-lg">
                {/* Header */}
                <div className="flex items-center p-4 border-b border-gray-800">
                    <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => onViewProfile(post.user)}/>
                    <div className="ml-3 flex-1">
                        <span className="font-semibold text-sm cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.username}</span>
                        {post.user.isVerified && <VerifiedBadge className="w-3 h-3 ml-1 inline-block" />}
                    </div>
                    <button onClick={() => onOptions(post)} className="p-1 text-gray-400 hover:text-white"><Icon className="w-5 h-5"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon></button>
                </div>

                {/* Comments */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Caption */}
                    <div className="flex items-start gap-3">
                        <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full" />
                        <div>
                            <p className="text-sm"><span className="font-semibold">{post.user.username}</span> {post.caption}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatTimestamp(post.timestamp)}</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 my-2"></div>
                    {/* Comment list */}
                    {post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-3">
                            <img src={comment.user.avatar} alt={comment.user.username} className="w-9 h-9 rounded-full" />
                            <div>
                                <p className="text-sm"><span className="font-semibold">{comment.user.username}</span> {comment.text}</p>
                                <p className="text-xs text-gray-500 mt-1">{formatTimestamp(comment.timestamp)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions and Footer */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <button onClick={() => onToggleLike(post.id)}><Icon className={`w-7 h-7 ${isLiked ? 'text-red-500' : ''}`} fill={isLiked ? 'currentColor' : 'none'}><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon></button>
                            <button><Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25z" /></Icon></button>
                            <button onClick={() => onShare(post)}><Icon className="w-7 h-7"><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon></button>
                        </div>
                        <button onClick={() => onToggleSave(post.id)}><Icon className={`w-7 h-7 ${post.isSaved ? 'text-white' : ''}`} fill={post.isSaved ? 'currentColor' : 'none'}><path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></Icon></button>
                    </div>
                    <p className="text-sm font-semibold">{post.likes.toLocaleString()} likes</p>
                    <p className="text-xs text-gray-500 uppercase mt-2">{new Date(post.timestamp).toDateString()}</p>
                </div>
                {/* Comment input */}
                <form onSubmit={handleCommentSubmit} className="flex items-center border-t border-gray-800 p-4">
                     <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-transparent text-sm focus:outline-none" />
                    <button type="submit" className="text-red-500 font-semibold text-sm disabled:opacity-50" disabled={!commentText.trim()}>Post</button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default PostModal;
