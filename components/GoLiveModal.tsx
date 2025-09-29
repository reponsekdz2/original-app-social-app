import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface GoLiveModalProps {
  onClose: () => void;
  onStartStream: (title: string) => void;
}

const GoLiveModal: React.FC<GoLiveModalProps> = ({ onClose, onStartStream }) => {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleStart = async () => {
        setIsLoading(true);
        try {
            await onStartStream(title);
            // The parent component will handle closing on success
        } catch (error) {
            console.error("Failed to start stream", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 text-center relative">
                    <h2 className="text-lg font-semibold">Go Live</h2>
                     <button className="absolute top-2 right-3" onClick={onClose}>
                        <Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Live Stream Title (Optional)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Q&A Session"
                            className="w-full bg-gray-700 p-2 rounded-md"
                        />
                    </div>
                     <button
                        onClick={handleStart}
                        disabled={isLoading}
                        className="w-full bg-red-600 text-white font-bold py-3 rounded-md mt-4 disabled:bg-gray-600"
                    >
                        {isLoading ? 'Starting...' : 'Start Live Stream'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoLiveModal;
