import React, { useState } from 'react';
import Icon from './Icon.tsx';
import EmojiPicker from './EmojiPicker.tsx';

interface MessageInputProps {
    onSend: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [isPickerOpen, setPickerOpen] = useState(false);

  const hasText = text.trim().length > 0;

  const handleSend = () => {
    if (hasText) {
        onSend(text);
        setText('');
        setPickerOpen(false);
    }
  };

  return (
    <div className="p-3 border-t border-gray-800">
      <div className="relative flex items-center gap-2">
        <button className="p-2 text-red-500 hover:bg-gray-800 rounded-full">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></Icon>
        </button>
        <button className="p-2 text-red-500 hover:bg-gray-800 rounded-full">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.735l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l7.693-7.693a3.375 3.375 0 014.773 4.773l-7.693 7.693a1.125 1.125 0 01-1.591-1.591l7.693-7.693" /></Icon>
        </button>
        <div className="relative flex-1">
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Aa"
            className="bg-gray-800 w-full rounded-full py-2 pl-4 pr-10 focus:outline-none"
          />
          <button onClick={() => setPickerOpen(p => !p)} className="absolute right-2 top-1/2 -translate-y-1/2">
            <Icon className="w-6 h-6 text-gray-400 hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>
          </button>
           {isPickerOpen && <div className="absolute bottom-12 right-0"><EmojiPicker onSelectEmoji={(emoji) => setText(p => p+emoji)} /></div>}
        </div>
        {hasText ? (
            <button onClick={handleSend} className="p-2 text-red-500 hover:bg-gray-800 rounded-full">
                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z" /></Icon>
            </button>
        ) : (
            <button className="p-2 text-red-500 hover:bg-gray-800 rounded-full">
                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-6-6v0a6 6 0 00-6 6v1.5m12 0v.001" /></Icon>
            </button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
