import React, { useState, useRef } from 'react';
import type { User } from '../types.ts';
import Icon from './Icon.tsx';
import { generateBio } from '../services/geminiService.ts';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (formData: FormData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [website, setWebsite] = useState(user.website || '');
  const [gender, setGender] = useState(user.gender || 'Prefer not to say');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleSave = () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('website', website);
    formData.append('gender', gender);
    if (avatarFile) {
        formData.append('avatar', avatarFile);
    }
    onSave(formData);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const newBio = await generateBio(username, name);
      setBio(newBio);
    } catch (error) {
      console.error("Failed to generate bio:", error);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-white text-sm font-semibold">Cancel</button>
          <h2 className="font-semibold text-lg">Edit Profile</h2>
          <button onClick={handleSave} className="font-semibold text-red-500 hover:text-red-400 text-sm">Done</button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col items-center">
            <img src={avatarPreview} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
            <button onClick={() => fileInputRef.current?.click()} className="text-red-500 font-semibold mt-2">Change profile photo</button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-red-500" 
                />
              </div>
               <div>
                <label className="text-sm text-gray-400">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-red-500" 
                />
              </div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Website</label>
            <input 
              type="text"
              placeholder="Add your website"
              value={website} 
              onChange={e => setWebsite(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-red-500" 
            />
          </div>

           <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-400">Bio</label>
              <button 
                onClick={handleGenerateBio}
                disabled={isGeneratingBio}
                className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 disabled:opacity-50"
              >
                 {isGeneratingBio ? "Generating..." : "✨ Generate with AI"}
              </button>
            </div>
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 mt-1 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-red-500" 
            />
          </div>

           <div>
            <label className="text-sm text-gray-400">Gender</label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value as User['gender'])}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
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
