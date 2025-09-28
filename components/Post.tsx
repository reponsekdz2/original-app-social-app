import React, { useState, useRef } from 'react';
import type { Post as PostType, User, Poll as PollType } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import { formatTimestamp } from './utils.tsx';
import Poll from './Poll.tsx';

interface PostProps {
  post: PostType;
  currentUser: User;
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (post: PostType) => void;
  onShare: (post: PostType) => void;
  onOptions: (post: PostType) => void;
  onViewProfile: (user: User) => void;
  onViewLikes: (users: User[]) => void;
  // FIX: Changed pollId to string to match type
  onVote: (pollId: string, optionId: number) => void;
  onViewTag: (tag: string) => void;
}

const PostComponent: React.FC<PostProps> = (props) => {
    const { post, currentUser, onLike, onUnlike, onSave, onComment, onShare, onOptions, onViewProfile, onViewLikes, onVote, onViewTag } = props;
    
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(post.likedBy.some(u => u.id === currentUser.id));
    const [isSaved, setIsSaved] = useState(post.isSaved);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [showHeart, setShowHeart] = useState(false);
    const doubleTapTimeout = useRef<number | null>(null);

    const handleLikeToggle = () => {
        if (isLiked) {
            onUnlike(post.id);
            setIsLiked(false);
            setLikeCount(prev => prev - 1);
        } else {
            onLike(post.id);
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
        }
    };

    const handleSaveToggle = () => {
        onSave(post.id);
        setIsSaved(prev => !prev);
    };

    const handleDoubleTap = () => {
        if (!isLiked) {
            handleLikeToggle();
        }
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
    };

    const handleMediaClick = () => {
        if (doubleTapTimeout.current) {
            clearTimeout(doubleTapTimeout.current);
            doubleTapTimeout.current = null;
            handleDoubleTap();
        } else {
            doubleTapTimeout.current = window.setTimeout(() => {
                doubleTapTimeout.current = null;
            }, 300);
        }
    };
    
    const handleNextMedia = () => setCurrentMediaIndex(prev => Math.min(prev + 1, post.media.length - 1));
    const handlePrevMedia = () => setCurrentMediaIndex(prev => Math.max(prev - 1, 0));
    
    const parseCaption = (caption: string) => {
        const parts = caption.split(/(\#[a-zA-Z0-9_]+)/g);
        return parts.map((part, index) => {
            if (part.startsWith('#')) {
                const tag = part.substring(1);
                return <button key={index} onClick={() => onViewTag(tag)} className="text-red-400 hover:underline">{part}</button>;
            }
            return part;
        });
    };

  return (
    <article className="border-b border-gray-800 py-4">
      <header className="flex items-center px-4 pb-3">
        <img src={post.user.avatar_url} alt={post.user.username} className="w-9 h-9 rounded-full object-cover cursor-pointer" onClick={() => onViewProfile(post.user)} />
        <div className="ml-3">
          <span className="font-semibold text-sm cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.username}</span>
          {post.user.isVerified && <VerifiedBadge className="w-3 h-3 ml-1 inline-block" />}
          {post.location && <span className="text-xs text-gray-400 block">{post.location}</span>}
        </div>
        <button onClick={() => onOptions(post)} className="ml-auto p-1 text-white">
          <Icon className="w-5 h-5"><path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></Icon>
        </button>
      </header>
      
      <div className="relative w-full aspect-square bg-black" onClick={handleMediaClick}>
        {showHeart && <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"><Icon className="w-24 h-24 text-white/90 animate-heart-pulse"><path fill="currentColor" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon></div>}
        {post.media.map((media, index) => (
            <div key={media.id} className={`absolute inset-0 transition-opacity duration-300 ${index === currentMediaIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                 {media.type === 'video' 
                    ? <video src={media.url} controls className="w-full h-full object-contain" />
                    : <img src={media.url} alt={`Post by ${post.user.username}`} className="w-full h-full object-contain" />
                 }
            </div>
        ))}
         {post.media.length > 1 && (
            <>
                {currentMediaIndex > 0 && <button onClick={e => { e.stopPropagation(); handlePrevMedia(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 text-white z-10"><Icon className="w-6 h-6"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
                {currentMediaIndex < post.media.length - 1 && <button onClick={e => { e.stopPropagation(); handleNextMedia(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1 text-white z-10"><Icon className="w-6 h-6"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {post.media.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentMediaIndex ? 'bg-white' : 'bg-white/50'}`}></div>)}
                </div>
            </>
        )}
      </div>

      <footer className="px-4 pt-3">
        <div className="flex items-center gap-4">
            <button onClick={handleLikeToggle}><Icon className={`w-7 h-7 ${isLiked ? 'text-red-500' : ''}`} fill={isLiked ? 'currentColor' : 'none'}><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon></button>
            <button onClick={() => onComment(post)}><Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25zM12 16.5a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5H12zM15.375 12a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5h6.75z" /></Icon></button>
            <button onClick={() => onShare(post)}><Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon></button>
            <button onClick={handleSaveToggle} className="ml-auto"><Icon className="w-7 h-7" fill={isSaved ? 'currentColor' : 'none'}><path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></Icon></button>
        </div>
        {likeCount > 0 && <button onClick={() => onViewLikes(post.likedBy)} className="font-semibold text-sm mt-2">{likeCount.toLocaleString()} likes</button>}
        <p className="text-sm mt-1"><span className="font-semibold">{post.user.username}</span> {parseCaption(post.caption)}</p>
        {post.poll && <div className="mt-3"><Poll poll={post.poll} onVote={(optionId) => onVote(post.poll!.id, optionId)} /></div>}
        {post.comments.length > 0 && <button onClick={() => onComment(post)} className="text-sm text-gray-500 mt-1">View all {post.comments.length} comments</button>}
        <p className="text-xs text-gray-500 uppercase mt-2">{formatTimestamp(post.timestamp)}</p>
      </footer>
    </article>
  );
};

export default PostComponent;
