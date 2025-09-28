
import React, { useState, useRef, useEffect } from 'react';
import type { Post, User, Comment } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import FollowButton from './FollowButton.tsx';
import Poll from './Poll.tsx';
import { formatTimestamp } from './utils.tsx';

interface PostProps {
  post: Post;
  currentUser: User;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (post: Post) => void;
  onViewLikes: (users: User[]) => void;
  onViewProfile: (user: User) => void;
  onViewPost: (post: Post) => void;
  onOptions: (post: Post) => void;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
  onTip: (post: Post) => void;
  onVote: (optionId: number) => void;
}

const PostComponent: React.FC<PostProps> = (props) => {
    const { post, currentUser, onToggleLike, onToggleSave, onComment, onShare, onViewLikes, onViewProfile, onViewPost, onOptions, onFollow, onUnfollow, onTip, onVote } = props;
    const [commentText, setCommentText] = useState('');
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [showLikeAnimation, setShowLikeAnimation] = useState(false);

    const isLiked = post.likedBy.some(u => u.id === currentUser.id);
    const isCurrentUserPost = post.user.id === currentUser.id;

    const handleNextMedia = () => setCurrentMediaIndex(p => Math.min(p + 1, post.media.length - 1));
    const handlePrevMedia = () => setCurrentMediaIndex(p => Math.max(p - 1, 0));

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post.id, commentText);
            setCommentText('');
        }
    };

    const handleDoubleClickLike = () => {
        if (!isLiked) {
            onToggleLike(post.id);
        }
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 800);
    };
    
    return (
        <article className="bg-black border border-gray-800 rounded-lg">
            {/* Post Header */}
            <div className="flex items-center p-3">
                <img src={post.user.avatar_url} alt={post.user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => onViewProfile(post.user)} />
                <div className="ml-3 flex-1">
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.username}</span>
                        {post.user.isVerified && <VerifiedBadge className="w-3.5 h-3.5" />}
                    </div>
                     {post.location && <p className="text-xs text-gray-400">{post.location}</p>}
                </div>
                 <button onClick={() => onOptions(post)} className="p-1 text-gray-400 hover:text-white">
                    <Icon className="w-5 h-5"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon>
                 </button>
            </div>

            {/* Post Media */}
            <div className="relative aspect-square bg-black" onDoubleClick={handleDoubleClickLike}>
                {post.media.map((item, index) => (
                    <div key={item.id} className={`absolute inset-0 transition-opacity duration-300 ${index === currentMediaIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {item.type === 'video' ? (
                            <video src={item.url} controls className="w-full h-full object-contain" />
                        ) : (
                            <img src={item.url} alt={`Post by ${post.user.username}`} className="w-full h-full object-contain" />
                        )}
                    </div>
                ))}
                 {showLikeAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Icon className="w-24 h-24 text-white drop-shadow-lg animate-heart-pulse" fill="currentColor">
                            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </Icon>
                    </div>
                )}
                {post.media.length > 1 && (
                    <>
                        {currentMediaIndex > 0 && <button onClick={handlePrevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white"><Icon className="w-5 h-5"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
                        {currentMediaIndex < post.media.length - 1 && <button onClick={handleNextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white"><Icon className="w-5 h-5"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {post.media.map((_, index) => <div key={index} className={`w-1.5 h-1.5 rounded-full ${index === currentMediaIndex ? 'bg-white' : 'bg-white/50'}`}></div>)}
                        </div>
                    </>
                )}
            </div>

            {/* Post Actions & Content */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <button onClick={() => onToggleLike(post.id)}>
                            <Icon className={`w-7 h-7 transition-transform duration-200 hover:scale-110 ${isLiked ? 'text-red-500' : ''}`} fill={isLiked ? 'currentColor' : 'none'}>
                                <path stroke="currentColor" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </Icon>
                        </button>
                        <button onClick={() => onViewPost(post)}>
                             <Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25zM12 16.5a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5H12zM15.375 12a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5h6.75z" /></Icon>
                        </button>
                         <button onClick={() => onShare(post)}>
                             <Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon>
                         </button>
                          {!isCurrentUserPost && (
                             <button onClick={() => onTip(post)}>
                                <Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.278-.659 2.003-.659.768 0 1.536.219 2.121.659l.879.659m0-2.218a.375.375 0 00.495-.595l-1.328-1.328a.375.375 0 00-.595.495l1.428 1.428z" /></Icon>
                            </button>
                         )}
                    </div>
                    <button onClick={() => onToggleSave(post.id)}>
                        <Icon className={`w-7 h-7 ${post.isSaved ? 'text-white' : ''}`} fill={post.isSaved ? 'currentColor' : 'none'}>
                            <path stroke="currentColor" strokeWidth="1.5" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </Icon>
                    </button>
                </div>

                <button onClick={() => onViewLikes(post.likedBy)} className="text-sm font-semibold">{post.likes.toLocaleString()} likes</button>
                <p className="text-sm mt-1">
                    <span className="font-semibold cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.username}</span> {post.caption}
                </p>

                {post.poll && <div className="mt-3"><Poll poll={post.poll} onVote={(optionId) => onVote(optionId)} /></div>}

                {post.comments.length > 0 && <button onClick={() => onViewPost(post)} className="text-sm text-gray-400 mt-2">View all {post.comments.length} comments</button>}
                <p className="text-xs text-gray-500 uppercase mt-2">{formatTimestamp(post.timestamp)}</p>
            </div>
            {/* Comment Input */}
            <div className="border-t border-gray-800 p-3">
                <form onSubmit={handleCommentSubmit} className="flex items-center">
                    <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-transparent text-sm focus:outline-none" />
                    <button type="submit" className="text-red-500 font-semibold text-sm disabled:opacity-50" disabled={!commentText.trim()}>Post</button>
                </form>
            </div>
        </article>
    );
};

export default PostComponent;