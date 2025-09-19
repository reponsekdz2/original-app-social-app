import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface GoLiveModalProps {
  onClose: () => void;
  onStartStream: (title: string) => void;
}

const GoLiveModal: React.FC<GoLiveModalProps> = ({ onClose, onStartStream }) => {
  const [title, setTitle] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">Go Live</h2>
          <button className="absolute top-2 right-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-center text-gray-400 text-sm">Your followers will be notified when you start a live stream.</p>
          <div>
            <label htmlFor="stream-title" className="block text-sm font-medium text-gray-400 mb-1">Stream Title (Optional)</label>
            <input
              id="stream-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Q&A Session, Gaming, etc."
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button 
            onClick={() => onStartStream(title)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-full mt-4 text-lg"
          >
            Go Live
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoLiveModal;