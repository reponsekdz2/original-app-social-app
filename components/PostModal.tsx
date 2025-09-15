import React, { useState } from 'react';
import type { Post as PostType, User, Comment } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import EmojiPicker from './EmojiPicker.tsx';
import { generateComment } from '../services/geminiService.ts';
import MagicComposePanel from './MagicComposePanel.tsx';

interface PostModalProps {
  post: PostType;
  currentUser: User;
  onClose: () => void;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onShare: (post: PostType) => void;
  onViewProfile: (user: User) => void;
  onEdit: (post: PostType) => void;
  onViewLikes: (users: User[]) => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, currentUser, onClose, onLike, onSave, onComment, onLikeComment, onShare, onViewProfile, onEdit, onViewLikes }) => {
  const [commentText, setCommentText] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isMagicComposeOpen, setMagicComposeOpen] = useState(false);
  const [isGeneratingComment, setIsGeneratingComment] = useState(false);

  const handlePostComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
      setMagicComposeOpen(false);
    }
  };
  
  const handleGenerateComment = async (style: string) => {
    setIsGeneratingComment(true);
    setMagicComposeOpen(false);
    try {
        const generated = await generateComment(post.caption, style);
        setCommentText(generated);
    } catch (error) {
        console.error("Failed to generate comment:", error);
    } finally {
        setIsGeneratingComment(false);
    }
  };

  const handleViewProfileAndClose = (user: User) => {
    onViewProfile(user);
    onClose();
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex(prev => (prev > 0 ? prev - 1 : 0));
  };
  
  const handleNextMedia = () => {
    setCurrentMediaIndex(prev => (prev < post.media.length - 1 ? prev + 1 : prev));
  };
  
  const renderMedia = () => {
    const media = post.media[currentMediaIndex];
    if (media.type === 'video') {
      return <video src={media.url} controls className="w-full h-full object-contain" />;
    }
    return <img src={media.url} alt={`Post by ${post.user.username}`} className="w-full h-full object-contain" />;
  };
  
  const isMultiMedia = post.media.length > 1;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white z-10">
        <Icon className="w-8 h-8"><path d="M6 18L18 6M6 6l12 12" /></Icon>
      </button>

      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Media Side */}
        <div className="w-3/5 bg-black flex items-center justify-center relative">
            {renderMedia()}
            {isMultiMedia && (
                <>
                    {currentMediaIndex > 0 && <button onClick={handlePrevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"><Icon className="w-6 h-6"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
                    {currentMediaIndex < post.media.length - 1 && <button onClick={handleNextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"><Icon className="w-6 h-6"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
                </>
            )}
        </div>

        {/* Info Side */}
        <div className="w-2/5 flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-gray-700">
             <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleViewProfileAndClose(post.user)}>
                <img src={post.user.avatar} alt={post.user.username} className="w-10 h-10 rounded-full object-cover" />
                <p className="font-semibold text-sm flex items-center gap-1">
                    {post.user.username}
                    {post.user.isVerified && <VerifiedBadge />}
                </p>
            </div>
            <button onClick={() => onEdit(post)} className="p-1">
                <Icon className="w-6 h-6"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Caption */}
            <div className="flex items-start gap-3">
                <img src={post.user.avatar} alt={post.user.username} className="w-10 h-10 rounded-full object-cover cursor-pointer" onClick={() => handleViewProfileAndClose(post.user)} />
                <div>
                     <p className="text-sm">
                        <span className="font-semibold cursor-pointer" onClick={() => handleViewProfileAndClose(post.user)}>{post.user.username}</span>{' '}
                        {post.caption}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{post.timestamp}</p>
                </div>
            </div>

            {/* Comments */}
            {post.comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-3">
                    <img src={comment.user.avatar} alt={comment.user.username} className="w-10 h-10 rounded-full object-cover cursor-pointer" onClick={() => handleViewProfileAndClose(comment.user)} />
                    <div className="flex-1">
                        <p className="text-sm">
                            <span className="font-semibold cursor-pointer" onClick={() => handleViewProfileAndClose(comment.user)}>{comment.user.username}</span>{' '}
                            {comment.text}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span>{comment.timestamp}</span>
                            <button className="font-semibold" onClick={() => onViewLikes(post.likedBy)}> {comment.likes} likes</button>
                            <button className="font-semibold">Reply</button>
                        </div>
                    </div>
                     <button onClick={() => onLikeComment(post.id, comment.id)} className="mt-2">
                        <Icon className={`w-4 h-4 ${comment.likedByUser ? 'text-red-500' : 'text-gray-400'}`} fill={comment.likedByUser ? 'currentColor' : 'none'}>
                            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </Icon>
                    </button>
                </div>
            ))}
          </div>
          
          <footer className="p-4 border-t border-gray-700">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => onLike(post.id)}><Icon className={`w-7 h-7 ${post.isLiked ? 'text-red-500' : ''}`} fill={post.isLiked ? 'currentColor' : 'none'}><path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon></button>
                    <button><Icon className="w-7 h-7"><path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25zM12 16.5a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5H12zM15.375 12a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5h6.75z" /></Icon></button>
                    <button onClick={() => onShare(post)}><Icon className="w-7 h-7"><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon></button>
                </div>
                <button onClick={() => onSave(post.id)}><Icon className="w-7 h-7" fill={post.isSaved ? 'currentColor' : 'none'}><path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></Icon></button>
            </div>
            <button onClick={() => onViewLikes(post.likedBy)} className="font-semibold text-sm mt-2">{post.likes.toLocaleString()} likes</button>
             <div className="relative border-t border-gray-700 pt-3 mt-3">
              {isMagicComposeOpen && <div className="absolute bottom-12 right-0 z-10"><MagicComposePanel onGenerate={handleGenerateComment} isLoading={isGeneratingComment} /></div>}
                <div className="flex items-center">
                    <input 
                        type="text" 
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                        className="w-full bg-transparent text-sm focus:outline-none"
                    />
                     <button onClick={() => setMagicComposeOpen(p => !p)} className="p-1" disabled={isGeneratingComment}>
                      {isGeneratingComment ? (
                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></Icon>
                      )}
                    </button>
                    {commentText && <button onClick={handlePostComment} className="text-red-500 font-semibold text-sm ml-2">Post</button>}
                </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
