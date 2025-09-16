
// Fix: Create the ChatWindow component.
import React, { useState } from 'react';
import type { Conversation, User, Message as MessageType } from '../types';
import Icon from './Icon';
import Message from '../Message';
import MessageInput from './MessageInput';
import ChatSettingsPanel from './ChatSettingsPanel';
import VerifiedBadge from './VerifiedBadge';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (conversationId: string, message: Omit<MessageType, 'id' | 'senderId' | 'timestamp'>) => void;
  onViewProfile: (user: User) => void;
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onSendMessage, onViewProfile, onBack }) => {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);

  if (!otherParticipant) return <div>Conversation error</div>;

  const handleSendMessage = (content: string, type: MessageType['type']) => {
    onSendMessage(conversation.id, { content, type });
  };
  
  return (
    <div className="flex-1 flex flex-col bg-gray-900 h-full relative">
       <header className="p-3 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <button onClick={onBack} className="lg:hidden p-1 -ml-1">
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
                 </button>
                <div onClick={() => onViewProfile(otherParticipant)} className="flex items-center gap-3 cursor-pointer">
                    <img src={otherParticipant.avatar} alt={otherParticipant.username} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-semibold text-sm flex items-center gap-1">{otherParticipant.username} {otherParticipant.isVerified && <VerifiedBadge className="w-3 h-3"/>}</p>
                        <p className="text-xs text-gray-400">Active now</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></Icon>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon>
                </button>
                <button onClick={() => setSettingsOpen(p => !p)} className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></Icon>
                </button>
            </div>
       </header>
       <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.messages.map(msg => (
                <Message key={msg.id} message={msg} currentUser={currentUser} otherUser={otherParticipant} />
            ))}
       </main>
       <footer className="p-3">
            <MessageInput onSend={handleSendMessage} />
       </footer>
       {isSettingsOpen && <ChatSettingsPanel user={otherParticipant} onClose={() => setSettingsOpen(false)} />}
    </div>
  );
};

export default ChatWindow;