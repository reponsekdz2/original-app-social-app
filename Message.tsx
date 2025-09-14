// Fix: Create the Message component.
import React from 'react';
import type { Message, User } from './types';

interface MessageComponentProps {
  message: Message;
  currentUser: User;
  participants: User[];
  onReply: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onReact: (emoji: string) => void;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ message, currentUser, participants, onReply, onDelete, onReact }) => {
  const isCurrentUser = message.senderId === currentUser.id;
  const sender = participants.find(p => p.id === message.senderId);

  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <img src={sender?.avatar} alt={sender?.username} className="w-8 h-8 rounded-full" />
      )}
      <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-red-600 rounded-br-md' : 'bg-gray-800 rounded-bl-md'}`}>
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-red-200' : 'text-gray-400'} text-right`}>{message.timestamp}</p>
      </div>
    </div>
  );
};

export default MessageComponent;
