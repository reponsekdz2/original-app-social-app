import React, { useState, useRef, useEffect } from 'react';
import type { Post as PostType, User } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import MagicComposePanel from './MagicComposePanel.tsx';
import { generateComment } from '../services/geminiService.ts';

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
}) => {
  const [commentText, setCommentText] = useState('');
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const panelRef = useRef<HTMLDivElement>(null);
  
  const hasMultipleMedia = post.media.length > 1;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setPanelOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNextMedia = () => {
    setCurrentMediaIndex(prev => (prev + 1) % post.media.length);
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex(prev => (prev - 1 + post.media.length) % post.media.length);
  };

  const handlePostComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
      setPanelOpen(false);
    }
  };

  const handleGenerateComment = async (style: string) => {
    setIsGenerating(true);
    try {
      const generated = await generateComment(post.caption, style);
      setCommentText(generated);
    } catch (error) {
      console.error("Failed to generate comment:", error);
    } finally {
      setIsGenerating(false);
    }
    setPanelOpen(false);
  };

  const currentMedia = post.media[currentMediaIndex];

  return (
    <article className="border-b border-gray-800 py-4">
      <div className="flex items-center justify-between px-2 sm:px-4 mb-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewProfile(post.user)}>
          <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full object-cover" />
          <p className="font-semibold text-sm flex items-center">{post.user.username} {post.user.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />} <span className="text-gray-500 font-normal ml-2 text-xs">· {post.timestamp}</span></p>
        </div>
        <button onClick={() => onOptions(post)}>
          <Icon className="w-6 h-6"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon>
        </button>
      </div>

      <div className="relative bg-black rounded-lg overflow-hidden">
        {currentMedia.type === 'image' ? (
          <img src={currentMedia.url} alt={`Post by ${post.user.username}`} className="w-full h-auto max-h-[80vh] object-contain" />
        ) : (
          <>
            <video src={currentMedia.url} loop autoPlay muted={isMuted} playsInline className="w-full h-auto max-h-[80vh] object-contain" />
            <button onClick={() => setIsMuted(p => !p)} className="absolute bottom-3 right-3 bg-black/60 p-1.5 rounded-full text-white hover:bg-black/80 transition-opacity">
              {isMuted ? (
                  <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></Icon>
              ) : (
                  <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></Icon>
              )}
            </button>
          </>
        )}
        {hasMultipleMedia && (
            <>
                {currentMediaIndex > 0 && 
                    <button onClick={handlePrevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white hover:bg-black/80">
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon>
                    </button>
                }
                 {currentMediaIndex < post.media.length - 1 && 
                    <button onClick={handleNextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full text-white hover:bg-black/80">
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon>
                    </button>
                }
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {post.media.map((_, index) => (
                        <div key={index} className={`w-1.5 h-1.5 rounded-full ${index === currentMediaIndex ? 'bg-white' : 'bg-white/40'}`}></div>
                    ))}
                </div>
            </>
        )}
      </div>

      <div className="px-2 sm:px-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onToggleLike(post.id)}>
              <Icon className={`w-7 h-7 hover:text-gray-400 ${post.isLiked ? 'text-red-500' : ''}`} fill={post.isLiked ? 'currentColor' : 'none'}>
                <path stroke="currentColor" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </Icon>
            </button>
            <button><Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25z" /></Icon></button>
            <button onClick={() => onShare(post)}><Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon></button>
          </div>
          <button onClick={() => onToggleSave(post.id)}>
            <Icon className="w-7 h-7" fill={post.isSaved ? 'currentColor' : 'none'}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </Icon>
          </button>
        </div>

        <button onClick={() => onViewLikes(post.likedBy)} className="mt-2 font-semibold text-sm">{post.likes.toLocaleString()} likes</button>
        <p className="text-sm mt-1">
          <span className="font-semibold cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.username}</span> {post.caption}
        </p>
        {post.comments.length > 0 && <button className="text-sm text-gray-500 mt-1">View all {post.comments.length} comments</button>}
        
        <div className="relative flex items-center mt-2">
            <input 
                type="text" 
                placeholder="Add a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handlePostComment()}
                className="w-full bg-transparent text-sm focus:outline-none"
            />
            {currentUser.isPremium && !commentText && (
                <div ref={panelRef}>
                    <button onClick={() => setPanelOpen(p => !p)} className="text-gray-500 hover:text-white">
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></Icon>
                    </button>
                    {isPanelOpen && <div className="absolute bottom-8 right-0 z-10"><MagicComposePanel onGenerate={handleGenerateComment} isLoading={isGenerating} /></div>}
                </div>
            )}
            {commentText && <button onClick={handlePostComment} className="text-red-500 font-semibold text-sm">Post</button>}
        </div>
      </div>
    </article>
  );
};

export default Post;