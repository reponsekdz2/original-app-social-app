import React, { useState, useEffect } from 'react';
import type { Conversation, User } from '../types.ts';
import Message from '../Message.tsx';
import MessageInput from './MessageInput.tsx';
import Icon from './Icon.tsx';
import TypingIndicator from './TypingIndicator.tsx';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (conversationId: string, content: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onSendMessage }) => {
  const otherUser = conversation.participants.find(p => p.id !== currentUser.id)!;
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    // If the last message is from the current user, simulate a reply
    if (lastMessage && lastMessage.senderId === currentUser.id) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000 + Math.random() * 2000); // Simulate typing for 2-4 seconds

      return () => clearTimeout(timer);
    }
  }, [conversation.messages, currentUser.id]);

  const handleSend = (text: string) => {
    onSendMessage(conversation.id, text);
  };
  
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-gray-800 flex items-center gap-3">
        <img src={otherUser.avatar} alt={otherUser.username} className="w-10 h-10 rounded-full" />
        <h2 className="font-semibold">{otherUser.username}</h2>
        <div className="ml-auto flex items-center gap-4">
            <button className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-gray-800">
                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></Icon>
            </button>
            <button className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-gray-800">
                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon>
            </button>
        </div>
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {conversation.messages.map(msg => (
          <Message key={msg.id} message={msg} isOwnMessage={msg.senderId === currentUser.id} />
        ))}
        {isTyping && <TypingIndicator user={otherUser} />}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
