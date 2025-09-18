
// Fix: Create the MessageInput component.
import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon.tsx';
// Fix: Corrected import path for types and added extension
import type { Message } from '../types.ts';
import EmojiStickerPanel from './EmojiStickerPanel.tsx';
// Fix: Corrected import path for socketService
import { socketService } from '../services/socketService.ts';

interface MessageInputProps {
  onSend: (content: string, type: Message['type']) => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, replyingTo, onCancelReply, conversationId }) => {
  const [text, setText] = useState('');
  const [isEmojiPanelOpen, setEmojiPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setEmojiPanelOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    
    if (!socketService.socket) return;

    if (!typingTimeoutRef.current) {
        socketService.emit('typing', conversationId);
    }
    
    if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
        socketService.emit('stop_typing', conversationId);
        typingTimeoutRef.current = null;
    }, 2000); // 2 seconds of inactivity
  };


  const handleSendText = () => {
    if (text.trim()) {
      onSend(text, 'text');
      setText('');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socketService.emit('stop_typing', conversationId);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real app, you would upload the file to a server and get a URL.
        // For now, we'll use the base64 data URL as a mock.
        onSend(reader.result as string, 'image');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSendVoicenote = () => {
    onSend('#', 'voicenote');
  };

  const handleSelectEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
  };
  
  const handleSelectSticker = (stickerUrl: string) => {
    onSend(stickerUrl, 'sticker');
    setEmojiPanelOpen(false);
  };

  return (
    <div className="relative">
      {replyingTo && (
        <div className="bg-gray-800 rounded-t-lg p-2 px-4 text-sm border-b-2 border-red-500">
            <div className="flex justify-between items-center">
                <p className="text-gray-300">Replying to <span className="font-semibold">{replyingTo.senderId}</span></p>
                <button onClick={onCancelReply} className="p-1"><Icon className="w-4 h-4 text-gray-400"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
            </div>
            <p className="text-gray-400 truncate bg-black/20 p-1 rounded-md mt-1">{replyingTo.content}</p>
        </div>
      )}
      <div className="relative" ref={panelRef}>
        {isEmojiPanelOpen && (
          <div className="absolute bottom-full mb-2">
              <EmojiStickerPanel 
                  onSelectEmoji={handleSelectEmoji}
                  onSelectSticker={handleSelectSticker}
              />
          </div>
        )}
        <div className={`flex items-center gap-3 bg-gray-800 border border-gray-700 ${replyingTo ? 'rounded-b-full' : 'rounded-full'} px-2 py-1.5`}>
          <button onClick={() => setEmojiPanelOpen(p => !p)} className="p-1.5 rounded-full hover:bg-gray-700">
                <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V9.75zm6 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V9.75z" /></Icon>
          </button>
          <input 
            type="text" 
            placeholder="Message..."
            value={text}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
            className="flex-1 bg-transparent focus:outline-none"
          />
          {text ? (
            <button onClick={handleSendText} className="text-red-500 font-semibold px-2">Send</button>
          ) : (
            <div className="flex items-center gap-1">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-full hover:bg-gray-700" aria-label="Attach file">
                  <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.735l-7.662 7.662a4.5 4.5 0 01-6.364-6.364l7.662-7.662a3 3 0 014.242 4.242l-7.662 7.662a1.5 1.5 0 01-2.121-2.121l7.662-7.662" /></Icon>
                </button>
                <button onClick={handleSendVoicenote} className="p-1.5 rounded-full hover:bg-gray-700" aria-label="Record voice note">
                    <Icon className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 00.75-.75V6.75a.75.75 0 00-1.5 0v11.25a.75.75 0 00.75.75zM8.25 12a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3A.75.75 0 018.25 12zM15.75 12a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5h-.008a.75.75 0 01-.75-.75z" /></Icon>
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
