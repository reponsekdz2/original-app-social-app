// Fix: Create the MessageInput component.
import React, { useState } from 'react';
import Icon from './Icon.tsx';
import type { Message } from '../types';

interface MessageInputProps {
  onSend: (content: string, type: Message['type']) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text, 'text');
      setText('');
    }
  };

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
            <button className="p-1.5 rounded-full hover:bg-gray-700">
              <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></Icon>
            </button>
             <button className="p-1.5 rounded-full hover:bg-gray-700">
                <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-6-6v1.5a4.5 4.5 0 014.5 4.5v1.5a4.5 4.5 0 01-4.5 4.5v-1.5zm-6 0a6 6 0 01-6-6v-1.5a6 6 0 016-6v1.5a4.5 4.5 0 00-4.5 4.5v1.5a4.5 4.5 0 004.5 4.5v-1.5z" /></Icon>
            </button>
            <button onClick={() => {}} className="p-1.5 rounded-full hover:bg-gray-700">
                <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5v-1.5m6-6v-1.5a6 6 0 00-6-6v1.5a4.5 4.5 0 014.5 4.5v1.5a4.5 4.5 0 01-4.5 4.5m-6 0a6 6 0 01-6-6v-1.5m6 7.5v-1.5m-6-6v-1.5a6 6 0 016-6v1.5a4.5 4.5 0 00-4.5 4.5v1.5a4.5 4.5 0 004.5 4.5m12 0a6 6 0 00-6-6v-1.5m0 9v-1.5" /></Icon>
            </button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;