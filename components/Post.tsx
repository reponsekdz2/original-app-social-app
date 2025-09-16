import React, { useState } from 'react';
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
    onShare,
    onViewLikes,
    onViewProfile,
    onFollow,
    onUnfollow,
    onViewPost,
    onOptions,
}) => {
    const [isMuted, setIsMuted] = useState(true);
    const [showLikeBurst, setShowLikeBurst] = useState(false);

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

    const isFollowing = currentUser.following.some(u => u.id === post.user.id);

    return (
    <article className="relative h-full w-full max-w-lg bg-black rounded-xl overflow-hidden shadow-2xl">
        {/* Media Container */}
        <div className="absolute inset-0" onClick={handleDoubleClickLike}>
            {currentMedia.type === 'image' ? (
                <img src={currentMedia.url} alt={`Post by ${post.user.username}`} className="w-full h-full object-cover" />
            ) : (
                <video key={post.id} src={currentMedia.url} loop autoPlay muted={isMuted} playsInline className="w-full h-full object-cover" />
            )}
        </div>
        
        {/* Like Burst Animation */}
        {showLikeBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="animate-like-burst">
                    <Icon className="w-32 h-32 text-white drop-shadow-lg" fill="currentColor">
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </Icon>
                </div>
            </div>
        )}

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 p-4 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewProfile(post.user)}>
                <img src={post.user.avatar} alt={post.user.username} className="w-10 h-10 rounded-full border-2 border-white/80" />
                <div className="text-white drop-shadow-md">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{post.user.username}</h3>
                        {post.user.isVerified && <VerifiedBadge className="w-3 h-3"/>}
                    </div>
                     {!isFollowing && post.user.id !== currentUser.id && (
                        <button onClick={(e) => { e.stopPropagation(); onFollow(post.user); }} className="text-xs font-bold text-red-400 hover:text-red-300">Follow</button>
                    )}
                </div>
            </div>
            <button onClick={() => onOptions(post)} className="text-white p-2 drop-shadow-md">
                <Icon className="w-6 h-6"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm4.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm4.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon>
            </button>
        </header>

        {/* Right Action Bar */}
        <div className="absolute bottom-4 right-2 z-10 flex flex-col items-center gap-5 text-white drop-shadow-md">
            <button onClick={() => onToggleLike(post.id)} className="flex flex-col items-center">
                <Icon className={`w-8 h-8 ${post.isLiked ? 'text-red-500' : ''}`} fill={post.isLiked ? 'currentColor' : 'none'}><path stroke="currentColor" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
                <span className="text-xs font-semibold">{post.likes.toLocaleString()}</span>
            </button>
            
            <button onClick={() => onViewPost(post)} className="flex flex-col items-center">
                <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25z" /></Icon>
                <span className="text-xs font-semibold">{post.comments.length.toLocaleString()}</span>
            </button>
            
             <button onClick={() => onToggleSave(post.id)} className="flex flex-col items-center">
                <Icon className="w-8 h-8" fill={post.isSaved ? 'currentColor' : 'none'}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></Icon>
            </button>
            
            <button onClick={() => onShare(post)} className="flex flex-col items-center">
                <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon>
            </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-16 p-4 z-10 text-white bg-gradient-to-t from-black/70 to-transparent">
             <p className="text-sm drop-shadow-md whitespace-pre-wrap">{post.caption}</p>
             <button onClick={() => onViewPost(post)} className="text-xs text-gray-300 mt-1 hover:underline">View all {post.comments.length} comments</button>
        </div>
        
        {/* Mute button for video */}
        {currentMedia.type === 'video' && (
            <div className="absolute top-16 right-4 pointer-events-auto z-10">
                <button onClick={() => setIsMuted(p => !p)} className="bg-black/40 p-1.5 rounded-full text-white hover:bg-black/60 transition-opacity">
                {isMuted ? (
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></Icon>
                ) : (
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></Icon>
                )}
                </button>
            </div>
        )}
    </article>
    );
};

export default Post;