import React, { useState, useRef } from 'react';
import Icon from './Icon.tsx';
import type { User } from '../types.ts';
import * as api from '../services/apiService.ts';

interface CreatePostModalProps {
  onClose: () => void;
  onCreatePost: (formData: FormData) => void;
  allUsers: User[];
  currentUser: User;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onCreatePost, allUsers, currentUser }) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTool, setActiveTool] = useState<'caption' | 'poll' | 'collab'>('caption');

  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [collabSearch, setCollabSearch] = useState('');

  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [captionSuggestions, setCaptionSuggestions] = useState<string[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      setMediaFiles(files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
      setCaptionSuggestions([]);
      setGenerationError(null);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || mediaFiles.length === 0) return;
    setIsSubmitting(true);

    const formData = new FormData();
    mediaFiles.forEach(file => formData.append('media', file));
    formData.append('caption', caption);
    formData.append('location', location);

    if (activeTool === 'poll' && pollQuestion.trim() && pollOptions.every(o => o.trim())) {
      formData.append('pollQuestion', pollQuestion);
      formData.append('pollOptions', JSON.stringify(pollOptions.map(o => o.trim())));
    }
    
    if (collaborators.length > 0) {
        formData.append('collaborators', JSON.stringify(collaborators.map(c => c.id)));
    }

    await onCreatePost(formData);
    setIsSubmitting(false);
  };

  const handleGenerateCaption = async () => {
    if (mediaFiles.length === 0 || !mediaFiles[0].type.startsWith('image/')) return;
    setIsGeneratingCaption(true);
    setCaptionSuggestions([]);
    setGenerationError(null);
    try {
      const formData = new FormData();
      formData.append('image', mediaFiles[0]);
      const response = await api.generateCaptionSuggestions(formData);
      setCaptionSuggestions(response.suggestions);
    } catch (error) {
      console.error(error);
      setGenerationError("Could not generate captions. Please try again.");
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };
  
  const addPollOption = () => {
      if (pollOptions.length < 4) setPollOptions([...pollOptions, '']);
  }

  const removePollOption = (index: number) => {
      if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, i) => i !== index));
  }

  const filteredUsers = collabSearch
    ? allUsers.filter(u => u.username.toLowerCase().includes(collabSearch.toLowerCase()) && u.id !== currentUser.id && !collaborators.some(c => c.id === u.id))
    : [];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-modal-intro" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-white text-sm">Cancel</button>
          <h2 className="text-lg font-semibold">Create new post</h2>
          <button onClick={handleSubmit} disabled={mediaFiles.length === 0 || isSubmitting} className="font-semibold text-red-500 hover:text-red-400 text-sm disabled:opacity-50">
            {isSubmitting ? 'Sharing...' : 'Share'}
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          <div className="w-full md:w-1/2 aspect-square bg-black flex items-center justify-center">
            {previews.length > 0 ? (
                <img src={previews[0]} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : (
                <div className="text-center p-4">
                    <Icon className="mx-auto w-16 h-16 text-gray-500"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></Icon>
                    <p className="mt-2 text-lg">Drag photos and videos here</p>
                    <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-sm">
                        Select From Computer
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept="image/*,video/*" />
                </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-4 flex flex-col border-t md:border-t-0 md:border-l border-gray-700">
             {activeTool === 'caption' && (
                <div className="flex-1 flex flex-col">
                    <textarea 
                        placeholder="Write a caption..." 
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        className="w-full flex-1 bg-transparent text-sm focus:outline-none resize-none"
                    />
                     <div className="mt-2">
                        <button onClick={handleGenerateCaption} disabled={isGeneratingCaption || mediaFiles.length === 0 || !mediaFiles[0].type.startsWith('image/')} className="text-sm flex items-center gap-1 font-semibold text-red-400 disabled:text-gray-500">
                           ✨ {isGeneratingCaption ? 'Generating...' : 'Magic Compose'}
                        </button>
                        {generationError && <p className="text-xs text-red-400 mt-1">{generationError}</p>}
                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                            {captionSuggestions.map((s, i) => (
                                <button key={i} onClick={() => setCaption(s)} className="block w-full text-left p-2 bg-gray-800 hover:bg-gray-700 rounded-md text-xs">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
             )}
             {activeTool === 'poll' && (
                 <div className="space-y-2">
                    <input type="text" placeholder="Poll question..." value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} className="w-full bg-gray-800 p-2 rounded-md" />
                    {pollOptions.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                             <input type="text" placeholder={`Option ${i+1}`} value={opt} onChange={e => handlePollOptionChange(i, e.target.value)} className="w-full bg-gray-800 p-2 rounded-md" />
                             {i > 1 && <button onClick={() => removePollOption(i)}><Icon className="w-5 h-5"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>}
                        </div>
                    ))}
                    {pollOptions.length < 4 && <button onClick={addPollOption} className="text-sm text-red-400">Add option</button>}
                 </div>
             )}
             {activeTool === 'collab' && (
                 <div>
                     <input type="text" placeholder="Search for collaborators..." value={collabSearch} onChange={e => setCollabSearch(e.target.value)} className="w-full bg-gray-800 p-2 rounded-md" />
                     <div className="my-2 space-y-1">
                         {collaborators.map(c => <div key={c.id} className="text-sm bg-red-500/50 p-1 rounded-md">{c.username}</div>)}
                     </div>
                     <div className="max-h-48 overflow-y-auto">
                        {filteredUsers.map(u => <div key={u.id} onClick={() => { setCollaborators([...collaborators, u]); setCollabSearch(''); }} className="p-2 hover:bg-gray-800 cursor-pointer">{u.username}</div>)}
                     </div>
                 </div>
             )}
             <div className="border-t border-gray-700 mt-auto pt-2">
                <div className="flex items-center justify-between">
                     <input 
                        type="text" 
                        placeholder="Add location" 
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full bg-transparent text-sm focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                        <button onClick={() => setActiveTool('poll')}><Icon className={`w-6 h-6 ${activeTool === 'poll' ? 'text-red-500' : ''}`}><path d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></Icon></button>
                        <button onClick={() => setActiveTool('collab')}><Icon className={`w-6 h-6 ${activeTool === 'collab' ? 'text-red-500' : ''}`}><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM3.75 18.75a3 3 0 002.72-4.682A9.095 9.095 0 0018 18.72m0 0a9 9 0 00-9-9 9 9 0 00-9 9m18 0h-3.375a9.06 9.06 0 00-1.5-3.375m-1.5 3.375a9.06 9.06 0 01-1.5-3.375m0 0a9 9 0 01-9-9" /></Icon></button>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;