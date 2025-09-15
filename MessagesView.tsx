import React, { useState } from 'react';
import type { Conversation, User, Message } from './types';
import ChatWindow from './components/ChatWindow';
import Icon from './components/Icon';

interface MessagesViewProps {
  currentUser: User;
  conversations: Conversation[];
  onNavigateHome: () => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ currentUser, conversations: initialConversations, onNavigateHome }) => {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
  
  const handleSendMessage = (content: string, type: 'text' | 'image' | 'voice', replyTo?: Message) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
        id: `m-${Date.now()}`,
        senderId: currentUser.id,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type,
        replyTo,
    };

    const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
            return { ...conv, messages: [...conv.messages, newMessage], lastMessageSeenId: newMessage.id };
        }
        return conv;
    });

    setConversations(updatedConversations);
    
    const updatedSelectedConv = updatedConversations.find(c => c.id === selectedConversation.id);
    if (updatedSelectedConv) {
      setSelectedConversation(updatedSelectedConv);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedConversation) return;
    
    const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
            const updatedMessages: Message[] = conv.messages.map(m => m.id === messageId ? {...m, content: 'This message was deleted.', type: 'text', reactions: []} : m);
            return { ...conv, messages: updatedMessages };
        }
        return conv;
    });
    setConversations(updatedConversations);

    const updatedSelectedConv = updatedConversations.find(c => c.id === selectedConversation.id);
    if (updatedSelectedConv) {
      setSelectedConversation(updatedSelectedConv);
    }
  };

  const handleReact = (messageId: string, emoji: string) => {
    if (!selectedConversation) return;

    const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
            const updatedMessages = conv.messages.map(m => {
                if (m.id === messageId) {
                    const existingReactionIndex = m.reactions?.findIndex(r => r.userId === currentUser.id) ?? -1;
                    let newReactions = [...(m.reactions || [])];
                    if (existingReactionIndex > -1) {
                        if(newReactions[existingReactionIndex].emoji === emoji) {
                            newReactions.splice(existingReactionIndex, 1);
                        } else {
                            newReactions[existingReactionIndex] = { userId: currentUser.id, emoji };
                        }
                    } else {
                        newReactions.push({ userId: currentUser.id, emoji });
                    }
                    return { ...m, reactions: newReactions };
                }
                return m;
            });
            return { ...conv, messages: updatedMessages };
        }
        return conv;
    });

    setConversations(updatedConversations);
    const updatedSelectedConv = updatedConversations.find(c => c.id === selectedConversation.id);
    if (updatedSelectedConv) {
      setSelectedConversation(updatedSelectedConv);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:flex items-center justify-center" onClick={onNavigateHome}>
        <div 
          className="bg-gray-900 border-gray-800 flex flex-col w-full h-full md:w-[80vw] md:max-w-[900px] md:h-[80vh] md:max-h-[700px] md:rounded-2xl md:border md:shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
            <div className="flex md:hidden p-4 border-b border-gray-800 justify-between items-center flex-shrink-0">
                <button onClick={onNavigateHome}><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
                <h2 className="text-xl font-bold">{currentUser.username}</h2>
                <Icon className="w-6 h-6"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></Icon>
            </div>
             <div className="flex flex-1 overflow-hidden">
                <div className={`w-full md:w-96 border-r border-gray-800 flex-shrink-0 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                    <div className="hidden md:flex p-4 border-b border-gray-800 justify-between items-center flex-shrink-0">
                        <h2 className="text-xl font-bold">{currentUser.username}</h2>
                        <button onClick={onNavigateHome}><Icon className="w-6 h-6"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
                    </div>
                    <div className="p-2 flex-shrink-0">
                        <h3 className="font-semibold px-2">Messages</h3>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {conversations.map(conv => {
                            const otherUser = conv.participants.find(p => p.id !== currentUser.id)!;
                            const lastMessage = conv.messages[conv.messages.length - 1];
                            return (
                                <button key={conv.id} onClick={() => setSelectedConversation(conv)} className={`w-full text-left p-3 flex items-center space-x-3 hover:bg-gray-800 transition-colors ${selectedConversation?.id === conv.id ? 'bg-gray-900' : ''}`}>
                                     <img src={otherUser.avatar} alt={otherUser.username} className="w-14 h-14 rounded-full" />
                                     <div className="overflow-hidden">
                                        <p>{otherUser.username}</p>
                                        <p className="text-sm text-gray-400 truncate">{lastMessage?.type === 'voice' ? 'Voice message' : lastMessage?.type === 'image' ? 'Image' : lastMessage?.content}</p>
                                     </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className={`flex-1 ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                    {selectedConversation ? (
                        <ChatWindow 
                            currentUser={currentUser} 
                            conversation={selectedConversation}
                            onSendMessage={handleSendMessage}
                            onDeleteMessage={handleDeleteMessage}
                            onReact={handleReact}
                            onBack={() => setSelectedConversation(null)}
                        />
                    ) : (
                        <div className="h-full flex-col items-center justify-center hidden md:flex">
                            <Icon className="w-24 h-24 border-2 border-white rounded-full p-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /></Icon>
                            <h2 className="text-2xl mt-4">Your Messages</h2>
                            <p className="text-gray-400">Send private photos and messages to a friend or group.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default MessagesView;