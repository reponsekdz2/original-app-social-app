import React, { useState } from 'react';
import type { Conversation, User, Message } from './types';
import Icon from './components/Icon';
import ChatWindow from './components/ChatWindow';

interface MessagesViewProps {
  currentUser: User;
  conversations: Conversation[];
  onSendMessage: (convoId: string, content: string, type: 'text' | 'image' | 'voice', replyTo?: Message) => void;
  onDeleteMessage: (convoId: string, messageId: string) => void;
  onReact: (convoId: string, messageId: string, emoji: string) => void;
}

const ConversationListItem: React.FC<{ convo: Conversation, isActive: boolean, currentUser: User, onClick: () => void }> = ({ convo, isActive, currentUser, onClick }) => {
    const otherParticipant = convo.participants.find(p => p.id !== currentUser.id)!;
    const lastMessage = convo.messages[convo.messages.length - 1];
    const isTyping = convo.typingUserIds?.includes(otherParticipant.id);

    return (
        <button onClick={onClick} className={`w-full text-left p-3 flex items-center space-x-4 hover:bg-gray-800 transition-colors rounded-lg ${isActive ? 'bg-gray-800' : ''}`}>
            <div className="relative flex-shrink-0">
                <img src={otherParticipant.avatar} alt={otherParticipant.username} className="w-14 h-14 rounded-full object-cover" />
                {otherParticipant.isOnline && <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-white truncate">{otherParticipant.username}</p>
                    {lastMessage && <p className="text-xs text-gray-500 flex-shrink-0">{lastMessage.timestamp}</p>}
                </div>
                 <div className="flex justify-between items-start">
                    {isTyping ? (
                        <p className="text-sm text-red-400 animate-pulse truncate">typing...</p>
                    ) : (
                        <p className="text-sm text-gray-400 truncate">{lastMessage?.content}</p>
                    )}
                    {convo.unreadCount > 0 && <span className="bg-red-600 text-white text-xs rounded-full px-2 py-0.5 ml-2">{convo.unreadCount}</span>}
                </div>
            </div>
        </button>
    );
};

const MessagesView: React.FC<MessagesViewProps> = (props) => {
    const { currentUser, conversations } = props;
    const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);

    const selectedConvo = conversations.find(c => c.id === selectedConvoId);

  return (
    <div className="flex w-full h-full">
        <div className="w-full md:w-1/3 border-r border-gray-800 flex-shrink-0 flex flex-col">
           <div className="p-4 border-b border-gray-800">
                <h2 className="text-2xl font-bold text-center md:text-left">{currentUser.username}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                <h3 className="px-2 text-lg font-bold">Messages</h3>
                {conversations.map(convo => (
                    <ConversationListItem 
                        key={convo.id}
                        convo={convo}
                        isActive={selectedConvoId === convo.id}
                        currentUser={currentUser}
                        onClick={() => setSelectedConvoId(convo.id)}
                    />
                ))}
            </div>
        </div>
        <div className="hidden md:flex w-2/3 flex-1 flex-col">
            {selectedConvo ? (
                <ChatWindow
                    key={selectedConvo.id}
                    currentUser={currentUser}
                    conversation={selectedConvo}
                    onSendMessage={(content, type, replyTo) => props.onSendMessage(selectedConvo.id, content, type, replyTo)}
                    onDeleteMessage={(messageId) => props.onDeleteMessage(selectedConvo.id, messageId)}
                    onReact={(messageId, emoji) => props.onReact(selectedConvo.id, messageId, emoji)}
                />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                    <div className="border-2 border-gray-500 rounded-full p-6">
                        <Icon className="w-16 h-16"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></Icon>
                    </div>
                    <h2 className="text-3xl mt-6 text-white">Your Messages</h2>
                    <p className="mt-2">Select a chat to start messaging.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default MessagesView;