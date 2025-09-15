import React, { useState } from 'react';
import type { User, Conversation } from './types.ts';
import ChatWindow from './components/ChatWindow.tsx';

interface MessagesViewProps {
  currentUser: User;
  conversations: Conversation[];
  onViewProfile: (user: User) => void;
  onSendMessage: (conversationId: string, content: string) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ currentUser, conversations, onViewProfile, onSendMessage }) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(conversations[0]?.id);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  
  const getOtherParticipant = (convo: Conversation) => {
      return convo.participants.find(p => p.id !== currentUser.id)!;
  };

  return (
    <div className="h-[calc(100vh-theme(space.16))] md:h-[calc(100vh-4rem)] flex">
      <div className="w-1/3 border-r border-gray-800 flex flex-col">
        <header className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">{currentUser.username}</h1>
        </header>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(convo => {
            const otherUser = getOtherParticipant(convo);
            return (
              <button key={convo.id} onClick={() => setSelectedConversationId(convo.id)} className={`w-full text-left p-4 flex items-center gap-3 ${selectedConversationId === convo.id ? 'bg-gray-800' : 'hover:bg-gray-900'}`}>
                <img src={otherUser.avatar} alt={otherUser.username} className="w-12 h-12 rounded-full" />
                <div>
                  <p>{otherUser.username}</p>
                  <p className="text-sm text-gray-400 truncate">{convo.messages[convo.messages.length - 1].content}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="w-2/3">
        {selectedConversation ? (
          <ChatWindow 
            key={selectedConversation.id} // Add key to force re-mount on conversation change
            conversation={selectedConversation} 
            currentUser={currentUser} 
            onSendMessage={onSendMessage} 
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;
