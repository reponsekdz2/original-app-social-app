// Fix: Create the Message component.
import React, { useState } from 'react';
import type { Message as MessageType, User } from './types';
import Icon from './components/Icon';
import VoicenoteMessage from './components/VoicenoteMessage';

interface MessageProps {
  message: MessageType;
  currentUser: User;
  otherUser: User;
  onReply: (message: MessageType) => void;
  onDelete: (messageId: string) => void;
}

const ReplyPreview: React.FC<{ message: MessageType, currentUserId: string, otherUserName: string }> = ({ message, currentUserId, otherUserName }) => {
    const isReplyToSelf = message.senderId === currentUserId;
    return (
        <div className={`text-xs opacity-80 mb-1 px-3`}>
            <p className="text-gray-400">Replying to {isReplyToSelf ? 'yourself' : otherUserName}</p>
            <p className="bg-white/10 rounded p-1 truncate inline-block max-w-full">{message.content}</p>
        </div>
    );
}

const Message: React.FC<MessageProps> = ({ message, currentUser, otherUser, onReply, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCurrentUser = message.senderId === currentUser.id;

  const renderMessageContent = () => {
    switch(message.type) {
        case 'like':
            return <span className="text-4xl px-2 py-1">❤️</span>;
        case 'image':
            return <img src={message.content} alt="image message" className="max-w-xs md:max-w-sm rounded-2xl" />;
        case 'sticker':
             return <img src={message.content} alt="sticker message" className="w-24 h-24" />;
        case 'voicenote':
            return <VoicenoteMessage duration={message.duration || '0:00'} isCurrentUser={isCurrentUser} />;
        case 'text':
        default:
            return (
                 <div 
                    className={`max-w-xs md:max-w-md p-3 rounded-2xl break-words ${isCurrentUser ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}
                >
                    <p>{message.content}</p>
                </div>
            );
    }
  }

  return (
    <div>
        <div 
            className={`flex items-end gap-2 group ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
        {!isCurrentUser && <img src={otherUser.avatar} alt={otherUser.username} className="w-8 h-8 rounded-full self-end mb-1" />}
        
        {isCurrentUser && (
            <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <button onClick={() => onReply(message)} className="p-1 rounded-full hover:bg-gray-700"><Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></Icon></button>
                <button onClick={() => onDelete(message.id)} className="p-1 rounded-full hover:bg-gray-700"><Icon className="w-5 h-5 text-gray-400"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></Icon></button>
            </div>
        )}

        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
            {message.replyTo && <ReplyPreview message={message.replyTo} currentUserId={currentUser.id} otherUserName={otherUser.username} />}
            {renderMessageContent()}
            <p className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</p>
        </div>

        {!isCurrentUser && (
             <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <button className="p-1 rounded-full hover:bg-gray-700"><Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 9.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V9.75zm6 0a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V9.75z" /></Icon></button>
                 <button onClick={() => onReply(message)} className="p-1 rounded-full hover:bg-gray-700"><Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></Icon></button>
            </div>
        )}

        </div>
    </div>
  );
};

export default Message;