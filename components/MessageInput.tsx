import React, { useState, useRef } from 'react';
import type { Message, User, MessageType } from '../types';
import Icon from './Icon';

interface MessageInputProps {
  onSend: (content: string, type: MessageType) => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
  participants: User[];
}

const ReplyPreview: React.FC<{message: Message, onCancel: () => void, participants: User[]}> = ({ message, onCancel, participants }) => {
    const sender = participants.find(p => p.id === message.senderId);
    return (
        <div className="px-4 pt-2">
            <div className="bg-gray-800 p-2 rounded-lg flex justify-between items-center">
                <div className="border-l-2 border-red-500 pl-2">
                    <p className="text-sm font-semibold text-red-400">Replying to {sender?.username}</p>
                    <p className="text-sm text-gray-300 truncate max-w-xs">{message.type === 'text' ? message.content : `An ${message.type}`}</p>
                </div>
                <button onClick={onCancel} className="p-1 rounded-full hover:bg-gray-700">
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
                </button>
            </div>
        </div>
    )
}


const MessageInput: React.FC<MessageInputProps> = ({ onSend, replyingTo, onCancelReply, participants }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendText = () => {
    if (text.trim()) {
      onSend(text, 'text');
      setText('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSendText();
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSend(event.target.result as string, 'image');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const toggleRecording = () => {
    if(isRecording) {
      // simulate sending a voice note
      onSend('some-voice-note-url', 'voice');
    }
    setIsRecording(!isRecording);
  };

  return (
    <div>
      {replyingTo && <ReplyPreview message={replyingTo} onCancel={onCancelReply} participants={participants} />}
      <div className="flex items-center space-x-2 p-2">
        <button className="p-2 rounded-full hover:bg-gray-800">
          <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0 4.5 4.5 0 010-6.364l6.364-6.364a4.5 4.5 0 016.364 6.364l-6.364 6.364a.75.75 0 01-1.06 0l-2.829-2.828a.75.75 0 011.06-1.06l2.829 2.828a3 3 0 004.242 0 3 3 0 000-4.242l-6.364-6.364a3 3 0 00-4.242 0 3 3 0 000 4.242l6.364 6.364" /></Icon>
        </button>
        <div className="flex-1 bg-gray-800 rounded-full flex items-center px-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Message..."
            className="bg-transparent w-full h-10 focus:outline-none"
          />
           <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-gray-700">
            <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></Icon>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
        {text ? (
             <button onClick={handleSendText} className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white">
                <Icon className="w-6 h-6"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></Icon>
            </button>
        ) : (
             <button onClick={toggleRecording} className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'hover:bg-gray-800'}`}>
                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-6-6v0a6 6 0 00-6 6v1.5" /></Icon>
            </button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
