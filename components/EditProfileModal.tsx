import React, { useState, useRef } from 'react';
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
    website: currentUser.website || '',
    gender: currentUser.gender || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
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
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
            <button onClick={onClose}><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
            <h2 className="text-lg font-semibold">Edit Profile</h2>
            <button onClick={handleSubmit} className="font-semibold text-red-500 hover:text-red-400">Done</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            <div className="flex flex-col items-center">
                <img src={formData.avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover mb-2" />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="text-red-500 font-semibold cursor-pointer text-sm"
                >
                  Change profile photo
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/*"
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
                <label htmlFor="website" className="block text-sm font-medium text-gray-400">Website</label>
                <input
                    id="website"
                    name="website"
                    type="text"
                    value={formData.website}
                    placeholder="e.g. https://my-portfolio.com"
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
             <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-400">Gender</label>
                <input
                    id="gender"
                    name="gender"
                    type="text"
                    value={formData.gender}
                    placeholder="Prefer not to say"
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                 <p className="text-xs text-gray-500 mt-1">This won't be part of your public profile.</p>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;