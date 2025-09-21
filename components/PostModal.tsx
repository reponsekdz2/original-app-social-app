import React, { useState, useRef } from 'react';
import type { Post, User, Comment as CommentType } from '../types';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import FollowButton from './FollowButton.tsx';

interface PostModalProps {
  post: Post;
  currentUser: User;
  onClose: () => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (post: Post) => void;
  onViewLikes: (users: User[]) => void;
  onViewProfile: (user: User) => void;
  onOptions: (post: Post) => void;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
  onTip: (post: Post) => void;
  onToggleCommentLike: (commentId: string) => void;
}

const PostModal: React.FC<PostModalProps> = (props) => {
    const { post, currentUser, onClose, onToggleLike, onToggleSave, onComment, onShare, onViewLikes, onViewProfile, onOptions, onFollow, onUnfollow, onTip, onToggleCommentLike } = props;
    const [commentText, setCommentText] = useState('');
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    
    const isLiked = post.likedBy.some(u => u.id === currentUser.id);
    const isSaved = post.isSaved;

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post.id, commentText);
            setCommentText('');
        }
    };
    
    const nextMedia = () => setCurrentMediaIndex(prev => Math.min(prev + 1, post.media.length - 1));
    const prevMedia = () => setCurrentMediaIndex(prev => Math.max(prev - 1, 0));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-0 md:p-4" onClick={onClose}>
            <div className="bg-gray-900 shadow-xl w-full h-full md:rounded-lg md:max-w-5xl md:max-h-[90vh] flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
                <div className="w-full md:w-1/2 lg:w-3/5 aspect-square bg-black relative flex items-center justify-center">
                    {post.media.map((media, index) => (
                        <div key={media.id} className={`absolute inset-0 transition-opacity duration-300 ${index === currentMediaIndex ? 'opacity-100' : 'opacity-0'}`}>
                            {media.type === 'image' 
                            ? <img src={media.url} alt={`Post by ${post.user.username}`} className="w-full h-full object-contain" />
                            : <video src={media.url} controls className="w-full h-full object-contain" />
                            }
                        </div>
                    ))}
                    {post.media.length > 1 && (
                        <>
                            {currentMediaIndex > 0 && <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1"><Icon className="w-5 h-5"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
                            {currentMediaIndex < post.media.length - 1 && <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1"><Icon className="w-5 h-5"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
                        </>
                    )}
                </div>
                <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col">
                    <header className="flex items-center p-4 border-b border-gray-800">
                        <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full" />
                        <span className="font-semibold text-sm ml-3">{post.user.username}</span>
                        <button onClick={() => onOptions(post)} className="ml-auto"><Icon className="w-5 h-5"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon></button>
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full" />
                            <p className="text-sm"><span className="font-semibold">{post.user.username}</span> {post.caption}</p>
                        </div>
                        {post.comments.map(comment => {
                            const isCommentLiked = comment.likedBy.some(u => u.id === currentUser.id);
                            return (
                                <div key={comment.id} className="flex items-start gap-3 group">
                                    <img src={comment.user.avatar} alt={comment.user.username} className="w-9 h-9 rounded-full" />
                                    <div className="flex-1">
                                        <p className="text-sm"><span className="font-semibold">{comment.user.username}</span> {comment.text}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span>{comment.timestamp}</span>
                                            {comment.likes > 0 && <span>{comment.likes} likes</span>}
                                            <button>Reply</button>
                                        </div>
                                    </div>
                                    <button onClick={() => onToggleCommentLike(comment.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icon className={`w-4 h-4 ${isCommentLiked ? 'text-red-500' : 'text-gray-400'}`} fill={isCommentLiked ? 'currentColor' : 'none'}>
                                            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </Icon>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <footer className="border-t border-gray-800 p-2">
                        <div className="p-2">
                             <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => onToggleLike(post.id)}>
                                        <Icon className={`w-7 h-7 hover:text-gray-400 ${isLiked ? 'text-red-500' : ''}`} fill={isLiked ? 'currentColor' : 'none'}><path stroke="currentColor" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
                                    </button>
                                    <button><Icon className="w-7 h-7 hover:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25zM12 16.5a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5H12zM15.375 12a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5h6.75z" /></Icon></button>
                                    <button onClick={() => onShare(post)}><Icon className="w-7 h-7 hover:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon></button>
                                </div>
                                <button onClick={() => onToggleSave(post.id)}>
                                    <Icon className={`w-7 h-7 hover:text-gray-400 ${isSaved ? 'text-white' : ''}`} fill={isSaved ? 'currentColor' : 'none'}><path stroke="currentColor" strokeWidth="1.5" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></Icon>
                                </button>
                            </div>
                            {post.likes > 0 && <button onClick={() => onViewLikes(post.likedBy)} className="font-semibold text-sm">{post.likes.toLocaleString()} likes</button>}
                            <p className="text-gray-500 text-xs uppercase mt-2">{new Date(post.timestamp).toDateString()}</p>
                        </div>
                        <form onSubmit={handlePostComment} className="border-t border-gray-800 p-3 flex items-center gap-2">
                            <input type="text" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="w-full bg-transparent text-sm focus:outline-none" />
                            {commentText.trim().length > 0 && (
                                <button type="submit" className="text-red-500 font-semibold text-sm">Post</button>
                            )}
                        </form>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default PostModal;