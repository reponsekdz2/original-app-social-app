import React, { useState } from 'react';
import type { Post, User } from '../types.ts';
import Icon from './Icon.tsx';

interface ShareModalProps {
  post: Post;
  currentUser: User;
  onClose: () => void;
  onShareToUser: (user: User) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, currentUser, onClose, onShareToUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // In a real app, this would be a list of recent conversations or followers
  const suggestedUsers = currentUser.following.slice(0, 5);
  
  const filteredUsers = searchTerm
    ? currentUser.following.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()))
    : suggestedUsers;

  const handleCopyLink = () => {
    // This would be the actual URL of the post
    const postUrl = `${window.location.origin}/p/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">Share</h2>
          <button className="absolute top-2 right-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-700">
             <input
                type="text"
                placeholder="Search for a user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          <p className="text-sm font-semibold p-2">Suggested</p>
          <ul className="divide-y divide-gray-700/50">
            {filteredUsers.map(user => (
              <li key={user.id}>
                <button onClick={() => onShareToUser(user)} className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded-md text-left">
                   <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.username} className="w-11 h-11 rounded-full object-cover" />
                      <p className="font-semibold text-sm">{user.username}</p>
                  </div>
                  <span className="text-sm font-semibold bg-red-600 text-white py-1 px-4 rounded-md">Send</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-t border-gray-700">
            <button onClick={handleCopyLink} className="w-full flex items-center justify-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                <Icon className="w-5 h-5"><path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></Icon>
                <span>{linkCopied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default ShareModal;
