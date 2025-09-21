import React, { useState, useRef } from 'react';
// Fix: Corrected import path for types to be relative.
import type { Reel, User, Comment } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';

interface ReelCommentsModalProps {
  reel: Reel;
  currentUser: User;
  onClose: () => void;
  onPostComment: (reelId: string, text: string) => void;
  onViewProfile: (user: User) => void;
  onToggleCommentLike: (commentId: string) => void;
}

const ReelCommentsModal: React.FC<ReelCommentsModalProps> = ({ reel, currentUser, onClose, onPostComment, onViewProfile, onToggleCommentLike }) => {
  const [commentText, setCommentText] = useState('');

  const handlePostComment = () => {
    if (commentText.trim()) {
      onPostComment(reel.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center" onClick={onClose}>
      <div 
        className="bg-gray-800 w-full max-w-lg rounded-t-2xl h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button className="absolute top-2 right-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Reel Caption */}
            <div className="flex items-start gap-3">
                <img src={reel.user.avatar} alt={reel.user.username} className="w-9 h-9 rounded-full" />
                <p className="text-sm"><span className="font-semibold">{reel.user.username}</span> {reel.caption}</p>
             </div>

            <hr className="border-gray-700" />

            {/* Comments */}
            {reel.comments.map(comment => {
                const isCommentLiked = comment.likedBy.some(u => u.id === currentUser.id);
                return (
                    <div key={comment.id} className="flex items-start gap-3 group">
                        <img src={comment.user.avatar} alt={comment.user.username} className="w-9 h-9 rounded-full cursor-pointer" onClick={() => onViewProfile(comment.user)} />
                        <div className="flex-1">
                            <p className="text-sm">
                                <span className="font-semibold cursor-pointer" onClick={() => onViewProfile(comment.user)}>{comment.user.username}</span> {comment.text}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{comment.timestamp}</span>
                                {comment.likes > 0 && <span>{comment.likes} likes</span>}
                                <button>Reply</button>
                            </div>
                        </div>
                        <button onClick={() => onToggleCommentLike(comment.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Icon className={`w-4 h-4 ${isCommentLiked ? 'text-red-500' : 'text-gray-400'}`} fill={isCommentLiked ? 'currentColor' : 'none'}>
                                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </Icon>
                        </button>
                    </div>
                );
             })}
             {reel.comments.length === 0 && (
                <p className="text-center text-gray-500 pt-16">No comments yet. Be the first!</p>
             )}
        </div>

        <div className="relative p-3 border-t border-gray-700">
            <div className="flex items-center gap-2">
                <img src={currentUser.avatar} alt="current user" className="w-9 h-9 rounded-full" />
                <input 
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                    className="w-full bg-transparent text-sm focus:outline-none"
                />
                {commentText.trim().length > 0 && (
                  <button onClick={handlePostComment} className="text-red-500 font-semibold text-sm">Post</button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCommentsModal;