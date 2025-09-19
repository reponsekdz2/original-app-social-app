import React, { useState, useRef, useEffect } from 'react';
import type { Post, User } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import EmojiPicker from './EmojiPicker.tsx';

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
}

const PostModal: React.FC<PostModalProps> = (props) => {
  const { post, currentUser, onClose, onToggleLike, onToggleSave, onComment, onShare, onViewLikes, onViewProfile, onOptions } = props;

  const [commentText, setCommentText] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const isLiked = post.likedBy.some(u => u.id === currentUser.id);
  const isSaved = post.savedBy.some(u => u.id === currentUser.id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleNextMedia = () => setCurrentMediaIndex(prev => Math.min(prev + 1, post.media.length - 1));
  const handlePrevMedia = () => setCurrentMediaIndex(prev => Math.max(prev - 1, 0));

  const handlePostComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-black w-full max-w-4xl h-full max-h-[90vh] flex" onClick={e => e.stopPropagation()}>
        <div className="flex-1 bg-black relative flex items-center justify-center">
          {post.media.map((media, index) => (
            <div key={media.id} className={`absolute inset-0 transition-opacity duration-300 ${index === currentMediaIndex ? 'opacity-100' : 'opacity-0'}`}>
              {media.type === 'image'
                ? <img src={media.url} alt="Post" className="w-full h-full object-contain" />
                : <video src={media.url} controls className="w-full h-full object-contain" />}
            </div>
          ))}
          {post.media.length > 1 && (
            <>
              {currentMediaIndex > 0 && <button onClick={handlePrevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1"><Icon className="w-5 h-5"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
              {currentMediaIndex < post.media.length - 1 && <button onClick={handleNextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1"><Icon className="w-5 h-5"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
            </>
          )}
        </div>
        <div className="w-96 border-l border-gray-800 flex flex-col">
          <header className="flex items-center justify-between p-3 border-b border-gray-800">
             <div className="flex items-center gap-3">
                <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => onViewProfile(post.user)} />
                <span className="font-semibold text-sm cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.username}</span>
                {post.user.isVerified && <VerifiedBadge className="w-3 h-3"/>}
            </div>
            <button onClick={() => onOptions(post)}><Icon className="w-6 h-6"><path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></Icon></button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
             <div className="flex items-start gap-3">
                <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full" />
                <p className="text-sm"><span className="font-semibold">{post.user.username}</span> {post.caption}</p>
             </div>
             {post.comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-3">
                    <img src={comment.user.avatar} alt={comment.user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => onViewProfile(comment.user)} />
                    <div>
                        <p className="text-sm"><span className="font-semibold cursor-pointer" onClick={() => onViewProfile(comment.user)}>{comment.user.username}</span> {comment.text}</p>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                </div>
             ))}
          </div>

          <footer className="p-3 border-t border-gray-800 space-y-2">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => onToggleLike(post.id)}><Icon className={`w-7 h-7 ${isLiked ? 'text-red-500' : ''}`} fill={isLiked ? 'currentColor' : 'none'}><path stroke="currentColor" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon></button>
                    <button><Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25zM12 16.5a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5H12zM15.375 12a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5h6.75z" /></Icon></button>
                    <button onClick={() => onShare(post)}><Icon className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon></button>
                </div>
                <button onClick={() => onToggleSave(post.id)}><Icon className={`w-7 h-7 ${isSaved ? 'text-white' : ''}`} fill={isSaved ? 'currentColor' : 'none'}><path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></Icon></button>
            </div>
            {post.likes > 0 && <button onClick={() => onViewLikes(post.likedBy)} className="font-semibold text-sm">{post.likes.toLocaleString()} likes</button>}
             <div className="relative" ref={pickerRef}>
                {showEmojiPicker && <div className="absolute bottom-full mb-2"><EmojiPicker onSelectEmoji={(emoji) => setCommentText(prev => prev + emoji)} /></div>}
                <div className="flex items-center gap-2 border-t border-gray-800 pt-2">
                    <button onClick={() => setShowEmojiPicker(p => !p)}><Icon className="w-6 h-6 text-gray-400"><path d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V9.75zm6 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V9.75z" /></Icon></button>
                    <input type="text" placeholder="Add a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} onKeyPress={e => e.key === 'Enter' && handlePostComment()} className="w-full bg-transparent text-sm focus:outline-none" />
                    {commentText && <button onClick={handlePostComment} className="text-red-500 font-semibold text-sm">Post</button>}
                </div>
            </div>
          </footer>
        </div>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 text-white"><Icon className="w-8 h-8"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
    </div>
  );
};

export default PostModal;