import React, { useState, useEffect, useCallback } from 'react';
import type { Conversation, User, Message } from './types';
import Icon from './components/Icon.tsx';
import ChatWindow from './components/ChatWindow.tsx';
import VerifiedBadge from './components/VerifiedBadge.tsx';
import NewMessageModal from './components/NewMessageModal.tsx';
import { socketService } from './services/socketService.ts';
import * as api from './services/apiService';
import CreateGroupModal from './components/CreateGroupModal.tsx';

interface MessagesViewProps {
  conversations: Conversation[];
  currentUser: User;
  allUsers: User[];
  onNavigate: (view: 'profile', user: User) => void;
  onInitiateCall: (user: User, type: 'video' | 'audio') => void;
  onUpdateConversation: (updatedConvo: Conversation) => void;
  onUpdateUserRelationship: (targetUser: User, action: 'block' | 'unblock') => void;
  // Fix: Add onReport to props to pass to ChatWindow
  onReport: (user: User) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ conversations: initialConversations, currentUser, allUsers, onNavigate, onInitiateCall, onUpdateConversation, onUpdateUserRelationship, onReport }) => {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(initialConversations[0] || null);
  const [isNewMessageModalOpen, setNewMessageModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  
  useEffect(() => {
    setConversations(initialConversations);
    if (!selectedConversation && initialConversations.length > 0) {
        setSelectedConversation(initialConversations[0]);
    } else if (selectedConversation) {
        // If the selected conversation is in the updated list, use the updated version
        const updatedSelected = initialConversations.find(c => c.id === selectedConversation.id);
        setSelectedConversation(updatedSelected || null);
    }
  }, [initialConversations, selectedConversation]);
  
  const updateConversationWithMessage = useCallback((conversationId: string, message: Message, isFinal: boolean = false) => {
    const updateFn = (convo: Conversation) => {
        if (convo.id === conversationId) {
            let messages;
            const existingMsgIndex = convo.messages.findIndex(m => m.id === message.id || m.id === `temp-${message.id}`);

            if (existingMsgIndex > -1) {
                // Update existing message (e.g., confirmation)
                messages = [...convo.messages];
                messages[existingMsgIndex] = message;
            } else {
                // Add new message
                messages = [...convo.messages, message];
            }
            return { ...convo, messages };
        }
        return convo;
    };
    setConversations(prev => prev.map(updateFn));
    if (selectedConversation?.id === conversationId) {
        setSelectedConversation(prev => (prev ? updateFn(prev) : null));
    }
  }, [selectedConversation?.id]);
  
  useEffect(() => {
    const handleNewMessage = ({ conversationId, message }: { conversationId: string; message: Message }) => {
        updateConversationWithMessage(conversationId, message, true);
    };

    const handleMessageConfirmation = ({ conversationId, message }: { conversationId: string; message: Message }) => {
        updateConversationWithMessage(conversationId, message, true);
    }

    socketService.on('receive_message', handleNewMessage);
    socketService.on('message_sent_confirmation', handleMessageConfirmation);

    return () => {
        socketService.off('receive_message', handleNewMessage);
        socketService.off('message_sent_confirmation', handleMessageConfirmation);
    };
  }, [updateConversationWithMessage]);


  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };
  
  const handleStartNewConversation = (user: User) => {
    const existingConvo = conversations.find(c => !c.isGroup && c.participants.length === 2 && c.participants.some(p => p.id === user.id));
    if (existingConvo) {
      setSelectedConversation(existingConvo);
    } else {
      const tempConvo: Conversation = {
        id: `temp-convo-${Date.now()}`,
        participants: [currentUser, user],
        messages: [],
        isGroup: false,
        settings: { theme: 'default', vanish_mode_enabled: false },
      };
      setConversations(prev => [tempConvo, ...prev]);
      setSelectedConversation(tempConvo);
    }
    setNewMessageModalOpen(false);
  };
  
  const handleSendMessage = async (content: string | File, type: Message['type']) => {
    if (!selectedConversation) return;
    const otherUser = selectedConversation.participants.find(p => p.id !== currentUser.id);
    if (!otherUser && !selectedConversation.isGroup) return;

    const tempId = `temp-msg-${Date.now()}`;
    const optimisticContent = typeof content === 'string' ? content : URL.createObjectURL(content);

    const newMessage: Message = {
      id: tempId,
      senderId: currentUser.id,
      content: optimisticContent,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Optimistic update
    updateConversationWithMessage(selectedConversation.id, newMessage);
    
    const conversationId = selectedConversation.id.startsWith('temp-convo') ? undefined : selectedConversation.id;

    try {
        await api.sendMessage(otherUser!.id, content, type, undefined, undefined, conversationId);
        
        if (selectedConversation.id.startsWith('temp-convo')) {
            const newConversations = await api.getConversations();
            setConversations(newConversations); 
            const newSelected = newConversations.find(c => c.participants.some(p => p.id === otherUser!.id));
            setSelectedConversation(newSelected || null);
        }
    } catch(error) {
        console.error("Failed to send message:", error);
        setConversations(prev => prev.map(c => 
            c.id === selectedConversation.id 
                ? { ...c, messages: c.messages.filter(m => m.id !== tempId) } 
                : c
        ));
         setSelectedConversation(prev => prev ? { ...prev, messages: prev.messages.filter(m => m.id !== tempId) } : null);
    }
  };

   const handleCreateGroup = (newGroup: Conversation) => {
        setConversations(prev => [newGroup, ...prev]);
        setSelectedConversation(newGroup);
    };

  return (
    <div className="flex h-[calc(100vh-4rem)] border-t border-gray-800">
      <aside className={`w-full md:w-96 border-r border-gray-800 flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setCreateGroupModalOpen(true)} className="p-2 hover:bg-gray-800 rounded-full">
                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM3.75 18.75a3 3 0 002.72-4.682A9.095 9.095 0 0018 18.72m0 0a9 9 0 00-9-9 9 9 0 00-9 9m18 0h-3.375a9.06 9.06 0 00-1.5-3.375m-1.5 3.375a9.06 9.06 0 01-1.5-3.375m0 0a9 9 0 01-9-9" /></Icon>
            </button>
            <button onClick={() => setNewMessageModalOpen(true)} className="p-2 hover:bg-gray-800 rounded-full">
                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243c0 .384.128.753.36 1.06l.995 1.493a.75.75 0 01-.26 1.06l-1.636 1.09a.75.75 0 00-.26 1.06l.995 1.493c.232.348.359.726.359 1.112v.243m-13.5-9.75h9" /></Icon>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(convo => {
            const otherUser = convo.participants.find(p => p.id !== currentUser.id);
            const lastMessage = convo.messages[convo.messages.length - 1];
            return (
              <div
                key={convo.id}
                onClick={() => handleSelectConversation(convo)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800 ${selectedConversation?.id === convo.id ? 'bg-gray-800' : ''}`}
              >
                <img src={convo.isGroup ? '/uploads/group_avatar.png' : otherUser?.avatar} alt={convo.name || otherUser?.username} className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between">
                    <p className="font-semibold flex items-center">{convo.name || otherUser?.name} {otherUser?.isVerified && <VerifiedBadge className="w-3 h-3 ml-1" />}</p>
                    {lastMessage && <p className="text-xs text-gray-500">{new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>}
                  </div>
                  {lastMessage && <p className="text-sm text-gray-400 truncate">{lastMessage.content || 'Shared content'}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <main className={`flex-1 flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedConversation(null)}
            onViewProfile={(user) => onNavigate('profile', user)}
            onInitiateCall={onInitiateCall}
            onUpdateConversation={onUpdateConversation}
            onUpdateUserRelationship={onUpdateUserRelationship}
            onReport={onReport}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
             <Icon className="w-24 h-24 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /></Icon>
            <h2 className="text-2xl font-bold text-white">Select a message</h2>
            <p>Choose one of your existing conversations or start a new one.</p>
          </div>
        )}
      </main>
      
      {isNewMessageModalOpen && (
        <NewMessageModal 
            users={allUsers.filter(u => u.id !== currentUser.id)}
            onClose={() => setNewMessageModalOpen(false)}
            onSelectUser={handleStartNewConversation}
        />
      )}
      {isCreateGroupModalOpen && (
        <CreateGroupModal
            followers={currentUser.followers}
            onClose={() => setCreateGroupModalOpen(false)}
            onCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default MessagesView;