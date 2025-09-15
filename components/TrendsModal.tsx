import React from 'react';
import Icon from './Icon.tsx';

interface TrendsModalProps {
  topics: string[];
  onClose: () => void;
}

const TrendsModal: React.FC<TrendsModalProps> = ({ topics, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700 flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 text-center relative">
          <h2 className="text-lg font-semibold">Trends for you</h2>
          <button className="absolute top-2 right-3" onClick={onClose}>
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
          </button>
        </div>
        <div className="overflow-y-auto">
          {topics.map((topic, index) => (
            <div key={index} className="p-3 hover:bg-gray-700 cursor-pointer">
              <p className="text-xs text-gray-500">Trending in your location</p>
              <p className="font-semibold">{topic}</p>
              <p className="text-xs text-gray-500">{Math.floor(Math.random() * 20 + 5)}k posts</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendsModal;