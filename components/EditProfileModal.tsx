import React, { useState } from 'react';
import type { User } from '../types';
import Icon from './Icon';

interface EditProfileModalProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ currentUser, onUpdateUser, onClose }) => {
  const [formData, setFormData] = useState({
    avatar: currentUser.avatar,
    username: currentUser.username,
    name: currentUser.name,
    bio: currentUser.bio,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <button onClick={onClose}><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
            <h2 className="text-lg font-semibold">Edit Profile</h2>
            <button onClick={handleSubmit} className="font-semibold text-red-500 hover:text-red-400">Done</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex flex-col items-center">
                <img src={formData.avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover mb-2" />
                <label htmlFor="avatar-url" className="text-red-500 font-semibold cursor-pointer text-sm">Change profile photo URL</label>
                <input
                    id="avatar-url"
                    name="avatar"
                    type="text"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Image URL"
                />
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
            </div>
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-400">Bio</label>
                <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                />
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;