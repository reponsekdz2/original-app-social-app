// Fix: Create MessageInput component.
import React, { useState } from 'react';
import type { Message, User } from '../types';
import Icon from './Icon';

interface MessageInputProps {
  onSend: (content: string, type: 'text' | 'image' | 'voice') => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
  participants: User[];
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, replyingTo, onCancelReply, participants }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text, 'text');
      setText('');
    }
  };
  
  const replyingToUser = replyingTo ? participants.find(p => p.id === replyingTo.senderId) : null;

  return (
    <div className="p-4">
        {replyingTo && (
            <div className="bg-gray-700 p-2 rounded-t-lg text-sm flex justify-between items-center">
                <div>
                    <p className="font-bold">Replying to {replyingToUser?.username}</p>
                    <p className="text-gray-300 truncate">{replyingTo.content}</p>
                </div>
                <button onClick={onCancelReply}><Icon className="w-5 h-5"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
            </div>
        )}
      <form onSubmit={handleSubmit} className="flex items-center space-x-3 bg-gray-800 rounded-full px-4 py-2">
        <Icon className="w-6 h-6 text-gray-400"><path d="M12 2a3 3 0 00-3 3v6a3 3 0 106 0V5a3 3 0 00-3-3zM10.5 15.5v-1.5a5.5 5.5 0 0111 0v1.5" /></Icon>
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message..."
          className="bg-transparent w-full focus:outline-none"
        />
        {text ? (
          <button type="submit" className="text-red-500 font-semibold">Send</button>
        ) : (
          <div className="flex items-center space-x-2">
            <Icon className="w-6 h-6 text-gray-400 cursor-pointer"><path d="M12 2a3 3 0 00-3 3v6a3 3 0 106 0V5a3 3 0 00-3-3zM10.5 15.5v-1.5a5.5 5.5 0 0111 0v1.5" /></Icon>
            <Icon className="w-6 h-6 text-gray-400 cursor-pointer"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></Icon>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
