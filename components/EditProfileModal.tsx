

import React, { useState } from 'react';
import type { User } from '../types';
import Icon from './Icon.tsx';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (data: { name: string; bio: string; website: string; gender: string }) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [website, setWebsite] = useState(user.website || '');
  const [gender, setGender] = useState((user as any).gender || 'Prefer not to say');

  const handleSave = () => {
    onSave({ name, bio, website, gender });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-sm">Cancel</button>
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button onClick={handleSave} className="text-sm font-semibold text-red-500">Done</button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
           <div className="flex items-center gap-6">
                <div className="relative">
                    <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold">{user.username}</h3>
                    <button className="text-sm font-semibold text-red-400 mt-1">Change photo</button>
                </div>
           </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 resize-none" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
                <input type="text" value={website} onChange={e => setWebsite(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2">
                    <option>Prefer not to say</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;