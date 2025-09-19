
import React from 'react';
import type { Message, User } from '../types.ts';
import Icon from './Icon.tsx';
import VoicenoteMessage from './VoicenoteMessage.tsx';

interface MessageProps {
  message: Message;
  isCurrentUser: boolean;
  isLastInGroup: boolean;
  sender: User;
  onReply: () => void;
}

const Message: React.FC<MessageProps> = ({ message, isCurrentUser, isLastInGroup, sender, onReply }) => {
  const messageAlignment = isCurrentUser ? 'justify-end' : 'justify-start';
  const bubbleStyles = isCurrentUser
    ? 'bg-red-600 text-white rounded-br-none'
    : 'bg-gray-700 text-white rounded-bl-none';

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="py-2 px-3">{message.content}</p>;
      case 'image':
        return <img src={message.content} alt="sent" className="rounded-lg max-w-xs" />;
      case 'sticker':
        return <img src={message.content} alt="sticker" className="w-32 h-32" />;
      case 'voicenote':
          return <VoicenoteMessage duration="0:15" isCurrentUser={isCurrentUser} />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-end gap-2 group ${messageAlignment}`}>
      {!isCurrentUser && isLastInGroup && (
        <img src={sender.avatar} alt={sender.username} className="w-7 h-7 rounded-full self-end" />
      )}
       {!isCurrentUser && !isLastInGroup && (
        <div className="w-7"></div>
      )}
      <div className={`relative max-w-md rounded-2xl ${message.type === 'text' ? bubbleStyles : ''}`}>
        {renderContent()}
      </div>
       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onReply} className="p-1 hover:bg-gray-700 rounded-full">
            <Icon className="w-4 h-4 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3" /></Icon>
        </button>
      </div>
    </div>
  );
};

export default Message;
