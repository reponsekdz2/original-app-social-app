import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, User, Message as MessageType } from '../types.ts';
import MessageComponent from '../Message.tsx';
import MessageInput from './MessageInput.tsx';
import Icon from './Icon.tsx';

interface ChatWindowProps {
  currentUser: User;
  conversation: Conversation;
  onSendMessage: (content: string, type: 'text' | 'image' | 'voice', replyTo?: MessageType) => void;
  onDeleteMessage: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, conversation, onSendMessage, onDeleteMessage, onReact, onBack }) => {
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
  const otherUser = conversation.participants.find(p => p.id !== currentUser.id)!;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const handleSend = (content: string, type: 'text' | 'image' | 'voice') => {
    onSendMessage(content, type, replyingTo || undefined);
    setReplyingTo(null);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black">
      <header className="p-3 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
        <div className='flex items-center'>
            <button onClick={onBack} className="md:hidden mr-2 p-1"><Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></Icon></button>
            <img src={otherUser.avatar} alt={otherUser.username} className="w-10 h-10 rounded-full" />
            <p className="font-semibold ml-3">{otherUser.username}</p>
        </div>
        <div className="flex items-center gap-4">
            <button><Icon className="w-6 h-6"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></Icon></button>
            <button><Icon className="w-6 h-6"><path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon></button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map(msg => (
          <MessageComponent
            key={msg.id}
            message={msg}
            currentUser={currentUser}
            participants={conversation.participants}
            onReply={setReplyingTo}
            onDelete={onDeleteMessage}
            onReact={(emoji) => onReact(msg.id, emoji)}
          />
        ))}
        <div ref={messagesEndRef} />
      </main>
      <footer className="border-t border-gray-800">
        <MessageInput 
            onSend={handleSend}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            participants={conversation.participants}
        />
      </footer>
    </div>
  );
};

export default ChatWindow;
