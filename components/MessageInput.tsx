import React, { useState } from 'react';
import Icon from './Icon.tsx';
import EmojiPicker from './EmojiPicker.tsx';

const MessageInput: React.FC = () => {
  const [text, setText] = useState('');
  const [isPickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="p-4 border-t border-gray-800">
      <div className="relative flex items-center bg-gray-800 rounded-full px-4 py-2">
        <button onClick={() => setPickerOpen(p => !p)}>
          <Icon className="w-6 h-6 text-gray-400 hover:text-white"><path d="M15.182 15.182a4.5 4.5 0 01-6.364 0 4.5 4.5 0 010-6.364l4.95-4.95a3.375 3.375 0 014.773 4.773l-1.976 1.976a1.125 1.125 0 01-1.59 0l-1.591-1.59a.375.375 0 10-.53-.53l1.59-1.591a.375.375 0 000-.53l-4.774-4.773a2.625 2.625 0 00-3.712 3.712l4.95 4.95a1.125 1.125 0 001.59 0l1.976-1.976a2.625 2.625 0 00-3.712-3.712l-4.95 4.95a4.5 4.5 0 006.364 6.364l1.976-1.976a1.125 1.125 0 00-1.59-1.59l-1.976 1.976z" /></Icon>
        </button>
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
          className="bg-transparent w-full focus:outline-none ml-3"
        />
        {isPickerOpen && <div className="absolute bottom-12 left-0"><EmojiPicker onSelectEmoji={(emoji) => setText(p => p+emoji)} /></div>}
      </div>
    </div>
  );
};

export default MessageInput;
