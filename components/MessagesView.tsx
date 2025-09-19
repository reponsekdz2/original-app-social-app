import React, { useState, useEffect } from 'react';
import type { Conversation, User, Message } from '../types.ts';
import Icon from './Icon.tsx';
import ChatWindow from './ChatWindow.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import NewMessageModal from './NewMessageModal.tsx';
import { socketService } from '../services/socketService.ts';

interface MessagesViewProps {
  conversations: Conversation[];
  currentUser: User;
  allUsers: User[];
  onNavigate: (view: 'profile', user: User) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ conversations: initialConversations, currentUser, allUsers, onNavigate }) => {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
  const [isNewMessageModalOpen, setNewMessageModalOpen] = useState(false);
  
  useEffect(() => {
    const handleNewMessage = (newMessage: { conversationId: string; message: Message }) => {
        setConversations(prev =>
            prev.map(convo =>
                convo.id === newMessage.conversationId
                    ? { ...convo, messages: [...convo.messages, newMessage.message] }
                    : convo
            )
        );
        // Also update the selected conversation if it's the one receiving the message
        if (selectedConversation?.id === newMessage.conversationId) {
            setSelectedConversation(prev => prev ? { ...prev, messages: [...prev.messages, newMessage.message] } : null);
        }
    };
    
    socketService.on('receive_message', handleNewMessage);

    return () => {
        socketService.off('receive_message', handleNewMessage);
    };
  }, [selectedConversation]);


  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };
  
  const handleStartNewConversation = (user: User) => {
    const existingConvo = conversations.find(c => c.participants.some(p => p.id === user.id));
    if (existingConvo) {
      setSelectedConversation(existingConvo);
    } else {
      const newConvo: Conversation = {
        id: `convo-${Date.now()}`,
        participants: [currentUser, user],
        messages: [],
      };
      setConversations([newConvo, ...conversations]);
      setSelectedConversation(newConvo);
    }
    setNewMessageModalOpen(false);
  };
  
  const handleSendMessage = (content: string, type: Message['type']) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    const updatedConvo = {
        ...selectedConversation,
        messages: [...selectedConversation.messages, newMessage],
    };
    
    setConversations(conversations.map(c => c.id === updatedConvo.id ? updatedConvo : c));
    setSelectedConversation(updatedConvo);
    
    // Emit via socket
    socketService.emit('send_message', {
      conversationId: selectedConversation.id,
      message: newMessage,
    });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] border-t border-gray-800">
      {/* Conversation List */}
      <aside className={`w-full md:w-96 border-r border-gray-800 flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold">Messages</h1>
          <button onClick={() => setNewMessageModalOpen(true)} className="p-2 hover:bg-gray-800 rounded-full">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243c0 .384.128.753.36 1.06l.995 1.493a.75.75 0 01-.26 1.06l-1.636 1.09a.75.75 0 00-.26 1.06l.995 1.493c.232.348.359.726.359 1.112v.243m-13.5-9.75h9" /></Icon>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(convo => {
            const otherUser = convo.participants.find(p => p.id !== currentUser.id);
            if (!otherUser) return null;
            const lastMessage = convo.messages[convo.messages.length - 1];
            return (
              <div
                key={convo.id}
                onClick={() => handleSelectConversation(convo)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800 ${selectedConversation?.id === convo.id ? 'bg-gray-800' : ''}`}
              >
                <img src={otherUser.avatar} alt={otherUser.username} className="w-14 h-14 rounded-full" />
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between">
                    <p className="font-semibold flex items-center">{otherUser.username} {otherUser.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />}</p>
                    {lastMessage && <p className="text-xs text-gray-500">{lastMessage.timestamp}</p>}
                  </div>
                  {lastMessage && <p className="text-sm text-gray-400 truncate">{lastMessage.content}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Chat Window */}
      <main className={`flex-1 flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedConversation(null)}
            onViewProfile={(user) => onNavigate('profile', user)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
             <Icon className="w-24 h-24 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /></Icon>
            <h2 className="text-2xl font-bold text-white">Select a message</h2>
            <p>Choose one of your existing conversations or start a new one.</p>
          </div>
        )}
      </main>
      
      {isNewMessageModalOpen && (
        <NewMessageModal 
            users={allUsers}
            onClose={() => setNewMessageModalOpen(false)}
            onSelectUser={handleStartNewConversation}
        />
      )}
    </div>
  );
};

export default MessagesView;