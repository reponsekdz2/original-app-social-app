import React, { useState, useRef, useEffect } from 'react';
import type { Post as PostType, User, Comment as CommentType } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import MagicComposePanel from './MagicComposePanel.tsx';
import { generateComment } from '../services/geminiService.ts';

interface CommentComponentProps {
  comment: CommentType;
  currentUser: User;
  onViewProfile: (user: User) => void;
  onToggleLike: (commentId: string) => void;
  onReply: (comment: CommentType) => void;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ comment, currentUser, onViewProfile, onToggleLike, onReply }) => {
  const likedByUser = comment.likedBy.some(u => u.id === currentUser.id);

  return (
    <div className="flex items-start gap-3">
      <img src={comment.user.avatar} alt={comment.user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => onViewProfile(comment.user)} />
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-semibold cursor-pointer" onClick={() => onViewProfile(comment.user)}>{comment.user.username}</span> {comment.text}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
          <span>{comment.timestamp}</span>
          {comment.likes > 0 && <span className="font-semibold">{comment.likes} likes</span>}
          <button onClick={() => onReply(comment)} className="font-semibold">Reply</button>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-4 pl-4 border-l-2 border-gray-700">
            {comment.replies.map(reply => (
              <CommentComponent
                key={reply.id}
                comment={reply}
                currentUser={currentUser}
                onViewProfile={onViewProfile}
                onToggleLike={onToggleLike}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
      <button className="mt-2" onClick={() => onToggleLike(comment.id)}>
        <Icon className={`w-4 h-4 ${likedByUser ? 'text-red-500' : 'text-gray-400'}`} fill={likedByUser ? 'currentColor' : 'none'}>
          <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </Icon>
      </button>
    </div>
  );
};


interface PostModalProps {
  post: PostType;
  currentUser: User;
  onClose: () => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onComment: (postId: string, text: string, replyToId?: string) => void;
  onToggleCommentLike: (postId: string, commentId: string) => void;
  onShare: (post: PostType) => void;
  onViewLikes: (users: User[]) => void;
  onViewProfile: (user: User) => void;
  onOptions: (post: PostType) => void;
}

const PostModal: React.FC<PostModalProps> = (props) => {
  const { post, currentUser, onClose, onToggleCommentLike } = props;
  const [commentText, setCommentText] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [replyingTo, setReplyingTo] = useState<CommentType | null>(null);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const hasMultipleMedia = post.media.length > 1;
  const currentMedia = post.media[currentMediaIndex];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setPanelOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (replyingTo) {
      commentInputRef.current?.focus();
    }
  }, [replyingTo]);

  const handleNextMedia = () => setCurrentMediaIndex(p => (p + 1) % post.media.length);
  const handlePrevMedia = () => setCurrentMediaIndex(p => (p - 1 + post.media.length) % post.media.length);
  
  const handlePostComment = () => {
    if (commentText.trim()) {
      props.onComment(post.id, commentText, replyingTo?.id);
      setCommentText('');
      setPanelOpen(false);
      setReplyingTo(null);
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
  
  const handleSetReplyingTo = (comment: CommentType) => {
    setReplyingTo(comment);
    commentInputRef.current?.focus();
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md md:max-w-3xl lg:max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full md:w-3/5 bg-black flex items-center justify-center">
            {currentMedia.type === 'image' ? (
                <img src={currentMedia.url} alt="Post" className="max-h-full max-w-full object-contain" />
            ) : (
                <video src={currentMedia.url} controls autoPlay muted loop playsInline className="max-h-full max-w-full object-contain" />
            )}
            {hasMultipleMedia && (
                <>
                    {currentMediaIndex > 0 && <button onClick={handlePrevMedia} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/80"><Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
                    {currentMediaIndex < post.media.length - 1 && <button onClick={handleNextMedia} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/80"><Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
                </>
            )}
        </div>
        <div className="w-full md:w-2/5 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => props.onViewProfile(post.user)}>
                    <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full" />
                    <span className="font-semibold text-sm">{post.user.username}</span>
                    {post.user.isVerified && <VerifiedBadge className="w-3 h-3"/>}
                </div>
                 <button onClick={() => props.onOptions(post)}><Icon className="w-6 h-6"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm4.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm4.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 <div className="flex items-start gap-3">
                    <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => props.onViewProfile(post.user)} />
                    <div>
                        <p className="text-sm"><span className="font-semibold cursor-pointer" onClick={() => props.onViewProfile(post.user)}>{post.user.username}</span> {post.caption}</p>
                        <p className="text-xs text-gray-500 mt-1">{post.timestamp}</p>
                    </div>
                 </div>
                {post.comments.map(comment => (
                     <CommentComponent
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        onViewProfile={props.onViewProfile}
                        onToggleLike={(commentId) => onToggleCommentLike(post.id, commentId)}
                        onReply={handleSetReplyingTo}
                      />
                ))}
            </div>
             <div className="p-4 border-t border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => props.onToggleLike(post.id)}><Icon className={`w-7 h-7 hover:text-gray-400 ${post.isLiked ? 'text-red-500' : ''}`} fill={post.isLiked ? 'currentColor' : 'none'}><path stroke="currentColor" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon></button>
                        <button><Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25z" /></Icon></button>
                        <button onClick={() => props.onShare(post)}><Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon></button>
                    </div>
                    <button onClick={() => props.onToggleSave(post.id)}><Icon className="w-7 h-7" fill={post.isSaved ? 'currentColor' : 'none'}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></Icon></button>
                </div>
                <button onClick={() => props.onViewLikes(post.likedBy)} className="mt-2 font-semibold text-sm">{post.likes.toLocaleString()} likes</button>
                <p className="text-xs text-gray-500 uppercase mt-1">{post.timestamp}</p>
            </div>
            <div className="p-3 border-t border-gray-700">
                {replyingTo && (
                    <div className="text-xs text-gray-400 mb-2 flex justify-between items-center">
                        <span>Replying to <span className="font-semibold text-gray-300">{replyingTo.user.username}</span></span>
                        <button onClick={() => setReplyingTo(null)} className="p-1"><Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon></button>
                    </div>
                )}
               <div className="relative flex items-center">
                  <img src={currentUser.avatar} alt="current user avatar" className="w-8 h-8 rounded-full mr-3" />
                  <input ref={commentInputRef} type="text" placeholder="Add a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePostComment()} className="w-full bg-transparent text-sm focus:outline-none"/>
                  {currentUser.isPremium && !commentText && !replyingTo && (
                    <div ref={panelRef}>
                      <button onClick={() => setPanelOpen(p => !p)} className="text-gray-500 hover:text-white">
                          <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></Icon>
                      </button>
                      {isPanelOpen && <div className="absolute bottom-10 right-0 z-10"><MagicComposePanel onGenerate={handleGenerateComment} isLoading={isGenerating} /></div>}
                    </div>
                  )}
                  {commentText && <button onClick={handlePostComment} className="text-red-500 font-semibold text-sm">Post</button>}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;