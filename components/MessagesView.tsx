import React, { useState } from 'react';
import type { Conversation, User } from '../types.ts';
import ChatWindow from './ChatWindow.tsx';
import Icon from './Icon.tsx';
import NewMessageModal from './NewMessageModal.tsx';
import * as api from '../services/apiService.ts';

interface MessagesViewProps {
  currentUser: User;
  conversations: Conversation[];
  allUsers: User[];
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: (conversation: Conversation) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ currentUser, conversations, allUsers, onSelectConversation, onNewConversation }) => {
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(conversations[0] || null);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);

  if (!conversations) {
    return <div>Loading conversations...</div>;
  }

  const otherUser = (convo: Conversation) => convo.participants.find(p => p.id !== currentUser.id);

  const handleSelectConvo = (convo: Conversation) => {
    setSelectedConvo(convo);
    onSelectConversation(convo);
  };

  const handleSelectUserForNewMessage = async (user: User) => {
    setIsNewMessageModalOpen(false);
    // Check if a conversation already exists
    const existingConvo = conversations.find(c => !c.isGroup && c.participants.some(p => p.id === user.id));
    if (existingConvo) {
      handleSelectConvo(existingConvo);
    } else {
      // Create a new temporary conversation that will be solidified on the first message
      const tempConvo: Conversation = {
        id: `temp_${user.id}`,
        name: user.name,
        participants: [currentUser, user],
        messages: [],
        isGroup: false,
      };
      onNewConversation(tempConvo);
      setSelectedConvo(tempConvo);
    }
  };


  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] md:h-screen bg-black">
        <div className={`w-full md:w-1/3 xl:w-1/4 border-r border-gray-800 flex-col ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold">{currentUser.username}</h2>
            <button onClick={() => setIsNewMessageModalOpen(true)}>
              <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></Icon>
            </button>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.map(convo => {
              const participant = otherUser(convo);
              const lastMessage = convo.messages[convo.messages.length - 1];
              return (
                <div key={convo.id} onClick={() => handleSelectConvo(convo)} className={`flex items-center gap-3 p-3 cursor-pointer ${selectedConvo?.id === convo.id ? 'bg-gray-800' : 'hover:bg-gray-900'}`}>
                  <img src={convo.isGroup ? '/uploads/group_avatar.png' : participant?.avatar_url} alt={convo.name || participant?.username} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-semibold">{convo.name || participant?.username}</p>
                    {lastMessage && <p className="text-sm text-gray-400 truncate w-48">{lastMessage.content}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={`w-full md:w-2/3 xl:w-3/4 ${selectedConvo ? 'block' : 'hidden md:block'}`}>
          {selectedConvo ? (
            <ChatWindow conversation={selectedConvo} currentUser={currentUser} onBack={() => setSelectedConvo(null)} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 flex-col p-8 text-center">
              <Icon className="w-24 h-24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /></Icon>
              <h3 className="text-xl font-semibold mt-4">Your Messages</h3>
              <p>Send private photos and messages to a friend or group.</p>
              <button onClick={() => setIsNewMessageModalOpen(true)} className="mt-4 bg-red-600 text-white font-semibold py-2 px-4 rounded-md">
                Send Message
              </button>
            </div>
          )}
        </div>
      </div>
      {isNewMessageModalOpen && (
        <NewMessageModal
          users={allUsers.filter(u => u.id !== currentUser.id)}
          onClose={() => setIsNewMessageModalOpen(false)}
          onSelectUser={handleSelectUserForNewMessage}
        />
      )}
    </>
  );
};

export default MessagesView;