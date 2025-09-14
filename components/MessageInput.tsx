// Fix: Create the MessageInput component.
import React, { useState } from 'react';
import type { Message, User } from '../types';
import Icon from './Icon';

interface MessageInputProps {
    onSend: (content: string, type: 'text') => void;
    replyingTo: Message | null;
    onCancelReply: () => void;
    participants: User[];
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, replyingTo, onCancelReply }) => {
    const [text, setText] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSend(text, 'text');
            setText('');
        }
    };

    return (
        <div>
            {replyingTo && (
                <div className="bg-gray-700 p-2 text-sm flex justify-between items-center">
                    <div>
                        <p className="font-bold">Replying to {replyingTo.senderId}</p>
                        <p className="text-gray-300 truncate">{replyingTo.content}</p>
                    </div>
                    <button onClick={onCancelReply}><Icon className="w-5 h-5"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
                </div>
            )}
            <form onSubmit={handleSend} className="p-4 flex items-center space-x-3">
                <Icon className="w-6 h-6 cursor-pointer hover:text-gray-400"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 1.5a8.25 8.25 0 110 16.5 8.25 8.25 0 010-16.5zM8.625 9.375a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125.375a.375.375 0 10-.75 0 .375.375 0 00.75 0zm4.125-.375a.375.375 0 11-.75 0 .375.375 0 01.75 0z" clipRule="evenodd" /></Icon>
                <input 
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-gray-700 rounded-full px-4 py-2 focus:outline-none"
                />
                 {text.trim() ? (
                    <button type="submit" className="text-red-500 font-semibold hover:text-red-400">
                        Send
                    </button>
                 ) : (
                    <div className="flex items-center space-x-2">
                         <Icon className="w-6 h-6 cursor-pointer hover:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a9.75 9.75 0 009.435-8.246 3.75 3.75 0 00-6.81-2.055 3.75 3.75 0 00-1.226-5.532.75.75 0 00-.63.018 3.75 3.75 0 00-5.416 3.992A9.75 9.75 0 0012 18.375z" /></Icon>
                         <Icon className="w-6 h-6 cursor-pointer hover:text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" /></Icon>
                    </div>
                 )}
            </form>
        </div>
    );
};

export default MessageInput;
