import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, User, Message } from '../types';
import Icon from './Icon.tsx';
import MessageComponent from './Message.tsx';
import MessageInput from './MessageInput.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';
import TypingIndicator from './TypingIndicator.tsx';
import { socketService } from '../services/socketService.ts';
import ChatSettingsPanel from './ChatSettingsPanel.tsx';
import * as api from '../services/apiService.ts';


interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onSendMessage: (content: string | File, type: Message['type']) => void;
  onBack: () => void;
  onViewProfile: (user: User) => void;
  onInitiateCall: (user: User, type: 'video' | 'audio') => void;
  onUpdateConversation: (updatedConvo: Conversation) => void;
  onUpdateUserRelationship: (targetUser: User, action: 'block' | 'unblock' | 'mute' | 'unmute') => void;
  onReport: (user: User) => void;
}

const getThemeClass = (theme: string) => {
    switch (theme) {
        case 'sunset': return 'bg-gradient-to-br from-orange-900 via-gray-900 to-black';
        case 'ocean': return 'bg-gradient-to-br from-teal-900 via-gray-900 to-black';
        case 'nebula': return 'bg-gradient-to-br from-indigo-900 via-gray-900 to-black';
        default: return 'bg-black';
    }
}


const ChatWindow: React.FC<ChatWindowProps> = (props) => {
  const { conversation, currentUser, onSendMessage, onBack, onViewProfile, onInitiateCall, onUpdateConversation, onUpdateUserRelationship, onReport } = props;
  const otherUser = conversation.participants.find(p => p.id !== currentUser.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [messages, setMessages] = useState(conversation.messages);

  const lastSeenMessageId = messages.filter(m => m.senderId === otherUser?.id && m.read).pop()?.id;


  useEffect(() => {
    setMessages(conversation.messages);
  }, [conversation.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleTyping = ({ conversationId }: { conversationId: string }) => {
        if (conversationId === conversation.id) setIsTyping(true);
    };
    const handleStopTyping = ({ conversationId }: { conversationId: string }) => {
        if (conversationId === conversation.id) setIsTyping(false);
    };
    
    socketService.on('typing', handleTyping);
    socketService.on('stop_typing', handleStopTyping);

    return () => {
        socketService.off('typing', handleTyping);
        socketService.off('stop_typing', handleStopTyping);
    };
  }, [conversation.id]);
  
  const handleAddReaction = (messageId: string, emoji: string) => {
    // Optimistic Update
    setMessages(currentMessages => currentMessages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReactionIndex = reactions.findIndex(r => r.user.id === currentUser.id);
        
        if (existingReactionIndex > -1) {
            // User is changing or removing their reaction
            const existingReaction = reactions[existingReactionIndex];
            if (existingReaction.emoji === emoji) {
                // Same emoji clicked, remove it
                return { ...msg, reactions: reactions.filter(r => r.user.id !== currentUser.id) };
            } else {
                // Different emoji, update it
                const updatedReactions = [...reactions];
                updatedReactions[existingReactionIndex] = { emoji, user: currentUser };
                return { ...msg, reactions: updatedReactions };
            }
        } else {
            // New reaction
            const newReaction = { emoji, user: currentUser };
            return { ...msg, reactions: [...reactions, newReaction] };
        }
      }
      return msg;
    }));
    
    // API Call
    api.addMessageReaction(messageId, emoji).catch(err => {
        console.error("Failed to add reaction", err);
        // Revert optimistic update on failure
        setMessages(conversation.messages); 
    });
  };
  
  const handleUpdateSettings = async (settings: Partial<Conversation['settings']>) => {
    const optimisticConvo = { ...conversation, settings: { ...conversation.settings, ...settings } };
    onUpdateConversation(optimisticConvo); // Optimistic update
    try {
        await api.updateConversationSettings(conversation.id, settings);
    } catch (error) {
        console.error("Failed to update settings:", error);
        onUpdateConversation(conversation); // Revert on failure
    }
  };


  if (!otherUser && !conversation.isGroup) {
    return <div className="flex items-center justify-center h-full">Error: Conversation is invalid.</div>;
  }
  
  const headerDetails = conversation.isGroup ? {
      avatar: '/uploads/group_avatar.png',
      name: conversation.name,
      status: `${conversation.participants.length} members`
  } : {
      avatar: otherUser?.avatar,
      name: otherUser?.username,
      status: 'Online'
  };

  return (
    <div className={`flex flex-col h-full relative transition-colors duration-500 ${getThemeClass(conversation.settings.theme)}`}>
      <header className="flex items-center justify-between p-3 border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="sm:hidden p-2 -ml-2">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
          </button>
          <img src={headerDetails.avatar} alt={headerDetails.name} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => otherUser && onViewProfile(otherUser)} />
          <div>
            <p className="font-semibold flex items-center gap-1.5 cursor-pointer" onClick={() => otherUser && onViewProfile(otherUser)}>{headerDetails.name} {otherUser?.isVerified && <VerifiedBadge className="w-3 h-3"/>}</p>
            <p className="text-xs text-gray-400">{headerDetails.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {!conversation.isGroup && otherUser &&
           <>
             <button onClick={() => onInitiateCall(otherUser, 'audio')} className="p-2 hover:bg-gray-800 rounded-full">
              <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" /></Icon>
            </button>
            <button onClick={() => onInitiateCall(otherUser, 'video')} className="p-2 hover:bg-gray-800 rounded-full">
              <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon>
            </button>
           </>
           }
          <button onClick={() => setSettingsOpen(true)} className="p-2 hover:bg-gray-800 rounded-full">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></Icon>
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-8">
        {messages.map((message, index) => {
          const sender = conversation.participants.find(p => p.id === message.senderId);
          if (!sender) return null;
          const prevMessage = messages[index - 1];
          const nextMessage = messages[index + 1];
          const isFirstInGroup = !prevMessage || prevMessage.senderId !== message.senderId;
          const isLastInGroup = !nextMessage || nextMessage.senderId !== message.senderId;
          return (
            <MessageComponent
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUser.id}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
              sender={sender}
              onReply={() => setReplyingTo(message)}
              onAddReaction={(emoji) => handleAddReaction(message.id, emoji)}
              isVanishMode={conversation.settings.vanish_mode_enabled}
            />
          );
        })}
        {isTyping && otherUser && <TypingIndicator user={otherUser} />}
        {lastSeenMessageId && (
            <div className="flex justify-end text-xs text-gray-400 pr-2">
                Seen
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 bg-black/20">
        <MessageInput 
            onSend={onSendMessage}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
            conversationId={conversation.id}
            otherUser={otherUser}
        />
      </div>

      {isSettingsOpen && (
        <ChatSettingsPanel 
            conversation={conversation}
            currentUser={currentUser}
            onClose={() => setSettingsOpen(false)}
            onUpdateUserRelationship={onUpdateUserRelationship}
            onReport={onReport}
            onViewProfile={onViewProfile}
            onUpdateSettings={handleUpdateSettings}
        />
      )}
    </div>
  );
};

export default ChatWindow;