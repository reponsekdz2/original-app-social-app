
import React, { useState } from 'react';
// Fix: Add .ts extension to types import
import type { Reel, User, Comment as CommentType } from '../types.ts';
import Icon from './Icon.tsx';

interface ReelCommentsModalProps {
  reel: Reel;
  currentUser: User;
  onClose: () => void;
  onComment: (reelId: string, text: string) => void;
}

const ReelCommentsModal: React.FC<ReelCommentsModalProps> = ({ reel, currentUser, onClose, onComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(reel.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-end justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-t-2xl w-full max-w-2xl h-[70vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button className="absolute top-2 right-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {reel.comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-3">
              <img src={comment.user.avatar_url} alt={comment.user.username} className="w-9 h-9 rounded-full" />
              <div>
                <p className="text-sm bg-gray-700 p-2 rounded-lg">
                  <span className="font-semibold">{comment.user.username}</span> {comment.text}
                </p>
                <p className="text-xs text-gray-400 mt-1">{new Date(comment.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {reel.comments.length === 0 && (
            <p className="text-center text-gray-500 pt-16">No comments yet.</p>
          )}
        </div>

        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-700 rounded-full p-1">
            <img src={currentUser.avatar_url} alt="current user" className="w-8 h-8 rounded-full" />
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="w-full bg-transparent px-2 focus:outline-none"
            />
            <button type="submit" className="text-red-500 font-semibold px-3 py-1 text-sm disabled:text-gray-500" disabled={!commentText.trim()}>Post</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReelCommentsModal;
