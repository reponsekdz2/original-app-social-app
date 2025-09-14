import React, { useState, useMemo } from 'react';
import type { Conversation, User, Message, MessageType } from '../types';
import Icon from './components/Icon';
import ChatWindow from './components/ChatWindow';

interface ConversationListProps {
  conversations: Conversation[];
  currentUser: User;
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationListItem: React.FC<{conversation: Conversation, isSelected: boolean, onClick: () => void, currentUser: User}> = ({ conversation, isSelected, onClick, currentUser }) => {
  const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return (
     <button onClick={onClick} className={`w-full text-left p-3 flex items-start space-x-3 transition-colors ${isSelected ? 'bg-gray-800' : 'hover:bg-gray-900'}`}>
        <img src={otherParticipant?.avatar} alt={otherParticipant?.username} className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className="font-semibold truncate">{otherParticipant?.username}</p>
            {conversation.unreadCount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unreadCount}
                </span>
            )}
          </div>
          <p className="text-sm text-gray-400 truncate">{lastMessage?.content}</p>
        </div>
      </button>
  );
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, currentUser, selectedConversationId, onSelectConversation }) => {
  return (
    <div className="h-full flex flex-col">
       <div className="p-4 border-b border-gray-700 flex-shrink-0">
         <h2 className="text-xl font-bold text-center">{currentUser.username}</h2>
       </div>
       <div className="flex-1 overflow-y-auto">
         {conversations.map(convo => (
           <ConversationListItem 
             key={convo.id}
             conversation={convo}
             isSelected={selectedConversationId === convo.id}
             onClick={() => onSelectConversation(convo.id)}
             currentUser={currentUser}
           />
         ))}
       </div>
    </div>
  );
}

interface MessagesViewProps {
  conversations: Conversation[];
  currentUser: User;
  onClose: () => void;
  onSendMessage: (conversationId: string, content: string, type: MessageType, replyTo?: Message) => void;
  onDeleteMessage: (conversationId: string, messageId: string) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ conversations, currentUser, onClose, onSendMessage, onDeleteMessage }) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(conversations[0]?.id || null);

  const selectedConversation = useMemo(() => {
    return conversations.find(c => c.id === selectedConversationId);
  }, [selectedConversationId, conversations]);

  return (
    <div className="fixed inset-0 bg-black z-40 flex items-center justify-center">
      <div className="bg-gray-950 w-full h-full lg:w-[95%] lg:max-w-6xl lg:h-[95%] lg:rounded-lg border border-gray-800 flex shadow-2xl">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white z-50">
          <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
        </button>
        
        <div className="w-full md:w-1/3 border-r border-gray-800 h-full">
           <ConversationList 
             conversations={conversations}
             currentUser={currentUser}
             selectedConversationId={selectedConversationId}
             onSelectConversation={setSelectedConversationId}
           />
        </div>
        
        <div className="hidden md:flex w-2/3 h-full flex-col">
          {selectedConversation ? (
            <ChatWindow 
              key={selectedConversation.id}
              conversation={selectedConversation}
              currentUser={currentUser}
              onSendMessage={onSendMessage}
              onDeleteMessage={onDeleteMessage}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Icon className="w-24 h-24"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></Icon>
                <h3 className="text-2xl mt-4">Your Messages</h3>
                <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesView;