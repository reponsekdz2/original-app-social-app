import React from 'react';
import type { Conversation, User } from '../types.ts';
import Message from '../Message.tsx';
import MessageInput from './MessageInput.tsx';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser }) => {
  const otherUser = conversation.participants.find(p => p.id !== currentUser.id)!;
  
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <img src={otherUser.avatar} alt={otherUser.username} className="w-10 h-10 rounded-full" />
        <h2 className="font-semibold">{otherUser.username}</h2>
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {conversation.messages.map(msg => (
          <Message key={msg.id} message={msg} isOwnMessage={msg.senderId === currentUser.id} />
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
