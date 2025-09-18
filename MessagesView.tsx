// Fix: Create the MessagesView component.
import React, { useState, useEffect } from 'react';
import type { Conversation, User, Message } from './types';
import ChatWindow from './components/ChatWindow';
import Icon from './components/Icon';
import * as api from './services/apiService';


interface MessagesViewProps {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  currentUser: User;
  onSendMessage: (messageData: any) => void;
  onViewProfile: (user: User) => void;
  onInitiateCall: (user: User, type: 'audio' | 'video') => void;
  onUpdateUserRelationship: (targetUser: User, action: 'mute' | 'unmute' | 'block' | 'unblock' | 'restrict' | 'unrestrict') => void;
  onNewMessage: () => void;
  conversationToSelect: string | null;
  setConversationToSelect: (id: string | null) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ 
    conversations, 
    setConversations, 
    currentUser, 
    onSendMessage, 
    onViewProfile, 
    onInitiateCall, 
    onUpdateUserRelationship,
    onNewMessage,
    conversationToSelect,
    setConversationToSelect
}) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);

  useEffect(() => {
    if (conversationToSelect) {
      const convoToSelect = conversations.find(c => c.id === conversationToSelect);
      if (convoToSelect) {
        setSelectedConversation(convoToSelect);
      }
      setConversationToSelect(null); // Reset the trigger
    }
  }, [conversationToSelect, conversations, setConversationToSelect]);


  useEffect(() => {
    if (!selectedConversation) return;

    const interval = setInterval(async () => {
      try {
        const updatedConvo = await api.getConversationById(selectedConversation.id);
        setConversations(convos => convos.map(c => c.id === updatedConvo.id ? updatedConvo : c));
        setSelectedConversation(updatedConvo);
      } catch (error) {
        console.error("Failed to poll for new messages:", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [selectedConversation, setConversations]);


  const getOtherParticipant = (convo: Conversation) => {
    return convo.participants.find(p => p.id !== currentUser.id);
  };
  
  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen">
      <div className={`w-full lg:w-96 border-r border-gray-800 flex-col ${selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-bold">{currentUser.username}</h1>
          <button onClick={onNewMessage} className="p-1 hover:bg-gray-800 rounded-full">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></Icon>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(convo => {
            const otherUser = getOtherParticipant(convo);
            if (!otherUser) return null;
            
            const lastMessage = convo.messages[convo.messages.length - 1];
            return (
              <button key={convo.id} onClick={() => setSelectedConversation(convo)} className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-800 ${selectedConversation?.id === convo.id ? 'bg-gray-800' : ''}`}>
                <img src={otherUser.avatar} alt={otherUser.username} className="w-14 h-14 rounded-full" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{otherUser.username}</p>
                  <p className="text-sm text-gray-400 truncate">{lastMessage?.content}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      {selectedConversation && (
        <ChatWindow 
          key={selectedConversation.id}
          conversation={selectedConversation}
          setConversation={setSelectedConversation}
          currentUser={currentUser} 
          onSendMessage={onSendMessage}
          onViewProfile={onViewProfile}
          onBack={() => setSelectedConversation(null)}
          onInitiateCall={onInitiateCall}
          onUpdateUserRelationship={onUpdateUserRelationship}
        />
      )}
    </div>
  );
};

export default MessagesView;