import React from 'react';
import type { Message as MessageType } from './types.ts';

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${isOwnMessage ? 'bg-red-600' : 'bg-gray-700'}`}>
        <p>{message.content}</p>
      </div>
    </div>
  );
};

export default Message;
