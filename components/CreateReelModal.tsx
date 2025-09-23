import React, { useState, useRef } from 'react';
import Icon from './Icon.tsx';

interface CreateReelModalProps {
  onClose: () => void;
  onCreateReel: (formData: FormData) => void;
}

const CreateReelModal: React.FC<CreateReelModalProps> = ({ onClose, onCreateReel }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!videoFile || isSubmitting) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('caption', caption);
    await onCreateReel(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-modal-intro" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-white text-sm">Cancel</button>
          <h2 className="text-lg font-semibold">Create new reel</h2>
          <button onClick={handleSubmit} disabled={!videoFile || isSubmitting} className="font-semibold text-red-500 hover:text-red-400 text-sm disabled:opacity-50">
            {isSubmitting ? 'Sharing...' : 'Share'}
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          <div className="w-full md:w-1/2 aspect-[9/16] bg-black flex items-center justify-center">
            {preview ? (
                <video src={preview} controls className="max-h-full max-w-full object-contain" />
            ) : (
                <div className="text-center p-4">
                    <Icon className="mx-auto w-16 h-16 text-gray-500"><path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon>
                    <p className="mt-2 text-lg">Select a video file</p>
                    <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-sm">
                        Select From Computer
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="video/*" />
                </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-4 flex flex-col border-t md:border-t-0 md:border-l border-gray-700">
             <textarea 
                placeholder="Write a caption..." 
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="w-full h-full bg-transparent text-sm focus:outline-none resize-none"
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReelModal;