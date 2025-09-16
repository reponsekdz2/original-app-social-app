import React from 'react';
import Icon from './Icon.tsx';

interface VoicenoteMessageProps {
  duration: string;
  isCurrentUser: boolean;
}

const VoicenoteMessage: React.FC<VoicenoteMessageProps> = ({ duration, isCurrentUser }) => {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-2xl ${isCurrentUser ? 'bg-red-500' : 'bg-gray-600'}`}>
      <button className="text-white">
        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></Icon>
      </button>
      <div className="flex items-center h-5 w-32">
        {/* Simplified waveform */}
        <div className={`w-1 h-2 rounded-full ${isCurrentUser ? 'bg-red-300' : 'bg-gray-400'}`}></div>
        <div className={`w-1 h-4 rounded-full ml-0.5 ${isCurrentUser ? 'bg-red-300' : 'bg-gray-400'}`}></div>
        <div className={`w-1 h-5 rounded-full ml-0.5 ${isCurrentUser ? 'bg-red-300' : 'bg-gray-400'}`}></div>
        <div className={`w-1 h-3 rounded-full ml-0.5 ${isCurrentUser ? 'bg-red-300' : 'bg-gray-400'}`}></div>
        <div className={`w-1 h-4 rounded-full ml-0.5 ${isCurrentUser ? 'bg-red-300' : 'bg-gray-400'}`}></div>
        <div className={`w-1 h-2 rounded-full ml-0.5 ${isCurrentUser ? 'bg-red-300' : 'bg-gray-400'}`}></div>
        <div className="flex-1 h-0.5 bg-red-300 relative ml-1"><div className="absolute -top-0.5 w-1.5 h-1.5 rounded-full bg-white"></div></div>
      </div>
      <span className="text-xs text-white font-mono">{duration}</span>
    </div>
  );
};

export default VoicenoteMessage;
