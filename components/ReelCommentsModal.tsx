import React, { useState } from 'react';
import type { Reel as ReelType, User } from '../types.ts';
import Icon from './Icon.tsx';

interface ReelCommentsModalProps {
  reel: ReelType;
  currentUser: User;
  onClose: () => void;
  onComment: (reelId: string, text: string) => void;
  onViewProfile: (user: User) => void;
}

const ReelCommentsModal: React.FC<ReelCommentsModalProps> = ({ reel, currentUser, onClose, onComment, onViewProfile }) => {
  const [commentText, setCommentText] = useState('');

  const handlePostComment = () => {
    if (commentText.trim()) {
      onComment(reel.id, commentText);
      setCommentText('');
    }
  };

  const handleViewProfileAndClose = (user: User) => {
    onViewProfile(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button className="absolute top-2 right-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {reel.comments.length > 0 ? reel.comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-3">
              <img src={comment.user.avatar} alt={comment.user.username} className="w-9 h-9 rounded-full object-cover cursor-pointer" onClick={() => handleViewProfileAndClose(comment.user)} />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold cursor-pointer" onClick={() => handleViewProfileAndClose(comment.user)}>{comment.user.username}</span>{' '}
                  {comment.text}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>{comment.timestamp}</span>
                  {comment.likes > 0 && <span className="font-semibold">{comment.likes} likes</span>}
                  <button className="font-semibold">Reply</button>
                </div>
              </div>
              <button className="mt-2">
                <Icon className={`w-4 h-4 ${comment.likedByUser ? 'text-red-500' : 'text-gray-400'}`} fill={comment.likedByUser ? 'currentColor' : 'none'}>
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </Icon>
              </button>
            </div>
          )) : (
            <p className="text-center text-gray-500 py-8">No comments yet.</p>
          )}
        </div>
        <div className="p-3 border-t border-gray-700">
           <div className="relative flex items-center">
              <img src={currentUser.avatar} alt="current user avatar" className="w-8 h-8 rounded-full mr-3" />
              <input 
                  type="text" 
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                  className="w-full bg-transparent text-sm focus:outline-none"
              />
              {commentText && <button onClick={handlePostComment} className="text-red-500 font-semibold text-sm">Post</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelCommentsModal;