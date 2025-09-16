// Fix: Create the MessageInput component.
import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon.tsx';
import type { Message } from '../types';
import EmojiStickerPanel from './EmojiStickerPanel.tsx';

interface MessageInputProps {
  onSend: (content: string, type: Message['type']) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [isEmojiPanelOpen, setEmojiPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setEmojiPanelOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendText = () => {
    if (text.trim()) {
      onSend(text, 'text');
      setText('');
    }
  };

  const handleSelectEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
  };
  
  const handleSelectSticker = (stickerUrl: string) => {
    onSend(stickerUrl, 'sticker');
    setEmojiPanelOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      {isEmojiPanelOpen && (
        <div className="absolute bottom-full mb-2">
            <EmojiStickerPanel 
                onSelectEmoji={handleSelectEmoji}
                onSelectSticker={handleSelectSticker}
            />
        </div>
      )}
      <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-full px-2 py-1.5">
        <button onClick={() => setEmojiPanelOpen(p => !p)} className="p-1.5 rounded-full hover:bg-gray-700">
              <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V9.75zm6 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V9.75z" /></Icon>
        </button>
        <input 
          type="text" 
          placeholder="Message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
          className="flex-1 bg-transparent focus:outline-none"
        />
        {text ? (
          <button onClick={handleSendText} className="text-red-500 font-semibold px-2">Send</button>
        ) : (
          <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-full hover:bg-gray-700" aria-label="Attach file">
                <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.735l-7.662 7.662a4.5 4.5 0 01-6.364-6.364l7.662-7.662a3 3 0 014.242 4.242l-7.662 7.662a1.5 1.5 0 01-2.121-2.121l7.662-7.662" /></Icon>
              </button>
              <button className="p-1.5 rounded-full hover:bg-gray-700" aria-label="Send image">
                <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></Icon>
              </button>
              <button className="p-1.5 rounded-full hover:bg-gray-700" aria-label="Record voice note">
                  <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 00.75-.75V6.75a.75.75 0 00-1.5 0v11.25a.75.75 0 00.75.75zM8.25 12a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3A.75.75 0 018.25 12zM15.75 12a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5h-.008a.75.75 0 01-.75-.75z" /></Icon>
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;