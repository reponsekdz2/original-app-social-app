import React from 'react';
import type { Post, User } from '../types.ts';

interface PostWithOptionsModalProps {
  post: Post;
  currentUser: User;
  onClose: () => void;
  onUnfollow: (user: User) => void;
  onDelete: (postId: string) => void;
  onEdit: (post: Post) => void;
  onToggleArchive: (post: Post) => void;
  onToggleComments: (postId: string) => void;
  onCopyLink: (postId: string) => void;
}

const PostWithOptionsModal: React.FC<PostWithOptionsModalProps> = ({
  post,
  currentUser,
  onClose,
  onUnfollow,
  onDelete,
  onEdit,
  onToggleArchive,
  onToggleComments,
  onCopyLink,
}) => {
  const isOwnPost = post.user.id === currentUser.id;

  const handleUnfollow = () => {
    onUnfollow(post.user);
    onClose();
  };
  
  const handleEdit = () => {
    onEdit(post);
    onClose();
  };
  
  const handleDelete = () => {
    onDelete(post.id);
    onClose();
  };

  const handleToggleArchive = () => {
    onToggleArchive(post);
    onClose();
  };
  
  const handleCopyLink = () => {
    onCopyLink(post.id);
    onClose();
  }

  const ownPostOptions = [
    { label: post.isArchived ? 'Unarchive' : 'Archive', action: handleToggleArchive, className: '' },
    { label: 'Edit', action: handleEdit, className: '' },
    { label: 'Turn off commenting', action: () => onToggleComments(post.id), className: '' },
    { label: 'Delete', action: handleDelete, className: 'text-red-500 font-bold' },
  ];

  const otherUserPostOptions = [
    { label: 'Unfollow', action: handleUnfollow, className: 'text-red-500 font-bold' },
    { label: 'Add to favorites', action: onClose, className: '' },
    { label: 'Report', action: onClose, className: 'text-red-500' },
  ];

  const commonOptions = [
      { label: 'Copy Link', action: handleCopyLink, className: '' },
      { label: 'Share to...', action: onClose, className: '' },
  ];

  const options = isOwnPost ? ownPostOptions : otherUserPostOptions;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col text-center divide-y divide-gray-700">
          {options.map((option) => (
            <button
              key={option.label}
              onClick={option.action}
              className={`py-3 text-sm ${option.className || ''}`}
            >
              {option.label}
            </button>
          ))}
          {commonOptions.map((option) => (
             <button
              key={option.label}
              onClick={option.action}
              className={`py-3 text-sm ${option.className || ''}`}
            >
              {option.label}
            </button>
          ))}
          <button onClick={onClose} className="py-3 text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PostWithOptionsModal;
