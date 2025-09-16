import React, { useState, useRef } from 'react';
import type { Post as PostType, User } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';

interface PostProps {
  post: PostType;
  currentUser: User;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (post: PostType) => void;
  onViewLikes: (users: User[]) => void;
  onViewProfile: (user: User) => void;
  onOptions: (post: PostType) => void;
  onFollow: (user: User) => void;
  onUnfollow: (user: User) => void;
  onViewPost: (post: PostType) => void;
}

const Post: React.FC<PostProps> = ({ 
    post, 
    currentUser, 
    onToggleLike, 
    onToggleSave, 
    onComment,
    onShare,
    onViewLikes,
    onViewProfile,
    onOptions,
    onViewPost,
}) => {
    const [isMuted, setIsMuted] = useState(true);
    const [showLikeBurst, setShowLikeBurst] = useState(false);
    const [commentText, setCommentText] = useState('');
    const commentInputRef = useRef<HTMLInputElement>(null);

    const currentMedia = post.media[0];

    const handleDoubleClickLike = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.detail === 2) { 
            if (!post.isLiked) {
                onToggleLike(post.id);
            }
            setShowLikeBurst(true);
            setTimeout(() => setShowLikeBurst(false), 700);
        }
    };

    const handlePostComment = () => {
        if (commentText.trim()) {
          onComment(post.id, commentText);
          setCommentText('');
        }
    };

    return (
    <article className="py-4 border-b border-gray-800">
        {/* Post Header */}
        <div className="flex items-center justify-between px-2 pb-3">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewProfile(post.user)}>
                <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full" />
                <span className="font-semibold text-sm">{post.user.username}</span>
                {post.user.isVerified && <VerifiedBadge className="w-3 h-3"/>}
            </div>
            <button onClick={() => onOptions(post)}><Icon className="w-6 h-6"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm4.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm4.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon></button>
        </div>

        {/* Media Container */}
        <div className="relative w-full rounded-lg overflow-hidden bg-black aspect-[4/5]" >
            <div className="w-full h-full" onClick={handleDoubleClickLike}>
                {currentMedia.type === 'image' ? (
                    <img src={currentMedia.url} alt={`Post by ${post.user.username}`} className="w-full h-full object-cover" />
                ) : (
                    <video key={post.id} src={currentMedia.url} loop autoPlay muted={isMuted} playsInline className="w-full h-full object-cover" />
                )}
            </div>
            
            {showLikeBurst && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="animate-like-burst">
                        <Icon className="w-32 h-32 text-white drop-shadow-lg" fill="currentColor">
                            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </Icon>
                    </div>
                </div>
            )}
            {currentMedia.type === 'video' && (
                <div className="absolute top-4 right-4 pointer-events-auto">
                    <button onClick={() => setIsMuted(p => !p)} className="bg-black/40 p-1.5 rounded-full text-white hover:bg-black/60 transition-opacity">
                    {isMuted ? (
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></Icon>
                    ) : (
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></Icon>
                    )}
                    </button>
                </div>
            )}
        </div>

        {/* Action Bar & Content */}
        <div className="px-2 pt-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => onToggleLike(post.id)}><Icon className={`w-7 h-7 hover:text-gray-400 ${post.isLiked ? 'text-red-500' : ''}`} fill={post.isLiked ? 'currentColor' : 'none'}><path stroke="currentColor" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon></button>
                    <button onClick={() => commentInputRef.current?.focus()}><Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25z" /></Icon></button>
                    <button onClick={() => onShare(post)}><Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon></button>
                </div>
                <button onClick={() => onToggleSave(post.id)}><Icon className="w-7 h-7" fill={post.isSaved ? 'currentColor' : 'none'}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></Icon></button>
            </div>
            <button onClick={() => onViewLikes(post.likedBy)} className="mt-2 font-semibold text-sm">{post.likes.toLocaleString()} likes</button>
            <p className="text-sm mt-1"><span className="font-semibold cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.username}</span> {post.caption}</p>
            
            {post.comments.length > 0 && (
                <button onClick={() => onViewPost(post)} className="text-sm text-gray-400 mt-1">View all {post.comments.length} comments</button>
            )}

            {post.comments.slice(0, 1).map(comment => (
                <div key={comment.id} className="text-sm mt-1 flex gap-2">
                    <p><span className="font-semibold cursor-pointer" onClick={() => onViewProfile(comment.user)}>{comment.user.username}</span> {comment.text}</p>
                </div>
            ))}

            <div className="flex items-center gap-2 mt-2">
                <img src={currentUser.avatar} alt="current user avatar" className="w-6 h-6 rounded-full" />
                <input 
                    ref={commentInputRef}
                    type="text" 
                    placeholder="Add a comment..." 
                    value={commentText} 
                    onChange={e => setCommentText(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && handlePostComment()} 
                    className="w-full bg-transparent text-sm focus:outline-none placeholder-gray-500"
                />
                {commentText && <button onClick={handlePostComment} className="text-red-500 font-semibold text-sm">Post</button>}
            </div>
        </div>
    </article>
    );
};

export default Post;