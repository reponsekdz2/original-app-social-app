// Fix: Create the MessageInput component.
import React, { useState } from 'react';
import Icon from './Icon.tsx';

interface MessageInputProps {
  onSend: (content: string, type: 'text' | 'like') => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text, 'text');
      setText('');
    }
  };

  const handleLike = () => {
    onSend('❤️', 'like');
  }

  return (
    <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-full px-2 py-1.5">
       <button className="p-1.5 rounded-full hover:bg-gray-700">
            <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V9.75zm6 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V9.75z" /></Icon>
       </button>
      <input 
        type="text" 
        placeholder="Message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        className="flex-1 bg-transparent focus:outline-none"
      />
      {text ? (
        <button onClick={handleSend} className="text-red-500 font-semibold px-2">Send</button>
      ) : (
        <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-full hover:bg-gray-700"><Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon></button>
            <button onClick={handleLike} className="p-1.5 rounded-full hover:bg-gray-700"><Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></Icon></button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
