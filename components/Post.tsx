import React, { useState, useRef, useEffect } from 'react';
import type { Post as PostType, User, Comment } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import EmojiPicker from './EmojiPicker.tsx';

interface PostProps {
  post: PostType;
  currentUser: User;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onSave: (postId: string) => void;
  onShare: (post: PostType) => void;
  onViewProfile: (user: User) => void;
  onEditPost: (post: PostType) => void;
  onViewLikes: (users: User[]) => void;
}

const Post: React.FC<PostProps> = ({ post, currentUser, onLike, onComment, onSave, onShare, onViewProfile, onEditPost, onViewLikes }) => {
  const [commentText, setCommentText] = useState('');
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const captionRef = useRef<HTMLParagraphElement>(null);
  const [isCaptionLong, setIsCaptionLong] = useState(false);

  useEffect(() => {
    if (captionRef.current) {
        // Simple check, can be improved
        setIsCaptionLong(captionRef.current.innerText.length > 100);
    }
  }, [post.caption]);

  const handlePostComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
      setEmojiPickerOpen(false);
    }
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
      return <video src={media.url} controls className="w-full h-full object-cover" />;
    }
    return <img src={media.url} alt={`Post by ${post.user.username}`} className="w-full h-full object-cover" />;
  };
  
  const isMultiMedia = post.media.length > 1;

  return (
    <article className="border-b border-gray-800 py-4">
      <header className="flex items-center justify-between px-4 pb-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewProfile(post.user)}>
          <img src={post.user.avatar} alt={post.user.username} className="w-10 h-10 rounded-full object-cover" />
          <div>
              <p className="font-semibold text-sm flex items-center gap-1">
                {post.user.username}
                {post.user.isVerified && <VerifiedBadge />}
              </p>
              <p className="text-xs text-gray-400">{post.timestamp}</p>
          </div>
        </div>
        <button onClick={() => onEditPost(post)} className="p-1">
            <Icon className="w-6 h-6"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon>
        </button>
      </header>
      
      <div className="relative aspect-square bg-black">
        {renderMedia()}
        {isMultiMedia && (
            <>
                {currentMediaIndex > 0 && <button onClick={handlePrevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1"><Icon className="w-5 h-5"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
                {currentMediaIndex < post.media.length - 1 && <button onClick={handleNextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1"><Icon className="w-5 h-5"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {post.media.map((_, index) => <div key={index} className={`w-1.5 h-1.5 rounded-full ${index === currentMediaIndex ? 'bg-white' : 'bg-white/50'}`} />)}
                </div>
            </>
        )}
      </div>

      <footer className="px-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onLike(post.id)}>
              <Icon className={`w-7 h-7 hover:text-gray-400 transition-transform hover:scale-110 ${post.isLiked ? 'text-red-500' : ''}`} fill={post.isLiked ? 'currentColor' : 'none'}>
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </Icon>
            </button>
            <button><Icon className="w-7 h-7 hover:text-gray-400 transition-transform hover:scale-110"><path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25zM12 16.5a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5H12zM15.375 12a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5h6.75z" /></Icon></button>
            <button onClick={() => onShare(post)}><Icon className="w-7 h-7 hover:text-gray-400 transition-transform hover:scale-110"><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon></button>
          </div>
          <button onClick={() => onSave(post.id)}>
            <Icon className="w-7 h-7 hover:text-gray-400 transition-transform hover:scale-110" fill={post.isSaved ? 'currentColor' : 'none'}>
              <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </Icon>
          </button>
        </div>

        <button onClick={() => onViewLikes(post.likedBy)} className="font-semibold text-sm mt-2">{post.likes.toLocaleString()} likes</button>
        
        <p ref={captionRef} className="text-sm mt-1">
          <span className="font-semibold cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.username}</span>{' '}
          <span className={!showFullCaption && isCaptionLong ? 'line-clamp-2' : ''}>{post.caption}</span>
           {isCaptionLong && (
             <button onClick={() => setShowFullCaption(prev => !prev)} className="text-gray-400 ml-1">
                {showFullCaption ? 'less' : 'more'}
             </button>
           )}
        </p>
        
        {post.comments.length > 0 && <p className="text-sm text-gray-400 mt-2">View all {post.comments.length} comments</p>}
        
        <div className="relative flex items-center mt-3">
            <input 
                type="text" 
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                className="w-full bg-transparent text-sm focus:outline-none"
            />
            {commentText && <button onClick={handlePostComment} className="text-red-500 font-semibold text-sm">Post</button>}
             <button onClick={() => setEmojiPickerOpen(p => !p)} className="p-1">
                <Icon className="w-5 h-5 text-gray-400"><path d="M15.182 15.182a4.5 4.5 0 01-6.364 0 4.5 4.5 0 010-6.364l4.95-4.95a3.375 3.375 0 014.773 4.773l-1.976 1.976a1.125 1.125 0 01-1.59 0l-1.591-1.59a.375.375 0 10-.53-.53l1.59-1.591a.375.375 0 000-.53l-4.774-4.773a2.625 2.625 0 00-3.712 3.712l4.95 4.95a1.125 1.125 0 001.59 0l1.976-1.976a2.625 2.625 0 00-3.712-3.712l-4.95 4.95a4.5 4.5 0 006.364 6.364l1.976-1.976a1.125 1.125 0 00-1.59-1.59l-1.976 1.976z" /></Icon>
            </button>
            {isEmojiPickerOpen && <div className="absolute bottom-8 right-0"><EmojiPicker onSelectEmoji={(emoji) => setCommentText(p => p+emoji)} /></div>}
        </div>
      </footer>
    </article>
  );
};

export default Post;
