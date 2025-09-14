import React, { useState } from 'react';
import type { Message, User } from '../types';
import Icon from './components/Icon';

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
  participants: User[];
  onReply: (message: Message) => void;
  onDelete: (messageId: string) => void;
}

const MessageContent: React.FC<{message: Message}> = ({ message }) => {
  switch (message.type) {
    case 'image':
      return <img src={message.content} alt="User upload" className="rounded-lg max-w-xs object-cover" />;
    case 'voice':
      return (
        <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.254 9.254 9 9.563 9h4.874c.31 0 .563.254.563.563v4.874c0 .31-.254.563-.563.563H9.563A.563.563 0 019 14.437V9.563z" /></Icon>
            <div className="w-32 h-1 bg-gray-500 rounded-full"></div>
            <span className="text-xs">0:08</span>
        </div>
      );
    case 'text':
    default:
      return <p>{message.content}</p>;
  }
};

const QuotedReply: React.FC<{message: Message, participants: User[]}> = ({ message, participants }) => {
    const sender = participants.find(p => p.id === message.senderId);
    if (!sender) return null;
    return (
        <div className="border-l-2 border-red-500 pl-2 opacity-70 mb-1">
            <p className="text-xs font-semibold">{sender.username}</p>
            <p className="text-xs truncate max-w-xs">{message.type === 'text' ? message.content : `Sent an ${message.type}`}</p>
        </div>
    )
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwnMessage, participants, onReply, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const sender = participants.find(p => p.id === message.senderId);
  const bubbleClasses = isOwnMessage
    ? 'bg-red-600 rounded-br-none ml-auto'
    : 'bg-gray-700 rounded-bl-none';

  return (
    <div 
        className={`flex items-end gap-2 group ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        {!isOwnMessage && (
            <img src={sender?.avatar} alt={sender?.username} className="w-8 h-8 rounded-full self-start" />
        )}
      <div className={`flex flex-col max-w-md ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div className={`p-3 rounded-2xl ${bubbleClasses}`}>
            {message.replyTo && <QuotedReply message={message.replyTo} participants={participants} />}
            <MessageContent message={message} />
        </div>
        <p className="text-xs text-gray-500 mt-1 px-1">{message.timestamp}</p>
      </div>

       <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button onClick={() => onReply(message)} className="p-1.5 rounded-full hover:bg-gray-700">
              <Icon className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3" /></Icon>
          </button>
          {isOwnMessage && (
              <button onClick={() => onDelete(message.id)} className="p-1.5 rounded-full hover:bg-gray-700">
                  <Icon className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></Icon>
              </button>
          )}
      </div>
    </div>
  );
};

export default MessageItem;