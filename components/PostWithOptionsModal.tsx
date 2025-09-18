import React from 'react';
import type { Post, User } from '../types.ts';
import Icon from './Icon.tsx';

interface PostWithOptionsModalProps {
  post: Post;
  currentUser: User;
  onClose: () => void;
  onUnfollow: (user: User) => void;
  onFollow: (user: User) => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onArchive: (post: Post) => void;
  onReport: (post: Post) => void;
}

const PostWithOptionsModal: React.FC<PostWithOptionsModalProps> = (props) => {
  const { post, currentUser, onClose, onUnfollow, onFollow, onEdit, onDelete, onArchive, onReport } = props;

  const isCurrentUserPost = post.user.id === currentUser.id;
  const isFollowing = currentUser.following.some(u => u.id === post.user.id);

  const userOptions = [
    !isCurrentUserPost && { label: 'Report', action: () => onReport(post), className: 'text-red-500 font-bold' },
    !isCurrentUserPost && (isFollowing 
        ? { label: 'Unfollow', action: () => onUnfollow(post.user), className: 'text-red-500 font-bold' }
        : { label: 'Follow', action: () => onFollow(post.user), className: 'font-bold' }
    ),
  ].filter(Boolean);

  const postOptions = [
    isCurrentUserPost && { label: 'Edit', action: () => onEdit(post) },
    isCurrentUserPost && { label: 'Delete', action: () => onDelete(post), className: 'text-red-500 font-bold' },
    isCurrentUserPost && { label: 'Archive', action: () => onArchive(post) },
    { label: 'Go to post', action: () => {} },
    { label: 'Share to...', action: () => {} },
    { label: 'Copy link', action: () => {} },
    { label: 'About this account', action: () => {} },
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          {userOptions.map((option, index) => (
            <button key={index} onClick={() => { option.action(); onClose(); }} className={`w-full py-3 text-sm hover:bg-gray-700/50 border-b border-gray-700 transition-colors ${option.className || ''}`}>
              {option.label}
            </button>
          ))}
           {postOptions.map((option, index) => (
            <button key={index} onClick={() => { option.action(); onClose(); }} className={`w-full py-3 text-sm hover:bg-gray-700/50 border-b border-gray-700 transition-colors ${option.className || ''}`}>
              {option.label}
            </button>
          ))}
           <button onClick={onClose} className="w-full py-3 text-sm hover:bg-gray-700/50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostWithOptionsModal;
