import React, { useState, useEffect, useRef } from 'react';
import type { Post, User, Comment as CommentType } from '../types';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import FollowButton from './FollowButton.tsx';
import Poll from './Poll.tsx';

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
    const [showLikeBurst, setShowLikeBurst] = useState(false);
    const mediaContainerRef = useRef<HTMLDivElement>(null);
    let lastTap = 0;

    const isLiked = post.likedBy.some(u => u.id === currentUser.id);
    const isSaved = post.isSaved;
    const isCurrentUserPost = post.user.id === currentUser.id;

    const handleDoubleTap = () => {
        const now = new Date().getTime();
        if (now - lastTap < 300) { // 300ms for double tap
            if (!isLiked) {
                onToggleLike(post.id);
            }
            setShowLikeBurst(true);
            setTimeout(() => setShowLikeBurst(false), 700);
        }
        lastTap = now;
    };
    
    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post.id, commentText);
            setCommentText('');
        }
    };

    const nextMedia = () => setCurrentMediaIndex(prev => Math.min(prev + 1, post.media.length - 1));
    const prevMedia = () => setCurrentMediaIndex(prev => Math.max(prev - 1, 0));
    
    const collaborators = post.collaborators.filter(c => c.id !== post.user.id);

    return (
        <article className="w-full max-w-2xl bg-black/50 backdrop-blur-sm sm:border border-gray-800 sm:rounded-2xl overflow-hidden shadow-lg shadow-black/20">
            <header className="flex items-center p-3 sm:p-4">
                <img src={post.user.avatar} alt={post.user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => onViewProfile(post.user)} />
                <div className="ml-3 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                       <span className="font-semibold text-sm cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.username}</span>
                       {post.user.isVerified && <VerifiedBadge />}
                       {collaborators.length > 0 && (
                           <span className="text-sm text-gray-400">
                               with <span className="font-semibold text-white cursor-pointer" onClick={() => onViewProfile(collaborators[0])}>{collaborators[0].username}</span>
                               {collaborators.length > 1 && ` and ${collaborators.length - 1} other${collaborators.length > 2 ? 's' : ''}`}
                           </span>
                       )}
                    </div>
                    {post.location && <p className="text-xs text-gray-400">{post.location}</p>}
                </div>
                {!isCurrentUserPost && <FollowButton user={post.user} currentUser={currentUser} onFollow={onFollow} onUnfollow={onUnfollow} />}
                <button onClick={() => onOptions(post)} className="ml-2 p-1"><Icon className="w-5 h-5"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon></button>
            </header>

            <div ref={mediaContainerRef} className="relative w-full aspect-square bg-gray-900 overflow-hidden" onClick={handleDoubleTap}>
                {showLikeBurst && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <Icon className="w-32 h-32 text-white animate-like-burst"><path fill="currentColor" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon>
                    </div>
                )}
                 <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${currentMediaIndex * 100}%)` }}>
                    {post.media.map((media) => (
                        <div key={media.id} className="w-full h-full flex-shrink-0">
                            {media.type === 'image' 
                            ? <img src={media.url} alt={`Post by ${post.user.username}`} className="w-full h-full object-contain" />
                            : <video src={media.url} controls className="w-full h-full object-contain" />
                            }
                        </div>
                    ))}
                </div>
                {post.media.length > 1 && (
                    <>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {post.media.map((_, index) => (
                                <button key={index} onClick={() => setCurrentMediaIndex(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentMediaIndex ? 'bg-white scale-125' : 'bg-white/40'}`}></button>
                            ))}
                        </div>
                        {currentMediaIndex > 0 && <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"><Icon className="w-5 h-5"><path d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>}
                        {currentMediaIndex < post.media.length - 1 && <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"><Icon className="w-5 h-5"><path d="M8.25 4.5l7.5 7.5-7.5 7.5" /></Icon></button>}
                    </>
                )}
            </div>

            <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <button onClick={() => onToggleLike(post.id)}>
                             <Icon className={`w-8 h-8 hover:text-gray-400 transition-colors ${isLiked ? 'text-red-500' : ''}`} fill={isLiked ? 'currentColor' : 'none'}>
                               <path stroke="currentColor" strokeWidth="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </Icon>
                        </button>
                        <button onClick={() => onViewPost(post)}>
                            <Icon className="w-8 h-8 hover:text-gray-400 transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25zM12 16.5a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5H12zM15.375 12a.75.75 0 000-1.5H8.625a.75.75 0 000 1.5h6.75z" /></Icon>
                        </button>
                         <button onClick={() => onShare(post)}>
                            <Icon className="w-8 h-8 hover:text-gray-400 transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon>
                        </button>
                    </div>
                     <div className="flex items-center gap-4">
                         {!isCurrentUserPost && (
                            <button onClick={() => onTip(post)}>
                                <Icon className="w-8 h-8 hover:text-gray-400 transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 10.5 12 10.5s-1.536.71-2.121 1.359c-1.172.879-1.172 2.303 0 3.182z" /></Icon>
                            </button>
                         )}
                        <button onClick={() => onToggleSave(post.id)}>
                            <Icon className={`w-8 h-8 hover:text-gray-400 transition-colors ${isSaved ? 'text-white' : ''}`} fill={isSaved ? 'currentColor' : 'none'}>
                                <path stroke="currentColor" strokeWidth="1.5" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                            </Icon>
                        </button>
                    </div>
                </div>
                {post.likes > 0 && <button onClick={() => onViewLikes(post.likedBy)} className="font-semibold text-sm">{post.likes.toLocaleString()} likes</button>}
                
                {post.poll && (
                    <div className="my-3">
                        <Poll poll={post.poll} onVote={onVote} />
                    </div>
                )}

                <div className="text-sm">
                    <span className="font-semibold cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.username}</span> {post.caption}
                </div>
                {post.comments.length > 0 && <button onClick={() => onViewPost(post)} className="text-gray-400 text-sm mt-1">View all {post.comments.length} comments</button>}
                {post.comments.slice(0, 2).map(comment => (
                    <div key={comment.id} className="text-sm mt-1">
                        <span className="font-semibold cursor-pointer" onClick={() => onViewProfile(comment.user)}>{comment.user.username}</span> {comment.text}
                    </div>
                ))}
                <p className="text-gray-500 text-xs uppercase mt-2">{new Date(post.timestamp).toDateString()}</p>
            </div>
            <form onSubmit={handlePostComment} className="border-t border-gray-800 p-3 sm:p-4 flex items-center gap-2">
                <input 
                    type="text" 
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-transparent text-sm focus:outline-none"
                />
                {commentText.trim().length > 0 && (
                    <button type="submit" className="text-red-500 font-semibold text-sm">Post</button>
                )}
            </form>
        </article>
    );
};

export default PostComponent;