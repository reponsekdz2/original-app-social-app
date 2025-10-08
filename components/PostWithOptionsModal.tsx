import React from 'react';
import type { Post, User } from '../types.ts';
import Icon from './Icon.tsx';

interface PostWithOptionsModalProps {
  post: Post;
  currentUser: User;
  onClose: () => void;
  onUnfollow: (userId: string) => void;
  onFollow: (userId: string) => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onArchive: (post: Post) => void;
  onUnarchive?: (post: Post) => void;
  onReport: (content: Post | User) => void;
  onShare: (post: Post) => void;
  onCopyLink: () => void;
  onViewProfile: (user: User) => void;
  onGoToPost: (post: Post) => void;
  onPinPost: (postId: string) => void;
  onTip: (post: Post) => void;
}

const PostWithOptionsModal: React.FC<PostWithOptionsModalProps> = (props) => {
  const { post, currentUser, onClose, onUnfollow, onFollow, onEdit, onDelete, onArchive, onUnarchive, onReport, onShare, onCopyLink, onViewProfile, onGoToPost, onPinPost, onTip } = props;

  const isCurrentUserPost = post.user.id === currentUser.id;
  const isFollowing = currentUser.following?.some(u => u.id === post.user.id) || false;

  const options = [
    // --- Destructive/Moderation Actions ---
    !isCurrentUserPost && { label: 'Report', action: () => onReport(post), className: 'text-blue-600 font-bold' },
    isCurrentUserPost && { label: 'Delete', action: () => onDelete(post), className: 'text-blue-600 font-bold' },
    !isCurrentUserPost && isFollowing && { label: 'Unfollow', action: () => onUnfollow(post.user.id), className: 'text-blue-600 font-bold' },

    // --- User-Specific Actions ---
    isCurrentUserPost && { label: post.is_pinned ? 'Unpin from profile' : 'Pin to profile', action: () => onPinPost(post.id) },
    isCurrentUserPost && { label: 'Edit', action: () => onEdit(post) },
    isCurrentUserPost && (post.isArchived 
        ? { label: 'Unarchive', action: () => onUnarchive && onUnarchive(post) }
        : { label: 'Archive', action: () => onArchive(post) }
    ),
    !isCurrentUserPost && !isFollowing && { label: 'Follow', action: () => onFollow(post.user.id), className: 'font-bold' },

    // --- General Actions ---
    !isCurrentUserPost && { label: 'Tip Author', action: () => onTip(post) },
    { label: 'Go to post', action: () => onGoToPost(post) },
    { label: 'Share to...', action: () => onShare(post) },
    { label: 'Copy link', action: onCopyLink },
    { label: 'About this account', action: () => onViewProfile(post.user) },
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-sm border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          {options.map((option, index) => (
            <button 
              key={index} 
              onClick={() => { if(option && option.action) option.action(); onClose(); }} 
              className={`w-full py-3 text-sm hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors ${option ? option.className || '' : ''}`}
            >
              {option ? option.label : ''}
            </button>
          ))}
           <button onClick={onClose} className="w-full py-3 text-sm hover:bg-gray-100 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostWithOptionsModal;