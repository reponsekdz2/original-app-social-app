// Fix: Create the Message component.
import React from 'react';
import type { Message as MessageType, User } from './types';

interface MessageProps {
  message: MessageType;
  currentUser: User;
  otherUser: User;
}

const Message: React.FC<MessageProps> = ({ message, currentUser, otherUser }) => {
  const isCurrentUser = message.senderId === currentUser.id;

  if (message.type === 'like') {
     return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-4xl">❤️</span>
        </div>
     );
  }

  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && <img src={otherUser.avatar} alt={otherUser.username} className="w-8 h-8 rounded-full" />}
      <div 
        className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-red-600 text-white rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default Message;
