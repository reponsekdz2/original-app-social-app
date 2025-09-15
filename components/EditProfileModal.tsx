import React, { useState } from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');

  const handleSave = () => {
    onSave({ ...user, username, bio });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-white">Cancel</button>
          <h2 className="font-semibold">Edit Profile</h2>
          <button onClick={handleSave} className="font-semibold text-red-500">Done</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-col items-center">
            <img src={user.avatar} alt="avatar" className="w-24 h-24 rounded-full" />
            <button className="text-red-500 font-semibold mt-2">Change profile photo</button>
          </div>
          <div>
            <label className="text-sm text-gray-400">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 mt-1" 
            />
          </div>
           <div>
            <label className="text-sm text-gray-400">Bio</label>
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 mt-1 h-24 resize-none" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
