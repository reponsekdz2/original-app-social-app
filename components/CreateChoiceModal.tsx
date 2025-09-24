
import React from 'react';
import Icon from './Icon.tsx';

interface CreateChoiceModalProps {
  onClose: () => void;
  onChoice: (type: 'post' | 'reel' | 'story' | 'live') => void;
}

// Fix: Replaced JSX.Element with React.ReactNode to resolve namespace error.
const ChoiceButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-6 bg-gray-800 hover:bg-gray-700 rounded-lg aspect-square transition-all transform hover:scale-105">
        <div className="w-12 h-12 text-red-500">{icon}</div>
        <span className="mt-2 font-semibold">{label}</span>
    </button>
);


const CreateChoiceModal: React.FC<CreateChoiceModalProps> = ({ onClose, onChoice }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-900 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 flex flex-col animate-modal-intro"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 border-b border-gray-700 relative">
          <h2 className="text-lg font-semibold">Create</h2>
          <button onClick={onClose} className="absolute top-3 right-3"><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
            <ChoiceButton label="Post" onClick={() => onChoice('post')} icon={<Icon><path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></Icon>} />
            <ChoiceButton label="Reel" onClick={() => onChoice('reel')} icon={<Icon><path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon>} />
            <ChoiceButton label="Story" onClick={() => onChoice('story')} icon={<Icon><path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>} />
            <ChoiceButton label="Go Live" onClick={() => onChoice('live')} icon={<Icon><path d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" /></Icon>} />
        </div>
      </div>
    </div>
  );
};

export default CreateChoiceModal;
